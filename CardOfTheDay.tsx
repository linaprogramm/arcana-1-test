import React, { useState, useEffect } from 'react';
import { ScheduledDailyCard } from '../types';
import { getScheduledCardForDate, getDailyCardState, saveDailyCardState } from '../utils/storage';
import { RotateCw, Sparkles } from 'lucide-react';

interface CardOfTheDayProps {
  onSelectServiceForCard?: (serviceId: string) => void;
}

export function CardOfTheDay({ onSelectServiceForCard }: CardOfTheDayProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [scheduledCard, setScheduledCard] = useState<ScheduledDailyCard>(() => getScheduledCardForDate(todayStr));
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  useEffect(() => {
    const cardForToday = getScheduledCardForDate(todayStr);
    setScheduledCard(cardForToday);

    const saved = getDailyCardState();
    if (saved && saved.date === todayStr) {
      setIsFlipped(saved.isFlipped);
      setHasInteracted(saved.isFlipped);
    } else {
      setIsFlipped(false);
      setHasInteracted(false);
    }

    const handleStorageChange = () => {
      setScheduledCard(getScheduledCardForDate(todayStr));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [todayStr]);

  const handleFlip = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    setHasInteracted(true);
    saveDailyCardState({
      date: todayStr,
      card: {
        id: scheduledCard.nameEn.toLowerCase().replace(/\s+/g, '-'),
        arcanaNumber: scheduledCard.arcanaNumber,
        nameRu: scheduledCard.nameRu,
        nameEn: scheduledCard.nameEn,
        element: scheduledCard.element,
        cosmicKeywords: ['Совет дня', 'Направление'],
        guidance: scheduledCard.guidance,
        affirmation: scheduledCard.guidance,
        symbolColor: '#FAFAF9',
      },
      isFlipped: nextFlipped,
    });
  };

  const formattedDate = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });

  return (
    <section className="w-full max-w-full overflow-hidden">
      {/* Editorial Header */}
      <div className="flex items-baseline justify-between border-b border-[#FAFAF9]/15 pb-2 mb-4">
        <div>
          <span className="font-script text-base sm:text-xl text-[#FAFAF9]/60 block -mb-0.5">
            daily clipping · {formattedDate}
          </span>
          <h2 className="text-xl sm:text-3xl font-serif-luxury font-normal text-[#FAFAF9] tracking-[0.2em] uppercase">
            КАРТА ДНЯ
          </h2>
        </div>
        {hasInteracted && isFlipped && (
          <button
            onClick={handleFlip}
            className="text-[10px] font-mono tracking-wider text-[#FAFAF9]/60 hover:text-white transition-colors flex items-center gap-1.5 py-1 px-3 rounded-full border border-[#FAFAF9]/20 uppercase cursor-pointer"
          >
            <RotateCw className="w-3 h-3" />
            <span>Скрыть</span>
          </button>
        )}
      </div>

      {/* Magazine Collage Card Container */}
      <div className="bg-[#14110F] border border-[#FAFAF9]/20 rounded-3xl p-5 sm:p-8 relative overflow-hidden shadow-2xl">
        
        {/* Collage tape marker top right */}
        <div className="absolute top-3 right-6 w-20 h-3.5 bg-[#FAFAF9]/10 transform rotate-3 pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-center">
          
          {/* Magazine Cutout 3D Card */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div
              onClick={handleFlip}
              className="cursor-pointer group relative w-44 h-64 sm:w-48 sm:h-72 perspective-1000 select-none"
              title="Нажмите, чтобы открыть карту дня"
            >
              <div
                className={`relative w-full h-full duration-700 transform-style-3d transition-transform ease-out ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Back side of card (Magazine clipping cover) */}
                <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden bg-[#0C0A09] border border-[#FAFAF9]/30 p-5 flex flex-col items-center justify-between text-center shadow-2xl">
                  <div className="w-full flex justify-between text-[9px] font-mono text-[#FAFAF9]/40">
                    <span>CUTOUT № 01</span>
                    <span>DAILY ISSUE</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="font-serif-luxury text-4xl sm:text-5xl font-light text-[#FAFAF9] tracking-[0.2em]">
                      A
                    </span>
                    <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#FAFAF9]/70 mt-1">
                      ARCANA
                    </span>
                  </div>

                  <div className="w-full text-center">
                    <span className="text-[9px] font-mono text-[#FAFAF9] bg-[#1C1714] py-1 px-3 rounded-full border border-[#FAFAF9]/20 inline-block tracking-widest uppercase">
                      ОТКРЫТЬ КАРТУ
                    </span>
                  </div>
                </div>

                {/* Front side of card (revealed today's card) */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden border border-[#FAFAF9]/40 shadow-2xl bg-[#0C0A09] p-4 flex flex-col justify-between">
                  {scheduledCard.imageUrl ? (
                    <div className="absolute inset-0 z-0">
                      <img
                        src={scheduledCard.imageUrl}
                        alt={scheduledCard.nameRu}
                        className="w-full h-full object-cover filter grayscale contrast-125 brightness-[0.7]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09] via-[#0C0A09]/50 to-transparent" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-radial from-[#221D1A] to-[#0C0A09] pointer-events-none" />
                  )}

                  <div className="relative z-10 flex justify-between items-center text-[10px] text-[#FAFAF9]/80 font-mono">
                    <span className="text-sm font-serif-luxury font-bold text-white">{scheduledCard.arcanaNumber}</span>
                    <span className="truncate max-w-[110px] uppercase tracking-wider">{scheduledCard.nameEn}</span>
                  </div>

                  <div className="relative z-10 my-auto text-center py-2">
                    <span className="font-script text-xl sm:text-2xl text-[#FAFAF9]/70 block mb-0.5">
                      аркан дня
                    </span>
                    <h4 className="font-serif-luxury text-base sm:text-lg font-bold text-white tracking-wider uppercase leading-tight">
                      {scheduledCard.nameRu}
                    </h4>
                  </div>

                  <div className="relative z-10 text-center pt-2 border-t border-[#FAFAF9]/15">
                    <span className="text-[9px] font-mono text-[#FAFAF9]/60 uppercase tracking-widest block truncate">
                      {scheduledCard.element}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] font-mono text-[#FAFAF9]/50 text-center mt-3 uppercase tracking-wider">
              {!isFlipped ? 'Нажмите на карту для разворота' : 'Карта на сегодня открыта'}
            </p>
          </div>

          {/* Right side: Editorial text guidance */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-4">
            {!isFlipped ? (
              <div className="text-center md:text-left py-2 space-y-3">
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#FAFAF9]/50 uppercase block">
                  DAILY DISPATCH · {formattedDate}
                </span>
                <h3 className="text-xl sm:text-3xl font-serif-luxury font-normal text-white tracking-wide">
                  Послание на сегодня
                </h3>
                <p className="text-xs sm:text-sm text-[#FAFAF9]/75 leading-relaxed font-light font-sans max-w-md">
                  Нажмите на карту, чтобы перевернуть вырезку и прочитать персональный совет от Насти на этот день.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={handleFlip}
                    className="py-2.5 px-6 rounded-full bg-[#FAFAF9] text-[#0C0A09] text-xs font-semibold tracking-wider uppercase transition-all shadow-md hover:bg-white active:scale-95 cursor-pointer border border-[#FAFAF9]"
                  >
                    Открыть совет
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#FAFAF9]/50 mb-1">
                    <span>{scheduledCard.arcanaNumber}</span>
                    <span>·</span>
                    <span>{scheduledCard.element}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif-luxury font-normal text-white tracking-wide">
                    {scheduledCard.nameRu}
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-[#0C0A09] border border-[#FAFAF9]/15 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#FAFAF9]/50 block">
                    РЕКОМЕНДАЦИЯ НА {formattedDate}:
                  </span>
                  <p className="text-xs sm:text-sm text-[#FAFAF9]/90 leading-relaxed font-light">
                    «{scheduledCard.guidance}»
                  </p>
                </div>

                {onSelectServiceForCard && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectServiceForCard('one-question')}
                      className="text-xs text-[#FAFAF9]/85 hover:text-white transition-colors underline font-light cursor-pointer text-left leading-relaxed block"
                    >
                      Задать вопрос тарологу по этой теме (расклад «1 ВОПРОС» — 550 ₽) →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
