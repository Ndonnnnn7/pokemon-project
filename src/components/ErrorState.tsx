import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isOffline?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = "We couldn't load the Pokémon data. Please check your connection and try again.",
  onRetry,
  isOffline = false,
}) => {
  const IconComponent = isOffline ? WifiOff : AlertTriangle;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 my-10 rounded-[2.5rem] bg-[#FF6B6B] text-black border-[3.5px] border-black max-w-lg mx-auto shadow-[6px_6px_0px_0px_#000] font-['Space_Grotesk']">
      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-4 border-2 border-black shadow-[3px_3px_0px_0px_#000] text-black">
        <IconComponent className="w-8 h-8 stroke-[2.5]" />
      </div>
      
      <h3 className="text-2xl font-black mb-2">
        {title}
      </h3>
      
      <p className="text-black text-sm font-extrabold max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm bg-white text-black border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 stroke-[3]" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
