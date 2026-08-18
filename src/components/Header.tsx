import React, { useState } from 'react';
import { Heart, Scale, Sun, Moon, Compass, Menu, X } from 'lucide-react';
import { PokemonLogo } from './PokemonLogo';

interface HeaderProps {
  favoritesCount: number;
  onOpenFavorites: () => void;
  compareCount: number;
  onOpenCompare: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onResetView?: () => void;
  activeNav?: 'explorer' | 'favorites' | 'compare';
}

export const Header: React.FC<HeaderProps> = ({
  favoritesCount,
  onOpenFavorites,
  compareCount,
  onOpenCompare,
  theme,
  onToggleTheme,
  onResetView,
  activeNav = 'explorer',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (nav: 'explorer' | 'favorites' | 'compare') => {
    setMobileMenuOpen(false);
    if (nav === 'explorer' && onResetView) {
      onResetView();
    } else if (nav === 'favorites') {
      onOpenFavorites();
    } else if (nav === 'compare') {
      onOpenCompare();
    }
  };

  return (
    <header className="sticky top-3 sm:top-4 z-40 w-full max-w-6xl mx-auto px-3 sm:px-6 pointer-events-none">
      <div className="pointer-events-auto relative w-full rounded-full bg-white dark:bg-slate-900 border-[3px] border-black shadow-[5px_5px_0px_0px_#000] px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between transition-all duration-200">
        <PokemonLogo
          onClick={() => handleNavClick('explorer')}
          size="md"
        />

        <nav className="hidden lg:flex items-center gap-4 text-sm font-['Space_Grotesk'] font-bold">
          <button
            type="button"
            onClick={() => handleNavClick('explorer')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-black transition-all duration-150 cursor-pointer ${
              activeNav === 'explorer'
                ? 'bg-[#A3E635] text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-[#A3E635] hover:text-black dark:hover:bg-[#A3E635] dark:hover:text-black hover:shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_#000]'
            }`}
          >
            <Compass className="w-4 h-4 stroke-[2.5]" />
            <span>Explorer</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('favorites')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-black transition-all duration-150 cursor-pointer ${
              activeNav === 'favorites'
                ? 'bg-[#FF6B6B] text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-[#FF6B6B] hover:text-black dark:hover:bg-[#FF6B6B] dark:hover:text-black hover:shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_#000]'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-black rounded-full bg-white text-black border border-black shadow-xs">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('compare')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-black transition-all duration-150 cursor-pointer ${
              activeNav === 'compare'
                ? 'bg-[#C084FC] text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-[#C084FC] hover:text-black dark:hover:bg-[#C084FC] dark:hover:text-black hover:shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_#000]'
            }`}
          >
            <Scale className="w-4 h-4 stroke-[2.5]" />
            <span>Compare</span>
            {compareCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-black rounded-full bg-white text-black border border-black shadow-xs">
                {compareCount}
              </span>
            )}
          </button>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="p-2.5 rounded-full bg-[#FACC15] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <Moon className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            title="Toggle Navigation Menu"
            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-black dark:text-white border-2 border-black shadow-[3px_3px_0px_0px_#000] lg:hidden transition-all cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 stroke-[3]" />
            ) : (
              <Menu className="w-4 h-4 stroke-[3]" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="pointer-events-auto mt-3 w-full rounded-2xl bg-white dark:bg-slate-900 border-[3px] border-black p-4 shadow-[6px_6px_0px_0px_#000] flex flex-col gap-2.5 lg:hidden animate-scaleUp font-['Space_Grotesk']">
          <button
            type="button"
            onClick={() => handleNavClick('explorer')}
            className={`flex items-center justify-between p-3 rounded-xl border-2 border-black font-bold text-sm ${
              activeNav === 'explorer'
                ? 'bg-[#A3E635] text-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-slate-50 dark:bg-slate-800 text-black dark:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>Explore Pokédex</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('favorites')}
            className={`flex items-center justify-between p-3 rounded-xl border-2 border-black font-bold text-sm ${
              activeNav === 'favorites'
                ? 'bg-[#FF6B6B] text-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-slate-50 dark:bg-slate-800 text-black dark:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>Favorite Pokémon</span>
            </div>
            {favoritesCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-black rounded-full bg-white text-black border border-black">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('compare')}
            className={`flex items-center justify-between p-3 rounded-xl border-2 border-black font-bold text-sm ${
              activeNav === 'compare'
                ? 'bg-[#C084FC] text-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-slate-50 dark:bg-slate-800 text-black dark:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span>Compare Pokémon</span>
            </div>
            {compareCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-black rounded-full bg-white text-black border border-black">
                {compareCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
