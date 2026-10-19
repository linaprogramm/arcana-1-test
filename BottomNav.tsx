import React from 'react';
import { Compass, Sparkles, Gift, ShoppingBag, Crown } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  ordersCount: number;
  hasClubMembership: boolean;
}

export function BottomNav({ activeTab, onSelectTab, ordersCount, hasClubMembership }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0C0A09]/95 backdrop-blur-lg border-t border-[#FAFAF9]/15 px-2 py-1.5 pb-safe">
      <div className="grid grid-cols-5 items-center">
        
        <button
          type="button"
          onClick={() => onSelectTab('services')}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer ${
            activeTab === 'services' ? 'text-white' : 'text-[#FAFAF9]/50 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[9px] font-mono tracking-tight mt-1">Услуги</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('card')}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer ${
            activeTab === 'card' ? 'text-white' : 'text-[#FAFAF9]/50 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[9px] font-mono tracking-tight mt-1">Карта дня</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('club')}
          className={`relative flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer ${
            activeTab === 'club' ? 'text-white' : 'text-[#FAFAF9]/50 hover:text-white'
          }`}
        >
          <Crown className="w-4 h-4" />
          {hasClubMembership && (
            <span className="absolute top-1 right-3 w-1.5 h-1.5 rounded-full bg-emerald-400" />
          )}
          <span className="text-[9px] font-mono tracking-tight mt-1">Клуб</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('wheel')}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer ${
            activeTab === 'wheel' ? 'text-white' : 'text-[#FAFAF9]/50 hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span className="text-[9px] font-mono tracking-tight mt-1">Удача</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('orders')}
          className={`relative flex flex-col items-center justify-center py-1.5 transition-colors cursor-pointer ${
            activeTab === 'orders' ? 'text-white' : 'text-[#FAFAF9]/50 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          {ordersCount > 0 && (
            <span className="absolute top-1 right-3 w-3.5 h-3.5 rounded-full bg-[#FAFAF9] text-[#0C0A09] text-[8px] flex items-center justify-center font-bold">
              {ordersCount}
            </span>
          )}
          <span className="text-[9px] font-mono tracking-tight mt-1">Заказы</span>
        </button>

      </div>
    </nav>
  );
}
