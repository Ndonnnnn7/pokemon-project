import React from 'react';
import {
  Layers,
  CircleDot,
  Flame,
  Droplets,
  Leaf,
  Zap,
  Snowflake,
  Swords,
  Skull,
  Mountain,
  Feather,
  Eye,
  Bug,
  Gem,
  Ghost,
  ShieldAlert,
  Moon,
  Shield,
  Sparkles,
} from 'lucide-react';

interface TypeIconProps {
  type: string;
  className?: string;
}

export const TypeIcon: React.FC<TypeIconProps> = ({ type, className = 'w-3.5 h-3.5' }) => {
  const norm = type.toLowerCase().trim();

  switch (norm) {
    case 'all':
      return <Layers className={className} />;
    case 'normal':
      return <CircleDot className={className} />;
    case 'fire':
      return <Flame className={className} />;
    case 'water':
      return <Droplets className={className} />;
    case 'grass':
      return <Leaf className={className} />;
    case 'electric':
      return <Zap className={className} />;
    case 'ice':
      return <Snowflake className={className} />;
    case 'fighting':
      return <Swords className={className} />;
    case 'poison':
      return <Skull className={className} />;
    case 'ground':
      return <Mountain className={className} />;
    case 'flying':
      return <Feather className={className} />;
    case 'psychic':
      return <Eye className={className} />;
    case 'bug':
      return <Bug className={className} />;
    case 'rock':
      return <Gem className={className} />;
    case 'ghost':
      return <Ghost className={className} />;
    case 'dragon':
      return <ShieldAlert className={className} />;
    case 'dark':
      return <Moon className={className} />;
    case 'steel':
      return <Shield className={className} />;
    case 'fairy':
      return <Sparkles className={className} />;
    default:
      return <CircleDot className={className} />;
  }
};
