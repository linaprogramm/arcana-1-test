import React, { useState } from 'react';
import { TarotService, TimePeriodOption } from '../types';
import { TAROT_SERVICES } from '../data/services';
import { ArrowRight, Sparkles, FileText, Download } from 'lucide-react';

interface ServiceShowcaseProps {
  onSelectService: (service: TarotService, selectedPeriod?: TimePeriodOption) => void;
}

export function ServiceShowcase({ onSelectService }: ServiceShowcaseProps) {
  const [selectedTimePeriodIndex, setSelectedTimePeriodIndex] = useState<number>(0);

  const popularServices = TAROT_SERVICES.filter((s) => s.category === 'popular');
  const deepServices = TAROT_SERVICES.filter((s) => s.category === 'deep');
  const timeServices = TAROT_SERVICES.filter((s) => s.category === 'time');
  const digitalServices = TAROT_SERVICES.filter((s) => s.category === 'digital');

  return (
    <div className="space-y-12 sm:space-y-16 w-full max-w-full overflow-hidden">
      
      {/* Editorial Catalog Header */}
      <div className="flex items-baseline justify-between border-b border-[#FAFAF9]/15 pb-2">
        <div>
          <span className="font-script text-base sm:text-xl text-[#FAFAF9]/60 block -mb-0.5">
            index of consultations
          </span>
          <h2 className="text-xl sm:text-3xl font-serif-luxury font-normal text-[#FAFAF9] tracking-[0.2em] uppercase">
            ВИТРИНА УСЛУГ
          </h2>
        </div>
        <span className="text-[10px] font-mono tracking-widest text-[#FAFAF9]/40 uppercase">
          INDEX · TAROT CATALOGUE
        </span>
      </div>

      {/* 1. БЛОК: ПОПУЛЯРНОЕ (Журнальный список с тонкими линиями) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#FAFAF9]/60 uppercase">
            SECTION 01
          </span>
          <span className="h-px flex-1 bg-[#FAFAF9]/10" />
          <span className="text-xs font-serif-luxury text-[#FAFAF9] tracking-wider uppercase font-medium">
            ПОПУЛЯРНОЕ
          </span>
        </div>

        <div className="divide-y divide-[#FAFAF9]/10 border-y border-[#FAFAF9]/15">
          {popularServices.map((service, idx) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="py-4 sm:py-5 group cursor-pointer hover:bg-[#FAFAF9]/[0.02] transition-colors px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6">
                
                <div className="flex items-baseline gap-3 min-w-0">
                  <span className="font-mono text-xs text-[#FAFAF9]/40 shrink-0">
                    0{idx + 1}.
                  </span>
                  <div>
                    <h3 className="font-serif-luxury text-base sm:text-xl font-medium text-[#FAFAF9] tracking-wide uppercase group-hover:text-white transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-[#FAFAF9]/65 font-light leading-relaxed mt-0.5">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-1 sm:pt-0">
                  <span className="text-base sm:text-xl font-serif-luxury font-bold text-[#FAFAF9] tabular-nums whitespace-nowrap">
                    {service.price.toLocaleString('ru-RU')} ₽
                  </span>
                  <button
                    type="button"
                    className="py-1.5 px-4 rounded-full border border-[#FAFAF9]/30 text-[10px] font-semibold tracking-wider uppercase group-hover:bg-[#FAFAF9] group-hover:text-[#0C0A09] transition-all cursor-pointer whitespace-nowrap"
                  >
                    Записаться →
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. БЛОК: ГЛУБОКИЙ АНАЛИЗ (Журнальный список с тонкими линиями) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#FAFAF9]/60 uppercase">
            SECTION 02
          </span>
          <span className="h-px flex-1 bg-[#FAFAF9]/10" />
          <span className="text-xs font-serif-luxury text-[#FAFAF9] tracking-wider uppercase font-medium">
            ГЛУБОКИЙ АНАЛИЗ
          </span>
        </div>

        <div className="divide-y divide-[#FAFAF9]/10 border-y border-[#FAFAF9]/15">
          {deepServices.map((service, idx) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="py-4 sm:py-5 group cursor-pointer hover:bg-[#FAFAF9]/[0.02] transition-colors px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6">
                
                <div className="flex items-baseline gap-3 min-w-0">
                  <span className="font-mono text-xs text-[#FAFAF9]/40 shrink-0">
                    0{idx + 3}.
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif-luxury text-base sm:text-xl font-medium text-[#FAFAF9] tracking-wide uppercase group-hover:text-white transition-colors">
                        {service.title}
                      </h3>
                      {service.requiresPartner && (
                        <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border border-[#FAFAF9]/20 text-[#FAFAF9]/60">
                          Отношения
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#FAFAF9]/65 font-light leading-relaxed mt-0.5">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-1 sm:pt-0">
                  <span className="text-base sm:text-xl font-serif-luxury font-bold text-[#FAFAF9] tabular-nums whitespace-nowrap">
                    {service.price.toLocaleString('ru-RU')} ₽
                  </span>
                  <button
                    type="button"
                    className="py-1.5 px-4 rounded-full border border-[#FAFAF9]/30 text-[10px] font-semibold tracking-wider uppercase group-hover:bg-[#FAFAF9] group-hover:text-[#0C0A09] transition-all cursor-pointer whitespace-nowrap"
                  >
                    Записаться →
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. БЛОК: ПРОГНОЗЫ НА ВРЕМЯ (Журнальная карточка с переключателем периодов) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#FAFAF9]/60 uppercase">
            SECTION 03
          </span>
          <span className="h-px flex-1 bg-[#FAFAF9]/10" />
          <span className="text-xs font-serif-luxury text-[#FAFAF9] tracking-wider uppercase font-medium">
            ПРОГНОЗЫ НА ВРЕМЯ
          </span>
        </div>

        {timeServices.map((service) => {
          const periods = service.pricePeriods || [];
          const currentPeriod = periods[selectedTimePeriodIndex] || periods[0];

          return (
            <div
              key={service.id}
              className="p-5 sm:p-7 rounded-2xl bg-[#14110F] border border-[#FAFAF9]/20 space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAFAF9]/15 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FAFAF9]/50 block">
                    TIME HORIZON FORECAST
                  </span>
                  <h3 className="font-serif-luxury text-lg sm:text-2xl font-medium text-[#FAFAF9] uppercase tracking-wide">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[#FAFAF9]/70 font-light mt-0.5">
                    {service.description}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white tabular-nums">
                    {currentPeriod.price.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>

              {/* Period selection buttons */}
              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#FAFAF9]/60 uppercase block mb-2">
                  ВЫБЕРИТЕ ПЕРИОД ПРОГНОЗА:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {periods.map((period, idx) => {
                    const isSelected = idx === selectedTimePeriodIndex;
                    return (
                      <button
                        key={period.label}
                        type="button"
                        onClick={() => setSelectedTimePeriodIndex(idx)}
                        className={`py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FAFAF9] border-[#FAFAF9] text-[#0C0A09] font-bold shadow-sm'
                            : 'bg-[#0C0A09] border-[#FAFAF9]/15 text-[#FAFAF9]/70 hover:text-[#FAFAF9]'
                        }`}
                      >
                        <span className="block text-[11px] sm:text-xs uppercase font-serif-luxury tracking-wider">
                          {period.label}
                        </span>
                        <span className="block text-[10px] sm:text-xs font-mono tabular-nums mt-0.5">
                          {period.price.toLocaleString('ru-RU')} ₽
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Strict action button */}
              <button
                type="button"
                onClick={() => onSelectService(service, currentPeriod)}
                className="w-full py-3.5 px-6 rounded-full bg-[#FAFAF9] hover:bg-white text-[#0C0A09] text-xs font-semibold tracking-[0.2em] uppercase transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-[#FAFAF9]"
              >
                <span>Оформить запись ({currentPeriod.label} · {currentPeriod.price.toLocaleString('ru-RU')} ₽)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </section>

      {/* 4. БЛОК: ЦИФРОВЫЕ ТОВАРЫ (Автовыдача файла после ввода знака зодиака) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#FAFAF9]/60 uppercase">
            SECTION 04
          </span>
          <span className="h-px flex-1 bg-[#FAFAF9]/10" />
          <span className="text-xs font-serif-luxury text-[#FAFAF9] tracking-wider uppercase font-medium">
            ЦИФРОВЫЕ ТОВАРЫ (АВТОВЫДАЧА)
          </span>
        </div>

        <div className="divide-y divide-[#FAFAF9]/10 border-y border-[#FAFAF9]/15">
          {digitalServices.map((service, idx) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="py-4 sm:py-5 group cursor-pointer hover:bg-[#FAFAF9]/[0.02] transition-colors px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6">
                
                <div className="flex items-baseline gap-3 min-w-0">
                  <span className="font-mono text-xs text-[#FAFAF9]/40 shrink-0">
                    AUTO-0{idx + 1}.
                  </span>
                  <div>
                    <h3 className="font-serif-luxury text-base sm:text-xl font-medium text-[#FAFAF9] tracking-wide uppercase group-hover:text-white transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-[#FAFAF9]/65 font-light leading-relaxed mt-0.5">
                      {service.description} · Моментальный доступ к PDF-файлу после выбора знака зодиака.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-1 sm:pt-0">
                  <span className="text-base sm:text-xl font-serif-luxury font-bold text-[#FAFAF9] tabular-nums whitespace-nowrap">
                    {service.price.toLocaleString('ru-RU')} ₽
                  </span>
                  <button
                    type="button"
                    className="py-1.5 px-4 rounded-full border border-[#FAFAF9]/30 text-[10px] font-semibold tracking-wider uppercase group-hover:bg-[#FAFAF9] group-hover:text-[#0C0A09] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Купить файл →</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
