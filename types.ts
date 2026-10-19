export type ServiceCategory = 'popular' | 'deep' | 'time' | 'digital';

export interface TimePeriodOption {
  label: string;
  durationMonths: number;
  price: number;
  description: string;
}

export interface TarotService {
  id: string;
  title: string;
  subtitle: string;
  category: ServiceCategory;
  price: number;
  pricePeriods?: TimePeriodOption[];
  format: string;
  eta: string;
  icon: string;
  badge?: string;
  requiresPartner?: boolean;
  description: string;
  includes: string[];
}

export interface CalendarSlot {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  isBooked: boolean;
  bookedByOrderId?: string;
}

export interface Order {
  id: string;
  serviceId: string;
  serviceTitle: string;
  price: number;
  periodLabel?: string;
  clientName: string;
  clientBirthDate?: string;
  zodiacSign?: string; // for digital horoscopes
  partnerName?: string;
  partnerBirthDate?: string;
  questionDetails?: string;
  photoUrl?: string;
  slotDate: string;
  slotTime: string;
  createdAt: string;
  status: 'pending' | 'in_progress' | 'completed';
  paymentMethod: string;
  promoCodeApplied?: string;
  discountRub?: number;
  hasBonusQuestion?: boolean; // won in wheel of fortune
  // Audio result delivered by Nastya
  audioResultUrl?: string;
  audioResultTitle?: string;
  audioDuration?: string;
  deliveredAt?: string;
  // For digital goods
  isDigitalGood?: boolean;
  digitalDownloadKey?: string;
}

export interface TarotCard {
  id: string;
  arcanaNumber: string;
  nameRu: string;
  nameEn: string;
  element: string;
  cosmicKeywords: string[];
  guidance: string;
  affirmation: string;
  symbolColor: string;
}

export interface ScheduledDailyCard {
  date: string; // YYYY-MM-DD
  arcanaNumber: string;
  nameRu: string;
  nameEn: string;
  element: string;
  guidance: string;
  imageUrl?: string;
  updatedAt: string;
}

export interface WheelPrize {
  id: string;
  label: string;
  sublabel: string;
  promoCode: string;
  discountRub?: number;
  discountPercent?: number;
  isBonusQuestion?: boolean; // free bonus question added to order
  description: string;
  accentColor: string;
}

// Club Arcana Types
export interface ClubMember {
  id: string;
  clientName: string;
  clientBirthDate: string;
  telegramUsername?: string;
  isActive: boolean;
  subscribedAt: string;
  expiresAt: string;
  hasUsedEmergencyQuestion: boolean;
  emergencyQuestionText?: string;
  emergencyQuestionAnswer?: string;
  emergencyAnswerDate?: string;
  weeklyForecastSentDate?: string;
}

export interface ClubMaterial {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  readTime: string;
  content: string;
}
