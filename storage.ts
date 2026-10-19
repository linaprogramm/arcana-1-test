import { CalendarSlot, ClubMember, ClubMaterial, Order, ScheduledDailyCard, TarotCard, WheelPrize } from '../types';
import { TAROT_DECK } from '../data/tarotCards';

const STORAGE_KEYS = {
  ORDERS: 'arcana_orders_v1',
  SLOTS: 'arcana_calendar_slots_v1',
  WHEEL: 'arcana_wheel_state_v1',
  CARD_OF_DAY: 'arcana_daily_card_v1',
  SCHEDULED_CARDS: 'arcana_scheduled_daily_cards_v1',
  PROMO: 'arcana_active_promo_v1',
  CLUB_MEMBERS: 'arcana_club_members_v1',
  MY_CLUB_MEMBERSHIP: 'arcana_my_club_membership_v1',
};

// Generate future date YYYY-MM-DD
export function getFutureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

const DEFAULT_SLOTS: CalendarSlot[] = [
  { id: 'slot-1', date: getFutureDate(0), time: '12:00', isBooked: true, bookedByOrderId: 'ORD-9821' },
  { id: 'slot-2', date: getFutureDate(0), time: '15:00', isBooked: false },
  { id: 'slot-3', date: getFutureDate(0), time: '18:30', isBooked: false },
  { id: 'slot-4', date: getFutureDate(1), time: '11:00', isBooked: false },
  { id: 'slot-5', date: getFutureDate(1), time: '14:00', isBooked: false },
  { id: 'slot-6', date: getFutureDate(1), time: '17:00', isBooked: false },
  { id: 'slot-7', date: getFutureDate(1), time: '20:00', isBooked: false },
  { id: 'slot-8', date: getFutureDate(2), time: '13:00', isBooked: false },
  { id: 'slot-9', date: getFutureDate(2), time: '16:00', isBooked: false },
  { id: 'slot-10', date: getFutureDate(2), time: '19:30', isBooked: false },
  { id: 'slot-11', date: getFutureDate(3), time: '12:00', isBooked: false },
  { id: 'slot-12', date: getFutureDate(3), time: '15:30', isBooked: false },
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ORD-9821',
    serviceId: 'relations-need-it',
    serviceTitle: 'А МНЕ ВСЕ ЭТО НАДО ЛИ НАДО ЛИ?',
    price: 2200,
    clientName: 'Алина Соколова',
    clientBirthDate: '1998-04-14',
    partnerName: 'Дмитрий',
    questionDetails: 'Вместе 2 года, в последнее время отдалился, хочу понять, есть ли будущее или пора уходить.',
    slotDate: getFutureDate(0),
    slotTime: '12:00',
    createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
    status: 'completed',
    paymentMethod: 'СБП',
    audioResultUrl: 'simulated_audio_1',
    audioResultTitle: 'Голосовой разбор отношений для Алины от Насти',
    audioDuration: '21:40',
    deliveredAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
  },
  {
    id: 'ORD-9844',
    serviceId: 'work-baby-work',
    serviceTitle: 'Я В РАБОТЕ, ДЕТКА, КАЖДЫЙ ДЕНЬ В РАБОТЕ',
    price: 2000,
    clientName: 'Екатерина Морозова',
    clientBirthDate: '1992-09-03',
    questionDetails: 'Предлагают перейти в конкурирующую компанию с повышением, но есть страх нестабильности.',
    slotDate: getFutureDate(1),
    slotTime: '14:00',
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    status: 'in_progress',
    paymentMethod: 'Банковская карта',
  },
];

