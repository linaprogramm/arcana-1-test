import React from 'react';

export function SacredStarIcon({ className = 'w-6 h-6 text-[#FF4D8D]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* 8-pointed modern cosmic star */}
      <polygon
        points="50,2 62,38 98,50 62,62 50,98 38,62 2,50 38,38"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </svg>
  );
}

export function CrescentMoonIcon({ className = 'w-6 h-6 text-[#FF4D8D]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M65 15C42.9086 15 25 32.9086 25 55C25 77.0914 42.9086 95 65 95C72.2 95 78.9 93.1 84.7 89.8C65.5 86.2 51 69.8 51 50C51 30.2 65.5 13.8 84.7 10.2C78.9 16.9 72.2 15 65 15Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="28" r="1.5" fill="currentColor" />
      <circle cx="78" cy="48" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function CosmicConstellation({ className = 'absolute inset-0 pointer-events-none' }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        <radialGradient id="nebulaPink" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#FF4D8D" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0A1128" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nebulaBlue" cx="80%" cy="70%" r="45%">
          <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0A1128" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#nebulaPink)" />
      <rect width="100%" height="100%" fill="url(#nebulaBlue)" />

      {/* Subtle delicate star coordinates */}
      <circle cx="12%" cy="18%" r="1" fill="#FFFFFF" opacity="0.6" />
      <circle cx="28%" cy="12%" r="1.5" fill="#FF4D8D" opacity="0.7" />
      <circle cx="45%" cy="22%" r="0.8" fill="#FFFFFF" opacity="0.5" />
      <circle cx="72%" cy="15%" r="1.8" fill="#FFFFFF" opacity="0.8" />
      <circle cx="88%" cy="26%" r="1.2" fill="#FF4D8D" opacity="0.6" />
      <circle cx="18%" cy="45%" r="1.2" fill="#FFFFFF" opacity="0.5" />
      <circle cx="34%" cy="62%" r="1" fill="#FFFFFF" opacity="0.6" />
      <circle cx="62%" cy="52%" r="1.5" fill="#FF4D8D" opacity="0.7" />
      <circle cx="82%" cy="68%" r="1.2" fill="#FFFFFF" opacity="0.6" />
      <circle cx="15%" cy="85%" r="1.5" fill="#FFFFFF" opacity="0.7" />
      <circle cx="50%" cy="92%" r="1.2" fill="#FF4D8D" opacity="0.5" />
      <circle cx="90%" cy="88%" r="1.8" fill="#FFFFFF" opacity="0.8" />

      {/* Delicate constellation line */}
      <line x1="28%" y1="12%" x2="45%" y2="22%" stroke="rgba(255, 77, 141, 0.15)" strokeWidth="0.8" strokeDasharray="3 3" />
      <line x1="45%" y1="22%" x2="72%" y2="15%" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.8" />
      <line x1="62%" y1="52%" x2="82%" y2="68%" stroke="rgba(255, 77, 141, 0.12)" strokeWidth="0.8" strokeDasharray="2 4" />
    </svg>
  );
}

export function TarotCardArtwork({ cardId }: { cardId: string }) {
  // Ultra-crisp geometric modern cosmic vector artwork for tarot cards
  switch (cardId) {
    case 'the-star':
      return (
        <svg viewBox="0 0 200 300" className="w-full h-full" fill="none">
          <rect width="200" height="300" fill="#0E1738" />
          {/* Outer hairline border */}
          <rect x="12" y="12" width="176" height="276" rx="8" stroke="#FF4D8D" strokeWidth="1" strokeOpacity="0.3" />
          <rect x="18" y="18" width="164" height="264" rx="6" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.15" />
          
          {/* Main 8-point geometric star */}
          <polygon
            points="100,50 108,82 140,90 108,98 100,130 92,98 60,90 92,82"
            stroke="#FF4D8D"
            strokeWidth="2"
            fill="rgba(255, 77, 141, 0.12)"
          />
          {/* Secondary stars */}
          <circle cx="60" cy="150" r="3" fill="#FFFFFF" />
          <circle cx="140" cy="140" r="3" fill="#FF4D8D" />
          <circle cx="80" cy="180" r="2" fill="#FFFFFF" opacity="0.8" />
          <circle cx="120" cy="190" r="2.5" fill="#38BDF8" />
          
          {/* Stream of starlight / water */}
          <path
            d="M100 135 C 100 170, 75 190, 70 230 C 65 260, 90 270, 100 275"
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.8"
          />
          <path
            d="M100 135 C 100 170, 125 190, 130 230 C 135 260, 110 270, 100 275"
            stroke="#FF4D8D"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.7"
          />
          
          <circle cx="100" cy="90" r="8" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="100" cy="90" r="3" fill="#FFFFFF" />
        </svg>
      );

    case 'the-high-priestess':
      return (
        <svg viewBox="0 0 200 300" className="w-full h-full" fill="none">
          <rect width="200" height="300" fill="#0C1533" />
          <rect x="12" y="12" width="176" height="276" rx="8" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.3" />
          {/* Two pillars: Boaz & Jachin represented as clean minimal cosmic towers */}
          <line x1="45" y1="60" x2="45" y2="240" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
          <line x1="155" y1="60" x2="155" y2="240" stroke="#38BDF8" strokeWidth="2" opacity="0.8" />
          <circle cx="45" cy="55" r="5" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="155" cy="55" r="5" stroke="#38BDF8" strokeWidth="1.5" />
          
          {/* Crescent Moon crown */}
          <path
            d="M100 90 C 85 90, 75 105, 75 120 C 75 135, 85 150, 100 150 C 92 140, 92 110, 100 90 Z"
            fill="#38BDF8"
            opacity="0.8"
          />
          <circle cx="100" cy="120" r="14" stroke="#FFFFFF" strokeWidth="1" fill="none" />
          {/* Veil with delicate cross */}
          <line x1="100" y1="160" x2="100" y2="210" stroke="#FF4D8D" strokeWidth="1.5" />
          <line x1="85" y1="180" x2="115" y2="180" stroke="#FF4D8D" strokeWidth="1.5" />
          <circle cx="100" cy="180" r="2" fill="#FFFFFF" />
        </svg>
      );

    case 'the-magician':
      return (
        <svg viewBox="0 0 200 300" className="w-full h-full" fill="none">
          <rect width="200" height="300" fill="#0F183C" />
          <rect x="12" y="12" width="176" height="276" rx="8" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.3" />
          {/* Infinity sign */}
          <path
            d="M75 80 C60 80, 50 95, 65 105 C80 115, 120 75, 135 85 C150 95, 140 110, 125 110 C110 110, 80 70, 75 80 Z"
            stroke="#F59E0B"
            strokeWidth="2"
            fill="none"
          />
          {/* Wand pointing up */}
          <line x1="100" y1="130" x2="100" y2="210" stroke="#FFFFFF" strokeWidth="2" />
          <polygon points="100,120 95,130 105,130" fill="#F59E0B" />
          {/* 4 elemental symbols */}
          <circle cx="65" cy="170" r="12" stroke="#FF4D8D" strokeWidth="1" /> {/* Cup */}
          <polygon points="135,160 145,180 125,180" stroke="#38BDF8" strokeWidth="1" fill="none" /> {/* Sword */}
          <circle cx="100" cy="235" r="14" stroke="#10B981" strokeWidth="1" /> {/* Pentacle */}
          <polygon points="100,227 106,243 94,233 106,233 94,243" stroke="#10B981" strokeWidth="0.8" fill="none" />
        </svg>
      );

    case 'the-sun':
      return (
        <svg viewBox="0 0 200 300" className="w-full h-full" fill="none">
          <rect width="200" height="300" fill="#131C42" />
          <rect x="12" y="12" width="176" height="276" rx="8" stroke="#FBBF24" strokeWidth="1" strokeOpacity="0.3" />
          {/* Radiant Sun disc */}
          <circle cx="100" cy="120" r="36" fill="rgba(251, 191, 36, 0.15)" stroke="#FBBF24" strokeWidth="2" />
          <circle cx="100" cy="120" r="18" fill="#FBBF24" opacity="0.8" />
          {/* Clean radiating modern rays */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="100"
              y1="65"
              x2="100"
              y2="50"
              stroke="#FBBF24"
              strokeWidth="1.5"
              transform={`rotate(${deg} 100 120)`}
            />
          ))}
          {/* Horizon line of life */}
          <path d="M40 230 Q 100 200, 160 230" stroke="#FF4D8D" strokeWidth="2" fill="none" />
          <circle cx="100" cy="215" r="4" fill="#FFFFFF" />
        </svg>
      );

    default:
      // The Empress / Wheel / World / Lovers
      return (
        <svg viewBox="0 0 200 300" className="w-full h-full" fill="none">
          <rect width="200" height="300" fill="#0D1636" />
          <rect x="12" y="12" width="176" height="276" rx="8" stroke="#FF4D8D" strokeWidth="1" strokeOpacity="0.3" />
          {/* Sacred mandala / wheel */}
          <circle cx="100" cy="130" r="45" stroke="#FF4D8D" strokeWidth="1.5" strokeDasharray="4 2" />
          <circle cx="100" cy="130" r="28" stroke="#FFFFFF" strokeWidth="1" />
          <polygon
            points="100,90 108,122 140,130 108,138 100,170 92,138 60,130 92,122"
            stroke="#38BDF8"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="100" cy="130" r="5" fill="#FF4D8D" />
          {/* Base pedestal */}
          <line x1="60" y1="210" x2="140" y2="210" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />
          <line x1="75" y1="220" x2="125" y2="220" stroke="#FF4D8D" strokeWidth="1" opacity="0.8" />
        </svg>
      );
  }
}

