import React from 'react';
import { getTypeColor } from '../styles/typeColors';

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: (e?: React.MouseEvent) => void;
  isActive?: boolean;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({
  type,
  size = 'md',
  onClick,
  isActive = false,
}) => {
  const colorInfo = getTypeColor(type);

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-xs font-extrabold',
    lg: 'px-4 py-1.5 text-sm font-extrabold',
  }[size];

  const clickableClasses = onClick
    ? 'cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
    : '';

  const activeOutline = isActive
    ? 'shadow-[3px_3px_0px_0px_#000] -translate-y-0.5 scale-105'
    : 'shadow-[2px_2px_0px_0px_#000]';

  return (
    <span
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick(e);
        }
      }}
      style={{
        backgroundColor: colorInfo.bg,
        color: colorInfo.text,
      }}
      className={`inline-flex items-center justify-center font-['Space_Grotesk'] font-black capitalize select-none rounded-full border-2 border-black ${sizeClasses} ${clickableClasses} ${activeOutline}`}
    >
      {colorInfo.name}
    </span>
  );
};
