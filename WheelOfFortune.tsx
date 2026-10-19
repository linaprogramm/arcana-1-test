import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { WHEEL_PRIZES } from '../data/prizes';
import { WheelPrize } from '../types';
import { getWheelState, saveWheelState, savePromo } from '../utils/storage';
import { Gift, Check, Clock, RotateCcw } from 'lucide-react';

interface WheelOfFortuneProps {
  onPrizeClaimed?: (prize: WheelPrize) => void;
  isOpenAsModal?: boolean;
  onCloseModal?: () => void;
}

export function WheelOfFortune({ onPrizeClaimed, isOpenAsModal = false, onCloseModal }: WheelOfFortuneProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [currentPrize, setCurrentPrize] = useState<WheelPrize | null>(null);
  const [canSpinToday, setCanSpinToday] = useState(true);
  const [timeUntilNextSpin, setTimeUntilNextSpin] = useState<string>('');
  const [appliedNotification, setAppliedNotification] = useState(false);

  const numSlices = WHEEL_PRIZES.length;
  const sliceAngle = 360 / numSlices;

  const checkSpinEligibility = () => {
    const state = getWheelState();
    if (state.lastSpinTimestamp) {
      const oneDayMs = 24 * 60 * 60 * 1000;
      const elapsed = Date.now() - state.lastSpinTimestamp;
      if (elapsed < oneDayMs) {
        setCanSpinToday(false);
        setCurrentPrize(state.wonPrize);

        const remainingMs = oneDayMs - elapsed;
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilNextSpin(`${hours} ч ${minutes} мин`);
        return;
      }
    }
    setCanSpinToday(true);
  };

  useEffect(() => {
    checkSpinEligibility();
  }, []);

  const handleSpin = () => {
    if (isSpinning || !canSpinToday) return;

    setIsSpinning(true);
    setAppliedNotification(false);

    const winningIndex = Math.floor(Math.random() * numSlices);
    const winningPrize = WHEEL_PRIZES[winningIndex];

    const segmentCenter = winningIndex * sliceAngle + sliceAngle / 2;
    const extraSpins = 5 * 360;
    const targetRotation = rotation + extraSpins + (360 - (rotation % 360)) + (360 - segmentCenter);

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setCurrentPrize(winningPrize);
      setCanSpinToday(false);

      const currentState = getWheelState();
      saveWheelState({
        lastSpinTimestamp: Date.now(),
        wonPrize: winningPrize,
        history: [{ prize: winningPrize, date: new Date().toISOString() }, ...currentState.history],
      });

      savePromo({
        code: winningPrize.promoCode,
        discountRub: winningPrize.discountRub,
        discountPercent: winningPrize.discountPercent,
        isBonusQuestion: winningPrize.isBonusQuestion,
        description: winningPrize.description,
      });

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FAFAF9', '#D6D3D1', '#78716C'],
      });

      if (onPrizeClaimed) {
        onPrizeClaimed(winningPrize);
      }
    }, 4000);
  };

  const handleResetForTesting = (e: React.MouseEvent) => {
    e.stopPropagation();
    saveWheelState({ lastSpinTimestamp: null, wonPrize: null, history: [] });
    setCanSpinToday(true);
    setCurrentPrize(null);
  };

  const handleApplyToBooking = () => {
    if (currentPrize) {
      savePromo({
        code: currentPrize.promoCode,
        discountRub: currentPrize.discountRub,
        discountPercent: currentPrize.discountPercent,
        isBonusQuestion: currentPrize.isBonusQuestion,
        description: currentPrize.description,
      });
      setAppliedNotification(true);
      setTimeout(() => {
        if (onPrizeClaimed) onPrizeClaimed(currentPrize);
        if (onCloseModal) onCloseModal();
      }, 700);
    }
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Editorial Header */}
      <div className="flex items-baseline justify-between border-b border-[#FAFAF9]/15 pb-2 mb-4">
        <div>
          <span className="font-script text-base sm:text-xl text-[#FAFAF9]/60 block -mb-0.5">
            vintage dial & chance
          </span>
          <h2 className="text-xl sm:text-3xl font-serif-luxury font-normal text-[#FAFAF9] tracking-[0.2em] uppercase flex items-center gap-2">
            КОЛЕСО УДАЧИ
            <span className="text-[10px] font-mono font-light text-[#FAFAF9]/60 border border-[#FAFAF9]/20 px-2 py-0.5 rounded-full">
              1 раз в день
            </span>
          </h2>
        </div>

        {!canSpinToday && (
          <button
            onClick={handleResetForTesting}
            title="Сбросить таймер для проверки"
            className="text-[10px] font-mono text-[#FAFAF9]/50 hover:text-white flex items-center gap-1 transition-colors py-1 px-2 rounded border border-[#FAFAF9]/15 cursor-pointer uppercase"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Сброс 24ч</span>
          </button>
        )}
      </div>

      <div className="bg-[#14110F] border border-[#FAFAF9]/20 rounded-3xl p-5 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-around gap-6 sm:gap-10">
          
          {/* Vintage B&W Dial Assembly */}
          <div className="relative flex flex-col items-center shrink-0">
            {/* Minimalist Top Indicator Needle */}
            <div className="absolute -top-3 z-20 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[14px] border-t-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
              <div className="w-2 h-2 rounded-full bg-white -mt-1" />
            </div>

            {/* SVG Vintage Dial in Black and White Monochrome */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 max-w-[85vw]">
              <svg
                viewBox="0 0 300 300"
                className="w-full h-full select-none"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
                }}
              >
                {/* Outer vintage chronometer rim */}
                <circle cx="150" cy="150" r="147" fill="#0C0A09" stroke="#FAFAF9" strokeWidth="1.2" />
                <circle cx="150" cy="150" r="141" fill="#171412" stroke="rgba(250,250,249,0.2)" strokeWidth="0.8" />

                {/* Dial ticks */}
                {Array.from({ length: 24 }).map((_, i) => {
                  const ang = (i * 15 * Math.PI) / 180;
                  const x1 = 150 + 142 * Math.cos(ang);
                  const y1 = 150 + 142 * Math.sin(ang);
                  const x2 = 150 + 146 * Math.cos(ang);
                  const y2 = 150 + 146 * Math.sin(ang);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(250,250,249,0.3)"
                      strokeWidth="1"
                    />
                  );
                })}

                {WHEEL_PRIZES.map((prize, idx) => {
                  const startAngle = (idx * sliceAngle * Math.PI) / 180;
                  const endAngle = ((idx + 1) * sliceAngle * Math.PI) / 180;
                  const x1 = 150 + 138 * Math.cos(startAngle);
                  const y1 = 150 + 138 * Math.sin(startAngle);
                  const x2 = 150 + 138 * Math.cos(endAngle);
                  const y2 = 150 + 138 * Math.sin(endAngle);

                  const pathData = `M150,150 L${x1},${y1} A138,138 0 0,1 ${x2},${y2} Z`;
                  const isEven = idx % 2 === 0;
                  const midAngleDeg = idx * sliceAngle + sliceAngle / 2;

                  return (
                    <g key={prize.id}>
                      <path
                        d={pathData}
                        fill={isEven ? '#120F0D' : '#1C1714'}
                        stroke="rgba(250, 250, 249, 0.25)"
                        strokeWidth="1"
                      />
                      <g transform={`rotate(${midAngleDeg} 150 150)`}>
                        <text
                          x="222"
                          y="153"
                          fill={isEven ? '#FAFAF9' : '#D6D3D1'}
                          fontSize="9.5"
                          fontWeight="400"
                          fontFamily="'Cormorant Garamond', Georgia, serif"
                          letterSpacing="0.04em"
                          textAnchor="middle"
                          transform="rotate(90 222 153)"
                        >
                          {prize.label}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Inner chronometer center hub */}
                <circle cx="150" cy="150" r="28" fill="#0C0A09" stroke="#FAFAF9" strokeWidth="1.2" />
                <circle cx="150" cy="150" r="24" fill="#1C1714" stroke="rgba(250,250,249,0.2)" strokeWidth="0.8" />
                <circle cx="150" cy="150" r="5" fill="#FAFAF9" />
              </svg>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 max-w-md w-full flex flex-col justify-center text-center lg:text-left space-y-3.5">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#FAFAF9]/60 uppercase block mb-0.5">
                VINTAGE DIAL · NO LOSSES
              </span>
              <h3 className="text-xl sm:text-3xl font-serif-luxury font-normal text-white tracking-wide">
                {currentPrize ? 'Ваш выигрыш готов' : 'Испытайте удачу'}
              </h3>
              <p className="text-xs text-[#FAFAF9]/75 mt-1 leading-relaxed font-light font-sans">
                Вращайте винтажный циферблат 1 раз в день. Максимальная скидка — 200 ₽ или 10%, либо бесплатный вопрос в подарок к заказу.
              </p>
            </div>

            {currentPrize ? (
              <div className="p-4 rounded-xl bg-[#0C0A09] border border-[#FAFAF9]/25 space-y-2 animate-in zoom-in-95 duration-200 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#FAFAF9]/60 font-mono text-[10px] uppercase">Выпал сектор:</span>
                  <span className="font-serif-luxury font-bold text-white text-sm">{currentPrize.label}</span>
                </div>

                <p className="text-[11px] text-[#FAFAF9]/80 font-light leading-relaxed">
                  {currentPrize.isBonusQuestion
                    ? '✨ Этот приз активирует 1 бесплатный дополнительный вопрос в подарок к любому выбранному раскладу (не действует как отдельный заказ).'
                    : currentPrize.description}
                </p>

                <div className="flex items-center justify-between bg-[#171412] p-2.5 rounded-lg border border-[#FAFAF9]/15 gap-2">
                  <div className="truncate">
                    <span className="text-[9px] font-mono text-[#FAFAF9]/50 block">Промокод</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-wider truncate block">
                      {currentPrize.promoCode}
                    </span>
                  </div>
                  <button
                    onClick={handleApplyToBooking}
                    className="px-3 py-1.5 rounded-lg bg-[#FAFAF9] text-[#0C0A09] text-[10px] font-semibold hover:bg-white active:scale-95 transition-all flex items-center gap-1 cursor-pointer uppercase tracking-wider shrink-0"
                  >
                    {appliedNotification ? <Check className="w-3.5 h-3.5" /> : <Gift className="w-3.5 h-3.5" />}
                    <span>{appliedNotification ? 'Применено' : 'Использовать'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-0.5">
                <div className="flex items-center justify-center lg:justify-start gap-2.5 text-[11px] font-mono text-[#FAFAF9]/60 font-light flex-wrap">
                  <span>Скидка до 200 ₽ / 10%</span>
                  <span>·</span>
                  <span>+1 вопрос к заказу</span>
                  <span>·</span>
                  <span>Карта-совет</span>
                </div>
              </div>
            )}

            <div className="pt-1">
              <button
                onClick={handleSpin}
                disabled={isSpinning || !canSpinToday}
                className={`w-full py-3.5 px-6 rounded-full font-semibold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#FAFAF9] ${
                  canSpinToday && !isSpinning
                    ? 'bg-[#FAFAF9] text-[#0C0A09] hover:bg-white active:scale-[0.98] shadow-md'
                    : 'bg-[#0C0A09] text-[#FAFAF9]/40 cursor-not-allowed border-[#FAFAF9]/15'
                }`}
              >
                {isSpinning ? (
                  <span>Циферблат вращается...</span>
                ) : canSpinToday ? (
                  <span>Вращать циферблат</span>
                ) : (
                  <span className="flex items-center gap-1.5 normal-case font-normal text-xs">
                    <Clock className="w-3.5 h-3.5" /> Следующее вращение через: {timeUntilNextSpin}
                  </span>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
