import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { PokemonStat } from '../types/pokemon';
import { Heart, Swords, Shield, Zap, Flame, ShieldAlert, Trophy } from 'lucide-react';

interface StatRadarChartProps {
  stats: PokemonStat[];
  primaryColor?: string;
  pokemonName: string;
}

const STAT_METADATA: Record<string, { label: string; shortLabel: string; icon: React.ReactNode; color: string }> = {
  hp: { label: 'HP', shortLabel: 'HP', icon: <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />, color: '#FF4757' },
  attack: { label: 'Attack', shortLabel: 'ATK', icon: <Swords className="w-3.5 h-3.5 text-amber-500" />, color: '#FFA502' },
  defense: { label: 'Defense', shortLabel: 'DEF', icon: <Shield className="w-3.5 h-3.5 text-blue-500" />, color: '#2ED573' },
  'special-attack': { label: 'Sp. Atk', shortLabel: 'SPA', icon: <Flame className="w-3.5 h-3.5 text-purple-500" />, color: '#9B51E0' },
  'special-defense': { label: 'Sp. Def', shortLabel: 'SPD', icon: <ShieldAlert className="w-3.5 h-3.5 text-cyan-500" />, color: '#1E90FF' },
  speed: { label: 'Speed', shortLabel: 'SPE', icon: <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />, color: '#ECCC68' },
};

const STAT_ORDER = ['hp', 'attack', 'defense', 'speed', 'special-defense', 'special-attack'];
const MAX_STAT_SCALE = 180;

