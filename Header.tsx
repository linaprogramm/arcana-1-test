import React from 'react';
import { Lock, ShoppingBag, Crown } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  onOpenMyOrders: () => void;
  onOpenClub: () => void;
  onScrollToSection: (sectionId: string) => void;
  ordersCount: number;
  hasClubMembership: boolean;
}

export function Header({
  onOpenAdmin,
  onOpenMyOrders,
  onOpenClub,
  onScrollToSection,
  ordersCount,
  hasClubMembership,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0C0A09]/95 backdrop-blur-md border-b border-[#FAFAF9]/15 transition-colors">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-13 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand: "Arcana | Анастасия" in Fashion Editorial Serif */}
        <div
          onClick={() => onScrollToSection('services-section')}
          className="cursor-pointer flex items-center gap-1.5 select-none shrink-0"
        >
          <span className="text-xs sm:text-base font-serif-luxury font-normal tracking-[0.15em] sm:tracking-[0.25em] text-[#FAFAF9] uppercase whitespace-nowrap">
            ARCANA | АНАСТАСИЯ
          </span>
        </div>

        {/* Navigation links & Actions */}
        <div className="flex items-center gap-2 sm:gap-5">
          <button
            onClick={() => onScrollToSection('services-section')}
            className="hidden sm:inline-block text-xs font-mono text-[#FAFAF9]/60 hover:text-white tracking-wider uppercase transition-colors cursor-pointer"
          >
            Услуги
          </button>

          <button
            onClick={() => onScrollToSection('card-section')}
            className="hidden sm:inline-block text-xs font-mono text-[#FAFAF9]/60 hover:text-white tracking-wider uppercase transition-colors cursor-pointer"
          >
            Карта дня
          </button>

          <button
            onClick={onOpenClub}
            className="hidden sm:flex items-center gap-1 text-xs font-mono text-[#FAFAF9] hover:text-white tracking-wider uppercase transition-colors cursor-pointer border border-[#FAFAF9]/20 px-2.5 py-1 rounded-full"
          >
            <Crown className="w-3 h-3 text-[#FAFAF9]" />
            <span>{hasClubMembership ? 'Клуб (Вход)' : 'Клуб (990 ₽)'}</span>
          </button>

          <button
            onClick={() => onScrollToSection('wheel-section')}
            className="hidden sm:inline-block text-xs font-mono text-[#FAFAF9]/60 hover:text-white tracking-wider uppercase transition-colors cursor-pointer"
          >
            Циферблат
          </button>

          <button
            onClick={() => onScrollToSection('important-section')}
            className="hidden sm:inline-block text-xs font-mono text-[#FAFAF9]/60 hover:text-white tracking-wider uppercase transition-colors cursor-pointer"
          >
            О важном
          </button>

          {/* Orders */}
          <button
            onClick={onOpenMyOrders}
            className="relative p-1.5 sm:p-2 rounded-full bg-[#14110F] hover:bg-[#221D1A] text-[#FAFAF9] transition-colors cursor-pointer flex items-center gap-1 text-xs border border-[#FAFAF9]/20"
            title="Мои заказы"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#FAFAF9]" />
            <span className="hidden sm:inline text-[#FAFAF9] text-[11px] font-mono">Заказы</span>
            {ordersCount > 0 && (
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#FAFAF9] text-[#0C0A09] text-[8px] sm:text-[9px] flex items-center justify-center font-bold">
                {ordersCount}
              </span>
            )}
          </button>

          {/* Admin PIN entrance */}
          <button
            onClick={onOpenAdmin}
            className="text-[#FAFAF9]/50 hover:text-white p-1.5 sm:p-2 rounded-full hover:bg-[#221D1A] transition-colors cursor-pointer flex items-center gap-1 text-xs"
            title="Админ-панель (по PIN: 7777)"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px] font-mono tracking-wider uppercase">Админ</span>
          </button>
        </div>

      </div>
    </header>
  );
}
