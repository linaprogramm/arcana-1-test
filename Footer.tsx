import React from 'react';
import { MessageCircle, Shield } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export function Footer({ onOpenAdmin }: FooterProps) {
  return (
    <footer className="w-full border-t border-[#FAFAF9]/15 mt-16 pt-10 pb-20 md:pb-12 text-[#FAFAF9]/60 text-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
        
        <div>
          <span className="font-serif-luxury text-sm font-normal text-white tracking-[0.25em] uppercase block">
            ARCANA | АНАСТАСИЯ
          </span>
          <span className="text-[11px] font-mono text-[#FAFAF9]/40 mt-0.5 block">
            Digital Fashion Editorial & Haute Tarot Collage
          </span>
        </div>

        <div className="flex items-center gap-6 text-[11px] font-mono tracking-wider uppercase">
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#FAFAF9]" />
            <span>Telegram</span>
          </a>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-[#FAFAF9]" />
            <span>Админ-панель</span>
          </button>
        </div>

      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6 pt-4 border-t border-[#FAFAF9]/10 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-[#FAFAF9]/40 gap-2 text-center sm:text-left">
        <p>© {new Date().getFullYear()} ARCANA · ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
        <p className="tracking-widest uppercase">ISSUE NO. 04 · FASHION EDITORIAL EDITION</p>
      </div>
    </footer>
  );
}