export const StatRadarChart: React.FC<StatRadarChartProps> = ({
  stats,
  primaryColor = '#FACC15',
  pokemonName,
}) => {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  const orderedStats = STAT_ORDER.map((statKey) => {
    const found = stats.find((s) => s.stat.name === statKey);
    const meta = STAT_METADATA[statKey] || {
      label: statKey,
      shortLabel: statKey.toUpperCase(),
      icon: <Heart className="w-3.5 h-3.5" />,
      color: '#A3E635',
    };
    return {
      key: statKey,
      name: meta.label,
      shortLabel: meta.shortLabel,
      icon: meta.icon,
      color: meta.color,
      value: found ? found.base_stat : 0,
    };
  });

  const totalBaseStat = stats.reduce((sum, s) => sum + s.base_stat, 0);

  const bestStat = [...orderedStats].sort((a, b) => b.value - a.value)[0];

  const size = 320;
  const center = size / 2;
  const maxRadius = 105;
  const numAxes = 6;
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (index: number, valueRatio: number) => {
    const angle = (index * 2 * Math.PI) / numAxes - Math.PI / 2;
    const r = maxRadius * valueRatio;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  const gridPolygons = gridLevels.map((level) => {
    return Array.from({ length: numAxes })
      .map((_, i) => {
        const { x, y } = getCoordinates(i, level);
        return `${x},${y}`;
      })
      .join(' ');
  });

  const statPoints = orderedStats.map((stat, i) => {
    const ratio = Math.min(Math.max(stat.value / MAX_STAT_SCALE, 0.14), 1.0);
    return getCoordinates(i, ratio);
  });

  const statPolygonPath = statPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="w-full flex flex-col lg:flex-row items-center lg:items-start gap-6 font-['Space_Grotesk'] text-black dark:text-white">
      <div className="relative flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border-[3px] border-black shadow-[4px_4px_0px_0px_#000] shrink-0 w-full max-w-[340px] sm:max-w-[360px]">
        <div className="flex items-center justify-between w-full mb-1 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4757] border border-black" />
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              STATS MATRIX
            </span>
          </div>

          {bestStat && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#FEF08A] text-black text-[10px] font-black border border-black shadow-xs">
              <Trophy className="w-3 h-3 text-amber-600 fill-amber-600" />
              <span>Top: {bestStat.shortLabel} ({bestStat.value})</span>
            </div>
          )}
        </div>

        <div className="relative w-[300px] h-[300px] flex items-center justify-center select-none">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
            <defs>
              <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={primaryColor} stopOpacity="0.75" />
                <stop offset="100%" stopColor="#FF4757" stopOpacity="0.45" />
              </radialGradient>
              <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="2" dy="2" stdDeviation="0" floodColor="#000000" />
              </filter>
            </defs>

            {gridPolygons.map((points, idx) => (
              <polygon
                key={idx}
                points={points}
                fill={idx === gridPolygons.length - 1 ? 'rgba(0,0,0,0.02)' : 'none'}
                stroke="currentColor"
                className="text-black/20 dark:text-white/20"
                strokeWidth={idx === gridPolygons.length - 1 ? '2' : '1.5'}
                strokeDasharray={idx === gridPolygons.length - 1 ? 'none' : '3,3'}
              />
            ))}

            {Array.from({ length: numAxes }).map((_, i) => {
              const { x, y } = getCoordinates(i, 1.0);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="currentColor"
                  className="text-black/30 dark:text-white/30"
                  strokeWidth="1.5"
                />
              );
            })}

            <motion.polygon
              initial={{ scale: 0, opacity: 0, transformOrigin: 'center' }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25, delay: 0.1 }}
              points={statPolygonPath}
              fill="url(#radarGlow)"
              stroke="#000000"
              strokeWidth="3.5"
              className="drop-shadow-[3px_3px_0px_#000]"
            />

            <circle cx={center} cy={center} r="4" fill="#000000" />

            {statPoints.map((p, idx) => {
              const stat = orderedStats[idx];
              const isHovered = hoveredStat === stat.key;

              return (
                <g key={stat.key} className="cursor-pointer">
                  {isHovered && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="9"
                      fill={stat.color}
                      stroke="#000000"
                      strokeWidth="2"
                      className="animate-ping opacity-75"
                    />
                  )}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? '7' : '5.5'}
                    fill={isHovered ? '#FFFFFF' : stat.color}
                    stroke="#000000"
                    strokeWidth="2.5"
                    onMouseEnter={() => setHoveredStat(stat.key)}
                    onMouseLeave={() => setHoveredStat(null)}
                    className="transition-all duration-150"
                  />
                </g>
              );
            })}
          </svg>

          {orderedStats.map((stat, idx) => {
            const { x, y } = getCoordinates(idx, 1.28);
            const isHovered = hoveredStat === stat.key;

            return (
              <button
                key={stat.key}
                type="button"
                onMouseEnter={() => setHoveredStat(stat.key)}
                onMouseLeave={() => setHoveredStat(null)}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-10 flex items-center gap-1 px-2 py-0.8 rounded-lg border-2 border-black text-[11px] font-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] ${
                  isHovered
                    ? 'bg-[#FEF08A] text-black scale-110 shadow-[3px_3px_0px_0px_#000]'
                    : 'bg-white dark:bg-slate-900 text-black dark:text-white hover:bg-slate-100'
                }`}
              >
                <span>{stat.shortLabel}</span>
                <span className="font-extrabold text-[10px] text-slate-500 dark:text-slate-400">
                  {stat.value}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 text-center mt-2">
          Hover over vertex nodes to inspect individual stat points
        </p>
      </div>

      <div className="flex-1 w-full flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between pb-2 border-b-2 border-black/10 dark:border-white/10">
          <div>
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-black dark:text-white">
              BASE STATS
            </h3>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Combat power distribution for {pokemonName}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#A3E635] text-black px-3.5 py-1.5 rounded-2xl border-2 border-black shadow-[2.5px_2.5px_0px_0px_#000] font-black text-xs">
            <span>TOTAL:</span>
            <span className="text-sm font-black">{totalBaseStat}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {orderedStats.map((stat) => {
            const isHovered = hoveredStat === stat.key;
            const percentage = Math.min(Math.round((stat.value / 255) * 100), 100);

            let grade = 'C';
            let gradeColor = 'bg-slate-200 text-black';
            if (stat.value >= 130) {
              grade = 'S+';
              gradeColor = 'bg-[#FF4757] text-white';
            } else if (stat.value >= 100) {
              grade = 'S';
              gradeColor = 'bg-[#FACC15] text-black';
            } else if (stat.value >= 80) {
              grade = 'A';
              gradeColor = 'bg-[#A3E635] text-black';
            } else if (stat.value >= 60) {
              grade = 'B';
              gradeColor = 'bg-[#38BDF8] text-black';
            }

            return (
              <div
                key={stat.key}
                onMouseEnter={() => setHoveredStat(stat.key)}
                onMouseLeave={() => setHoveredStat(null)}
                className={`p-2.5 sm:p-3 rounded-2xl border-2 border-black transition-all cursor-pointer ${
                  isHovered
                    ? 'bg-[#FEF08A]/40 dark:bg-slate-800 shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
                    : 'bg-white dark:bg-slate-900 shadow-[2px_2px_0px_0px_#000] hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-black mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-black">
                      {stat.icon}
                    </span>
                    <span className="text-slate-900 dark:text-slate-100 font-extrabold uppercase">
                      {stat.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md border border-black shadow-xs ${gradeColor}`}>
                      Tier {grade}
                    </span>
                    <span className="text-sm font-black text-black dark:text-white">
                      {stat.value}{' '}
                      <span className="text-[10px] font-bold text-slate-400">/ 255</span>
                    </span>
                  </div>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-black overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.05 }}
                    style={{ backgroundColor: stat.color }}
                    className="h-full rounded-full border-r border-black"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
