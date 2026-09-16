import React from 'react';
import { motion } from 'motion/react';
import { VoiceState, CustomizationSettings } from '../types';
import { Sparkles, Mic, Zap, Shield, Target } from 'lucide-react';
import { SpinningSun } from './SpinningSun';
import { THEMES } from '../utils/theme';

interface SolarOrbProps {
  state: VoiceState;
  audioLevel: number;
  onClick: () => void;
  onInterrupt?: () => void;
  isHandsFree?: boolean;
  customization?: CustomizationSettings;
}

export const SolarOrb: React.FC<SolarOrbProps> = ({
  state,
  audioLevel,
  onClick,
  onInterrupt,
  isHandsFree = false,
  customization,
}) => {
  const theme = THEMES[customization?.colorTheme || 'solar'] || THEMES.solar;
  const orbStyle = customization?.orbStyle || 'corona';
  const pulseSpeedSetting = customization?.pulseSpeed || 'balanced';
  const glowSetting = customization?.glowIntensity || 'radiant';
  const showFlares = customization?.solarFlares ?? true;
  const showEqualizer = customization?.showEqualizer ?? true;

  // Pulse speed factor in seconds
  const speedDurations = {
    slow: 5.5,
    balanced: 3.5,
    turbo: 2.0,
    hyper: 1.0,
  };
  const baseDuration = speedDurations[pulseSpeedSetting];

  // Glow multiplier
  const glowMultipliers = {
    subtle: 0.5,
    moderate: 0.9,
    radiant: 1.4,
    blinding: 2.2,
  };
  const glowMult = glowMultipliers[glowSetting];

  // Dynamic scale and glow pulsation
  const dynamicScale = state === 'listening' 
    ? 1 + audioLevel * 0.35 
    : state === 'speaking' 
    ? 1.05 
    : 1;

  const calculatedGlow = (state === 'listening'
    ? Math.max(0.4, audioLevel * 1.2)
    : state === 'processing'
    ? 0.85
    : state === 'speaking'
    ? 0.75
    : 0.35) * glowMult;

  const handleClick = () => {
    if (state === 'speaking' && onInterrupt) {
      onInterrupt();
    } else {
      onClick();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-6 my-2">
      {/* Ambient background radiant nebula halo */}
      <div
        className="absolute w-[440px] h-[440px] rounded-full pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(circle, rgba(${theme.primaryRgb}, ${calculatedGlow * 0.38}) 0%, rgba(${theme.primaryRgb}, ${calculatedGlow * 0.18}) 45%, transparent 75%)`,
          transform: `scale(${dynamicScale * 1.25})`,
          filter: 'blur(50px)',
        }}
      />

      {/* SOLAR ORB STYLE: CORONA / CYBER / PULSAR / QUANTUM / SHIELD */}
      
      {/* Outer Segmented Degree Radar Ring */}
      <motion.div
        className="absolute w-[390px] h-[390px] rounded-full pointer-events-none z-0 flex items-center justify-center"
        style={{
          borderColor: `rgba(${theme.primaryRgb}, 0.25)`,
          borderWidth: orbStyle === 'cyber' ? '2px' : '1px',
          borderStyle: orbStyle === 'pulsar' ? 'dotted' : 'solid',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: baseDuration * 10, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-1 text-[8px] font-mono" style={{ color: theme.primary }}>000°</div>
        <div className="absolute bottom-1 text-[8px] font-mono" style={{ color: theme.primary }}>180°</div>
        <div className="absolute left-1 text-[8px] font-mono" style={{ color: theme.primary }}>270°</div>
        <div className="absolute right-1 text-[8px] font-mono" style={{ color: theme.primary }}>090°</div>
        <div className="absolute inset-0 border-t border-b" style={{ borderColor: `rgba(${theme.primaryRgb}, 0.1)` }} />
        <div className="absolute inset-0 border-l border-r" style={{ borderColor: `rgba(${theme.primaryRgb}, 0.1)` }} />
      </motion.div>

      {/* Style Specific Extra Orbitals */}
      {orbStyle === 'quantum' && (
        <>
          <motion.div
            className="absolute w-[350px] h-[220px] rounded-[50%] border pointer-events-none z-0"
            style={{ borderColor: `rgba(${theme.primaryRgb}, 0.4)` }}
            animate={{ rotate: [0, 180, 360], scale: [1, 1.05, 1] }}
            transition={{ duration: baseDuration * 2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute w-[220px] h-[350px] rounded-[50%] border pointer-events-none z-0"
            style={{ borderColor: `rgba(${theme.primaryRgb}, 0.35)` }}
            animate={{ rotate: [360, 180, 0], scale: [1, 0.95, 1] }}
            transition={{ duration: baseDuration * 2.5, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}

      {orbStyle === 'shield' && (
        <motion.div
          className="absolute w-[370px] h-[370px] border-2 pointer-events-none z-0 rounded-2xl"
          style={{
            borderColor: `rgba(${theme.primaryRgb}, 0.35)`,
            boxShadow: `inset 0 0 20px rgba(${theme.primaryRgb}, 0.2)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: baseDuration * 8, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Middle Counter-Rotating Track Ring */}
      <motion.div
        className="absolute w-80 h-80 rounded-full border border-dashed pointer-events-none z-0"
        style={{
          borderColor: `rgba(${theme.primaryRgb}, 0.35)`,
          boxShadow: `0 0 ${15 + calculatedGlow * 20}px rgba(${theme.primaryRgb}, ${calculatedGlow * 0.3})`,
        }}
        animate={{
          rotate: -360,
          scale: state === 'listening' ? [1, 1.04 + audioLevel * 0.15, 1] : [1, 1.02, 1],
        }}
        transition={{
          rotate: { duration: baseDuration * 7, repeat: Infinity, ease: 'linear' },
          scale: { duration: state === 'listening' ? 0.5 : baseDuration, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Audio Reactive Frequency Ring (Expands when user or AI speaks) */}
      <motion.div
        className="absolute rounded-full pointer-events-none z-0 transition-all"
        style={{
          borderColor: `rgba(${theme.primaryRgb}, ${state === 'listening' || state === 'speaking' ? 0.7 : 0.25})`,
          borderWidth: state === 'speaking' || state === 'listening' ? '2px' : '1px',
          boxShadow: state === 'speaking' || state === 'listening' ? `0 0 25px ${theme.glow}` : 'none',
          width: state === 'speaking' ? '340px' : state === 'listening' ? '330px' : '310px',
          height: state === 'speaking' ? '340px' : state === 'listening' ? '330px' : '310px',
        }}
        animate={{
          scale: state === 'listening' ? 1 + audioLevel * 0.25 : state === 'speaking' ? [1, 1.04, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Audio Reactive Equalizer Ring Pins */}
      {showEqualizer && (
        <div className="absolute w-[360px] h-[360px] rounded-full pointer-events-none z-0 flex items-center justify-center">
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * 360;
            const barHeight = state === 'listening' 
              ? 4 + (audioLevel * 18 * Math.sin(i + audioLevel * 5))
              : state === 'speaking'
              ? 4 + Math.sin(i * 0.8 + Date.now() / 200) * 12
              : 3;
            return (
              <div
                key={i}
                className="absolute origin-bottom transition-all duration-75"
                style={{
                  transform: `rotate(${angle}deg) translateY(-175px)`,
                  width: '2px',
                  height: `${Math.max(2, Math.min(24, barHeight))}px`,
                  backgroundColor: theme.primary,
                  opacity: state === 'listening' || state === 'speaking' ? 0.8 : 0.2,
                  boxShadow: `0 0 4px ${theme.primary}`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Solar Flares Animation */}
      {showFlares && (
        <div className="absolute w-[340px] h-[340px] rounded-full pointer-events-none z-0">
          <motion.div
            className="absolute top-2 left-1/3 w-8 h-8 rounded-full blur-[2px]"
            style={{ background: `radial-gradient(circle, ${theme.accent} 0%, transparent 70%)` }}
            animate={{
              scale: [0.8, 1.8, 0.8],
              opacity: [0.3, 0.85, 0.3],
              y: [-5, -20, -5],
            }}
            transition={{ duration: baseDuration, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-4 right-1/4 w-10 h-10 rounded-full blur-[2px]"
            style={{ background: `radial-gradient(circle, ${theme.secondary} 0%, transparent 70%)` }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.2, 0.7, 0.2],
              x: [0, 15, 0],
            }}
            transition={{ duration: baseDuration * 1.3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </div>
      )}

      {/* THE ANIMATED SUN CLICK/INTERRUPT CONTROLLER */}
      <motion.button
        id="animated-sun-voice-button"
        type="button"
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          scale: dynamicScale,
        }}
        transition={{
          type: 'spring',
          stiffness: 320,
          damping: 22,
        }}
        className="relative z-10 flex items-center justify-center cursor-pointer rounded-full p-2 focus:outline-none focus:ring-4 group"
        style={{
          boxShadow: `0 0 35px ${theme.glow}`,
        }}
        title={
          state === 'speaking'
            ? 'Sunfyer speaking. CLICK TO INTERRUPT / OVERRIDE'
            : state === 'listening'
            ? 'Listening... Click sun or pause speaking to auto-transmit'
            : 'Click the animated sun to start voice transmission'
        }
      >
        {/* The Animated Spinning Sun */}
        <SpinningSun
          state={state}
          audioLevel={audioLevel}
          size={360}
        />

        {/* Center Futuristic Core HUD */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
          {state === 'listening' ? (
            <div className="flex flex-col items-center gap-1.5 drop-shadow-md">
              <motion.div
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 0.75 }}
                className="w-12 h-12 rounded-full bg-neutral-950/90 border flex items-center justify-center shadow-lg"
                style={{ borderColor: theme.primary }}
              >
                <Mic className="w-6 h-6 stroke-[2.5]" style={{ color: theme.accent }} />
              </motion.div>
              <span 
                className="text-[11px] font-extrabold tracking-widest uppercase font-mono text-neutral-950 px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: theme.primary,
                  boxShadow: `0 0 12px ${theme.primary}`,
                }}
              >
                LISTENING
              </span>
              <span 
                className="text-[9px] font-mono text-neutral-900 px-1.5 py-0.2 rounded font-bold"
                style={{ backgroundColor: `rgba(${theme.primaryRgb}, 0.8)` }}
              >
                AUTO-SENDS ON PAUSE
              </span>
            </div>
          ) : state === 'processing' ? (
            <div className="flex flex-col items-center gap-1.5 drop-shadow-md">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                className="w-12 h-12 rounded-full bg-neutral-950/90 border flex items-center justify-center shadow-lg"
                style={{ borderColor: theme.primary }}
              >
                <Sparkles className="w-6 h-6 stroke-[2.5]" style={{ color: theme.accent }} />
              </motion.div>
              <span 
                className="text-[11px] font-extrabold tracking-widest uppercase font-mono text-neutral-950 px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: theme.primary,
                  boxShadow: `0 0 12px ${theme.primary}`,
                }}
              >
                COMPUTING
              </span>
            </div>
          ) : state === 'speaking' ? (
            /* PROMINENT HIGH-TECH INTERRUPT TARGET WHEN SUNFYER IS VOCALIZING */
            <div className="flex flex-col items-center gap-1 drop-shadow-lg">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className="w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center shadow-lg"
                style={{
                  backgroundColor: theme.secondary,
                  borderColor: theme.accent,
                  boxShadow: `0 0 30px ${theme.glow}`,
                }}
              >
                <Zap className="w-6 h-6 text-neutral-950 fill-neutral-950" />
              </motion.div>
              <span 
                className="text-[10px] font-black tracking-widest uppercase font-mono text-neutral-950 px-3 py-0.5 rounded-full"
                style={{
                  backgroundColor: theme.primary,
                  boxShadow: `0 0 15px ${theme.glow}`,
                }}
              >
                ⚡ TAP TO INTERRUPT
              </span>
              <span 
                className="text-[9px] font-mono text-neutral-900 font-bold px-1.5 rounded"
                style={{ backgroundColor: `rgba(${theme.primaryRgb}, 0.9)` }}
              >
                OR PRESS SPACEBAR
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 transition-transform duration-200 group-hover:scale-110">
              <span 
                className="text-sm font-mono font-black tracking-[0.25em] text-neutral-950 uppercase drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]"
              >
                SUNFYER
              </span>
              <span 
                className="text-[10px] font-mono tracking-wider font-bold text-neutral-900 uppercase px-2 py-0.5 rounded-full border backdrop-blur-xs"
                style={{
                  backgroundColor: `rgba(${theme.primaryRgb}, 0.4)`,
                  borderColor: `rgba(${theme.primaryRgb}, 0.5)`,
                }}
              >
                TAP TO TALK
              </span>
            </div>
          )}
        </div>

        {/* Hands-Free indicator badge */}
        {isHandsFree && (
          <div
            className="absolute bottom-12 right-12 z-30 px-2 py-0.5 rounded-full bg-neutral-950 border font-mono text-[9px] font-bold tracking-tight shadow-md flex items-center gap-1"
            style={{
              borderColor: theme.primary,
              color: theme.accent,
            }}
            title="Hands-free auto-detect listening active"
          >
            <span 
              className="w-1.5 h-1.5 rounded-full animate-ping"
              style={{ backgroundColor: theme.primary }}
            />
            <span>VAD AUTO</span>
          </div>
        )}
      </motion.button>

      {/* State caption & instruction text with futuristic telemetry cues */}
      <div className="mt-5 flex flex-col items-center text-center z-10 font-mono">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: theme.primary }}
          />
          <span className="text-xs tracking-wider text-neutral-300 uppercase font-semibold">
            {state === 'listening'
              ? 'Vocal Sensors Active • Pause Speech to Auto-Transmit'
              : state === 'processing'
              ? 'Synthesizing Solar Core Neural Stream...'
              : state === 'speaking'
              ? 'Vocalizing Transmission • Tap Sun or Press Space to Interrupt'
              : 'Click Solar Orb or Press Spacebar to Speak'}
          </span>
        </div>
      </div>
    </div>
  );
};
