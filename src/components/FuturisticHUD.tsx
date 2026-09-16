import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VoiceState, CustomizationSettings } from '../types';
import {
  ShieldCheck,
  Zap,
  Radio,
  Volume2,
  Cpu,
  Activity,
  CornerDownLeft,
  Globe,
  Sliders,
} from 'lucide-react';
import { THEMES } from '../utils/theme';

interface FuturisticHUDProps {
  voiceState: VoiceState;
  audioLevel: number;
  interimTranscript: string;
  autoSendCountdown: number | null;
  isSpeaking: boolean;
  isHandsFree: boolean;
  onInterrupt: () => void;
  onSendNow: () => void;
  onToggleHandsFree: () => void;
  isDeepSearch?: boolean;
  onToggleDeepSearch?: () => void;
  persona: string;
  onOpenUpdate?: () => void;
  customization?: CustomizationSettings;
  onOpenCustomization?: () => void;
}

export const FuturisticHUD: React.FC<FuturisticHUDProps> = ({
  voiceState,
  audioLevel,
  interimTranscript,
  autoSendCountdown,
  isSpeaking,
  isHandsFree,
  onInterrupt,
  onSendNow,
  onToggleHandsFree,
  isDeepSearch = false,
  onToggleDeepSearch,
  persona,
  onOpenUpdate,
  customization,
  onOpenCustomization,
}) => {
  const theme = THEMES[customization?.colorTheme || 'solar'] || THEMES.solar;
  const showHUD = customization?.showHUD ?? true;
  const density = customization?.hudDensity ?? 'balanced';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pointer-events-none select-none">
      {/* Top Futuristic Telemetry Grid */}
      {showHUD && (
        <div className={`grid gap-2.5 mb-4 text-[11px] font-mono ${
          density === 'minimal' 
            ? 'grid-cols-2 sm:grid-cols-3' 
            : density === 'balanced'
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
        }`}>
          {/* Module 1: Neural Engine & EXE Version (Clickable to Update) */}
          <button
            type="button"
            onClick={onOpenUpdate}
            className="pointer-events-auto text-left relative p-2.5 rounded-xl bg-[#0a0a0f]/80 hover:bg-[#151522] border backdrop-blur-md flex items-center gap-2.5 overflow-hidden group transition-all cursor-pointer"
            style={{
              borderColor: `rgba(${theme.primaryRgb}, 0.25)`,
              boxShadow: `0 0 15px -5px ${theme.glow}`,
            }}
            title="Click to check for Sunfyer.exe updates or run auto-updater"
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: theme.primary }} />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: theme.primary }} />
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: `rgba(${theme.primaryRgb}, 0.1)`,
                borderColor: `rgba(${theme.primaryRgb}, 0.3)`,
              }}
            >
              <Cpu className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" style={{ color: theme.accent }} />
            </div>
            <div className="overflow-hidden w-full">
              <div className="text-[9px] uppercase tracking-wider text-neutral-500 flex items-center justify-between">
                <span>Neural Engine</span>
                <span className="text-[8px] font-bold group-hover:underline" style={{ color: theme.primary }}>UPDATE</span>
              </div>
              <div className="font-bold text-neutral-200 truncate flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }} />
                <span>v4.2 &bull; {persona.toUpperCase()}</span>
              </div>
            </div>
          </button>

          {/* Module 2: Deep Research Engine (Clickable) */}
          <button
            type="button"
            onClick={onToggleDeepSearch}
            className={`pointer-events-auto text-left relative p-2.5 rounded-xl backdrop-blur-md transition-all cursor-pointer flex items-center gap-2.5 overflow-hidden border ${
              isDeepSearch
                ? 'bg-cyan-500/15 border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                : 'bg-[#0a0a0f]/80 hover:bg-[#121218] border-neutral-800'
            }`}
            title="Toggle Deep Research & Live Web Grounding"
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400" />
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isDeepSearch ? 'bg-cyan-400/20 border border-cyan-400/50' : 'bg-neutral-800/60 border border-neutral-700/50'
            }`}>
              <Globe className={`w-3.5 h-3.5 ${isDeepSearch ? 'text-cyan-300' : 'text-neutral-400'}`} />
            </div>
            <div className="overflow-hidden">
              <div className="text-[9px] uppercase tracking-wider text-neutral-500">Deep Research</div>
              <div className={`font-bold truncate ${isDeepSearch ? 'text-cyan-300' : 'text-neutral-400'}`}>
                {isDeepSearch ? 'ENGAGED (WEB LIVE)' : 'STANDBY [OFF]'}
              </div>
            </div>
          </button>

          {/* Module 3: VAD Auto-Dispatch */}
          <div 
            className="relative p-2.5 rounded-xl bg-[#0a0a0f]/80 border backdrop-blur-md flex items-center gap-2.5 overflow-hidden"
            style={{ borderColor: `rgba(${theme.primaryRgb}, 0.2)` }}
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: theme.primary }} />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: theme.primary }} />
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: `rgba(${theme.primaryRgb}, 0.1)`,
                borderColor: `rgba(${theme.primaryRgb}, 0.3)`,
              }}
            >
              <Activity className="w-3.5 h-3.5" style={{ color: theme.accent }} />
            </div>
            <div className="overflow-hidden">
              <div className="text-[9px] uppercase tracking-wider text-neutral-500">VAD Auto-Dispatch</div>
              <div className="font-bold truncate" style={{ color: theme.primary }}>
                {autoSendCountdown !== null ? `TX IN ${autoSendCountdown}s` : 'SILENCE DETECT: ON'}
              </div>
            </div>
          </div>

          {/* Module 4: Hands-Free Auto Sensor (Clickable) */}
          <button
            type="button"
            onClick={onToggleHandsFree}
            className={`pointer-events-auto text-left relative p-2.5 rounded-xl backdrop-blur-md transition-all cursor-pointer flex items-center gap-2.5 overflow-hidden border ${
              isHandsFree
                ? 'border-yellow-400/50 bg-yellow-400/15 shadow-[0_0_20px_rgba(250,204,21,0.2)]'
                : 'bg-[#0a0a0f]/80 hover:bg-[#121218] border-neutral-800'
            }`}
            title="Toggle Continuous Hands-Free Listening"
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: theme.primary }} />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: theme.primary }} />
            <div className="w-7 h-7 rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center shrink-0">
              <Radio className={`w-3.5 h-3.5 ${isHandsFree ? 'text-yellow-400 animate-pulse' : 'text-neutral-400'}`} />
            </div>
            <div className="overflow-hidden">
              <div className="text-[9px] uppercase tracking-wider text-neutral-500">Hands-Free Loop</div>
              <div className={`font-bold truncate ${isHandsFree ? 'text-yellow-300' : 'text-neutral-400'}`}>
                {isHandsFree ? 'ACTIVE [VAD]' : 'OFF [MANUAL]'}
              </div>
            </div>
          </button>

          {/* Extra Modules for Dense HUD Mode */}
          {density === 'dense' && (
            <>
              {/* Module 5: Echo Suppression Shield */}
              <div className="relative p-2.5 rounded-xl bg-[#0a0a0f]/80 border border-neutral-800 backdrop-blur-md flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[9px] uppercase tracking-wider text-neutral-500">Echo Shield</div>
                  <div className="font-bold text-cyan-300 truncate">
                    {isSpeaking ? 'MUTED' : 'FILTERED'}
                  </div>
                </div>
              </div>

              {/* Module 6: Theme & Customizer Quick Trigger */}
              <button
                type="button"
                onClick={onOpenCustomization}
                className="pointer-events-auto text-left relative p-2.5 rounded-xl bg-[#0a0a0f]/80 hover:bg-[#151522] border backdrop-blur-md flex items-center gap-2.5 overflow-hidden transition-all cursor-pointer group"
                style={{ borderColor: `rgba(${theme.primaryRgb}, 0.3)` }}
                title="Open Interface Customization"
              >
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `rgba(${theme.primaryRgb}, 0.1)`,
                    borderColor: `rgba(${theme.primaryRgb}, 0.3)`,
                  }}
                >
                  <Sliders className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" style={{ color: theme.primary }} />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[9px] uppercase tracking-wider text-neutral-500">Spectrum</div>
                  <div className="font-bold truncate" style={{ color: theme.accent }}>
                    {theme.name}
                  </div>
                </div>
              </button>
            </>
          )}
        </div>
      )}

      {/* Floating Active Voice Banner: Either User Talking (with VAD Countdown) or AI Vocalizing (with Interrupt Button) */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="mb-4 p-3 rounded-2xl bg-[#120e03]/90 border backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 pointer-events-auto"
            style={{
              borderColor: theme.secondary,
              boxShadow: `0 0 30px ${theme.glow}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="relative w-9 h-9 rounded-xl border flex items-center justify-center"
                style={{
                  backgroundColor: `rgba(${theme.primaryRgb}, 0.2)`,
                  borderColor: theme.primary,
                }}
              >
                <Volume2 className="w-4 h-4 animate-pulse" style={{ color: theme.accent }} />
                <span className="absolute inset-0 rounded-xl border animate-ping opacity-60" style={{ borderColor: theme.primary }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wide" style={{ color: theme.accent }}>
                    Sunfyer Vocalizing Response
                  </span>
                  <span 
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: `rgba(${theme.primaryRgb}, 0.2)`,
                      borderColor: `rgba(${theme.primaryRgb}, 0.3)`,
                      color: theme.accent,
                    }}
                  >
                    Microphone Muted (Zero Feedback)
                  </span>
                </div>
                <div className="text-[11px] font-mono text-neutral-400">
                  Tap the solar orb, press <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-200">Space</kbd> or click Interrupt
                </div>
              </div>
            </div>

            {/* High-Tech Interrupt Button */}
            <button
              id="hud-interrupt-speech-btn"
              type="button"
              onClick={onInterrupt}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-neutral-950 font-mono text-xs font-black tracking-wider uppercase transition-all cursor-pointer hover:scale-105 active:scale-95"
              style={{
                backgroundColor: theme.primary,
                boxShadow: `0 0 20px ${theme.glow}`,
              }}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Interrupt / Override</span>
            </button>
          </motion.div>
        )}

        {voiceState === 'listening' && (interimTranscript || autoSendCountdown !== null) && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="mb-4 p-3.5 rounded-2xl bg-[#090b12]/95 border backdrop-blur-xl pointer-events-auto"
            style={{
              borderColor: theme.primary,
              boxShadow: `0 0 35px ${theme.glow}`,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span 
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" 
                    style={{ backgroundColor: theme.primary }}
                  />
                  <span 
                    className="relative inline-flex rounded-full h-3 w-3"
                    style={{ backgroundColor: theme.primary }}
                  />
                </span>
                <span className="text-xs font-mono font-bold tracking-wider uppercase" style={{ color: theme.accent }}>
                  Vocal Stream Detected
                </span>
                {autoSendCountdown !== null && (
                  <span 
                    className="text-[11px] font-mono font-bold text-neutral-950 px-2 py-0.5 rounded-md shadow-sm animate-pulse"
                    style={{ backgroundColor: theme.primary }}
                  >
                    Auto-Sending in {autoSendCountdown}s
                  </span>
                )}
              </div>

              {/* Instant Send Now Button */}
              <button
                type="button"
                onClick={onSendNow}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-xs font-semibold transition-all cursor-pointer shrink-0"
                style={{
                  backgroundColor: `rgba(${theme.primaryRgb}, 0.2)`,
                  borderColor: `rgba(${theme.primaryRgb}, 0.6)`,
                  color: theme.accent,
                }}
              >
                <span>Send Now</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Live Transcript Content */}
            <div className="px-3 py-2 rounded-xl bg-black/60 border border-neutral-800 text-sm text-neutral-100 font-mono italic mb-2.5 break-words">
              "{interimTranscript || 'Listening for speech...'}"
            </div>

            {/* Auto-Dispatch Progress Bar */}
            {autoSendCountdown !== null && (
              <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden border border-neutral-800">
                <motion.div
                  className="h-full shadow-md"
                  style={{
                    background: `linear-gradient(to right, ${theme.secondary}, ${theme.primary})`,
                  }}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: autoSendCountdown, ease: 'linear' }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
