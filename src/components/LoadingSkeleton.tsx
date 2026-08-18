import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  message?: string;
}

export const PokemonCardSkeleton: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 border-[3.5px] border-black p-4.5 shadow-[6px_6px_0px_0px_#000] font-['Space_Grotesk'] flex flex-col justify-between">
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF4757] border-2 border-black animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-[#38BDF8] border-2 border-black animate-pulse" />
        </div>
        <div className="w-14 h-6 rounded-xl bg-slate-200 dark:bg-slate-800 border-2 border-black animate-pulse" />
      </div>

      <div className="relative w-full rounded-2xl bg-[#BAE6FD]/40 dark:bg-slate-800/80 border-[2.5px] border-black p-3 flex flex-col justify-center items-center h-44 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />

        <div className="relative z-10 w-11 h-11 rounded-full border-[3px] border-black bg-white animate-spin flex items-center justify-center shadow-[2.5px_2.5px_0px_0px_#000] overflow-hidden mb-2">
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#FF4757] border-b-2 border-black" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
          <div className="relative z-10 w-3 h-3 rounded-full bg-white border-2 border-black" />
        </div>

        <span className="relative z-10 px-2.5 py-0.5 rounded-md bg-black text-white text-[9px] font-black tracking-wider uppercase shadow-[1.5px_1.5px_0px_0px_#FFF] animate-pulse">
          Loading...
        </span>

        <div className="absolute bottom-2 right-2.5 flex flex-col gap-0.5 opacity-60">
          <div className="w-5 h-1 bg-black rounded-full" />
          <div className="w-5 h-1 bg-black rounded-full" />
        </div>
      </div>

      <div className="my-2.5 flex justify-center">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded-xl border-2 border-black animate-pulse" />
      </div>

      <div className="flex gap-2 justify-center w-full mb-3.5">
        <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded-full border-2 border-black animate-pulse" />
        <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded-full border-2 border-black animate-pulse" />
      </div>

      <div className="mt-auto pt-2.5 border-t-2 border-black/10 dark:border-white/10 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="bg-[#FEF08A]/40 dark:bg-slate-800 border-2 border-black rounded-xl py-1 px-2 shadow-[2px_2px_0px_0px_#000] animate-pulse h-11 flex flex-col justify-center items-center">
          <div className="w-8 h-2 bg-slate-400 dark:bg-slate-600 rounded mb-1" />
          <div className="w-6 h-3 bg-slate-400 dark:bg-slate-600 rounded" />
        </div>
        <div className="bg-[#A3E635]/40 dark:bg-slate-800 border-2 border-black rounded-xl py-1 px-2 shadow-[2px_2px_0px_0px_#000] animate-pulse h-11 flex flex-col justify-center items-center">
          <div className="w-10 h-2 bg-slate-400 dark:bg-slate-600 rounded mb-1" />
          <div className="w-6 h-3 bg-slate-400 dark:bg-slate-600 rounded" />
        </div>
      </div>
    </div>
  );
};

export const PokemonGridSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 8,
  message = 'Scanning Pokédex Database...',
}) => {
  return (
    <div className="flex flex-col items-center w-full my-4 font-['Space_Grotesk']">
      <div className="flex items-center gap-2.5 mb-6 py-2 px-4 rounded-full bg-white dark:bg-slate-800 border-2 border-black shadow-[3px_3px_0px_0px_#000] text-xs font-black text-black dark:text-white animate-bounce">
        <div className="relative w-5 h-5 rounded-full border-2 border-black bg-white animate-spin flex items-center justify-center overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#FF4757] border-b border-black" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
          <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-white border border-black" />
        </div>
        <span>{message}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {Array.from({ length: count }).map((_, index) => (
          <PokemonCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export const PokemonDetailSkeleton: React.FC = () => {
  return (
    <div className="p-6 md:p-8 space-y-6 animate-pulse max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] border-[4px] border-black shadow-[8px_8px_0px_0px_#000] font-['Space_Grotesk']">
      <div className="flex justify-between items-center">
        <div className="h-8 w-36 bg-slate-300 dark:bg-slate-700 rounded-xl border-2 border-black" />
        <div className="h-6 w-16 bg-slate-300 dark:bg-slate-700 rounded-full border border-black" />
      </div>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-44 h-44 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-black flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-[3px] border-black bg-white animate-spin flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#FF4757] border-b-2 border-black" />
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
            <div className="relative z-10 w-3 h-3 rounded-full bg-white border-2 border-black" />
          </div>
        </div>
        <div className="flex-1 space-y-4 w-full">
          <div className="h-4 w-3/4 bg-slate-300 dark:bg-slate-700 rounded" />
          <div className="h-4 w-1/2 bg-slate-300 dark:bg-slate-700 rounded" />
        </div>
      </div>
    </div>
  );
};
