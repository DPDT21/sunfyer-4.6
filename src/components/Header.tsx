import React from 'react';
import {
  Sun,
  Settings,
  Volume2,
  VolumeX,
  Trash2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Download,
  RefreshCw,
  Globe,
  Palette,
} from 'lucide-react';
import { AssistantPersona, CustomizationSettings } from '../types';
import { THEMES } from '../utils/theme';

interface HeaderProps {
  persona: AssistantPersona;
  onSelectPersona: (p: AssistantPersona) => void;
  viewMode: 'orb' | 'chat';
  onToggleViewMode: (mode: 'orb' | 'chat') => void;
  soundFx: boolean;
  onToggleSoundFx: () => void;
  deepSearch: boolean;
  onToggleDeepSearch: () => void;
  onOpenSettings: () => void;
  onOpenDownload?: () => void;
  onOpenUpdate?: () => void;
  onOpenCustomization?: () => void;
  onOpenHomePanel?: () => void;
  onClearHistory: () => void;
  messageCount: number;
  customization?: CustomizationSettings;
}

export const Header: React.FC<HeaderProps> = ({
  persona,
  onSelectPersona,
  viewMode,
  onToggleViewMode,
  soundFx,
  onToggleSoundFx,
  deepSearch,
  onToggleDeepSearch,
  onOpenSettings,
  onOpenDownload,
  onOpenUpdate,
  onOpenCustomization,
  onOpenHomePanel,
  onClearHistory,
  messageCount,
  customization,
}) => {
  const theme = THEMES[customization?.colorTheme || 'solar'] || THEMES.solar;

  return (
    <header className="w-full border-b border-neutral-800/80 bg-[#08080b]/90 backdrop-blur-md px-4 sm:px-6 py-3 sticky top-0 z-30 flex items-center justify-between gap-4">
      {/* Sun in the corner on the left: Solar Home Panel Trigger */}
      <button
        id="header-home-panel-btn"
        type="button"
        onClick={onOpenHomePanel}
        className="group flex items-center gap-3 text-left cursor-pointer transition-all hover:opacity-95 focus:outline-none"
        title="Sunfyer Home Panel: Click for Customize, PC App Download, Auto-Update & Settings"
      >
        <div 
          className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-900 border shadow-md group-hover:scale-105 transition-all"
          style={{
            borderColor: `rgba(${theme.primaryRgb}, 0.5)`,
            boxShadow: `0 0 20px -2px ${theme.glow}`,
          }}
        >
          <Sun className="w-5 h-5 animate-spin-slow group-hover:rotate-45 transition-transform" style={{ color: theme.primary }} />
          <span 
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: theme.primary, boxShadow: `0 0 10px ${theme.primary}` }}
          />
          <span 
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full animate-ping opacity-75"
            style={{ backgroundColor: theme.primary }}
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-wider text-neutral-100 font-sans flex items-center gap-1.5 group-hover:text-white">
              <span>SUNFYER</span>
              <span
                className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border flex items-center gap-1 transition-all group-hover:scale-105"
                style={{
                  backgroundColor: `rgba(${theme.primaryRgb}, 0.15)`,
                  color: theme.accent,
                  borderColor: `rgba(${theme.primaryRgb}, 0.4)`,
                }}
              >
                <span>HOME</span>
              </span>
            </h1>
          </div>
          <p className="text-[11px] font-mono text-neutral-400 hidden sm:flex items-center gap-1 group-hover:text-neutral-300">
            <span>Home Panel &bull; Customize &bull; PC App</span>
          </p>
        </div>
      </button>

      {/* Middle Persona Pills */}
      <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-neutral-900/80 border border-neutral-800">
        <button
          type="button"
          onClick={() => onSelectPersona('core')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
            persona === 'core'
              ? 'bg-yellow-400/15 border border-yellow-400/50 text-yellow-300 font-semibold shadow-[0_0_10px_rgba(250,204,21,0.15)]'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
          title="Solar Core: Balanced, articulate, radiant reasoning"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Core</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectPersona('radiant_coder')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
            persona === 'radiant_coder'
              ? 'bg-yellow-400/15 border border-yellow-400/50 text-yellow-300 font-semibold shadow-[0_0_10px_rgba(250,204,21,0.15)]'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
          title="Radiant Coder: Optimal algorithms and clean architectures"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Coder</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectPersona('creative_flare')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
            persona === 'creative_flare'
              ? 'bg-yellow-400/15 border border-yellow-400/50 text-yellow-300 font-semibold shadow-[0_0_10px_rgba(250,204,21,0.15)]'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
          title="Creative Flare: Expansive metaphorical thinking"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Creative</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectPersona('ultra_concise')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
            persona === 'ultra_concise'
              ? 'bg-yellow-400/15 border border-yellow-400/50 text-yellow-300 font-semibold shadow-[0_0_10px_rgba(250,204,21,0.15)]'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
          title="Ultra Concise: Direct, zero filler answers"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Concise</span>
        </button>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2">
        {/* Deep Research Grounding Toggle */}
        <button
          id="header-deepsearch-toggle"
          type="button"
          onClick={onToggleDeepSearch}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
            deepSearch
              ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/40'
          }`}
          title={deepSearch ? 'Deep Research: ACTIVE (Web Grounded)' : 'Deep Research: STANDBY (Click to activate)'}
        >
          <Globe className={`w-3.5 h-3.5 ${deepSearch ? 'text-cyan-300' : 'text-neutral-400'}`} />
          <span className="hidden sm:inline">Deep Research</span>
          {deepSearch ? (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          ) : (
            <span className="text-[10px] text-neutral-500 hidden md:inline">OFF</span>
          )}
        </button>

        {/* View Mode Switcher */}
        <div className="flex items-center p-0.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => onToggleViewMode('orb')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              viewMode === 'orb'
                ? 'font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            style={viewMode === 'orb' ? { backgroundColor: theme.primary, color: '#000' } : {}}
            title="Solar Voice Orb focus"
          >
            Orb
          </button>
          <button
            type="button"
            onClick={() => onToggleViewMode('chat')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              viewMode === 'chat'
                ? 'font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            style={viewMode === 'chat' ? { backgroundColor: theme.primary, color: '#000' } : {}}
            title="Conversation Stream log"
          >
            Chat {messageCount > 0 && `(${messageCount})`}
          </button>
        </div>

        {/* Customize UI Button */}
        {onOpenCustomization && (
          <button
            id="header-customize-btn"
            type="button"
            onClick={onOpenCustomization}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 border hover:border-yellow-400 text-neutral-300 hover:text-yellow-300 text-xs font-mono transition-all cursor-pointer"
            style={{ borderColor: `rgba(${theme.primaryRgb}, 0.3)` }}
            title="Customize Interface (Theme, HUD, Solar Orb)"
          >
            <Palette className="w-3.5 h-3.5" style={{ color: theme.primary }} />
            <span className="hidden md:inline">Customize</span>
          </button>
        )}

        {/* Download Windows .EXE button */}
        {onOpenDownload && (
          <button
            id="header-download-exe-btn"
            type="button"
            onClick={onOpenDownload}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-neutral-950 text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
            style={{ backgroundColor: theme.primary }}
            title="Download Sunfyer PC App & .EXE"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">PC App</span>
          </button>
        )}

        {/* Update EXE button */}
        {onOpenUpdate && (
          <button
            id="header-update-exe-btn"
            type="button"
            onClick={onOpenUpdate}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 border hover:bg-neutral-800 text-xs font-mono font-semibold transition-all cursor-pointer"
            style={{
              borderColor: `rgba(${theme.primaryRgb}, 0.4)`,
              color: theme.accent,
            }}
            title="Check for Sunfyer updates & auto-update"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Update</span>
          </button>
        )}

        {/* Audio Chimes Sound FX Button */}
        <button
          id="header-soundfx-toggle"
          type="button"
          onClick={onToggleSoundFx}
          className="p-2 rounded-lg border transition-all cursor-pointer bg-neutral-900"
          style={{
            borderColor: soundFx ? `rgba(${theme.primaryRgb}, 0.4)` : '#262626',
            color: soundFx ? theme.primary : '#737373',
          }}
          title={soundFx ? 'Chime sound effects: ON' : 'Chime sound effects: OFF'}
        >
          {soundFx ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Settings button */}
        <button
          id="header-settings-btn"
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-yellow-400/40 text-neutral-400 hover:text-yellow-400 transition-all cursor-pointer"
          title="Voice and Solar settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Clear chat history */}
        {messageCount > 0 && (
          <button
            id="header-clear-btn"
            type="button"
            onClick={onClearHistory}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-red-500/40 text-neutral-500 hover:text-red-400 transition-all cursor-pointer"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
