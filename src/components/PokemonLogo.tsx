import React from 'react';

interface PokemonLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export const PokemonLogo: React.FC<PokemonLogoProps> = ({
  size = 'md',
  showBadge = false,
  className = '',
  onClick,
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }[size];

  const logoHeights = {
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-10 md:h-11',
    lg: 'h-11 sm:h-14',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group shrink-0 ${className}`}
    >
      <div className={`relative flex items-center justify-center ${iconDimensions} rounded-full bg-[#FF4757] border-[2.5px] border-black shadow-[3px_3px_0px_0px_#000] group-hover:-translate-y-0.5 group-hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all duration-150`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full group-hover:rotate-45 transition-transform duration-300 ease-out"
        >
          <path
            d="M 6,50 A 44,44 0 0,1 94,50 Z"
            fill="#FF4757"
            stroke="#000000"
            strokeWidth="5"
          />

          <path
            d="M 6,50 A 44,44 0 0,0 94,50 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="5"
          />

          <line x1="6" y1="50" x2="94" y2="50" stroke="#000000" strokeWidth="9" />

          <circle cx="50" cy="50" r="15" fill="#FFFFFF" stroke="#000000" strokeWidth="7" />

          <circle cx="50" cy="50" r="7" fill="#000000" />
        </svg>
      </div>

      <div className="flex items-center gap-2">
        <img
          src="/img/Pokemon-Logo.png"
          alt="Pokémon"
          className={`${logoHeights} w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] group-hover:scale-105 transition-transform duration-200`}
        />
        {showBadge && (
          <span className="text-[10px] sm:text-[11px] font-['Space_Grotesk'] font-extrabold tracking-wider uppercase px-2 sm:px-2.5 py-0.5 rounded-full bg-[#A3E635] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hidden md:inline-block">
            HQ
          </span>
        )}
      </div>
    </div>
  );
};
