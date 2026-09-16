import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  X,
  Palette,
  Download,
  RefreshCw,
  Sliders,
  Sparkles,
  Globe,
  Mic,
  Volume2,
  VolumeX,
  Trash2,
  Monitor,
  Check,
  ChevronRight,
  ShieldCheck,
  Zap,
  Terminal,
  Activity,
  Layers,
  Cpu,
} from 'lucide-react';
import {
  AssistantPersona,
  CustomizationSettings,
  ColorTheme,
} from '../types';
import { THEMES } from '../utils/theme';
import { playSolarTone } from '../utils/audio';
import { downloadSunfyerExe } from '../utils/desktopAppAssets';

interface HomePanelProps {
  isOpen: boolean;
  onClose: () => void;
  persona: AssistantPersona;
  onSelectPersona: (p: AssistantPersona) => void;
  customization: CustomizationSettings;
  onUpdateTheme: (themeId: ColorTheme) => void;
  onOpenCustomization: () => void;
  onOpenDownload: () => void;
  onOpenUpdate: () => void;
  onOpenVoiceSettings: () => void;
  onClearHistory: () => void;
  messageCount: number;
  deepSearch: boolean;
  onToggleDeepSearch: () => void;
  handsFree: boolean;
  onToggleHandsFree: () => void;
  soundFx: boolean;
  onToggleSoundFx: () => void;
  appVersion: string;
}

