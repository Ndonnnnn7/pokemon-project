import React from 'react';

interface HeroSectionProps {
  onSearchCompanion?: (name: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearchCompanion,
}) => {
  const handleCompanionClick = (name: string) => {
    if (onSearchCompanion) {
      onSearchCompanion(name);
    }
  };

  return (
    <section className="relative w-full text-center pt-8 sm:pt-12 pb-3 mb-2 flex flex-col items-center font-['Space_Grotesk'] overflow-visible">
      <button
        type="button"
        onClick={() => handleCompanionClick('Pikachu')}
        title="Click to explore Pikachu!"
        className="hidden lg:flex flex-col items-center group cursor-pointer animate-float transition-transform duration-200 hover:scale-115 absolute top-2 left-0 xl:-left-8 2xl:-left-16 pointer-events-auto select-none z-10"
      >
        <div className="bg-white dark:bg-slate-800 text-black dark:text-white border-2 border-black rounded-2xl px-2.5 py-1 text-xs font-black shadow-[3px_3px_0px_0px_#000] -rotate-6 mb-1 group-hover:bg-[#FEF08A] group-hover:text-black transition-colors">
          Pika Pika! ⚡
        </div>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
          alt="Pikachu"
          className="w-20 xl:w-28 h-20 xl:h-28 object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.25)] group-hover:rotate-6 transition-transform"
        />
      </button>

      <button
        type="button"
        onClick={() => handleCompanionClick('Gengar')}
        title="Click to explore Gengar!"
        className="hidden lg:flex flex-col items-center group cursor-pointer animate-float-reverse transition-transform duration-200 hover:scale-115 absolute top-36 -left-6 xl:-left-16 2xl:-left-24 pointer-events-auto select-none z-10"
      >
        <div className="bg-white dark:bg-slate-800 text-black dark:text-white border-2 border-black rounded-2xl px-2.5 py-1 text-xs font-black shadow-[3px_3px_0px_0px_#000] rotate-6 mb-1 group-hover:bg-[#C084FC] group-hover:text-black transition-colors">
          Boo! 👻
        </div>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png"
          alt="Gengar"
          className="w-20 xl:w-26 h-20 xl:h-26 object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.25)] group-hover:-rotate-6 transition-transform"
        />
      </button>

      <button
        type="button"
        onClick={() => handleCompanionClick('Bulbasaur')}
        title="Click to explore Bulbasaur!"
        className="hidden lg:flex flex-col items-center group cursor-pointer animate-float transition-transform duration-200 hover:scale-115 absolute top-68 left-2 xl:-left-4 2xl:-left-8 pointer-events-auto select-none z-10"
      >
        <div className="bg-white dark:bg-slate-800 text-black dark:text-white border-2 border-black rounded-2xl px-2.5 py-1 text-xs font-black shadow-[3px_3px_0px_0px_#000] -rotate-3 mb-1 group-hover:bg-[#4ADE80] group-hover:text-black transition-colors">
          Bulba! 🌿
        </div>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
          alt="Bulbasaur"
          className="w-20 xl:w-24 h-20 xl:h-24 object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.25)] group-hover:rotate-6 transition-transform"
        />
      </button>

      <button
        type="button"
        onClick={() => handleCompanionClick('Charizard')}
        title="Click to explore Charizard!"
        className="hidden lg:flex flex-col items-center group cursor-pointer animate-float-reverse transition-transform duration-200 hover:scale-115 absolute top-2 right-0 xl:-right-8 2xl:-right-16 pointer-events-auto select-none z-10"
      >
        <div className="bg-white dark:bg-slate-800 text-black dark:text-white border-2 border-black rounded-2xl px-2.5 py-1 text-xs font-black shadow-[3px_3px_0px_0px_#000] rotate-6 mb-1 group-hover:bg-[#FF6B6B] group-hover:text-black transition-colors">
          Flamethrower! 🔥
        </div>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png"
          alt="Charizard"
          className="w-24 xl:w-30 h-24 xl:h-30 object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.25)] group-hover:-rotate-6 transition-transform"
        />
      </button>

      <button
        type="button"
        onClick={() => handleCompanionClick('Blastoise')}
        title="Click to explore Blastoise!"
        className="hidden lg:flex flex-col items-center group cursor-pointer animate-float transition-transform duration-200 hover:scale-115 absolute top-36 -right-6 xl:-right-16 2xl:-right-24 pointer-events-auto select-none z-10"
      >
        <div className="bg-white dark:bg-slate-800 text-black dark:text-white border-2 border-black rounded-2xl px-2.5 py-1 text-xs font-black shadow-[3px_3px_0px_0px_#000] -rotate-6 mb-1 group-hover:bg-[#38BDF8] group-hover:text-black transition-colors">
          Hydro Pump! 💧
        </div>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png"
          alt="Blastoise"
          className="w-20 xl:w-26 h-20 xl:h-26 object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.25)] group-hover:rotate-6 transition-transform"
        />
      </button>

      <button
        type="button"
        onClick={() => handleCompanionClick('Mewtwo')}
        title="Click to explore Mewtwo!"
        className="hidden lg:flex flex-col items-center group cursor-pointer animate-float-reverse transition-transform duration-200 hover:scale-115 absolute top-68 right-2 xl:-right-4 2xl:-right-8 pointer-events-auto select-none z-10"
      >
        <div className="bg-white dark:bg-slate-800 text-black dark:text-white border-2 border-black rounded-2xl px-2.5 py-1 text-xs font-black shadow-[3px_3px_0px_0px_#000] rotate-4 mb-1 group-hover:bg-[#F472B6] group-hover:text-black transition-colors">
          Psychic! 🔮
        </div>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png"
          alt="Mewtwo"
          className="w-20 xl:w-24 h-20 xl:h-24 object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.25)] group-hover:-rotate-6 transition-transform"
        />
      </button>

      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-black dark:text-white mb-3 sm:mb-4 leading-[1.15] sm:leading-[1.1] max-w-4xl select-none">
        <span>Gotta </span>
        <span className="inline-block relative px-3 sm:px-5 py-0.5 sm:py-1 mx-1 rounded-2xl bg-[#FACC15] text-black border-[3px] sm:border-[4px] border-black shadow-[4px_4px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000] -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-200 cursor-pointer">
          Explore
          <span className="absolute -top-3 -right-3 text-[10px] sm:text-xs bg-[#FF6B6B] text-black font-black px-2 py-0.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] rotate-12 hidden sm:inline-block">
            Pokemon
          </span>
        </span>
        <span> 'Em All!</span>
      </h1>

      <p className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300 font-extrabold max-w-2xl mx-auto leading-relaxed mb-2 px-4">
        Search by name or ID, analyze base stat battle matrix, filter across 18 elemental types, and collect your favorite Pokémon.
      </p>
    </section>
  );
};
