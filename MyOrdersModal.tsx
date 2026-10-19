import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { getOrders } from '../utils/storage';
import { X, Play, Pause, BookOpen } from 'lucide-react';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDigitalGood?: (order: Order) => void;
  onOpenClub?: () => void;
}

export function MyOrdersModal({
  isOpen,
  onClose,
  onOpenDigitalGood,
  onOpenClub,
}: MyOrdersModalProps) {
  if (!isOpen) return null;

  const [orders, setOrders] = useState<Order[]>([]);
  const [playingOrderId, setPlayingOrderId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  useEffect(() => {
    setOrders(getOrders());
  }, [isOpen]);

  useEffect(() => {
    let interval: any = null;
    if (playingOrderId) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setPlayingOrderId(null);
            return 0;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [playingOrderId, playbackSpeed]);

  const togglePlayAudio = (orderId: string) => {
    if (playingOrderId === orderId) {
      setPlayingOrderId(null);
    } else {
      setPlayingOrderId(orderId);
      if (playbackProgress >= 100) setPlaybackProgress(0);
    }
  };

  const handleSpeedToggle = () => {
    if (playbackSpeed === 1) setPlaybackSpeed(1.25);
    else if (playbackSpeed === 1.25) setPlaybackSpeed(1.5);
    else setPlaybackSpeed(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#171412] border border-[#FAFAF9]/25 rounded-3xl shadow-2xl overflow-hidden my-4 text-[#FAFAF9]">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0C0A09] px-5 py-4 border-b border-[#FAFAF9]/15 flex items-center justify-between">
          <div>
            <span className="font-script text-base text-[#FAFAF9]/50 block">personal archive</span>
            <h2 className="text-base font-serif-luxury font-medium text-white uppercase tracking-wider">
              МОИ ЗАКАЗЫ
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#171412] flex items-center justify-center text-[#FAFAF9]/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {orders.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <p className="text-base font-serif-luxury text-white">У вас пока нет оформленных заказов</p>
              <p className="text-xs text-[#FAFAF9]/50 font-light font-sans max-w-xs mx-auto">
                Выберите подходящий расклад в каталоге или оформите подписку на закрытый клуб.
              </p>
              {onOpenClub && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenClub();
                  }}
                  className="mt-2 py-2 px-5 rounded-full border border-[#FAFAF9]/30 text-xs text-[#FAFAF9] hover:bg-[#FAFAF9] hover:text-[#0C0A09] transition-all uppercase tracking-wider font-mono cursor-pointer"
                >
                  Вступить в Клуб Arcana (990 ₽)
                </button>
              )}
            </div>
          ) : (
            orders.map((ord) => {
              const isPlaying = playingOrderId === ord.id;
              const hasAudio = ord.audioResultUrl || ord.status === 'completed';

              return (
                <div
                  key={ord.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0C0A09] border border-[#FAFAF9]/15 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-serif-luxury font-medium text-white text-sm uppercase tracking-wide">
                        {ord.serviceTitle}
                      </h4>
                      <span className="text-[11px] font-mono text-[#FAFAF9]/50 block mt-0.5">
                        {ord.slotDate} в {ord.slotTime} · {ord.price.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full border shrink-0 ${
                        ord.status === 'completed'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                          : 'bg-[#171412] text-[#FAFAF9]/60 border-[#FAFAF9]/10'
                      }`}
                    >
                      {ord.status === 'completed' ? 'Готово' : 'В обработке'}
                    </span>
                  </div>

                  {/* Audio Player if completed */}
                  {hasAudio && !ord.isDigitalGood && (
                    <div className="p-3.5 rounded-xl bg-[#171412] border border-[#FAFAF9]/20 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white font-light text-[11px]">
                          Голосовой ответ от Насти:
                        </span>
                        <span className="text-[#FAFAF9]/50 font-mono text-[10px]">
                          {ord.audioDuration || '15:20'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => togglePlayAudio(ord.id)}
                          className="w-9 h-9 rounded-full bg-[#FAFAF9] hover:bg-white text-[#0C0A09] flex items-center justify-center shrink-0 shadow-md transition-transform active:scale-95 cursor-pointer"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>

                        <div className="flex-1 space-y-1">
                          <div className="h-1.5 w-full bg-[#0C0A09] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white transition-all duration-200"
                              style={{ width: `${isPlaying ? playbackProgress : (playbackProgress > 0 ? playbackProgress : 0)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-mono text-[#FAFAF9]/50">
                            <span>{isPlaying ? `${Math.floor((playbackProgress * 15.2) / 100)} сек` : '0:00'}</span>
                            <button
                              onClick={handleSpeedToggle}
                              className="hover:text-white px-1.5 py-0.5 rounded bg-[#0C0A09] text-white"
                            >
                              {playbackSpeed}x
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Digital good access */}
                  {ord.isDigitalGood && onOpenDigitalGood && (
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          onClose();
                          onOpenDigitalGood(ord);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#FAFAF9] text-[#0C0A09] text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:bg-white border border-[#FAFAF9]"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Открыть файл гороскопа</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
