import React, { useState, useEffect, useRef } from 'react';
import { CalendarSlot, Order, ScheduledDailyCard, ClubMember } from '../types';
import { TAROT_DECK } from '../data/tarotCards';
import {
  getOrders,
  saveOrders,
  getSlots,
  addSlot,
  removeSlot,
  getScheduledDailyCards,
  setScheduledCard,
  deleteScheduledCard,
  getFutureDate,
  getClubMembers,
  saveClubMembers,
  sendWeeklyForecastMass,
} from '../utils/storage';
import {
  Plus,
  Trash2,
  CheckCircle,
  X,
  Eye,
  KeyRound,
  Mic,
  Search,
  Lock,
  Sparkles,
  Calendar,
  Upload,
  Edit2,
  Crown,
  Send,
  MessageCircle,
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const CORRECT_PIN = '7777';

  const [activeTab, setActiveTab] = useState<'records' | 'dailyCards' | 'club' | 'calendar' | 'finances'>('records');
  const [orders, setOrders] = useState<Order[]>([]);
  const [slots, setSlots] = useState<CalendarSlot[]>([]);
  const [clubMembers, setClubMembers] = useState<ClubMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Audio recording for orders
  const [selectedOrderForAudio, setSelectedOrderForAudio] = useState<Order | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Slots
  const [newSlotDate, setNewSlotDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newSlotTime, setNewSlotTime] = useState<string>('15:00');

  // Daily Card Scheduling state
  const todayIso = new Date().toISOString().split('T')[0];
  const [scheduledCards, setScheduledCards] = useState<Record<string, ScheduledDailyCard>>({});
  const [cardTargetDate, setCardTargetDate] = useState<string>(todayIso);
  const [cardArcanaNumber, setCardArcanaNumber] = useState<string>('XVII');
  const [cardNameRu, setCardNameRu] = useState<string>('Звезда');
  const [cardNameEn, setCardNameEn] = useState<string>('The Star');
  const [cardElement, setCardElement] = useState<string>('Воздух / Водолей');
  const [cardGuidance, setCardGuidance] = useState<string>(
    'Сегодня ваш день озарен спокойной уверенностью. Доверьтесь внутреннему компасу — вы движетесь в верном направлении.'
  );
  const [cardImageUrl, setCardImageUrl] = useState<string>('');
  const [cardImagePreview, setCardImagePreview] = useState<string | null>(null);

  // Club Weekly Forecast Mass Dispatch
  const [showForecastComposer, setShowForecastComposer] = useState(false);
  const [forecastMessageText, setForecastMessageText] = useState(
    'Послание на неделю для участниц Клуба Arcana: энергия недели требует спокойного созерцания и защиты личных границ. В среду избегайте спешки в договоренностях, а в пятницу ждите вдохновляющих новостей.'
  );

  // Emergency answer editor for club member
  const [answeringMemberId, setAnsweringMemberId] = useState<string | null>(null);
  const [emergencyAnswerText, setEmergencyAnswerText] = useState('');

  const [viewingPhotoUrl, setViewingPhotoUrl] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
  }, [isAuthenticated]);

  const refreshData = () => {
    setOrders(getOrders());
    setSlots(getSlots());
    setClubMembers(getClubMembers());
    const sc = getScheduledDailyCards();
    setScheduledCards(sc);

    loadCardIntoForm(cardTargetDate, sc);
  };

  const loadCardIntoForm = (dateStr: string, cardsMap?: Record<string, ScheduledDailyCard>) => {
    const map = cardsMap || scheduledCards;
    setCardTargetDate(dateStr);
    if (map[dateStr]) {
      const c = map[dateStr];
      setCardArcanaNumber(c.arcanaNumber);
      setCardNameRu(c.nameRu);
      setCardNameEn(c.nameEn);
      setCardElement(c.element);
      setCardGuidance(c.guidance);
      setCardImageUrl(c.imageUrl || '');
      setCardImagePreview(c.imageUrl || null);
    } else {
      const starter = TAROT_DECK[0];
      setCardArcanaNumber(starter.arcanaNumber);
      setCardNameRu(starter.nameRu);
      setCardNameEn(starter.nameEn);
      setCardElement(starter.element);
      setCardGuidance(starter.guidance);
      setCardImageUrl('');
      setCardImagePreview(null);
    }
  };

  const handleSelectDeckPreset = (deckCardId: string) => {
    const found = TAROT_DECK.find((c) => c.id === deckCardId);
    if (found) {
      setCardArcanaNumber(found.arcanaNumber);
      setCardNameRu(found.nameRu);
      setCardNameEn(found.nameEn);
      setCardElement(found.element);
      setCardGuidance(found.guidance);
      showNotification(`Аркан «${found.nameRu}» подставлен в форму`);
    }
  };

  const handleCardImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCardImageUrl(result);
        setCardImagePreview(result);
        showNotification('Изображение карты загружено');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveScheduledCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardTargetDate || !cardNameRu.trim() || !cardGuidance.trim()) {
      showNotification('Заполните дату, название и совет');
      return;
    }

    const card: ScheduledDailyCard = {
      date: cardTargetDate,
      arcanaNumber: cardArcanaNumber.trim() || '✦',
      nameRu: cardNameRu.trim(),
      nameEn: cardNameEn.trim() || cardNameRu.trim(),
      element: cardElement.trim() || 'Космос',
      guidance: cardGuidance.trim(),
      imageUrl: cardImagePreview || cardImageUrl.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    setScheduledCard(card);
    const updated = getScheduledDailyCards();
    setScheduledCards(updated);
    showNotification(`Карта дня на ${cardTargetDate} успешно сохранена!`);
    window.dispatchEvent(new Event('storage'));
  };

  const handleDeleteCardForDate = (dateStr: string) => {
    deleteScheduledCard(dateStr);
    const updated = getScheduledDailyCards();
    setScheduledCards(updated);
    showNotification(`Карта на ${dateStr} удалена`);
    window.dispatchEvent(new Event('storage'));
  };

  const handleToggleMember = (memberId: string) => {
    const updated = clubMembers.map((m) => {
      if (m.id === memberId) {
        return { ...m, isActive: !m.isActive };
      }
      return m;
    });
    saveClubMembers(updated);
    setClubMembers(updated);
    showNotification('Статус подписки изменен');
  };

  const handleSendWeeklyForecast = () => {
    sendWeeklyForecastMass(forecastMessageText);
    setClubMembers(getClubMembers());
    setShowForecastComposer(false);
    showNotification('Персональный еженедельный прогноз отправлен всем активным подписчикам клуба!');
  };

  const handleSendEmergencyAnswer = (memberId: string) => {
    if (!emergencyAnswerText.trim()) return;
    const updated = clubMembers.map((m) => {
      if (m.id === memberId) {
        return {
          ...m,
          emergencyQuestionAnswer: emergencyAnswerText.trim(),
          emergencyAnswerDate: new Date().toISOString().split('T')[0],
        };
      }
      return m;
    });
    saveClubMembers(updated);
    setClubMembers(updated);
    setAnsweringMemberId(null);
    setEmergencyAnswerText('');
    showNotification('Ответ на срочный вопрос отправлен клиенту!');
  };

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === CORRECT_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotDate || !newSlotTime) return;

    const exists = slots.some((s) => s.date === newSlotDate && s.time === newSlotTime);
    if (exists) {
      showNotification('Слот уже добавлен');
      return;
    }

    const slot: CalendarSlot = {
      id: `slot-${Date.now()}`,
      date: newSlotDate,
      time: newSlotTime,
      isBooked: false,
    };

    addSlot(slot);
    setSlots(getSlots());
    showNotification(`Слот ${newSlotDate} ${newSlotTime} добавлен`);
  };

  const handleDeleteSlot = (slotId: string) => {
    removeSlot(slotId);
    setSlots(getSlots());
    showNotification('Слот удален');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      setAudioUrl('simulated_audio_ready');
      showNotification('Микрофон недоступен, сгенерирован аудио-шаблон');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleSendAudioResult = (orderId: string) => {
    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: 'completed' as const,
          audioResultUrl: audioUrl || 'simulated_audio_ready',
          audioResultTitle: `Голосовой разбор для ${ord.clientName}`,
          audioDuration:
            recordingSeconds > 0
              ? `${Math.floor(recordingSeconds / 60)}:${(recordingSeconds % 60).toString().padStart(2, '0')}`
              : '15:20',
          deliveredAt: new Date().toISOString(),
        };
      }
      return ord;
    });

    saveOrders(updated);
    setOrders(updated);
    setSelectedOrderForAudio(null);
    setAudioUrl(null);
    showNotification('Результат отправлен клиенту!');
  };

  const totalTurnover = orders.reduce((sum, ord) => sum + (ord.price || 0), 0);
  const activeClubCount = clubMembers.filter((m) => m.isActive).length;
  const clubTurnover = activeClubCount * 990;
  const grandTurnover = totalTurnover + clubTurnover;
  const platformCommission = Math.round(grandTurnover * 0.1);
  const netEarnings = grandTurnover - platformCommission;

  const filteredOrders = orders.filter((ord) => {
    const q = searchQuery.toLowerCase();
    return (
      ord.clientName.toLowerCase().includes(q) ||
      ord.serviceTitle.toLowerCase().includes(q) ||
      (ord.questionDetails && ord.questionDetails.toLowerCase().includes(q))
    );
  });

  const futureDatesList = Array.from({ length: 14 }).map((_, i) => getFutureDate(i));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#171412] border border-[#FAFAF9]/25 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[94vh] text-[#FAFAF9]">
        
        {/* Top Header */}
        <div className="sticky top-0 z-10 bg-[#0C0A09] px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#FAFAF9]/15 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#FAFAF9]" />
            <h2 className="text-xs sm:text-base font-serif-luxury font-medium text-[#FAFAF9] uppercase tracking-wider truncate">
              Админ-панель · Настя
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#171412] flex items-center justify-center text-[#FAFAF9]/70 hover:text-[#FAFAF9] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PIN CODE SCREEN */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#0C0A09] border border-[#FAFAF9]/20 flex items-center justify-center text-[#FAFAF9]">
              <KeyRound className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-serif-luxury font-medium text-[#FAFAF9] uppercase tracking-wide">
                Вход по PIN-коду
              </h3>
              <p className="text-xs text-[#FAFAF9]/60 mt-1 font-light">
                Введите PIN для доступа к расписанию карт дня, клубу, клиентам и финансам
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="w-full max-w-xs space-y-3">
              <input
                type="password"
                maxLength={6}
                placeholder="Введите PIN (по умолч. 7777)"
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinError(false);
                }}
                className="w-full bg-[#0C0A09] border border-[#FAFAF9]/20 rounded-xl px-4 py-2.5 text-center text-sm font-mono font-bold tracking-widest text-[#FAFAF9] focus:outline-none focus:border-[#FAFAF9]"
                autoFocus
              />

              {pinError && <p className="text-xs text-rose-300">Неверный PIN-код</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#FAFAF9] hover:bg-white text-[#0C0A09] text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer shadow-md"
              >
                Войти
              </button>

              <button
                type="button"
                onClick={() => {
                  setEnteredPin('7777');
                  setIsAuthenticated(true);
                }}
                className="text-[11px] text-[#FAFAF9]/50 hover:underline font-light cursor-pointer block mx-auto"
              >
                Ввести тестовый PIN: 7777
              </button>
            </form>
          </div>
        ) : (
          <>
            {feedbackMessage && (
              <div className="bg-[#FAFAF9] text-[#0C0A09] px-4 sm:px-6 py-2 text-xs font-semibold flex items-center gap-1.5 shrink-0 animate-in fade-in">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{feedbackMessage}</span>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="bg-[#0C0A09] px-3 sm:px-6 py-2 border-b border-[#FAFAF9]/15 flex gap-1.5 sm:gap-2 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('records')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-medium tracking-wide uppercase transition-all cursor-pointer shrink-0 ${
                  activeTab === 'records'
                    ? 'bg-[#FAFAF9] text-[#0C0A09] font-semibold'
                    : 'text-[#FAFAF9]/60 hover:text-[#FAFAF9]'
                }`}
              >
                Записи ({orders.length})
              </button>

              <button
                onClick={() => setActiveTab('dailyCards')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-medium tracking-wide uppercase transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                  activeTab === 'dailyCards'
                    ? 'bg-[#FAFAF9] text-[#0C0A09] font-semibold'
                    : 'text-[#FAFAF9]/60 hover:text-[#FAFAF9]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Карта дня (Авто)</span>
              </button>

              {/* NEW TAB: ПОДПИСЧИКИ КЛУБА */}
              <button
                onClick={() => setActiveTab('club')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-medium tracking-wide uppercase transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                  activeTab === 'club'
                    ? 'bg-[#FAFAF9] text-[#0C0A09] font-semibold'
                    : 'text-[#FAFAF9]/60 hover:text-[#FAFAF9]'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Клуб Arcana ({activeClubCount})</span>
              </button>

              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-medium tracking-wide uppercase transition-all cursor-pointer shrink-0 ${
                  activeTab === 'calendar'
                    ? 'bg-[#FAFAF9] text-[#0C0A09] font-semibold'
                    : 'text-[#FAFAF9]/60 hover:text-[#FAFAF9]'
                }`}
              >
                Слоты ({slots.length})
              </button>

              <button
                onClick={() => setActiveTab('finances')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-medium tracking-wide uppercase transition-all cursor-pointer shrink-0 ${
                  activeTab === 'finances'
                    ? 'bg-[#FAFAF9] text-[#0C0A09] font-semibold'
                    : 'text-[#FAFAF9]/60 hover:text-[#FAFAF9]'
                }`}
              >
                Финансы
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              
              {/* ========================================================
                  TAB: ПОДПИСЧИКИ КЛУБА ARCANA
                  ======================================================== */}
              {activeTab === 'club' && (
                <div className="space-y-6">
                  
                  {/* Top Bar with Mass Forecast Button */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#0C0A09] border border-[#FAFAF9]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-[#FAFAF9]" />
                        <h3 className="text-sm font-serif-luxury font-bold text-white uppercase tracking-wider">
                          Клуб Arcana · Закрытый круг
                        </h3>
                      </div>
                      <p className="text-xs text-[#FAFAF9]/70 font-light mt-1">
                        Всего участников: <strong>{clubMembers.length}</strong> (активных: <strong>{activeClubCount}</strong>) · Выручка клуба: <strong>{clubTurnover.toLocaleString('ru-RU')} ₽/мес</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowForecastComposer(!showForecastComposer)}
                      className="py-2.5 px-4 rounded-full bg-[#FAFAF9] hover:bg-white text-[#0C0A09] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Отправить прогноз на неделю</span>
                    </button>
                  </div>

                  {/* Forecast Composer */}
                  {showForecastComposer && (
                    <div className="p-4 rounded-2xl bg-[#0C0A09] border border-[#FAFAF9]/25 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-[#FAFAF9]/10 pb-2">
                        <span className="text-xs font-serif-luxury font-bold uppercase tracking-wider text-white">
                          Рассылка еженедельного прогноза (каждое воскресенье):
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowForecastComposer(false)}
                          className="text-[10px] text-[#FAFAF9]/50 hover:text-white"
                        >
                          Отмена
                        </button>
                      </div>

                      <textarea
                        rows={3}
                        value={forecastMessageText}
                        onChange={(e) => setForecastMessageText(e.target.value)}
                        className="w-full bg-[#171412] border border-[#FAFAF9]/20 rounded-xl p-3 text-xs text-[#FAFAF9] placeholder-[#FAFAF9]/30 focus:outline-none focus:border-[#FAFAF9] resize-none leading-relaxed"
                      />

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[10px] text-[#FAFAF9]/50 font-light">
                          Будет отправлено {activeClubCount} активным участницам
                        </span>
                        <button
                          type="button"
                          onClick={handleSendWeeklyForecast}
                          className="py-2 px-5 rounded-full bg-[#FAFAF9] text-[#0C0A09] text-xs font-bold uppercase tracking-wider hover:bg-white transition-all cursor-pointer shadow-md"
                        >
                          Разослать сейчас 🚀
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Members list */}
                  <div className="space-y-3">
                    <span className="text-xs font-serif-luxury font-medium text-[#FAFAF9] uppercase tracking-wider block">
                      Список подписчиков:
                    </span>

                    {clubMembers.length === 0 ? (
                      <p className="text-xs text-[#FAFAF9]/50 text-center py-6">Подписчиков пока нет</p>
                    ) : (
                      clubMembers.map((m) => (
                        <div
                          key={m.id}
                          className="p-4 rounded-2xl bg-[#0C0A09] border border-[#FAFAF9]/15 space-y-3 text-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-serif-luxury font-bold text-white text-sm">
                                  {m.clientName}
                                </span>
                                {m.telegramUsername && (
                                  <span className="text-[#FAFAF9]/50 font-mono text-[11px]">
                                    {m.telegramUsername}
                                  </span>
                                )}
                                <span
                                  className={`text-[9px] px-2 py-0.5 rounded-full border uppercase font-mono ${
                                    m.isActive
                                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                                      : 'bg-[#171412] text-[#FAFAF9]/40 border-[#FAFAF9]/10'
                                  }`}
                                >
                                  {m.isActive ? 'Активна' : 'Отключена'}
                                </span>
                              </div>
                              <span className="text-[11px] text-[#FAFAF9]/60 font-light block mt-0.5">
                                Дата рождения: <strong>{m.clientBirthDate}</strong> · Подписка до: {m.expiresAt}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleMember(m.id)}
                              className="px-3 py-1 rounded-full border border-[#FAFAF9]/20 hover:border-[#FAFAF9]/50 text-[10px] uppercase font-mono tracking-wider cursor-pointer self-start sm:self-auto"
                            >
                              {m.isActive ? 'Отключить подписку' : 'Продлить / Включить'}
                            </button>
                          </div>

                          {/* Emergency Question Status */}
                          <div className="p-3 rounded-xl bg-[#171412] border border-[#FAFAF9]/10 space-y-2">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-[#FAFAF9]/70 font-light">
                                Запрос «Скорая помощь» (вопрос вне очереди):
                              </span>
                              <span className="font-mono text-[10px]">
                                {m.hasUsedEmergencyQuestion ? 'Использован в этом месяце' : 'Доступен клиенту'}
                              </span>
                            </div>

                            {m.emergencyQuestionText && (
                              <div className="space-y-1 pt-1 border-t border-[#FAFAF9]/10">
                                <span className="text-[10px] text-[#FAFAF9]/50 block">Срочный вопрос от клиента:</span>
                                <p className="text-xs text-[#FAFAF9] font-light leading-relaxed">
                                  «{m.emergencyQuestionText}»
                                </p>

                                {m.emergencyQuestionAnswer ? (
                                  <div className="mt-2 p-2.5 rounded-lg bg-[#0C0A09] border border-[#FAFAF9]/15">
                                    <span className="text-[9px] text-[#FAFAF9]/50 uppercase font-mono block">Ваш ответ:</span>
                                    <p className="text-xs text-emerald-200 mt-0.5">{m.emergencyQuestionAnswer}</p>
                                  </div>
                                ) : (
                                  <div className="pt-2">
                                    {answeringMemberId === m.id ? (
                                      <div className="space-y-2">
                                        <textarea
                                          rows={2}
                                          placeholder="Напишите ответ на срочный вопрос..."
                                          value={emergencyAnswerText}
                                          onChange={(e) => setEmergencyAnswerText(e.target.value)}
                                          className="w-full bg-[#0C0A09] border border-[#FAFAF9]/20 rounded-lg p-2 text-xs text-[#FAFAF9] focus:outline-none focus:border-[#FAFAF9]"
                                        />
                                        <div className="flex gap-2 justify-end">
                                          <button
                                            type="button"
                                            onClick={() => setAnsweringMemberId(null)}
                                            className="px-3 py-1 rounded text-[10px] text-[#FAFAF9]/50"
                                          >
                                            Отмена
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleSendEmergencyAnswer(m.id)}
                                            className="px-3 py-1 rounded bg-[#FAFAF9] text-[#0C0A09] text-[10px] font-bold uppercase"
                                          >
                                            Отправить ответ
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setAnsweringMemberId(m.id);
                                          setEmergencyAnswerText('');
                                        }}
                                        className="text-[11px] text-[#FAFAF9] hover:underline flex items-center gap-1 cursor-pointer"
                                      >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        <span>Ответить на вопрос вне очереди</span>
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                </div>
              )}

              {/* ========================================================
                  TAB: КАРТА ДНЯ (УПРАВЛЕНИЕ РАСПИСАНИЕМ)
                  ======================================================== */}
              {activeTab === 'dailyCards' && (
                <div className="space-y-6">
                  
                  <div className="p-4 rounded-2xl bg-[#0C0A09] border border-[#FAFAF9]/15 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FAFAF9]" />
                      <h3 className="text-sm font-serif-luxury font-bold text-white uppercase tracking-wider">
                        Автоматическая Карта Дня
                      </h3>
                    </div>
                    <p className="text-xs text-[#FAFAF9]/80 font-light leading-relaxed">
                      Загружайте карты с картинкой и советом на неделю или месяц вперед. Клиент автоматически видит карту, привязанную к сегодняшней дате, а вам не нужно обновлять ее каждый день!
                    </p>
                  </div>

                  <form
                    onSubmit={handleSaveScheduledCard}
                    className="p-4 sm:p-5 rounded-2xl bg-[#0C0A09] border border-[#FAFAF9]/15 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FAFAF9]/10 pb-3">
                      <div>
                        <span className="text-[10px] text-[#FAFAF9]/60 uppercase tracking-widest block font-mono">
                          Редактор карты
                        </span>
                        <h4 className="text-sm sm:text-base font-serif-luxury font-bold text-white uppercase tracking-wide">
                          Настройка карты на: {cardTargetDate} {cardTargetDate === todayIso && '(Сегодня)'}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        {[0, 1, 2, 3, 4, 7].map((offset) => {
                          const dt = getFutureDate(offset);
                          const isCur = cardTargetDate === dt;
                          const label = offset === 0 ? 'Сегодня' : offset === 1 ? 'Завтра' : `+${offset} дн`;
                          return (
                            <button
                              key={dt}
                              type="button"
                              onClick={() => loadCardIntoForm(dt)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all cursor-pointer whitespace-nowrap ${
                                isCur
                                  ? 'bg-[#FAFAF9] border-[#FAFAF9] text-[#0C0A09] font-bold'
                                  : 'bg-[#171412] border-[#FAFAF9]/10 text-[#FAFAF9]/70 hover:text-[#FAFAF9]'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#FAFAF9]/70 mb-1 font-light">
                          Дата показа карты:
                        </label>
                        <input
                          type="date"
                          value={cardTargetDate}
                          onChange={(e) => loadCardIntoForm(e.target.value)}
                          className="w-full bg-[#171412] border border-[#FAFAF9]/15 rounded-xl px-3 py-2 text-xs text-[#FAFAF9] focus:outline-none focus:border-[#FAFAF9]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#FAFAF9]/70 mb-1 font-light">
                          Быстрый шаблон из 22 Старших Арканов:
                        </label>
                        <select
                          onChange={(e) => handleSelectDeckPreset(e.target.value)}
                          defaultValue=""
                          className="w-full bg-[#171412] border border-[#FAFAF9]/15 rounded-xl px-3 py-2 text-xs text-[#FAFAF9] focus:outline-none focus:border-[#FAFAF9] cursor-pointer"
                        >
                          <option value="" disabled>
                            -- Выбрать аркан для автозаполнения --
                          </option>
                          {TAROT_DECK.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.arcanaNumber} {c.nameRu} ({c.nameEn})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div>
                        <label className="block text-[10px] text-[#FAFAF9]/70 mb-1 font-light">
                          Номер (Римский / Арабский):
                        </label>
                        <input
                          type="text"
                          value={cardArcanaNumber}
                          onChange={(e) => setCardArcanaNumber(e.target.value)}
                          placeholder="XVII"
                          className="w-full bg-[#171412] border border-[#FAFAF9]/15 rounded-xl px-3 py-1.5 text-xs text-[#FAFAF9] focus:outline-none focus:border-[#FAFAF9]"
                        />
                      </div>

                      <div className="col-span-1 sm:col-span-2">
                        <label className="block text-[10px] text-[#FAFAF9]/70 mb-1 font-light">
                          Название карты (RU):
                        </label>
                        <input
                          type="text"
                          value={cardNameRu}
                          onChange={(e) => setCardNameRu(e.target.value)}
                          placeholder="Звезда"
                          className="w-full bg-[#171412] border border-[#FAFAF9]/15 rounded-xl px-3 py-1.5 text-xs text-[#FAFAF9] focus:outline-none focus:border-[#FAFAF9]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#FAFAF9]/70 mb-1 font-light">
                          Название (EN):
                        </label>
                        <input
                          type="text"
                          value={cardNameEn}
                          onChange={(e) => setCardNameEn(e.target.value)}
                          placeholder="The Star"
                          className="w-full bg-[#171412] border border-[#FAFAF9]/15 rounded-xl px-3 py-1.5 text-xs text-[#FAFAF9] focus:outline-none focus:border-[#FAFAF9]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#FAFAF9]/70 mb-1 font-light">
                        Стихия / Астрологический знак:
                      </label>
                      <input
                        type="text"
                        value={cardElement}
                        onChange={(e) => setCardElement(e.target.value)}
                        placeholder="Воздух / Водолей"
                        className="w-full bg-[#171412] border border-[#FAFAF9]/15 rounded-xl px-3 py-1.5 text-xs text-[#FAFAF9] focus:outline-none focus:border-[#FAFAF9]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#FAFAF9]/70 mb-1 font-light">
                        Текст послания и рекомендации на день:
                      </label>
                      <textarea
                        rows={3}
                        value={cardGuidance}
                        onChange={(e) => setCardGuidance(e.target.value)}
                        placeholder="Опишите совет карт на этот день для клиента..."
                        className="w-full bg-[#171412] border border-[#FAFAF9]/15 rounded-xl p-3 text-xs text-[#FAFAF9] placeholder-[#FAFAF9]/30 focus:outline-none focus:border-[#FAFAF9] resize-none leading-relaxed"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] text-[#FAFAF9]/70 font-light">
                        Изображение карты (Загрузить фото или вставить URL):
                      </label>
                      
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <label className="flex-1 border border-dashed border-[#FAFAF9]/25 hover:border-[#FAFAF9]/60 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-colors bg-[#171412] text-xs text-[#FAFAF9]/80">
                          <Upload className="w-4 h-4 text-[#FAFAF9]" />
                          <span>{cardImagePreview ? 'Заменить изображение' : 'Загрузить картинку с устройства'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCardImageUpload}
                            className="hidden"
                          />
                        </label>

                        {cardImagePreview && (
                          <div className="relative w-14 h-18 rounded-lg overflow-hidden border border-[#FAFAF9]/30 shrink-0 self-center">
                            <img
                              src={cardImagePreview}
                              alt="Превью"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setCardImagePreview(null);
                                setCardImageUrl('');
                              }}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px]"
                              title="Удалить фото"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      <input
                        type="url"
                        placeholder="Или вставьте прямую ссылку на фото (https://...)"
                        value={cardImageUrl.startsWith('data:') ? '' : cardImageUrl}
                        onChange={(e) => {
                          setCardImageUrl(e.target.value);
                          setCardImagePreview(e.target.value || null);
                        }}
                        className="w-full bg-[#171412] border border-[#FAFAF9]/15 rounded-xl px-3 py-1.5 text-xs text-[#FAFAF9] placeholder-[#FAFAF9]/30 focus:outline-none focus:border-[#FAFAF9]"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      {scheduledCards[cardTargetDate] && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCardForDate(cardTargetDate)}
                          className="text-xs text-rose-300 hover:text-rose-200 transition-colors flex items-center gap-1 cursor-pointer order-2 sm:order-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Сбросить карту на {cardTargetDate}</span>
                        </button>
                      )}

                      <button
                        type="submit"
                        className="w-full sm:w-auto ml-auto py-2.5 px-6 rounded-full bg-[#FAFAF9] hover:bg-white text-[#0C0A09] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 order-1 sm:order-2"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Сохранить карту на {cardTargetDate}</span>
                      </button>
                    </div>
                  </form>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif-luxury font-medium text-[#FAFAF9] uppercase tracking-wider">
                        Расписание на ближайшие 14 дней:
                      </span>
                      <span className="text-[10px] text-[#FAFAF9]/50 font-light">
                        Нажмите «Изменить» для редактирования дня
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {futureDatesList.map((dt, idx) => {
                        const isToday = dt === todayIso;
                        const cardForDate = scheduledCards[dt];
                        return (
                          <div
                            key={dt}
                            className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                              isToday
                                ? 'bg-[#1C1714] border-[#FAFAF9]/40 shadow-md'
                                : 'bg-[#0C0A09] border-[#FAFAF9]/10'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-[11px] font-bold text-[#FAFAF9]">
                                    {dt}
                                  </span>
                                  {isToday && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#FAFAF9] text-[#0C0A09] font-bold uppercase tracking-wider font-mono">
                                      Сегодня
                                    </span>
                                  )}
                                </div>

                                <span className="text-[10px] text-[#FAFAF9]/50">
                                  {idx === 0 ? 'Сегодня' : idx === 1 ? 'Завтра' : `через ${idx} дн`}
                                </span>
                              </div>

                              {cardForDate ? (
                                <div className="flex items-start gap-2.5 pt-1">
                                  {cardForDate.imageUrl ? (
                                    <img
                                      src={cardForDate.imageUrl}
                                      alt=""
                                      className="w-9 h-12 object-cover rounded border border-[#FAFAF9]/20 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-9 h-12 rounded border border-[#FAFAF9]/15 bg-[#171412] flex items-center justify-center text-[10px] text-[#FAFAF9]/40 shrink-0">
                                      ✦
                                    </div>
                                  )}

                                  <div className="min-w-0 flex-1">
                                    <span className="font-serif-luxury font-bold text-[#FAFAF9] block truncate">
                                      {cardForDate.arcanaNumber} · {cardForDate.nameRu}
                                    </span>
                                    <p className="text-[10px] text-[#FAFAF9]/60 line-clamp-2 font-light leading-snug">
                                      {cardForDate.guidance}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-[10px] text-[#FAFAF9]/40 italic py-1">
                                  Карта не задана (будет показан стандартный аркан)
                                </p>
                              )}
                            </div>

                            <div className="pt-2.5 mt-2 border-t border-[#FAFAF9]/10 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => loadCardIntoForm(dt)}
                                className="text-[10px] text-[#FAFAF9] hover:underline flex items-center gap-1 cursor-pointer font-light"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>{cardForDate ? 'Изменить карту' : 'Назначить карту'}</span>
                              </button>

                              {cardForDate && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCardForDate(dt)}
                                  className="text-[10px] text-rose-300 hover:text-rose-200 cursor-pointer"
                                  title="Удалить"
                                >
                                  Сбросить
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 1: СПИСОК ЗАПИСЕЙ */}
              {activeTab === 'records' && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#FAFAF9]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Поиск по имени или вопросу..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#0C0A09] border border-[#FAFAF9]/15 rounded-xl pl-9 pr-3 py-2 text-xs text-[#FAFAF9] placeholder-[#FAFAF9]/30 focus:outline-none focus:border-[#FAFAF9]"
                    />
                  </div>

                  <div className="space-y-3">
                    {filteredOrders.length === 0 ? (
                      <p className="text-xs text-[#FAFAF9]/50 text-center py-6 font-light">
                        Записей не найдено
                      </p>
                    ) : (
                      filteredOrders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-4 rounded-2xl bg-[#0C0A09] border border-[#FAFAF9]/10 space-y-2.5 text-xs"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-serif-luxury font-bold text-white text-sm">
                                  {ord.clientName}
                                </span>
                                {ord.clientBirthDate && (
                                  <span className="text-[#FAFAF9]/50">({ord.clientBirthDate})</span>
                                )}
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                    ord.status === 'completed'
                                      ? 'bg-[#FAFAF9]/10 text-[#FAFAF9] border-[#FAFAF9]/30'
                                      : 'bg-[#171412] text-[#FAFAF9]/60 border-[#FAFAF9]/10'
                                  }`}
                                >
                                  {ord.status === 'completed' ? 'Готово' : 'Ожидает'}
                                </span>
                                {ord.hasBonusQuestion && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#221D1A] text-[#FAFAF9] border border-[#FAFAF9]/30">
                                    +1 бонусный вопрос
                                  </span>
                                )}
                              </div>
                              <span className="text-[#FAFAF9] font-serif-luxury font-medium block mt-0.5">
                                {ord.serviceTitle} · {ord.price.toLocaleString('ru-RU')} ₽
                              </span>
                            </div>

                            <span className="text-[11px] text-[#FAFAF9]/60 font-light whitespace-nowrap">
                              {ord.slotDate} в {ord.slotTime}
                            </span>
                          </div>

                          {ord.partnerName && (
                            <p className="text-[#FAFAF9]/80 font-light">
                              Имя партнера: <strong>{ord.partnerName}</strong>
                            </p>
                          )}

                          {ord.questionDetails ? (
                            <div className="p-2.5 rounded-xl bg-[#171412] border border-[#FAFAF9]/5 text-[#FAFAF9]/90 font-light whitespace-pre-line">
                              <span className="text-[10px] text-[#FAFAF9]/50 block mb-0.5">
                                Вопрос от клиента:
                              </span>
                              «{ord.questionDetails}»
                            </div>
                          ) : (
                            <p className="text-[#FAFAF9]/40 italic font-light">
                              Вопрос будет задан в личных сообщениях в Telegram
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-1">
                            {ord.photoUrl ? (
                              <button
                                type="button"
                                onClick={() => setViewingPhotoUrl(ord.photoUrl || null)}
                                className="flex items-center gap-1.5 text-[#FAFAF9] hover:underline cursor-pointer font-light"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Посмотреть фото</span>
                              </button>
                            ) : (
                              <span className="text-[#FAFAF9]/30 font-light">Фото не прикреплено</span>
                            )}

                            <button
                              onClick={() => setSelectedOrderForAudio(ord)}
                              className="px-3 py-1 rounded-full bg-[#FAFAF9] text-[#0C0A09] text-[10px] font-semibold uppercase tracking-wider cursor-pointer shadow-sm"
                            >
                              <Mic className="w-3 h-3 inline mr-1" />
                              {ord.status === 'completed' ? 'Обновить ответ' : 'Записать ответ'}
                            </button>
                          </div>

                          {selectedOrderForAudio?.id === ord.id && (
                            <div className="mt-3 p-3.5 rounded-xl bg-[#171412] border border-[#FAFAF9]/20 space-y-2">
                              <span className="font-serif-luxury text-xs text-[#FAFAF9] block">
                                Запись ответа для {ord.clientName}:
                              </span>

                              <div className="flex items-center gap-2">
                                {isRecording ? (
                                  <button
                                    onClick={stopRecording}
                                    className="px-3 py-1.5 rounded-full bg-[#FAFAF9] text-[#0C0A09] text-xs font-semibold cursor-pointer"
                                  >
                                    Остановить ({recordingSeconds} сек)
                                  </button>
                                ) : (
                                  <button
                                    onClick={startRecording}
                                    className="px-3 py-1.5 rounded-full bg-[#FAFAF9] text-[#0C0A09] text-xs font-semibold cursor-pointer"
                                  >
                                    Начать запись 🎙️
                                  </button>
                                )}

                                {audioUrl && (
                                  <button
                                    onClick={() => handleSendAudioResult(ord.id)}
                                    className="px-3 py-1.5 rounded-full bg-white text-[#0C0A09] text-xs font-bold cursor-pointer ml-auto"
                                  >
                                    Отправить клиенту
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: КАЛЕНДАРЬ СЛОТОВ */}
              {activeTab === 'calendar' && (
                <div className="space-y-5">
                  <form
                    onSubmit={handleAddSlot}
                    className="p-4 rounded-2xl bg-[#0C0A09] border border-[#FAFAF9]/10 space-y-3"
                  >
                    <span className="text-xs font-serif-luxury font-medium text-[#FAFAF9] uppercase tracking-wider block">
                      Добавить слот для записи:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <input
                        type="date"
                        value={newSlotDate}
                        onChange={(e) => setNewSlotDate(e.target.value)}
                        className="bg-[#171412] border border-[#FAFAF9]/15 rounded-xl px-3 py-2 text-xs text-[#FAFAF9]"
                        required
                      />
                      <input
                        type="time"
                        value={newSlotTime}
                        onChange={(e) => setNewSlotTime(e.target.value)}
                        className="bg-[#171412] border border-[#FAFAF9]/15 rounded-xl px-3 py-2 text-xs text-[#FAFAF9]"
                        required
                      />
                      <button
                        type="submit"
                        className="py-2 px-3 rounded-xl bg-[#FAFAF9] hover:bg-white text-[#0C0A09] text-xs font-semibold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Добавить</span>
                      </button>
                    </div>
                  </form>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {slots.map((s) => (
                      <div
                        key={s.id}
                        className="p-3 rounded-xl bg-[#0C0A09] border border-[#FAFAF9]/10 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-serif-luxury font-bold text-white block">{s.time}</span>
                          <span className="text-[10px] text-[#FAFAF9]/50 font-light">{s.date}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteSlot(s.id)}
                          className="text-[#FAFAF9]/40 hover:text-rose-300 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ФИНАНСОВАЯ СТАТИСТИКА */}
              {activeTab === 'finances' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-[#0C0A09] border border-[#FAFAF9]/10">
                      <span className="text-[10px] text-[#FAFAF9]/50 uppercase tracking-widest block mb-1">
                        Общий оборот (+ Клуб)
                      </span>
                      <span className="text-xl sm:text-2xl font-serif-luxury font-bold text-white tabular-nums">
                        {grandTurnover.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0C0A09] border border-[#FAFAF9]/20">
                      <span className="text-[10px] text-[#FAFAF9]/70 uppercase tracking-widest block mb-1">
                        Комиссия (10%)
                      </span>
                      <span className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#FAFAF9] tabular-nums">
                        {platformCommission.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0C0A09] border border-[#FAFAF9]/30">
                      <span className="text-[10px] text-[#FAFAF9] uppercase tracking-widest block mb-1">
                        Чистый доход Насти (90%)
                      </span>
                      <span className="text-xl sm:text-2xl font-serif-luxury font-bold text-white tabular-nums">
                        {netEarnings.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0C0A09] border border-[#FAFAF9]/10 text-xs text-[#FAFAF9]/70 space-y-1 font-light">
                    <p>
                      Всего оплаченных разовых записей:{' '}
                      <strong className="text-white font-serif-luxury">{orders.length}</strong> (на сумму {totalTurnover.toLocaleString('ru-RU')} ₽)
                    </p>
                    <p>
                      Активных подписок в Клубе Arcana:{' '}
                      <strong className="text-white font-serif-luxury">{activeClubCount}</strong> (рекуррентно: {clubTurnover.toLocaleString('ru-RU')} ₽/мес)
                    </p>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </div>

      {viewingPhotoUrl && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/90 cursor-pointer"
          onClick={() => setViewingPhotoUrl(null)}
        >
          <div className="relative max-w-sm max-h-[80vh] overflow-hidden rounded-2xl border border-[#FAFAF9]/30">
            <img src={viewingPhotoUrl} alt="Вложение" className="w-full h-full object-contain" />
            <button
              onClick={() => setViewingPhotoUrl(null)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