export const HomePanel: React.FC<HomePanelProps> = ({
  isOpen,
  onClose,
  persona,
  onSelectPersona,
  customization,
  onUpdateTheme,
  onOpenCustomization,
  onOpenDownload,
  onOpenUpdate,
  onOpenVoiceSettings,
  onClearHistory,
  messageCount,
  deepSearch,
  onToggleDeepSearch,
  handsFree,
  onToggleHandsFree,
  soundFx,
  onToggleSoundFx,
  appVersion,
}) => {
  const currentTheme = THEMES[customization.colorTheme] || THEMES.solar;

  const colorThemesList: Array<{ id: ColorTheme; name: string; color: string; rgb: string }> = [
    { id: 'solar', name: 'Solar Gold', color: '#FACC15', rgb: '250, 204, 21' },
    { id: 'supernova', name: 'Supernova', color: '#FB923C', rgb: '251, 146, 60' },
    { id: 'plasma', name: 'Plasma Cyan', color: '#38BDF8', rgb: '56, 189, 248' },
    { id: 'emerald', name: 'Emerald', color: '#4ADE80', rgb: '74, 222, 128' },
    { id: 'crimson', name: 'Crimson', color: '#F87171', rgb: '248, 113, 113' },
    { id: 'eclipse', name: 'Eclipse', color: '#C084FC', rgb: '192, 132, 252' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-start p-2 sm:p-4 md:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Home Panel Drawer/Card anchored from top-left */}
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0a0a0f]/95 border shadow-2xl overflow-hidden backdrop-blur-xl"
            style={{
              borderColor: `rgba(${currentTheme.primaryRgb}, 0.35)`,
              boxShadow: `0 0 50px -10px ${currentTheme.glow}`,
            }}
          >
            {/* Holographic corner accents */}
            <div
              className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 pointer-events-none"
              style={{ borderColor: currentTheme.primary }}
            />
            <div
              className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 pointer-events-none"
              style={{ borderColor: currentTheme.primary }}
            />
            <div
              className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 pointer-events-none"
              style={{ borderColor: currentTheme.primary }}
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 pointer-events-none"
              style={{ borderColor: currentTheme.primary }}
            />

            {/* Panel Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b bg-neutral-900/60"
              style={{ borderColor: `rgba(${currentTheme.primaryRgb}, 0.2)` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-black border shadow-lg"
                  style={{
                    borderColor: currentTheme.primary,
                    boxShadow: `0 0 20px -3px ${currentTheme.glow}`,
                  }}
                >
                  <Sun className="w-5 h-5 animate-spin-slow" style={{ color: currentTheme.primary }} />
                  <span
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-ping"
                    style={{ backgroundColor: currentTheme.primary }}
                  />
                  <span
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: currentTheme.primary }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold tracking-wider text-neutral-100 font-sans">
                      SUNFYER HOME PANEL
                    </h2>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
                      style={{
                        backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.15)`,
                        borderColor: `rgba(${currentTheme.primaryRgb}, 0.35)`,
                        color: currentTheme.accent,
                      }}
                    >
                      v{appVersion}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-400">
                    Solar Command Hub &bull; PC App &bull; Customizer
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Close Home Panel (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Core Feature Hub Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. INSTALL PC APP CARD */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDownload();
                  }}
                  className="flex flex-col text-left p-4 rounded-xl border bg-gradient-to-br from-neutral-900/90 to-black hover:border-yellow-400/80 transition-all duration-200 group cursor-pointer relative overflow-hidden"
                  style={{
                    borderColor: `rgba(${currentTheme.primaryRgb}, 0.3)`,
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-24 h-24 blur-2xl opacity-15 pointer-events-none rounded-full"
                    style={{ backgroundColor: currentTheme.primary }}
                  />
                  <div className="flex items-center justify-between w-full mb-2">
                    <div
                      className="p-2 rounded-lg bg-neutral-800/80 border group-hover:scale-110 transition-transform"
                      style={{
                        borderColor: `rgba(${currentTheme.primaryRgb}, 0.4)`,
                        color: currentTheme.primary,
                      }}
                    >
                      <Monitor className="w-5 h-5" />
                    </div>
                    <span
                      className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: currentTheme.primary,
                        color: '#000',
                      }}
                    >
                      Windows App
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-neutral-100 group-hover:text-white flex items-center justify-between">
                    <span>Install PC App</span>
                    <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Download verified <strong>Sunfyer.exe</strong>, 1-click installer, and desktop shortcut for Windows.
                  </p>
                </button>

                {/* 2. CUSTOMIZE INTERFACE CARD */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCustomization();
                  }}
                  className="flex flex-col text-left p-4 rounded-xl border bg-gradient-to-br from-neutral-900/90 to-black hover:border-yellow-400/80 transition-all duration-200 group cursor-pointer relative overflow-hidden"
                  style={{
                    borderColor: `rgba(${currentTheme.primaryRgb}, 0.3)`,
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-24 h-24 blur-2xl opacity-15 pointer-events-none rounded-full"
                    style={{ backgroundColor: currentTheme.primary }}
                  />
                  <div className="flex items-center justify-between w-full mb-2">
                    <div
                      className="p-2 rounded-lg bg-neutral-800/80 border group-hover:scale-110 transition-transform"
                      style={{
                        borderColor: `rgba(${currentTheme.primaryRgb}, 0.4)`,
                        color: currentTheme.primary,
                      }}
                    >
                      <Palette className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                      {currentTheme.name}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-neutral-100 group-hover:text-white flex items-center justify-between">
                    <span>Customize Interface</span>
                    <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Adjust themes, solar orb styles, HUD telemetry density, and acoustic equalizer.
                  </p>
                </button>

                {/* 3. AUTO-UPDATE & HOT PATCH */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenUpdate();
                  }}
                  className="flex flex-col text-left p-4 rounded-xl border bg-gradient-to-br from-neutral-900/90 to-black hover:border-yellow-400/80 transition-all duration-200 group cursor-pointer"
                  style={{
                    borderColor: `rgba(${currentTheme.primaryRgb}, 0.3)`,
                  }}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div
                      className="p-2 rounded-lg bg-neutral-800/80 border group-hover:scale-110 transition-transform"
                      style={{
                        borderColor: `rgba(${currentTheme.primaryRgb}, 0.4)`,
                        color: currentTheme.primary,
                      }}
                    >
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      v{appVersion}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-neutral-100 group-hover:text-white flex items-center justify-between">
                    <span>Auto-Updater Hub</span>
                    <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Perform instant in-app hot patching, verify binary integrity, or download updater script.
                  </p>
                </button>

                {/* 4. VOICE & NEURAL SETTINGS */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenVoiceSettings();
                  }}
                  className="flex flex-col text-left p-4 rounded-xl border bg-gradient-to-br from-neutral-900/90 to-black hover:border-yellow-400/80 transition-all duration-200 group cursor-pointer"
                  style={{
                    borderColor: `rgba(${currentTheme.primaryRgb}, 0.3)`,
                  }}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div
                      className="p-2 rounded-lg bg-neutral-800/80 border group-hover:scale-110 transition-transform"
                      style={{
                        borderColor: `rgba(${currentTheme.primaryRgb}, 0.4)`,
                        color: currentTheme.primary,
                      }}
                    >
                      <Sliders className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                      Echo Shield ON
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-neutral-100 group-hover:text-white flex items-center justify-between">
                    <span>Voice & Acoustic Calibration</span>
                    <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Configure speech synthesis voices, pitch, rate, and barge-in sensitivity.
                  </p>
                </button>
              </div>

              {/* Quick Theme Color Picker */}
              <div
                className="p-4 rounded-xl border bg-neutral-900/40"
                style={{ borderColor: `rgba(${currentTheme.primaryRgb}, 0.2)` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-neutral-200">
                    <Palette className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
                    <span>Quick Color Spectrum</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Active: <strong style={{ color: currentTheme.primary }}>{currentTheme.name}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {colorThemesList.map((t) => {
                    const isSelected = customization.colorTheme === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          onUpdateTheme(t.id);
                          if (soundFx) playSolarTone('toggle', customization.audioVolume);
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-800 border-white text-white font-bold scale-105 shadow-md'
                            : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full mb-1 shadow-sm"
                          style={{
                            backgroundColor: t.color,
                            boxShadow: isSelected ? `0 0 10px ${t.color}` : 'none',
                          }}
                        />
                        <span className="text-[10px] font-mono">{t.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Neural Persona Switcher */}
              <div
                className="p-4 rounded-xl border bg-neutral-900/40"
                style={{ borderColor: `rgba(${currentTheme.primaryRgb}, 0.2)` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-neutral-200">
                    <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
                    <span>Assistant Persona</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Select reasoning archetype
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'core' as const, label: 'Solar Core', icon: <Sparkles className="w-3.5 h-3.5" />, desc: 'Balanced' },
                    { id: 'radiant_coder' as const, label: 'Radiant Coder', icon: <Cpu className="w-3.5 h-3.5" />, desc: 'Code' },
                    { id: 'creative_flare' as const, label: 'Creative Flare', icon: <Zap className="w-3.5 h-3.5" />, desc: 'Creative' },
                    { id: 'ultra_concise' as const, label: 'Ultra Concise', icon: <Layers className="w-3.5 h-3.5" />, desc: 'Direct' },
                  ].map((p) => {
                    const isSelected = persona === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          onSelectPersona(p.id);
                          if (soundFx) playSolarTone('toggle', customization.audioVolume);
                        }}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'font-bold shadow-md'
                            : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                        }`}
                        style={
                          isSelected
                            ? {
                                backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.2)`,
                                borderColor: currentTheme.primary,
                                color: currentTheme.accent,
                              }
                            : {}
                        }
                      >
                        <div className="mb-1" style={{ color: isSelected ? currentTheme.primary : undefined }}>
                          {p.icon}
                        </div>
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Feature Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Deep Research Grounding */}
                <button
                  type="button"
                  onClick={onToggleDeepSearch}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                    deepSearch
                      ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>Deep Research</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40">
                    {deepSearch ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* Hands-Free Voice Detection */}
                <button
                  type="button"
                  onClick={onToggleHandsFree}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                    handsFree
                      ? 'font-bold shadow-md'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                  style={
                    handsFree
                      ? {
                          backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.15)`,
                          borderColor: currentTheme.primary,
                          color: currentTheme.accent,
                        }
                      : {}
                  }
                >
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    <span>Hands-Free</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40">
                    {handsFree ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* Sound Chimes FX */}
                <button
                  type="button"
                  onClick={onToggleSoundFx}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                    soundFx
                      ? 'font-bold shadow-md'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                  style={
                    soundFx
                      ? {
                          backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.15)`,
                          borderColor: currentTheme.primary,
                          color: currentTheme.accent,
                        }
                      : {}
                  }
                >
                  <div className="flex items-center gap-2">
                    {soundFx ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    <span>Sound Chimes</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40">
                    {soundFx ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>

              {/* Direct Executable Download Button Banner */}
              <div
                className="p-4 rounded-xl border bg-gradient-to-r from-neutral-900 to-black flex items-center justify-between gap-3"
                style={{ borderColor: `rgba(${currentTheme.primaryRgb}, 0.3)` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-lg bg-black/80 border"
                    style={{ borderColor: currentTheme.primary, color: currentTheme.primary }}
                  >
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-100 flex items-center gap-2 font-mono">
                      <span>Sunfyer.exe Ready</span>
                      <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.2 rounded border border-green-500/30 font-sans">
                        Verified 64-bit
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      Standalone Windows executable with solar icon
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (soundFx) playSolarTone('click', customization.audioVolume);
                    downloadSunfyerExe();
                  }}
                  className="px-3.5 py-2 rounded-lg text-xs font-mono font-bold text-black transition-all shadow-md hover:scale-105 shrink-0 cursor-pointer"
                  style={{
                    backgroundColor: currentTheme.primary,
                    boxShadow: `0 0 15px ${currentTheme.glow}`,
                  }}
                >
                  Download .EXE
                </button>
              </div>
            </div>

            {/* Panel Footer */}
            <div
              className="flex items-center justify-between px-5 py-3 border-t bg-black/60 text-xs font-mono text-neutral-400"
              style={{ borderColor: `rgba(${currentTheme.primaryRgb}, 0.2)` }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>Neural Core: Online</span>
                {messageCount > 0 && <span>&bull; {messageCount} msgs</span>}
              </div>

              <div className="flex items-center gap-2">
                {messageCount > 0 && (
                  <button
                    type="button"
                    onClick={onClearHistory}
                    className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
