import React from 'react';

export function AboutMe() {
  return (
    <section className="my-8 sm:my-14 space-y-6 w-full max-w-full">
      {/* Editorial Header */}
      <div className="flex items-baseline justify-between border-b border-[#FAFAF9]/15 pb-2">
        <div>
          <span className="font-script text-lg sm:text-2xl text-[#FAFAF9]/60 block -mb-1">
            about Anastasia
          </span>
          <h2 className="text-xl sm:text-3xl font-serif-luxury font-normal text-[#FAFAF9] tracking-[0.2em] uppercase">
            ОБО МНЕ
          </h2>
        </div>
        <span className="text-[10px] font-mono tracking-widest text-[#FAFAF9]/40 uppercase">
          PAGE · 02
        </span>
      </div>

      {/* Editorial Collage Layout (Inspired by Jing Wen / Fashion Magazine spread) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Magazine Art Collage / Cutout Frame */}
        <div className="lg:col-span-5 relative">
          <div className="rounded-2xl bg-[#171412] border border-[#FAFAF9]/20 p-5 shadow-xl relative overflow-hidden text-center sm:text-left">
            
            {/* Collage tape marker top */}
            <div className="absolute top-2 left-6 w-16 h-3 bg-[#FAFAF9]/10 transform -rotate-2 pointer-events-none" />

            <div className="space-y-4">
              <div className="w-full aspect-[4/5] rounded-xl bg-gradient-to-b from-[#221D1A] via-[#14110F] to-[#0C0A09] border border-[#FAFAF9]/15 p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-start text-[10px] font-mono text-[#FAFAF9]/40">
                  <span>FIG. 02</span>
                  <span>ARCANA SALON</span>
                </div>

                {/* Overlapping fashion cursive wordmark */}
                <div className="my-auto select-none">
                  <span className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#FAFAF9] tracking-widest block uppercase">
                    NASTYA
                  </span>
                  <span className="font-script text-4xl sm:text-5xl text-[#FAFAF9]/60 block -mt-2">
                    intuition & form
                  </span>
                </div>

                <div className="border-t border-[#FAFAF9]/10 pt-2 text-[9px] font-mono text-[#FAFAF9]/50 tracking-widest uppercase flex justify-between">
                  <span>DECISION MATRIX</span>
                  <span>EST. 2019</span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-[#FAFAF9]/50 tracking-wider">
                «Карты не предрекают фатум — они обнажают суть выбора».
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Two-Column Editorial Text spread */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main manifesto */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#FAFAF9]/50 uppercase block">
              EDITORIAL PROFILE · BIOGRAPHY
            </span>
            <p className="text-sm sm:text-base text-[#FAFAF9]/90 font-light leading-relaxed font-sans">
              Я практикующий таролог с многолетним опытом. Рассматриваю глубинные причины событий, скрытые мысли людей и помогаю увидеть ясную перспективу ситуации без ложных иллюзий и страхов.
            </p>
          </div>

          {/* Magazine Two-Column Stats Block with exact user text "плюс 300 человек" */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#FAFAF9]/15">
            <div className="space-y-2 p-4 rounded-xl bg-[#14110F] border border-[#FAFAF9]/10">
              <span className="font-serif-luxury text-2xl sm:text-3xl font-light text-white tracking-wide block">
                плюс 300 человек
              </span>
              <p className="text-xs text-[#FAFAF9]/70 leading-relaxed font-light">
                Клиентов, получивших точные ответы, эмоциональное спокойствие и твердую ясность в сложных жизненных вопросах.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-[#14110F] border border-[#FAFAF9]/10">
              <span className="font-serif-luxury text-2xl sm:text-3xl font-light text-white tracking-wide block">
                более 5 лет
              </span>
              <p className="text-xs text-[#FAFAF9]/70 leading-relaxed font-light">
                Глубокой ежедневной практики, деликатного психологического подхода и бережного внимания к каждой детали запроса.
              </p>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-4 rounded-xl bg-[#0C0A09] border border-[#FAFAF9]/15 flex items-center justify-between text-xs text-[#FAFAF9]/75 font-light">
            <span>100% приватность · Персональные аудио-разборы</span>
            <span className="font-mono text-[10px] text-[#FAFAF9]/40 uppercase tracking-widest">
              STRICT CONFIDENTIAL
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