// Seeded schedule for daily cards (automatic daily delivery)
const INITIAL_SCHEDULED_CARDS: Record<string, ScheduledDailyCard> = {
  [getFutureDate(0)]: {
    date: getFutureDate(0),
    arcanaNumber: 'XVII',
    nameRu: 'Звезда',
    nameEn: 'The Star',
    element: 'Воздух / Водолей',
    guidance: 'Сегодня ваш день озарен спокойной уверенностью. Доверьтесь внутреннему компасу — вы движетесь в верном направлении.',
    updatedAt: new Date().toISOString(),
  },
  [getFutureDate(1)]: {
    date: getFutureDate(1),
    arcanaNumber: 'II',
    nameRu: 'Верховная Жрица',
    nameEn: 'The High Priestess',
    element: 'Вода / Луна',
    guidance: 'День тишины и глубокой интуиции. Не торопите внешние события — верный ответ уже созрел внутри вас.',
    updatedAt: new Date().toISOString(),
  },
  [getFutureDate(2)]: {
    date: getFutureDate(2),
    arcanaNumber: 'I',
    nameRu: 'Маг',
    nameEn: 'The Magician',
    element: 'Воздух / Меркурий',
    guidance: 'В ваших руках достаточно сил и ресурсов, чтобы решить назревший вопрос. Сделайте первый шаг без колебаний.',
    updatedAt: new Date().toISOString(),
  },
  [getFutureDate(3)]: {
    date: getFutureDate(3),
    arcanaNumber: 'III',
    nameRu: 'Императрица',
    nameEn: 'The Empress',
    element: 'Земля / Венера',
    guidance: 'День заботы о себе и мягкой силы. Позвольте проектам созревать органично, избегайте давления на окружающих.',
    updatedAt: new Date().toISOString(),
  },
  [getFutureDate(4)]: {
    date: getFutureDate(4),
    arcanaNumber: 'XIX',
    nameRu: 'Солнце',
    nameEn: 'The Sun',
    element: 'Огонь / Солнце',
    guidance: 'Ясность во всем, теплое общение и прилив энергии. Отличный момент для открытого разговора и завершения сомнений.',
    updatedAt: new Date().toISOString(),
  },
  [getFutureDate(5)]: {
    date: getFutureDate(5),
    arcanaNumber: 'X',
    nameRu: 'Колесо Фортуны',
    nameEn: 'The Wheel of Fortune',
    element: 'Огонь / Юпитер',
    guidance: 'Неожиданный поворот обстоятельств сыграет вам на руку. Будьте гибкими и используйте внезапный шанс.',
    updatedAt: new Date().toISOString(),
  },
  [getFutureDate(6)]: {
    date: getFutureDate(6),
    arcanaNumber: 'XXI',
    nameRu: 'Мир',
    nameEn: 'The World',
    element: 'Земля / Сатурн',
    guidance: 'Успешное завершение важного этапа. Вы обрели ценный опыт — впереди открывается чистый горизонт.',
    updatedAt: new Date().toISOString(),
  },
};

// Seeded Club Arcana Members for Nastya's Admin
const DEFAULT_CLUB_MEMBERS: ClubMember[] = [
  {
    id: 'club-01',
    clientName: 'Дарья Романова',
    clientBirthDate: '1995-11-18',
    telegramUsername: '@daria_rom',
    isActive: true,
    subscribedAt: '2026-10-01',
    expiresAt: '2026-11-01',
    hasUsedEmergencyQuestion: false,
    weeklyForecastSentDate: '2026-10-18',
  },
  {
    id: 'club-02',
    clientName: 'Михаил Волков',
    clientBirthDate: '1989-07-24',
    telegramUsername: '@m_volkov',
    isActive: true,
    subscribedAt: '2026-10-05',
    expiresAt: '2026-11-05',
    hasUsedEmergencyQuestion: true,
    emergencyQuestionText: 'Срочный вопрос по подписанию контракта с новым партнером в среду.',
    emergencyQuestionAnswer: 'Карты указывают на скрытые пункты мелким шрифтом. Проверь второй лист перед подписью.',
    emergencyAnswerDate: '2026-10-14',
    weeklyForecastSentDate: '2026-10-18',
  },
  {
    id: 'club-03',
    clientName: 'София Лебедева',
    clientBirthDate: '2001-03-30',
    telegramUsername: '@sofia_leb',
    isActive: true,
    subscribedAt: '2026-09-28',
    expiresAt: '2026-10-28',
    hasUsedEmergencyQuestion: false,
    weeklyForecastSentDate: '2026-10-18',
  },
];

