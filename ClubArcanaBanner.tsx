import React from 'react';
import { Sparkles, Crown, ArrowRight, ShieldCheck, Heart, BookOpen, Clock } from 'lucide-react';
import { ClubMember } from '../types';

interface ClubArcanaBannerProps {
  onOpenClub: () => void;
  myMembership: ClubMember | null;
}

export function ClubArcanaBanner({ onOpenClub, myMembership }: ClubArcanaBannerProps) {
  const isMember = myMembership?.isActive;

  const benefits = [
    {
      title: 'Персональный прогноз на неделю',
      desc: 'Каждое воскресенье бот присылает мини-разбор по вашей дате рождения.',
    },
    {
      title: '«Скорая помощь»',
      desc: 'Возможность задать 1 короткий вопрос вне очереди в течение месяца.',
    },
    {
      title: 'Подарок-расклад на День рождения',
      desc: 'Персональный праздничный разбор годового соляра.',
    },
    {
      title: 'Скидка 20% на глубокие расклады',
      desc: 'Привилегия постоянного участника закрытого круга.',
    },
    {
      title: 'Полезные закрытые материалы',
      desc: 'Чек-листы: как пережить ретроградный Меркурий, ритуал новолуния и заземление.',
    },
  ];

  return (
    <section id="club-section" className="w-full max-w-full overflow-hidden my-8 sm:my-12">
      {/* Editorial Frame with Digital Collage styling */}
      <div className="relative rounded-3xl bg-[#14110F] border border-[#FAFAF9]/25 p-5 sm:p-9 shadow-2xl overflow-hidden">
        
        {/* Subtle background collage tape / watermark */}
        <div className="absolute top-2 right-4 text-[10px] font-mono tracking-[0.3em] text-[#FAFAF9]/30 uppercase pointer-events-none select-none">
          PRIVATE ARCHIVE · NO CHAT SLOP
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-between gap-8">
          
          {/* Left Column: Heading and Manifesto */}
          <div className="lg:max-w-md flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-[#FAFAF9]" />
                <span className="text-[11px] font-mono tracking-[0.25em] text-[#FAFAF9]/60 uppercase">
                  КЛУБ ARCANA · ЛИЧНАЯ ПОДДЕРЖКА
                </span>
              </div>

              <h2 className="font-serif-luxury text-2xl sm:text-4xl font-normal text-[#FAFAF9] tracking-wide uppercase leading-tight">
                ЗАКРЫТЫЙ ЖУРНАЛЬНЫЙ КЛУБ
              </h2>

              <p className="font-script text-xl sm:text-2xl text-[#FAFAF9]/70 mt-1 block">
                quiet guidance & weekly clarity
              </p>

              <p className="text-xs sm:text-sm text-[#FAFAF9]/80 font-light leading-relaxed mt-3">
                Формат личной заботы от Анастасии без шумных общих чатов и спама. Только вы, карты и персональная поддержка в течение всего месяца.
              </p>
            </div>

            {/* Price Badge & Status */}
            <div className="pt-2">
              <div className="inline-flex items-baseline gap-2 py-1 px-3 rounded-full bg-[#0C0A09] border border-[#FAFAF9]/20 mb-4">
                <span className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#FAFAF9] tabular-nums">
                  990 ₽
                </span>
                <span className="text-[11px] text-[#FAFAF9]/50 font-light">/ в месяц</span>
              </div>

              <div>
                <button
                  type="button"
                  onClick={onOpenClub}
                  className="w-full sm:w-auto py-3.5 px-7 rounded-full bg-[#FAFAF9] hover:bg-white text-[#0C0A09] text-xs font-semibold tracking-[0.2em] uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isMember ? (
                    <>
                      <span>Ваша подписка активна →</span>
                    </>
                  ) : (
                    <>
                      <span>Вступить в Клуб Arcana</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Benefits list styled like editorial magazine lines */}
          <div className="flex-1 lg:max-w-lg bg-[#0C0A09] rounded-2xl border border-[#FAFAF9]/15 p-4 sm:p-6 space-y-3.5">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#FAFAF9]/60 uppercase block border-b border-[#FAFAF9]/10 pb-2">
              ЧТО ВКЛЮЧЕНО В ПОДПИСКУ:
            </span>

            <div className="space-y-3">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="font-mono text-[10px] text-[#FAFAF9]/40 mt-0.5 shrink-0">
                    0{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-serif-luxury font-bold text-[#FAFAF9] tracking-wide">
                      {b.title}
                    </h4>
                    <p className="text-[11px] text-[#FAFAF9]/65 font-light leading-relaxed mt-0.5">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#FAFAF9]/10 flex items-center justify-between text-[10px] text-[#FAFAF9]/40 font-light">
              <span>Автопродление можно отменить в любой момент</span>
              <span>100% приватность</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
