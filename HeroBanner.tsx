import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onExploreServices: () => void;
  onExploreDailyCard: () => void;
  onExploreClub: () => void;
}

export function HeroBanner({
  onExploreServices,
  onExploreDailyCard,
  onExploreClub,
}: HeroBannerProps) {
  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full">
      {/* Editorial Header bar */}
      <div className="flex items-center justify-between border-b border-[#FAFAF9]/15 pb-2 text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#FAFAF9]/50 uppercase">
        <span>ISSUE NO. 04 · DIGITAL COLLAGE</span>
        <span>HAUTE TAROT ARCHIVE</span>
        <span className="hidden sm:inline">PARIS · MOSCOW</span>
      </div>

      {/* Main Magazine Cover / Digital Collage */}
      <div className="relative rounded-3xl bg-[#14110F] border border-[#FAFAF9]/20 p-6 sm:p-12 overflow-hidden shadow-2xl">
        
        {/* Subtle vintage paper & scanline watermark */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#0C0A09]/40 to-[#0C0A09]/90 pointer-events-none" />
        
        {/* Background collage elements */}
        <div className="absolute top-4 right-4 sm:right-8 opacity-25 select-none pointer-events-none text-right">
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase block text-[#FAFAF9]">
            COLLECTION 2026
          </span>
          <span className="text-4xl sm:text-6xl font-serif-luxury font-light text-[#FAFAF9]">
            № 04
          </span>
        </div>

        {/* Asymmetrical Collage Composition */}
        <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
          
          <div className="inline-block border-b border-[#FAFAF9]/30 pb-1">
            <span className="text-[11px] sm:text-xs font-mono tracking-[0.3em] uppercase text-[#FAFAF9]/60">
              ТАРОЛОГ · АНАСТАСИЯ
            </span>
          </div>

          {/* Huge Calligraphic Script "Arcana" Overlapping */}
          <div className="relative my-2 sm:my-4 w-full">
            <h1 className="font-serif-luxury text-4xl sm:text-7xl md:text-8xl font-normal tracking-[0.15em] uppercase text-[#FAFAF9] leading-none">
              ARCANA
            </h1>
            
            {/* Expressive Fashion Calligraphy overlapping title like in references */}
            <div className="sm:-mt-8 -mt-4 select-none">
              <span className="font-script text-5xl sm:text-8xl md:text-9xl text-[#FAFAF9]/80 block tracking-normal transform -rotate-2">
                mystique & silence
              </span>
            </div>
          </div>

          {/* Editorial manifesto quote */}
          <div className="max-w-md pt-2">
            <p className="text-xs sm:text-sm text-[#FAFAF9]/75 font-light leading-relaxed font-sans">
              Цифровой арт-журнал и личное пространство глубинной ясности. Индивидуальные расклады, прогнозы и закрытый клуб без лишних иллюзий.
            </p>
          </div>

          {/* Strict Boutiquesque CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onExploreServices}
              className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-[#FAFAF9] hover:bg-white text-[#0C0A09] text-xs font-semibold tracking-[0.2em] uppercase transition-all shadow-lg active:scale-95 cursor-pointer border border-[#FAFAF9]"
            >
              КАТАЛОГ УСЛУГ
            </button>

            <button
              type="button"
              onClick={onExploreClub}
              className="w-full sm:w-auto py-3.5 px-7 rounded-full bg-transparent hover:bg-[#FAFAF9]/10 text-[#FAFAF9] text-xs font-medium tracking-[0.2em] uppercase transition-all border border-[#FAFAF9]/30 cursor-pointer"
            >
              КЛУБ ARCANA (990 ₽)
            </button>

            <button
              type="button"
              onClick={onExploreDailyCard}
              className="text-[11px] font-mono text-[#FAFAF9]/60 hover:text-white uppercase tracking-widest transition-colors py-2 px-3"
            >
              КАРТА ДНЯ →
            </button>
          </div>

        </div>

      </div>

      {/* User's Exact Welcome Greeting in Editorial Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#14110F] border border-[#FAFAF9]/15 text-center shadow-md">
        <p className="text-xs sm:text-sm font-light text-[#FAFAF9] leading-relaxed tracking-wide px-2">
          ✨ Добро пожаловать в таро-гороскоп. Здесь ты найдешь ответы на волнующие вопросы ✨
        </p>
      </div>
    </div>
  );
}