// Exclusive Club Materials (Checklists & Guides)
export const CLUB_MATERIALS: ClubMaterial[] = [
  {
    id: 'mercury-retro',
    title: 'Как пережить ретроградный Меркурий без драмы',
    subtitle: 'Практический чек-лист по сохранению нервов и техники',
    tag: 'Астро-гайд',
    readTime: '6 мин чтения',
    content: `1. НЕ ПОДПИСЫВАЙТЕ ключевые долгосрочные контракты без тройной вычитки юристом.\n2. ДЕЛАЙТЕ бэкапы всех важных файлов, фотографий и рабочих документов.\n3. ВОЗВРАЩЕНИЕ БЫВШИХ: помните, что это тест на усвоение старых уроков. Не ныряйте в иллюзии.\n4. ЗАВЕРШАЙТЕ начатые дела, разгребайте шкафы и закрывайте старые висяки — для этого период идеален.\n5. ПРОВЕРЯЙТЕ билеты, брони и время вылета дважды.`,
  },
  {
    id: 'new-moon-intent',
    title: 'Как загадать желание на новолуние, чтобы оно сбылось',
    subtitle: 'Ритуал сонастройки с лунными циклами и чистым намерением',
    tag: 'Ритуал',
    readTime: '4 мин чтения',
    content: `1. Очистите пространство: проветрите комнату, зажгите любимый аромат или свечу.\n2. Формулируйте желание в НАСТОЯЩЕМ времени БЕЗ частицы «не» (например: «Я легко и спокойно зарабатываю от...»).\n3. Фокусируйтесь на СОСТОЯНИИ: представьте, что вы чувствуете телом в момент исполнения.\n4. Запишите от руки на чистом листе бумаги черными чернилами и спрячьте в укромное место на месяц.\n5. Отпустите контроль: доверьте реализацию Вселенной.`,
  },
  {
    id: 'grounding-energy',
    title: 'Практика заземления и защита личных границ',
    subtitle: 'Экспресс-техника восстановления после тяжелого общения',
    tag: 'Энергетика',
    readTime: '5 мин чтения',
    content: `1. Контакт со стихией Земли: опустите стопы на пол, почувствуйте гравитацию и плотную опору под собой.\n2. Мысленно визуализируйте золотистый кокон на расстоянии вытянутой руки вокруг себя.\n3. Сделайте 4 глубоких вдоха на 4 счета и выдоха на 6 счетов.\n4. Произнесите внутреннюю формулу: «Чужое отдаю, свое возвращаю. Мое поле защищено и чисто».`,
  },
];

export function getOrders(): Order[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
      return DEFAULT_ORDERS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_ORDERS;
  }
}

export function saveOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to localStorage', e);
  }
}

export function addOrder(order: Order): void {
  const current = getOrders();
  const updated = [order, ...current];
  saveOrders(updated);

  if (order.slotDate && order.slotTime && order.slotTime !== 'Мгновенно') {
    const slots = getSlots();
    const updatedSlots = slots.map((s) => {
      if (s.date === order.slotDate && s.time === order.slotTime) {
        return { ...s, isBooked: true, bookedByOrderId: order.id };
      }
      return s;
    });
    saveSlots(updatedSlots);
  }
}

export function getSlots(): CalendarSlot[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SLOTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(DEFAULT_SLOTS));
      return DEFAULT_SLOTS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_SLOTS;
  }
}

export function saveSlots(slots: CalendarSlot[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots));
  } catch (e) {
    console.error('Failed to save slots', e);
  }
}

export function addSlot(slot: CalendarSlot): void {
  const current = getSlots();
  saveSlots([...current, slot]);
}

export function removeSlot(slotId: string): void {
  const current = getSlots();
  saveSlots(current.filter((s) => s.id !== slotId));
}

// Scheduled Daily Cards
export function getScheduledDailyCards(): Record<string, ScheduledDailyCard> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULED_CARDS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SCHEDULED_CARDS, JSON.stringify(INITIAL_SCHEDULED_CARDS));
      return INITIAL_SCHEDULED_CARDS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_SCHEDULED_CARDS;
  }
}

export function saveScheduledDailyCards(cards: Record<string, ScheduledDailyCard>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULED_CARDS, JSON.stringify(cards));
  } catch (e) {
    console.error('Failed to save scheduled cards', e);
  }
}

export function getScheduledCardForDate(dateStr: string): ScheduledDailyCard {
  const allScheduled = getScheduledDailyCards();
  if (allScheduled[dateStr]) {
    return allScheduled[dateStr];
  }
  const dayIndex =
    Math.abs(dateStr.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0)) % TAROT_DECK.length;
  const baseCard = TAROT_DECK[dayIndex] || TAROT_DECK[0];

  return {
    date: dateStr,
    arcanaNumber: baseCard.arcanaNumber,
    nameRu: baseCard.nameRu,
    nameEn: baseCard.nameEn,
    element: baseCard.element,
    guidance: baseCard.guidance,
    updatedAt: new Date().toISOString(),
  };
}

