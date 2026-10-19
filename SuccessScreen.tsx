import React, { useState } from 'react';
import { Order } from '../types';
import { CheckCircle2, MessageCircle, Copy, Check, Download, ArrowLeft } from 'lucide-react';

interface SuccessScreenProps {
  order: Order;
  onBackToHome: () => void;
  onOpenDigitalGood?: (order: Order) => void;
  onViewMyOrders?: () => void;
}

export function SuccessScreen({
  order,
  onBackToHome,
  onOpenDigitalGood,
  onViewMyOrders,
}: SuccessScreenProps) {
  const [copied, setCopied] = useState(false);

  const formattedDate = order.slotDate;
  const formattedTime = order.slotTime;

  const messageForNastya = `Привет, Настя! ✨ Оплата прошла.
Номер записи: ${order.id}
Услуга: ${order.serviceTitle}
Имя: ${order.clientName} (${order.clientBirthDate || order.zodiacSign || ''})
${order.partnerName ? `Имя партнера: ${order.partnerName}\n` : ''}${
    order.questionDetails ? `Тема вопроса: ${order.questionDetails}\n` : ''
  }Запись на: ${formattedDate} в ${formattedTime}
Жду встречи в чате!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageForNastya);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenTelegram = () => {
    const tgUrl = `https://t.me/arcana_tarot?text=${encodeURIComponent(messageForNastya)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-lg mx-auto py-6 px-4 animate-in fade-in duration-200 text-[#FAFAF9]">
      <div className="bg-[#171412] border border-[#FAFAF9]/25 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
        
        {/* Subtle Checkmark */}
        <div className="w-14 h-14 rounded-full bg-[#0C0A09] border border-[#FAFAF9]/40 text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#FAFAF9]/50 uppercase block mb-1">
            CONFIRMATION PROTOCOL
          </span>
          <h1 className="text-xl sm:text-2xl font-serif-luxury font-normal text-white tracking-wide uppercase">
            Оплата прошла!
          </h1>
          <p className="text-sm font-serif-luxury text-[#FAFAF9]/90 mt-1">
            Ваша запись на {formattedDate} в {formattedTime}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0C0A09] border border-[#FAFAF9]/15 text-left text-xs space-y-2">
          <div className="flex justify-between border-b border-[#FAFAF9]/10 pb-2">
            <span className="text-[#FAFAF9]/50 font-mono">Номер заказа:</span>
            <span className="font-mono font-bold text-white">{order.id}</span>
          </div>
          <div className="flex justify-between border-b border-[#FAFAF9]/10 pb-2">
            <span className="text-[#FAFAF9]/50 font-mono">Услуга:</span>
            <span className="font-medium text-white text-right max-w-[200px] truncate">{order.serviceTitle}</span>
          </div>
          <div className="flex justify-between border-b border-[#FAFAF9]/10 pb-2">
            <span className="text-[#FAFAF9]/50 font-mono">Клиент:</span>
            <span className="text-white">{order.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#FAFAF9]/50 font-mono">Сумма:</span>
            <span className="font-bold font-serif-luxury text-white">{order.price.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>

        {order.isDigitalGood && onOpenDigitalGood ? (
          <button
            type="button"
            onClick={() => onOpenDigitalGood(order)}
            className="w-full py-3.5 px-6 rounded-full bg-[#FAFAF9] hover:bg-white text-[#0C0A09] text-xs font-semibold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Открыть и скачать файл</span>
          </button>
        ) : (
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleOpenTelegram}
              className="w-full py-3.5 px-6 rounded-full bg-[#FAFAF9] hover:bg-white text-[#0C0A09] text-xs font-semibold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#FAFAF9]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Написать Насте в Telegram</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-2.5 px-4 rounded-full bg-[#0C0A09] border border-[#FAFAF9]/20 hover:border-[#FAFAF9]/50 text-xs text-[#FAFAF9]/70 flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Текст скопирован' : 'Скопировать детали записи'}</span>
            </button>
          </div>
        )}

        <div className="pt-2 flex justify-center gap-4 text-xs font-mono">
          <button
            type="button"
            onClick={onBackToHome}
            className="text-[#FAFAF9]/60 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Вернуться на главную</span>
          </button>
        </div>

      </div>
    </div>
  );
}
