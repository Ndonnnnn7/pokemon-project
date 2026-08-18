import React from 'react';
import {
  ArrowUp,
  Heart,
  Scale,
  Sparkles,
  Zap,
  Flame,
  Droplets,
  Leaf,
  Moon,
  Compass,
  Layers,
  ShieldCheck,
  Dices,
} from 'lucide-react';
import { getTypeColor } from '../styles/typeColors';

interface FooterProps {
  onSelectType?: (type: string) => void;
  onOpenFavorites?: () => void;
  onOpenCompare?: () => void;
  onRandomPokemon?: () => void;
  favoritesCount?: number;
  compareCount?: number;
}

const QUICK_TYPES = [
  { name: 'Fire', id: 'fire', icon: Flame, color: '#FF6B6B' },
  { name: 'Water', id: 'water', icon: Droplets, color: '#38BDF8' },
  { name: 'Grass', id: 'grass', icon: Leaf, color: '#4ADE80' },
  { name: 'Electric', id: 'electric', icon: Zap, color: '#FEF08A' },
  { name: 'Dark', id: 'dark', icon: Moon, color: '#71717A' },
  { name: 'Dragon', id: 'dragon', icon: Sparkles, color: '#A855F7' },
];

export const Footer: React.FC<FooterProps> = ({
  onSelectType,
  onOpenFavorites,
  onOpenCompare,
  onRandomPokemon,
  favoritesCount = 0,
  compareCount = 0,
}) => {
  const [showFloatingTop, setShowFloatingTop] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowFloatingTop(true);
      } else {
        setShowFloatingTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTypeClick = (typeId: string) => {
    if (onSelectType) {
      onSelectType(typeId);
      const filterSection = document.querySelector('section');
      if (filterSection) {
        filterSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {showFloatingTop && (
        <button
          type="button"
          onClick={scrollToTop}
          title="Scroll to top"
          className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-12 h-12 rounded-2xl bg-[#A3E635] text-black border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer animate-fadeIn"
        >
          <ArrowUp className="w-6 h-6 stroke-[3]" />
        </button>
      )}

      <footer className="relative w-full border-t-[4px] border-black bg-white dark:bg-slate-900 text-black dark:text-white font-['Space_Grotesk'] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full border-[3px] border-black bg-white shadow-[3px_3px_0px_0px_#000] flex items-center justify-center overflow-hidden shrink-0 group">
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#FF4757] border-b-2 border-black" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
                  <div className="relative z-10 w-3 h-3 rounded-full bg-white border-2 border-black group-hover:rotate-180 transition-transform duration-500" />
                </div>

                <div>
                  <h3 className="text-xl font-black tracking-tight leading-none text-black dark:text-white">
                    POKÉMON EXPLORER
                  </h3>
                  <span className="text-[10px] font-black uppercase text-[#FF4757] tracking-wider">
                    Gotta Explore 'Em All!
                  </span>
                </div>
              </div>

              <p className="text-xs font-extrabold text-slate-600 dark:text-slate-400 leading-relaxed">
                An ultra-fast, modern Pokédex built with Neobrutalist aesthetics, live battle stats matrix, elemental filters, and comparison tools.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded-lg bg-[#FEF08A] text-black border-2 border-black text-[10px] font-black shadow-[1.5px_1.5px_0px_0px_#000]">
                  1025+ POKÉMON
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-[#BAE6FD] text-black border-2 border-black text-[10px] font-black shadow-[1.5px_1.5px_0px_0px_#000]">
                  18 TYPES
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-[#C084FC] text-black border-2 border-black text-[10px] font-black shadow-[1.5px_1.5px_0px_0px_#000]">
                  9 GENS
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 pb-1 border-b-2 border-black/10 dark:border-white/10">
                <Layers className="w-4 h-4 text-[#FF4757] stroke-[3]" />
                <h4 className="text-sm font-black uppercase tracking-wider text-black dark:text-white">
                  ELEMENTAL TYPES
                </h4>
              </div>

              <p className="text-xs font-extrabold text-slate-600 dark:text-slate-400">
                Jump directly into specific elemental categories:
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {QUICK_TYPES.map((type) => {
                  const Icon = type.icon;
                  const colorInfo = getTypeColor(type.id);

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleTypeClick(type.id)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border-2 border-black text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer bg-white dark:bg-slate-800 text-black dark:text-white group"
                    >
                      <div
                        style={{ backgroundColor: colorInfo.bg }}
                        className="w-4 h-4 rounded-full border border-black flex items-center justify-center shrink-0 text-black"
                      >
                        <Icon className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="truncate capitalize">{type.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 pb-1 border-b-2 border-black/10 dark:border-white/10">
                <Compass className="w-4 h-4 text-[#38BDF8] stroke-[3]" />
                <h4 className="text-sm font-black uppercase tracking-wider text-black dark:text-white">
                  EXPLORER TOOLS
                </h4>
              </div>

              <p className="text-xs font-extrabold text-slate-600 dark:text-slate-400">
                Interactive Pokédex utilities and battle comparison tools:
              </p>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={onOpenFavorites}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border-2 border-black text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 hover:bg-[#FF6B6B] hover:text-black dark:hover:bg-[#FF6B6B] dark:hover:text-black transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 fill-[#FF6B6B] text-black stroke-[2.5] group-hover:fill-black transition-colors" />
                    <span>Favorite Deck</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-black dark:text-white border border-black text-[10px] font-black group-hover:bg-white group-hover:text-black">
                    {favoritesCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onOpenCompare}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border-2 border-black text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 hover:bg-[#C084FC] hover:text-black dark:hover:bg-[#C084FC] dark:hover:text-black transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5 text-black dark:text-white group-hover:text-black stroke-[2.5]" />
                    <span>Head-to-Head Compare</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-black dark:text-white border border-black text-[10px] font-black group-hover:bg-white group-hover:text-black">
                    {compareCount}/2
                  </span>
                </button>

                {onRandomPokemon && (
                  <button
                    type="button"
                    onClick={onRandomPokemon}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FEF08A] text-black border-2 border-black text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    <Dices className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Surprise Pokémon Discovery</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 pb-1 border-b-2 border-black/10 dark:border-white/10">
                <ShieldCheck className="w-4 h-4 text-[#A3E635] stroke-[3]" />
                <h4 className="text-sm font-black uppercase tracking-wider text-black dark:text-white">
                  TRAINER TERMINAL
                </h4>
              </div>

              <div className="relative rounded-2xl bg-[#BAE6FD] dark:bg-slate-800 border-[2.5px] border-black p-3.5 shadow-[3px_3px_0px_0px_#000] flex flex-col gap-2.5 overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF4757] border border-black shadow-xs" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] border border-black shadow-xs" />
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-800 dark:text-slate-200 ml-1">
                    SYS.ONLINE
                  </span>
                </div>

                <div className="bg-white/90 dark:bg-slate-900/90 rounded-xl p-2.5 border-2 border-black text-xs font-bold leading-snug text-slate-900 dark:text-slate-100">
                  <span className="text-[#FF4757] font-black mr-1">💡 PRO TIP:</span>
                  Click any Pokémon card to inspect base stat radar, abilities, heights, weights, and battle moves!
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[9px] uppercase font-black text-slate-700 dark:text-slate-300">
                    Pokédex OS v2.6
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <div className="w-4 h-0.5 bg-black dark:bg-white rounded-full" />
                    <div className="w-4 h-0.5 bg-black dark:bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t-[3px] border-black flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-black">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left text-slate-600 dark:text-slate-400">
              <span>© {new Date().getFullYear()} Pokémon Explorer.</span>
              <span className="hidden sm:inline">•</span>
              <span>Made by Brandonngeraldo</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
