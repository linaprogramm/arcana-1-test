import React, { useState, useEffect } from 'react';
import { CalendarSlot, Order, TarotService, TimePeriodOption } from '../types';
import { addOrder, getSavedPromo, getSlots, savePromo } from '../utils/storage';
import { DemoPaymentModal } from './DemoPaymentModal';
import { X, Calendar, User, Upload, Heart, CreditCard, Sparkles, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  service: TarotService | null;
  selectedPeriod?: TimePeriodOption;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (order: Order) => void;
}

const ZODIAC_SIGNS = [
  'Овен (21.03 — 19.04)',
  'Телец (20.04 — 20.05)',
  'Близнецы (21.05 — 20.06)',
  'Рак (21.06 — 22.07)',
  'Лев (23.07 — 22.08)',
  'Дева (23.08 — 22.09)',
  'Весы (23.09 — 22.10)',
  'Скорпион (23.10 — 21.11)',
  'Стрелец (22.11 — 21.12)',
  'Козерог (22.12 — 19.01)',
  'Водолей (20.01 — 18.02)',
  'Рыбы (19.02 — 20.03)',
];

export function BookingModal({
  service,
  selectedPeriod,
  isOpen,
  onClose,
  onSuccess,
}: BookingModalProps) {
  if (!isOpen || !service) return null;

  const isDigitalGood = service.category === 'digital';
  const isRelationship = service.requiresPartner || service.id === 'relations-need-it';

  const basePrice = selectedPeriod ? selectedPeriod.price : service.price;

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientBirthDate, setClientBirthDate] = useState('');
  const [zodiacSign, setZodiacSign] = useState(ZODIAC_SIGNS[0]);
  const [partnerName, setPartnerName] = useState('');
  const [questionDetails, setQuestionDetails] = useState('');
  const [bonusQuestionText, setBonusQuestionText] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Slots
  const [allSlots, setAllSlots] = useState<CalendarSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Promo code
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountRub?: number;
    discountPercent?: number;
    isBonusQuestion?: boolean;
    description: string;
  } | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Demo Payment Modal
  const [showDemoPayment, setShowDemoPayment] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isDigitalGood) {
      const slots = getSlots();
      setAllSlots(slots);
      const availableDates = Array.from(new Set(slots.filter((s) => !s.isBooked).map((s) => s.date))).sort();
      if (availableDates.length > 0 && !selectedDate) {
        setSelectedDate(availableDates[0]);
      }
    }

    const savedPromo = getSavedPromo();
    if (savedPromo) {
      setAppliedPromo(savedPromo);
      setPromoInput(savedPromo.code);
    }
  }, [isOpen, isDigitalGood]);

  // Discount calculation: maximum 200 rubles or 10%
  let discountAmount = 0;
  let hasBonusQuestion = false;

  if (appliedPromo) {
    if (appliedPromo.isBonusQuestion) {
      hasBonusQuestion = true;
    } else if (appliedPromo.discountRub) {
      discountAmount = Math.min(appliedPromo.discountRub, 200);
    } else if (appliedPromo.discountPercent) {
      const maxPercent = Math.min(appliedPromo.discountPercent, 10);
      discountAmount = Math.round((basePrice * maxPercent) / 100);
    }
  }
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const uniqueDates = Array.from(new Set(allSlots.map((s) => s.date))).sort();
  const timesForSelectedDate = allSlots.filter((s) => s.date === selectedDate);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setAppliedPromo(null);
      savePromo(null);
      setPromoMessage(null);
      return;
    }

    if (code === 'FREEQ_BONUS' || code === 'FREEQ') {
      const p = {
        code,
        isBonusQuestion: true,
        description: '+1 бесплатный вопрос к заказу в подарок от Насти',
      };
      setAppliedPromo(p);
      savePromo(p);
      setPromoMessage('Бонус активирован: +1 вопрос к любому заказу в подарок!');
    } else if (code === 'ARCANA10') {
      const p = { code, discountPercent: 10, description: 'Скидка 10% (максимум)' };
      setAppliedPromo(p);
      savePromo(p);
      setPromoMessage('Скидка 10% применена');
    } else if (code === 'LUCKY200') {
      const p = { code, discountRub: 200, description: 'Скидка 200 ₽ (максимум)' };
      setAppliedPromo(p);
      savePromo(p);
      setPromoMessage('Скидка 200 ₽ применена');
    } else if (code === 'STAR100') {
      const p = { code, discountRub: 100, description: 'Скидка 100 ₽' };
      setAppliedPromo(p);
      savePromo(p);
      setPromoMessage('Скидка 100 ₽ применена');
    } else if (code === 'BONUS5') {
      const p = { code, discountPercent: 5, description: 'Скидка 5%' };
      setAppliedPromo(p);
      savePromo(p);
      setPromoMessage('Скидка 5% применена');
    } else {
      setPromoMessage('Промокод не найден');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (isDigitalGood) {
      if (!zodiacSign) newErrors.zodiacSign = 'Выберите ваш знак зодиака';
    } else {
      if (!clientName.trim()) newErrors.clientName = 'Укажите ваше имя';
      if (!clientBirthDate) newErrors.clientBirthDate = 'Укажите дату рождения';

      if (isRelationship) {
        if (!partnerName.trim()) newErrors.partnerName = 'Укажите имя партнера';
      }

      if (!selectedDate) newErrors.slotDate = 'Выберите дату';
      if (!selectedTime) newErrors.slotTime = 'Выберите удобное время слота';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (!validateForm()) return;
    // Show exact requested demo payment window
    setShowDemoPayment(true);
  };

  const handleConfirmDemoPayment = () => {
    const combinedDetails = bonusQuestionText.trim()
      ? `${questionDetails.trim() ? questionDetails.trim() + '\n\n' : ''}[+1 Бонусный вопрос к заказу]: ${bonusQuestionText.trim()}`
      : questionDetails.trim();

    const newOrder: Order = {
      id: `ARC-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceId: service.id,
      serviceTitle: selectedPeriod ? `${service.title} (${selectedPeriod.label})` : service.title,
      price: finalPrice,
      periodLabel: selectedPeriod?.label,
      clientName: isDigitalGood ? clientName.trim() || 'Клиент' : clientName.trim(),
      clientBirthDate: isDigitalGood ? undefined : clientBirthDate,
      zodiacSign: isDigitalGood ? zodiacSign : undefined,
      partnerName: isRelationship ? partnerName.trim() : undefined,
      questionDetails: combinedDetails,
      photoUrl: photoPreview || undefined,
      slotDate: isDigitalGood ? new Date().toISOString().split('T')[0] : selectedDate,
      slotTime: isDigitalGood ? 'Мгновенно' : selectedTime,
      createdAt: new Date().toISOString(),
      status: isDigitalGood ? 'completed' : 'pending',
      paymentMethod: 'ЮKassa (Демо)',
      promoCodeApplied: appliedPromo?.code,
      discountRub: discountAmount,
      hasBonusQuestion,
      isDigitalGood,
    };

    addOrder(newOrder);

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#FAFAF9', '#D6D3D1', '#78716C'],
    });

    onSuccess(newOrder);
  };

  const formatDateDisplay = (isoStr: string) => {
    try {
      const [y, m, d] = isoStr.split('-');
      const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
      return dateObj.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        weekday: 'short',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-lg bg-[#171412] border border-[#FAFAF9]/25 rounded-3xl shadow-2xl overflow-hidden my-3 max-h-[94vh] flex flex-col text-[#FAFAF9]">
          
          {/* Top Header */}
          <div className="sticky top-0 z-10 bg-[#0C0A09] px-4 sm:px-6 py-3.5 border-b border-[#FAFAF9]/15 flex items-center justify-between shrink-0">
            <div className="truncate mr-2">
              <span className="text-[10px] font-mono tracking-widest text-[#FAFAF9]/50 uppercase block">
                ORDER PROTOCOL
              </span>
              <h2 className="text-sm sm:text-base font-serif-luxury font-medium text-white uppercase tracking-wide truncate">
                {service.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#171412] flex items-center justify-center text-[#FAFAF9]/60 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
            
            {/* Service note */}
            <div className="p-3.5 rounded-xl bg-[#0C0A09] border border-[#FAFAF9]/10 space-y-1">
              <span className="text-[10px] font-mono text-[#FAFAF9]/50 uppercase tracking-widest block font-light">
                УСЛУГА:
              </span>
              <p className="text-xs text-[#FAFAF9]/85 font-light leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* FORM LOGIC */}
            {isDigitalGood ? (
              /* CASE 1: DIGITAL HOROSCOPE (ONLY ZODIAC SIGN REQUESTED!) */
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-[#0C0A09] border border-[#FAFAF9]/20 space-y-1 text-xs">
                  <span className="font-mono text-[10px] text-[#FAFAF9]/60 uppercase tracking-wider block">
                    АВТОВЫДАЧА ФАЙЛА
                  </span>
                  <p className="text-[#FAFAF9]/80 font-light">
                    Выберите только ваш знак зодиака. Сразу после нажатия кнопки «Оплатить» файл откроется на экране и будет доступен для скачивания.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#FAFAF9]/80 mb-1.5 uppercase tracking-wider">
                    Выберите ваш знак зодиака *
                  </label>
                  <select
                    value={zodiacSign}
                    onChange={(e) => setZodiacSign(e.target.value)}
                    className="w-full bg-[#0C0A09] border border-[#FAFAF9]/25 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#FAFAF9] focus:outline-none focus:border-[#FAFAF9] cursor-pointer"
                  >
                    {ZODIAC_SIGNS.map((sign) => (
                      <option key={sign} value={sign} className="bg-[#0C0A09] text-[#FAFAF9]">
                        {sign}
                      </option>
                    ))}
                  </select>
                  {errors.zodiacSign && (
                    <p className="text-[11px] text-rose-300 mt-1">{errors.zodiacSign}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] text-[#FAFAF9]/60 mb-1 font-light">
                    Ваше имя (для титульного листа файла, опционально)
                  </label>
                  <input
                    type="text"
                    placeholder="Например: Анастасия"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#0C0A09] border border-[#FAFAF9]/20 rounded-xl px-3.5 py-2 text-xs text-[#FAFAF9] placeholder-[#FAFAF9]/30 focus:outline-none focus:border-[#FAFAF9]"
                  />
                </div>
              </div>
            ) : (
              /* CASE 2: REGULAR TAROT READINGS (NAME, DATE, QUESTION) */
              <div className="space-y-4">
                
                {/* Date & Time Selection */}
                <div className="space-y-2.5">
                  <label className="text-xs font-mono text-[#FAFAF9]/80 tracking-wider uppercase flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#FAFAF9]" />
                    <span>Выберите дату и время записи:</span>
                  </label>

                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {uniqueDates.map((dateStr) => {
                      const isSelected = dateStr === selectedDate;
                      return (
                        <button
                          key={dateStr}
                          type="button"
                          onClick={() => {
                            setSelectedDate(dateStr);
                            setSelectedTime('');
                          }}
                          className={`py-1.5 px-3 rounded-xl text-center border transition-all cursor-pointer whitespace-nowrap text-xs font-mono ${
                            isSelected
                              ? 'bg-[#FAFAF9] border-[#FAFAF9] text-[#0C0A09] font-bold shadow-sm'
                              : 'bg-[#0C0A09] border-[#FAFAF9]/15 text-[#FAFAF9]/60 hover:text-[#FAFAF9]'
                          }`}
                        >
                          {formatDateDisplay(dateStr)}
                        </button>
                      );
                    })}
                  </div>
                  {errors.slotDate && <p className="text-[11px] text-rose-300">{errors.slotDate}</p>}

                  {selectedDate && (
                    <div>
                      <span className="text-[10px] font-mono text-[#FAFAF9]/60 block mb-1">
                        Доступные слоты:
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                        {timesForSelectedDate.map((slot) => {
                          const isSelected = selectedTime === slot.time;
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              disabled={slot.isBooked}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`py-1.5 px-2 rounded-lg text-xs font-mono border text-center transition-all cursor-pointer ${
                                slot.isBooked
                                  ? 'bg-[#0C0A09]/50 border-[#FAFAF9]/5 text-[#FAFAF9]/20 cursor-not-allowed line-through'
                                  : isSelected
                                  ? 'bg-[#FAFAF9] border-[#FAFAF9] text-[#0C0A09] font-bold'
                                  : 'bg-[#0C0A09] border-[#FAFAF9]/10 text-[#FAFAF9]/70 hover:text-[#FAFAF9]'
                              }`}
                            >
                              {slot.time}
                            </button>
                          );
                        })}
                      </div>
                      {errors.slotTime && (
                        <p className="text-[11px] text-rose-300 mt-1">{errors.slotTime}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Name, Birth Date, Question fields */}
                <div className="space-y-3 pt-1">
                  <span className="text-xs font-mono text-[#FAFAF9]/80 tracking-wider uppercase flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#FAFAF9]" />
                    <span>Данные клиента:</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] text-[#FAFAF9]/70 mb-1 font-light">
                        Ваше Имя *
                      </label>
                      <input
                        type="text"
                        placeholder="Ваше имя"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-[#0C0A09] border border-[#FAFAF9]/15 rounded-xl px-3 py-2 text-xs text-[#FAFAF9] placeholder-[#FAFAF9]/30 focus:outline-none focus:border-[#FAFAF9]"
                      />
                      {errors.clientName && (
                        <p className="text-[11px] text-rose-300 mt-0.5">{errors.clientName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#FAFAF9]/70 mb-1 font-light">
                        Дата рождения *
                      </label>
                      <input
                        type="date"
                        value={clientBirthDate}
                        onChange={(e) => setClientBirthDate(e.target.value)}
                        className="w-full bg-[#0C0A09] border border-[#FAFAF9]/15 rounded-xl px-3 py-2 text-xs text-[#FAFAF9] placeholder-[#FAFAF9]/30 focus:outline-none focus:border-[#FAFAF9]"
                      />
                      {errors.clientBirthDate && (
                        <p className="text-[11px] text-rose-300 mt-0.5">{errors.clientBirthDate}</p>
                      )}
                    </div>
                  </div>

                  {isRelationship && (
                    <div>
                      <label className="block text-[11px] text-white font-medium mb-1 flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-white" />
                        <span>Имя партнера *</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Имя партнера"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        className="w-full bg-[#0C0A09] border border-[#FAFAF9]/15 rounded-xl px-3 py-2 text-xs text-[#FAFAF9] placeholder-[#FAFAF9]/30 focus:outline-none focus:border-[#FAFAF9]"
                      />
                      {errors.partnerName && (
                        <p className="text-[11px] text-rose-300 mt-0.5">{errors.partnerName}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] text-[#FAFAF9]/80 mb-1 font-light">
                      На какую тему вопрос коротко описать?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Коротко опишите тему вопроса..."
                      value={questionDetails}
                      onChange={(e) => setQuestionDetails(e.target.value)}
                      className="w-full bg-[#0C0A09] border border-[#FAFAF9]/15 rounded-xl px-3 py-2 text-xs text-[#FAFAF9] placeholder-[#FAFAF9]/30 focus:outline-none focus:border-[#FAFAF9] resize-none leading-relaxed"
                    />
                    <p className="text-[10px] text-[#FAFAF9]/50 mt-0.5 font-light">
                      * Подробнее вопрос и все нюансы вы сможете уточнить в личных сообщениях с Настей.
                    </p>
                  </div>

                  {/* Bonus Question if won in Wheel */}
                  {hasBonusQuestion && (
                    <div className="p-3.5 rounded-xl bg-[#0C0A09] border border-[#FAFAF9]/30 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>Бонусный вопрос к заказу в подарок от Насти:</span>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Напишите ваш дополнительный бесплатный вопрос..."
                        value={bonusQuestionText}
                        onChange={(e) => setBonusQuestionText(e.target.value)}
                        className="w-full bg-[#171412] border border-[#FAFAF9]/20 rounded-xl px-3 py-1.5 text-xs text-[#FAFAF9] placeholder-[#FAFAF9]/30 focus:outline-none focus:border-[#FAFAF9] resize-none leading-relaxed mt-1"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] text-[#FAFAF9]/70 mb-1 font-light">
                      Фотографии участников (опционально)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 border border-dashed border-[#FAFAF9]/25 hover:border-[#FAFAF9]/60 rounded-xl p-2.5 flex items-center justify-center gap-2 cursor-pointer transition-colors bg-[#0C0A09] text-xs text-[#FAFAF9]/60">
                        <Upload className="w-4 h-4 text-[#FAFAF9]" />
                        <span>{photoPreview ? 'Фото прикреплено' : 'Прикрепить фото'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      {photoPreview && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#FAFAF9]/30 shrink-0">
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setPhotoPreview(null)}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px]"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                <div className="p-3 rounded-xl bg-[#0C0A09] border border-[#FAFAF9]/15 text-xs text-[#FAFAF9]/80 font-light">
                  Оплата 100% предоплата. Расклад приходит в формате голосового сообщения.
                </div>

              </div>
            )}

            {/* Promo Code section */}
            <div className="pt-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Промокод (если есть)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  className="flex-1 bg-[#0C0A09] border border-[#FAFAF9]/15 rounded-xl px-3 py-2 text-xs text-[#FAFAF9] placeholder-[#FAFAF9]/30 uppercase font-mono focus:outline-none focus:border-[#FAFAF9]"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 rounded-xl bg-[#0C0A09] hover:bg-[#221D1A] border border-[#FAFAF9]/25 text-[#FAFAF9] text-xs transition-colors cursor-pointer shrink-0 font-mono"
                >
                  Применить
                </button>
              </div>
              {promoMessage && (
                <p className="text-[11px] text-[#FAFAF9]/70 mt-1 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" />
                  <span>{promoMessage}</span>
                </p>
              )}
            </div>

            {/* Strict Boutique Action Button */}
            <div className="pt-2 border-t border-[#FAFAF9]/15 space-y-3">
              <div className="flex justify-between items-center text-xs text-[#FAFAF9]/70">
                <span className="font-light">К оплате:</span>
                <span className="text-xl font-serif-luxury font-bold text-white tabular-nums">
                  {finalPrice.toLocaleString('ru-RU')} ₽
                </span>
              </div>

              {/* Strict Button: white bg, black text, black border */}
              <button
                type="button"
                onClick={handleProceedToPayment}
                className="w-full py-3.5 px-6 rounded-full bg-[#FAFAF9] hover:bg-white active:scale-[0.98] text-[#0C0A09] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer border border-[#FAFAF9]"
              >
                <CreditCard className="w-4 h-4 text-[#0C0A09]" />
                <span>Оплатить {finalPrice.toLocaleString('ru-RU')} ₽</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Exact requested Demo Payment Modal */}
      <DemoPaymentModal
        isOpen={showDemoPayment}
        onClose={() => setShowDemoPayment(false)}
        onConfirm={handleConfirmDemoPayment}
        amount={finalPrice}
        itemName={service.title}
      />
    </>
  );
}
