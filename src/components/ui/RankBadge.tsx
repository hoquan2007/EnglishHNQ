import React from 'react';
import { RankLevel } from '../../types';
import { Shield, Award, Crown, Zap, Flame, Trophy, Star } from 'lucide-react';

interface RankBadgeProps {
  rank: RankLevel;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const rankConfig: Record<RankLevel, {
  name: string;
  color: string;
  bg: string;
  border: string;
  glow: string;
  icon: React.ElementType;
  gradient: string;
  stars: number;
}> = {
  bronze: {
    name: 'Đồng',
    color: '#CD7F32',
    bg: 'rgba(205, 127, 50, 0.15)',
    border: 'rgba(205, 127, 50, 0.5)',
    glow: 'rgba(205, 127, 50, 0.4)',
    gradient: 'linear-gradient(135deg, #CD7F32, #8B4513)',
    icon: Shield,
    stars: 1
  },
  silver: {
    name: 'Bạc',
    color: '#C0C0C0',
    bg: 'rgba(192, 192, 192, 0.12)',
    border: 'rgba(192, 192, 192, 0.5)',
    glow: 'rgba(192, 192, 192, 0.5)',
    gradient: 'linear-gradient(135deg, #E8E8E8, #A8B2C1)',
    icon: Award,
    stars: 2
  },
  gold: {
    name: 'Vàng',
    color: '#FFD700',
    bg: 'rgba(255, 215, 0, 0.12)',
    border: 'rgba(255, 215, 0, 0.5)',
    glow: 'rgba(255, 215, 0, 0.5)',
    gradient: 'linear-gradient(135deg, #FFE55C, #FFD700, #FFA500)',
    icon: Trophy,
    stars: 3
  },
  platinum: {
    name: 'Bạch Kim',
    color: '#00E5FF',
    bg: 'rgba(0, 229, 255, 0.1)',
    border: 'rgba(0, 229, 255, 0.5)',
    glow: 'rgba(0, 229, 255, 0.5)',
    gradient: 'linear-gradient(135deg, #00E5FF, #00BFFF, #0080FF)',
    icon: Zap,
    stars: 4
  },
  diamond: {
    name: 'Kim Cương',
    color: '#A855F7',
    bg: 'rgba(168, 85, 247, 0.12)',
    border: 'rgba(168, 85, 247, 0.5)',
    glow: 'rgba(168, 85, 247, 0.5)',
    gradient: 'linear-gradient(135deg, #A855F7, #7C3AED, #5B21B6)',
    icon: Flame,
    stars: 5
  },
  master: {
    name: 'Cao Thủ',
    color: '#FF0055',
    bg: 'rgba(255, 0, 85, 0.12)',
    border: 'rgba(255, 0, 85, 0.5)',
    glow: 'rgba(255, 0, 85, 0.6)',
    gradient: 'linear-gradient(135deg, #FF0055, #FF4444, #FF6B6B)',
    icon: Crown,
    stars: 6
  }
};

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, showName = true, size = 'md' }) => {
  const config = rankConfig[rank] || rankConfig.bronze;
  const IconComponent = config.icon;

  const sizeConfig = {
    sm: { font: '0.7rem', padding: '0.25rem 0.6rem', iconSize: 14, starSize: 8 },
    md: { font: '0.85rem', padding: '0.35rem 0.9rem', iconSize: 18, starSize: 10 },
    lg: { font: '1rem', padding: '0.5rem 1.2rem', iconSize: 22, starSize: 12 }
  }[size];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: sizeConfig.padding,
        background: config.bg,
        border: `2px solid ${config.border}`,
        borderRadius: '9999px',
        color: config.color,
        fontSize: sizeConfig.font,
        fontWeight: 800,
        letterSpacing: '0.04em',
        fontFamily: 'var(--font-heading)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `
          0 0 20px ${config.glow},
          inset 0 0 15px ${config.glow},
          0 4px 15px rgba(0, 0, 0, 0.3)
        `,
        textShadow: `0 0 10px ${config.glow}`,
      }}
    >
      {/* Animated shimmer overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            45deg,
            transparent 30%,
            ${config.color}22 50%,
            transparent 70%
          )`,
          backgroundSize: '200% 100%',
          animation: 'rank-shimmer 3s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Icon */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: `drop-shadow(0 0 6px ${config.color})`,
      }}>
        <IconComponent size={sizeConfig.iconSize} />
      </div>

      {/* Name */}
      {showName && (
        <span style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
        }}>
          {config.name}

          {/* Star indicators */}
          <div style={{
            display: 'flex',
            gap: '1px',
            marginLeft: '0.2rem',
          }}>
            {Array.from({ length: Math.min(config.stars, 3) }).map((_, i) => (
              <Star
                key={i}
                size={sizeConfig.starSize}
                fill={config.color}
                style={{
                  filter: `drop-shadow(0 0 3px ${config.color})`,
                  animation: `star-twinkle ${1.5 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </span>
      )}
    </div>
  );
};
