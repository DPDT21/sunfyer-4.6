import React from 'react';
import { motion } from 'motion/react';
import { VoiceState } from '../types';

interface SpinningSunProps {
  state: VoiceState;
  audioLevel?: number;
  size?: number;
  className?: string;
}

export const SpinningSun: React.FC<SpinningSunProps> = ({
  state,
  audioLevel = 0,
  size = 340,
  className = '',
}) => {
  // Rotational velocity:
  // idle: 12s smooth graceful spin
  // listening: 4.5s reactive spin
  // processing: 2s rapid vortex acceleration
  // speaking: 3.5s rhythmic cadence
  const spinDuration =
    state === 'processing'
      ? 2.0
      : state === 'listening'
      ? 4.5
      : state === 'speaking'
      ? 3.5
      : 12;

  const counterSpinDuration = spinDuration * 1.5;

  // Real-time audio reactive flare scaling
  const rayExpansion = state === 'listening' ? 1 + audioLevel * 0.55 : 1;
  const flareIntensity = state === 'listening' ? 0.85 + audioLevel * 0.4 : state === 'processing' ? 1.0 : 0.75;

  // 16 bold solar rays (alternating major pointed spear flares and curved solar prominence blades)
  const rayCount = 16;
  const rays = Array.from({ length: rayCount }, (_, i) => {
    const angle = (i * 360) / rayCount;
    const isMajor = i % 2 === 0;
    return { angle, isMajor, index: i };
  });

  return (
    <div
      className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background Multi-Layer Solar Bloom / Flare Atmosphere */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(254, 240, 138, ${flareIntensity * 0.6}) 0%, rgba(250, 204, 21, ${flareIntensity * 0.45}) 35%, rgba(234, 179, 8, ${flareIntensity * 0.25}) 55%, transparent 75%)`,
          filter: 'blur(28px)',
          transform: `scale(${rayExpansion * 1.25})`,
        }}
      />

      {/* Radiant Sun Disk (Solid Glowing Photosphere) */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-300 shadow-[0_0_60px_rgba(250,204,21,0.7)]"
        style={{
          width: size * 0.58,
          height: size * 0.58,
          background: 'radial-gradient(circle at 35% 35%, #FFFDE7 0%, #FEF08A 25%, #FACC15 60%, #EAB308 85%, #CA8A04 100%)',
          filter: 'drop-shadow(0 0 25px rgba(250, 204, 21, 0.85))',
        }}
      />

      {/* Primary Clockwise Ultra-Visible Solar Rays & Crown */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: spinDuration,
          ease: 'linear',
        }}
      >
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full overflow-visible"
          style={{ filter: 'drop-shadow(0 0 16px rgba(250, 204, 21, 0.9))' }}
        >
          <defs>
            {/* Vivid Opaque Golden Gradients */}
            <linearGradient id="solarRayMajorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="20%" stopColor="#FFF59D" />
              <stop offset="65%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>

            <linearGradient id="solarRayCurvedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFDE7" />
              <stop offset="35%" stopColor="#FDE047" />
              <stop offset="80%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Glowing filter for neon solar flare edges */}
            <filter id="solarRayGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform="translate(150, 150)" filter="url(#solarRayGlow)">
            {/* Outer Circular Solar Ring uniting ray bases */}
            <circle
              r="68"
              fill="none"
              stroke="#FDE047"
              strokeWidth="4"
              strokeOpacity="0.8"
            />
            <circle
              r="72"
              fill="none"
              stroke="#FEF08A"
              strokeWidth="2"
              strokeDasharray="8 6"
              strokeOpacity="0.75"
            />

            {/* 16 Prominent, High-Contrast Solar Rays */}
            {rays.map(({ angle, isMajor }, idx) => {
              // Ray starts at radius 65, extends boldly outward to 142 (major) or 118 (minor)
              const rayLength = isMajor ? 72 * rayExpansion : 50 * rayExpansion;
              const baseWidth = isMajor ? 14 : 10;

              return (
                <g key={idx} transform={`rotate(${angle})`}>
                  {isMajor ? (
                    // Bold Spear Flare Ray
                    <path
                      d={`M -${baseWidth / 2} -65 L 0 -${65 + rayLength} L ${baseWidth / 2} -65 Z`}
                      fill="url(#solarRayMajorGrad)"
                      stroke="#FFFFFF"
                      strokeWidth="1.2"
                      strokeOpacity="0.9"
                    />
                  ) : (
                    // Dynamic Curved Solar Prominence Tongue
                    <path
                      d={`M -${baseWidth / 2} -65 Q ${baseWidth * 1.8} -${65 + rayLength * 0.55} 0 -${65 + rayLength} Q -${baseWidth * 1.2} -${65 + rayLength * 0.4} ${baseWidth / 2} -65 Z`}
                      fill="url(#solarRayCurvedGrad)"
                      stroke="#FFF9C4"
                      strokeWidth="1.2"
                      strokeOpacity="0.85"
                    />
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </motion.div>

      {/* Counter-Clockwise Spinning Magnetic Coronal Loops */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: -360 }}
        transition={{
          repeat: Infinity,
          duration: counterSpinDuration,
          ease: 'linear',
        }}
      >
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full overflow-visible"
          style={{ filter: 'drop-shadow(0 0 10px rgba(253, 224, 71, 0.8))' }}
        >
          <g transform="translate(150, 150)">
            {/* Magnetic loop arcs spanning across rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((rot, i) => (
              <path
                key={i}
                d="M -34 -68 C -18 -102, 18 -102, 34 -68"
                fill="none"
                stroke="#FFF59D"
                strokeWidth="2.8"
                strokeOpacity="0.85"
                transform={`rotate(${rot})`}
              />
            ))}

            {/* Radiant flare diamond stars orbiting at corona boundary */}
            {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((rot, i) => (
              <g key={`diamond-${i}`} transform={`rotate(${rot}) translate(0, -96)`}>
                <polygon
                  points="0,-6 4,0 0,6 -4,0"
                  fill="#FFFFFF"
                  stroke="#FACC15"
                  strokeWidth="1"
                />
              </g>
            ))}
          </g>
        </svg>
      </motion.div>

      {/* Orbiting Solar Sparks / Flare Ejections */}
      <motion.div
        className="absolute w-full h-full rounded-full pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: spinDuration * 0.9,
          ease: 'linear',
        }}
      >
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white shadow-[0_0_12px_#ffffff,0_0_24px_#facc15]"
            style={{
              width: i % 2 === 0 ? '7px' : '5px',
              height: i % 2 === 0 ? '7px' : '5px',
              top: '50%',
              left: '50%',
              transform: `rotate(${deg}deg) translate(0, -${size * 0.44}px)`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};
