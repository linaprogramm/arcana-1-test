import React from 'react';

export function ImportantInfo() {
  const rules = [
    {
      title: 'Детали ситуации',
      text: 'Для расклада важно поделиться ситуацией — чем конкретнее запрос, тем точнее ответ карт.',
    },
    {
      title: 'Фотографии и имена',
      text: 'Необходимы фото и имена тех, кто будет просматриваться (свежие фото, без темных очков и фильтров).',
    },
    {
      title: '100% предоплата',
      text: 'Запись по 100% предоплате. Слот в расписании фиксируется за вами сразу после подтверждения.',
    },
    {
      title: 'Конфиденциальность',
      text: 'Гарантия конфиденциальности — ваши личные данные, фото и подробности ситуации никогда не передаются третьим лицам.',
    },
    {
      title: 'Срочные заказы',
      text: 'Срочные заказы (в день обращения или в течение нескольких часов) выполняются по двойной стоимости.',
    },
    {
      title: 'Формат ответа',
      text: 'Расклад выполняется голосовым сообщением. Вы сможете переслушивать его в любое удобное время.',
    },
  ];

  const prohibitedTopics = [
    'Здоровье, медицинские диагнозы, исход операций, протекание беременности и родов',
    'Криминал, судебные процессы, расследования, поиск пропавших людей или вещей',
    'Магические воздействия, порчи, сглазы, привороты/отвороты и наведение негатива',
    'Просмотр несовершеннолетних (до 18 лет) и третьих лиц без этического контекста',
  ];

  return (
    <section id="important-section" className="scroll-mt-20 space-y-6 pt-4 w-full">
      <div className="flex items-baseline justify-between border-b border-[#FAFAF9]/15 pb-2">
        <div>
          <span className="font-script text-base sm:text-xl text-[#FAFAF9]/60 block -mb-0.5">
            ethics & rules
          </span>
          <h2 className="text-xl sm:text-3xl font-serif-luxury font-normal text-[#FAFAF9] tracking-[0.2em] uppercase">
            О ВАЖНОМ
          </h2>
        </div>
        <span className="text-[10px] font-mono tracking-widest text-[#FAFAF9]/40 uppercase">
          CODE OF ETHICS
        </span>
      </div>

      {/* Rules list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {rules.map((rule, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-[#14110F] border border-[#FAFAF9]/15 space-y-1.5"
          >
            <span className="font-serif-luxury text-sm font-medium text-white tracking-wide block">
              {rule.title}
            </span>
            <p className="text-xs text-[#FAFAF9]/75 leading-relaxed font-light">
              {rule.text}
            </p>
          </div>
        ))}
      </div>

      {/* Prohibited topics banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0C0A09] border border-[#FAFAF9]/20 space-y-3">
        <span className="font-serif-luxury text-xs sm:text-sm font-semibold text-[#FAFAF9] uppercase tracking-wider block">
          Какие заказы и вопросы мы НЕ берем в работу:
        </span>
        
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#FAFAF9]/80 font-light">
          {prohibitedTopics.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-[#FAFAF9]/40 shrink-0 font-mono">✕</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-[11px] text-[#FAFAF9]/50 pt-2 border-t border-[#FAFAF9]/10 font-light">
          Таро — инструмент глубинного самопознания и анализа выбора, но не заменяет квалифицированную врачебную или юридическую помощь.
        </p>
      </div>
    </section>
  );
}
