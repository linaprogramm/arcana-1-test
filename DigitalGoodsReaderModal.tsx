import React from 'react';
import { Order } from '../types';
import { X, Download, BookOpen } from 'lucide-react';

interface DigitalGoodsReaderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DigitalGoodsReaderModal({
  order,
  isOpen,
  onClose,
}: DigitalGoodsReaderModalProps) {
  if (!isOpen || !order) return null;

  const isYearly = order.serviceId === 'digital-horoscope-year' || order.serviceTitle.includes('год');

  const handleDownloadGuide = () => {
    const title = isYearly ? 'Солярный Атлас на Год — Arcana' : 'Персональный Гороскоп на Месяц — Arcana';
    const content = `
=====================================================
${title.toUpperCase()}
Таролог: Анастасия (Arcana)
Клиент: ${order.clientName} (Знак: ${order.zodiacSign || 'Овен'})
Дата формирования: ${new Date().toLocaleDateString('ru-RU')}
=====================================================

1. АРХЕТИП И ОСНОВНОЙ ВЕКТОР ПЕРИОДА
Период глубокой внутренней ясности, упорядочивания приоритетов и выхода на новый уровень осознания. Фокус на раскрытии личной силы и освобождении от ложных страхов.

2. КАРЬЕРА, ПРОЕКТЫ И ФИНАНСЫ
- Благоприятный момент для завершения затянувшихся обязательств и точечного старта новых инициатив.
- Карты советуют проявлять мягкую твердость в переговорах и не поддаваться импульсивным тратам.

3. ОТНОШЕНИЯ, ЧУВСТВА И СВЯЗИ
- Время искренних диалогов и освобождения от невысказанного напряжения.
- Для одиноких: неожиданное проявление человека из интеллектуальной сферы.
- В паре: укрепление доверия через совместные планы.

4. РЕКОМЕНДАЦИЯ И КЛЮЧЕВОЙ СОВЕТ
- Отпустите иллюзию тотального контроля. Доверьтесь естественному созреванию событий.
=====================================================
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${isYearly ? 'Arcana_Yearly_Atlas' : 'Arcana_Monthly_Forecast'}_${(order.clientName || 'Client').replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#171412] border border-[#FAFAF9]/25 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[85vh] text-[#FAFAF9]">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0C0A09] px-5 py-4 border-b border-[#FAFAF9]/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#FAFAF9]" />
            <h3 className="font-serif-luxury text-sm sm:text-base font-normal uppercase tracking-wider text-white">
              {order.serviceTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#171412] flex items-center justify-center text-[#FAFAF9]/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content reader */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-4 flex-1">
          <div className="border-b border-[#FAFAF9]/15 pb-3">
            <span className="text-[10px] font-mono tracking-widest text-[#FAFAF9]/50 uppercase block">
              DIGITAL FILE DELIVERED · {order.zodiacSign || 'Зодиак'}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif-luxury font-normal text-white uppercase mt-1">
              Персональный расклад
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-[#0C0A09] border border-[#FAFAF9]/15 space-y-3 text-xs text-[#FAFAF9]/85 font-light leading-relaxed">
            <p>
              <strong>1. Главный вектор:</strong> Период возвращения внутреннего контроля. Туман рассеивается, открывая ясное направление для ключевых решений.
            </p>
            <p>
              <strong>2. Финансы и работа:</strong> Устойчивый рост через отказ от хаотичных распылений. Сконцентрируйтесь на одном приоритетном проекте.
            </p>
            <p>
              <strong>3. Сфера чувств:</strong> Время честных ответов перед собой. Отношения, построенные на компромиссе с собственными ценностями, потребуют пересмотра.
            </p>
            <p>
              <strong>4. Рекомендация карт:</strong> Сохраняйте внутреннюю тишину и не делитесь планами раньше времени.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleDownloadGuide}
              className="w-full py-3 px-5 rounded-full bg-[#FAFAF9] hover:bg-white text-[#0C0A09] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Скачать полный PDF/TXT отчет</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
