import React, { useState } from 'react';
import { ClubMember, ClubMaterial } from '../types';
import { CLUB_MATERIALS, setMyClubMembership } from '../utils/storage';
import { Crown, CheckCircle2, MessageCircle, X, Sparkles, BookOpen, Clock, ArrowRight, ShieldCheck, HelpCircle, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  membership: ClubMember | null;
  onMembershipUpdated: (m: ClubMember | null) => void;
  onRequestDemoPay: (amount: number, title: string, onConfirm: () => void) => void;
}

export function ClubModal({
  isOpen,
  onClose,
  membership,
  onMembershipUpdated,
  onRequestDemoPay,
}: ClubModalProps) {
  if (!isOpen) return null;

  const isActive = Boolean(membership?.isActive);

  // Subscription registration fields
  const [userName, setUserName] = useState(membership?.clientName || '');
  const [userBirthDate, setUserBirthDate] = useState(membership?.clientBirthDate || '');
  const [telegramHandle, setTelegramHandle] = useState(membership?.telegramUsername || '');

  // Emergency question state
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [emergencyQuestionInput, setEmergencyQuestionInput] = useState('');
  const [emergencySentMessage, setEmergencySentMessage] = useState<string | null>(null);

  // Active reading material
  const [selectedMaterial, setSelectedMaterial] = useState<ClubMaterial | null>(null);

  const handleSubscribeClick = () => {
    if (!userName.trim()) {
      alert('Пожалуйста, укажите ваше имя');
      return;
    }
    if (!userBirthDate) {
      alert('Пожалуйста, укажите вашу дату рождения для персонального прогноза');
      return;
    }

    // Trigger exact requested demo payment flow
    onRequestDemoPay(990, 'Подписка «Клуб Arcana» (1 месяц)', () => {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(today.getDate() + 30);

      const newMember: ClubMember = {
        id: `club-${Date.now()}`,
        clientName: userName.trim(),
        clientBirthDate: userBirthDate,
        telegramUsername: telegramHandle.trim() || undefined,
        isActive: true,
        subscribedAt: today.toISOString().split('T')[0],
        expiresAt: nextMonth.toISOString().split('T')[0],
        hasUsedEmergencyQuestion: false,
        weeklyForecastSentDate: today.toISOString().split('T')[0],
      };

      setMyClubMembership(newMember);
      onMembershipUpdated(newMember);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FAFAF9', '#D6D3D1', '#78716C'],
      });
    });
  };

  const handleSendEmergencyQuestion = () => {
    if (!emergencyQuestionInput.trim() || !membership) return;

    const updated: ClubMember = {
      ...membership,
      hasUsedEmergencyQuestion: true,
      emergencyQuestionText: emergencyQuestionInput.trim(),
    };

    setMyClubMembership(updated);
    onMembershipUpdated(updated);
    setShowEmergencyForm(false);
    setEmergencySentMessage('Ваш вопрос вне очереди передан Насте! Ответ придет в течение 24 часов.');
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#171412] border border-[#FAFAF9]/25 rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col text-[#FAFAF9]">
        
        {/* Top Header */}
        <div className="sticky top-0 z-10 bg-[#0C0A09] px-5 py-4 border-b border-[#FAFAF9]/15 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#FAFAF9]" />
            <h2 className="text-sm sm:text-base font-serif-luxury font-medium text-[#FAFAF9] uppercase tracking-wider">
              Клуб Arcana · Личный кабинет
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#171412] flex items-center justify-center text-[#FAFAF9]/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          
          {/* CASE 1: ACTIVE SUBSCRIPTION */}
          {isActive ? (
            <div className="space-y-6">
              
              {/* Status Banner */}
              <div className="p-5 rounded-2xl bg-[#0C0A09] border border-[#FAFAF9]/25 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FAFAF9]/15 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono tracking-widest uppercase text-emerald-300">
                      СТАТУС: ПОДПИСКА АКТИВНА
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#FAFAF9]/50">
                    Действует до: {membership?.expiresAt}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div>
                    <h3 className="font-serif-luxury text-lg sm:text-xl font-normal text-white">
                      {membership?.clientName}
                    </h3>
                    <p className="text-xs text-[#FAFAF9]/60 font-light">
                      Дата рождения: {membership?.clientBirthDate} · Еженедельный прогноз включен
                    </p>
                  </div>

                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-full border border-[#FAFAF9]/20 text-[#FAFAF9]/70 shrink-0 self-start sm:self-auto">
                    Скидка 20% активна
                  </span>
                </div>
              </div>

              {/* Action Buttons: Задать вопрос вне очереди & Перейти в чат */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowEmergencyForm(!showEmergencyForm)}
                  className="p-4 rounded-xl bg-[#221D1A] border border-[#FAFAF9]/20 hover:border-[#FAFAF9]/50 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-serif-luxury font-bold uppercase text-white tracking-wide">
                      «Скорая помощь»
                    </span>
                    <Sparkles className="w-4 h-4 text-[#FAFAF9]/70 group-hover:text-white" />
                  </div>
                  <p className="text-[11px] text-[#FAFAF9]/60 font-light leading-relaxed">
                    {membership?.hasUsedEmergencyQuestion
                      ? 'Вопрос на этот месяц уже отправлен'
                      : 'Задать 1 короткий вопрос вне очереди Насте'}
                  </p>
                </button>

                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl bg-[#221D1A] border border-[#FAFAF9]/20 hover:border-[#FAFAF9]/50 text-left transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-serif-luxury font-bold uppercase text-white tracking-wide">
                      Перейти в чат к Насте
                    </span>
                    <MessageCircle className="w-4 h-4 text-[#FAFAF9]/70 group-hover:text-white" />
                  </div>
                  <p className="text-[11px] text-[#FAFAF9]/60 font-light leading-relaxed">
                    Прямой приватный диалог для уточнения деталей
                  </p>
                </a>
              </div>

              {/* Emergency Question Form Drawer */}
              {showEmergencyForm && (
                <div className="p-4 rounded-2xl bg-[#0C0A09] border border-[#FAFAF9]/25 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif-luxury font-bold uppercase tracking-wider text-white">
                      Задать вопрос вне очереди:
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowEmergencyForm(false)}
                      className="text-[10px] text-[#FAFAF9]/50 hover:text-white"
                    >
                      Закрыть
                    </button>
                  </div>

                  {membership?.hasUsedEmergencyQuestion ? (
                    <div className="space-y-2">
                      <p className="text-xs text-[#FAFAF9]/70 font-light">
                        Вы уже использовали право вопроса вне очереди в текущем месяце.
                      </p>
                      {membership.emergencyQuestionAnswer && (
                        <div className="p-3 rounded-xl bg-[#171412] border border-[#FAFAF9]/20">
                          <span className="text-[10px] text-[#FAFAF9]/50 block uppercase font-mono mb-1">
                            Ответ от Насти:
                          </span>
                          <p className="text-xs text-[#FAFAF9] font-light leading-relaxed">
                            {membership.emergencyQuestionAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        rows={3}
                        placeholder="Опишите срочную ситуацию или вопрос, требующий взгляда карт прямо сейчас..."
                        value={emergencyQuestionInput}
                        onChange={(e) => setEmergencyQuestionInput(e.target.value)}
                        className="w-full bg-[#171412] border border-[#FAFAF9]/20 rounded-xl p-3 text-xs text-[#FAFAF9] placeholder-[#FAFAF9]/30 focus:outline-none focus:border-[#FAFAF9] resize-none leading-relaxed"
                      />
                      <button
                        type="button"
                        onClick={handleSendEmergencyQuestion}
                        className="w-full py-2.5 rounded-full bg-[#FAFAF9] text-[#0C0A09] text-xs font-semibold uppercase tracking-wider hover:bg-white transition-all cursor-pointer shadow-md"
                      >
                        Отправить вопрос Насте вне очереди
                      </button>
                    </div>
                  )}
                </div>
              )}

              {emergencySentMessage && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{emergencySentMessage}</span>
                </div>
              )}

              {/* Exclusive Club Materials */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-mono tracking-[0.2em] text-[#FAFAF9]/60 uppercase block">
                  ЗАКРЫТЫЕ МАТЕРИАЛЫ И ЧЕК-ЛИСТЫ:
                </span>

                <div className="space-y-2.5">
                  {CLUB_MATERIALS.map((mat) => (
                    <div
                      key={mat.id}
                      className="p-4 rounded-xl bg-[#0C0A09] border border-[#FAFAF9]/15 hover:border-[#FAFAF9]/30 transition-all cursor-pointer"
                      onClick={() => setSelectedMaterial(selectedMaterial?.id === mat.id ? null : mat)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#221D1A] text-[#FAFAF9]/70 border border-[#FAFAF9]/10">
                              {mat.tag}
                            </span>
                            <span className="text-[10px] text-[#FAFAF9]/40">{mat.readTime}</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-serif-luxury font-medium text-white">
                            {mat.title}
                          </h4>
                          <p className="text-[11px] text-[#FAFAF9]/60 font-light mt-0.5">
                            {mat.subtitle}
                          </p>
                        </div>
                        <span className="text-xs text-[#FAFAF9]/50 font-mono">
                          {selectedMaterial?.id === mat.id ? '✕' : '↓'}
                        </span>
                      </div>

                      {selectedMaterial?.id === mat.id && (
                        <div className="mt-4 pt-3 border-t border-[#FAFAF9]/10 animate-in fade-in">
                          <div className="p-3.5 rounded-lg bg-[#171412] text-xs text-[#FAFAF9]/90 font-light leading-relaxed whitespace-pre-line space-y-2">
                            {mat.content}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* CASE 2: REGISTRATION / JOIN THE CLUB */
            <div className="space-y-6">
              
              <div className="text-center space-y-2 max-w-md mx-auto">
                <span className="font-script text-2xl sm:text-3xl text-[#FAFAF9]/50 block">
                  private membership
                </span>
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-normal text-white uppercase tracking-wider">
                  Оформление подписки
                </h3>
                <p className="text-xs text-[#FAFAF9]/75 font-light leading-relaxed">
                  Заполните данные для составления персонального еженедельного астро-прогноза и подарка на День рождения.
                </p>
              </div>

              {/* Form fields */}
              <div className="space-y-3.5 max-w-md mx-auto">
                <div>
                  <label className="block text-[11px] text-[#FAFAF9]/70 mb-1 font-light">
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    placeholder="Например: Дарья"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-[#0C0A09] border border-[#FAFAF9]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#FAFAF9] placeholder-[#FAFAF9]/30 focus:outline-none focus:border-[#FAFAF9]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#FAFAF9]/70 mb-1 font-light">
                    Дата рождения (для еженедельного прогноза) *
                  </label>
                  <input
                    type="date"
                    value={userBirthDate}
                    onChange={(e) => setUserBirthDate(e.target.value)}
                    className="w-full bg-[#0C0A09] border border-[#FAFAF9]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#FAFAF9] focus:outline-none focus:border-[#FAFAF9]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#FAFAF9]/70 mb-1 font-light">
                    Telegram username (для личных уведомлений)
                  </label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={telegramHandle}
                    onChange={(e) => setTelegramHandle(e.target.value)}
                    className="w-full bg-[#0C0A09] border border-[#FAFAF9]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#FAFAF9] placeholder-[#FAFAF9]/30 focus:outline-none focus:border-[#FAFAF9]"
                  />
                </div>
              </div>

              {/* Summary card */}
              <div className="p-4 rounded-2xl bg-[#0C0A09] border border-[#FAFAF9]/15 max-w-md mx-auto space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#FAFAF9]/70 font-light">Стоимость подписки:</span>
                  <span className="text-lg font-serif-luxury font-bold text-white">990 ₽ / месяц</span>
                </div>
                <div className="text-[10px] text-[#FAFAF9]/50 font-light leading-snug">
                  Включает: персональный прогноз каждое воскресенье, 1 вопрос вне очереди в месяц, подарок на день рождения, скидку 20% на расклады и все закрытые чек-листы.
                </div>
              </div>

              {/* Button: "Оформить за 990 ₽/мес" */}
              <div className="max-w-md mx-auto pt-2">
                <button
                  type="button"
                  onClick={handleSubscribeClick}
                  className="w-full py-3.5 px-6 rounded-full bg-[#FAFAF9] hover:bg-white text-[#0C0A09] text-xs font-semibold tracking-[0.2em] uppercase transition-all shadow-xl active:scale-[0.98] cursor-pointer"
                >
                  Оформить за 990 ₽/мес
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