export function TarotCardBackPattern() {
  return (
    <div className="w-full h-full bg-[#0E1738] rounded-2xl relative overflow-hidden flex items-center justify-center border border-[#FF4D8D]/30 shadow-2xl">
      {/* Delicate inner frame */}
      <div className="absolute inset-2 border border-white/10 rounded-xl pointer-events-none" />
      <div className="absolute inset-3 border border-[#FF4D8D]/20 rounded-lg pointer-events-none" />

      {/* Central sacred geometry ornament */}
      <div className="relative flex flex-col items-center justify-center p-6 text-center">
        <SacredStarIcon className="w-16 h-16 text-[#FF4D8D] mb-3 animate-pulse duration-[3000ms]" />
        <span className="font-display text-sm tracking-[0.25em] text-white/90 uppercase font-semibold">
          Arcana
        </span>
        <span className="text-[10px] tracking-[0.3em] text-[#94A3B8] uppercase mt-1">
          Modern Cosmic Tarot
        </span>
      </div>

      {/* Subtle corner starlets */}
      <div className="absolute top-4 left-4 text-[#FF4D8D]/40 text-xs">✦</div>
      <div className="absolute top-4 right-4 text-[#FF4D8D]/40 text-xs">✦</div>
      <div className="absolute bottom-4 left-4 text-[#FF4D8D]/40 text-xs">✦</div>
      <div className="absolute bottom-4 right-4 text-[#FF4D8D]/40 text-xs">✦</div>
    </div>
  );
}
