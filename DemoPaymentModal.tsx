import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface DemoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
  itemName: string;
}

export function DemoPaymentModal({
  isOpen,
  onClose,
  onConfirm,
  amount,
  itemName,
}: DemoPaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#171412] border border-[#FAFAF9]/25 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 text-center text-[#FAFAF9]">
        
        {/* Editorial issue marker */}
        <div className="flex items-center justify-between border-b border-[#FAFAF9]/15 pb-3">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#FAFAF9]/50 uppercase">
            DEMO GATEWAY · YUKASSA READY
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-full border border-[#FAFAF9]/20 flex items-center justify-center text-[#FAFAF9]/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Insignia */}
        <div className="w-12 h-12 rounded-full border border-[#FAFAF9]/30 flex items-center justify-center mx-auto bg-[#0C0A09]">
          <ShieldCheck className="w-6 h-6 text-[#FAFAF9]" />
        </div>

        {/* Exact title requested by user */}
        <div className="space-y-1">
          <h3 className="font-serif-luxury text-xl sm:text-2xl font-normal text-[#FAFAF9] tracking-wide uppercase">
            Оплата в демо-режиме
          </h3>
          <p className="text-[11px] font-mono text-[#FAFAF9]/60">
            {itemName} · {amount.toLocaleString('ru-RU')} ₽
          </p>
        </div>

        {/* Exact text requested by user */}
        <div className="p-4 rounded-xl bg-[#0C0A09] border border-[#FAFAF9]/10 text-left">
          <p className="text-xs text-[#FAFAF9]/85 font-light leading-relaxed">
            Это предпросмотр приложения. Платежный шлюз (ЮKassa) будет подключен перед официальным запуском. Вы можете посмотреть, как выглядит процесс оформления, но реальные деньги сейчас не списываются.
          </p>
        </div>

        {/* Single button requested: "Понятно" */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className="w-full py-3.5 px-6 rounded-full bg-[#FAFAF9] hover:bg-white text-[#0C0A09] text-xs font-semibold tracking-[0.2em] uppercase transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            Понятно
          </button>
        </div>

      </div>
    </div>
  );
}