export function setScheduledCard(card: ScheduledDailyCard): void {
  const allScheduled = getScheduledDailyCards();
  allScheduled[card.date] = card;
  saveScheduledDailyCards(allScheduled);
}

export function deleteScheduledCard(dateStr: string): void {
  const allScheduled = getScheduledDailyCards();
  delete allScheduled[dateStr];
  saveScheduledDailyCards(allScheduled);
}

export interface WheelStorageState {
  lastSpinTimestamp: number | null;
  wonPrize: WheelPrize | null;
  history: Array<{ prize: WheelPrize; date: string }>;
}

export function getWheelState(): WheelStorageState {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WHEEL);
    if (!data) {
      return { lastSpinTimestamp: null, wonPrize: null, history: [] };
    }
    return JSON.parse(data);
  } catch {
    return { lastSpinTimestamp: null, wonPrize: null, history: [] };
  }
}

export function saveWheelState(state: WheelStorageState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WHEEL, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save wheel state', e);
  }
}

export interface DailyCardStorageState {
  date: string; // YYYY-MM-DD
  card: TarotCard;
  isFlipped: boolean;
}

export function getDailyCardState(): DailyCardStorageState | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CARD_OF_DAY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveDailyCardState(state: DailyCardStorageState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CARD_OF_DAY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save daily card state', e);
  }
}

export function getSavedPromo(): {
  code: string;
  discountRub?: number;
  discountPercent?: number;
  isBonusQuestion?: boolean;
  description: string;
} | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROMO);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function savePromo(
  promo: {
    code: string;
    discountRub?: number;
    discountPercent?: number;
    isBonusQuestion?: boolean;
    description: string;
  } | null
): void {
  try {
    if (!promo) {
      localStorage.removeItem(STORAGE_KEYS.PROMO);
    } else {
      localStorage.setItem(STORAGE_KEYS.PROMO, JSON.stringify(promo));
    }
  } catch (e) {
    console.error('Failed to save promo', e);
  }
}

// ==========================================
// CLUB ARCANA (990 ₽/мес) STORAGE METHODS
// ==========================================

export function getClubMembers(): ClubMember[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CLUB_MEMBERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CLUB_MEMBERS, JSON.stringify(DEFAULT_CLUB_MEMBERS));
      return DEFAULT_CLUB_MEMBERS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_CLUB_MEMBERS;
  }
}

export function saveClubMembers(members: ClubMember[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLUB_MEMBERS, JSON.stringify(members));
  } catch (e) {
    console.error('Failed to save club members', e);
  }
}

export function getMyClubMembership(): ClubMember | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MY_CLUB_MEMBERSHIP);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setMyClubMembership(member: ClubMember | null): void {
  try {
    if (!member) {
      localStorage.removeItem(STORAGE_KEYS.MY_CLUB_MEMBERSHIP);
    } else {
      localStorage.setItem(STORAGE_KEYS.MY_CLUB_MEMBERSHIP, JSON.stringify(member));
    }
    // Also keep in admin members list
    if (member) {
      const all = getClubMembers();
      const existingIdx = all.findIndex((m) => m.id === member.id || m.clientName === member.clientName);
      if (existingIdx >= 0) {
        all[existingIdx] = member;
      } else {
        all.unshift(member);
      }
      saveClubMembers(all);
    }
  } catch (e) {
    console.error('Failed to save my club membership', e);
  }
}

export function toggleClubMemberStatus(memberId: string): void {
  const members = getClubMembers();
  const updated = members.map((m) => {
    if (m.id === memberId) {
      return { ...m, isActive: !m.isActive };
    }
    return m;
  });
  saveClubMembers(updated);

  const my = getMyClubMembership();
  if (my && my.id === memberId) {
    setMyClubMembership({ ...my, isActive: !my.isActive });
  }
}

export function sendWeeklyForecastMass(forecastNote: string): void {
  const today = new Date().toISOString().split('T')[0];
  const members = getClubMembers();
  const updated = members.map((m) => {
    if (m.isActive) {
      return { ...m, weeklyForecastSentDate: today };
    }
    return m;
  });
  saveClubMembers(updated);
}
