import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Gauge, 
  Type, 
  Volume2, 
  RotateCcw, 
  X, 
  Check, 
  Sliders, 
  Activity,
  Zap,
  RefreshCw
} from 'lucide-react';
import { 
  CustomizationSettings, 
  ColorTheme, 
  OrbStyle, 
  HudDensity, 
  PulseSpeed, 
  GlowIntensity, 
  FontScale, 
  FontFamily,
  AutoUpdateSettings
} from '../types';
import { THEMES } from '../utils/theme';
import { playSolarTone } from '../utils/audio';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CustomizationSettings;
  onUpdateSettings: (newSettings: Partial<CustomizationSettings>) => void;
  onResetDefaults?: () => void;
  autoUpdateSettings: AutoUpdateSettings;
  onUpdateAutoUpdateSettings: (newSettings: Partial<AutoUpdateSettings>) => void;
  onTriggerUpdateCheck?: () => void;
}

type TabKey = 'theme' | 'orb' | 'hud' | 'typography' | 'sound' | 'autoupdate';

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetDefaults,
  autoUpdateSettings,
  onUpdateAutoUpdateSettings,
  onTriggerUpdateCheck,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('theme');

  if (!isOpen) return null;

  const currentTheme = THEMES[settings.colorTheme] || THEMES.solar;

  const handleThemeChange = (themeId: ColorTheme) => {
    onUpdateSettings({ colorTheme: themeId });
    if (settings.soundEffects) {
      playSolarTone('toggle', settings.soundVolume);
    }
  };

  const handleOptionChange = <K extends keyof CustomizationSettings>(key: K, value: CustomizationSettings[K]) => {
    onUpdateSettings({ [key]: value });
    if (settings.soundEffects) {
      playSolarTone('click', settings.soundVolume);
    }
  };

  const tabs: { id: TabKey; label: string; icon: React.ReactNode }[] = [
    { id: 'theme', label: 'Color Spectrum', icon: <Palette className="w-4 h-4" /> },
    { id: 'orb', label: 'Solar Orb', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'hud', label: 'HUD Matrix', icon: <Gauge className="w-4 h-4" /> },
    { id: 'typography', label: 'Typography', icon: <Type className="w-4 h-4" /> },
    { id: 'sound', label: 'Audio Synthesizer', icon: <Volume2 className="w-4 h-4" /> },
    { id: 'autoupdate', label: 'Auto-Update', icon: <RefreshCw className="w-4 h-4" /> },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#0b0c10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          boxShadow: `0 0 50px -10px ${currentTheme.glow}`,
          borderColor: currentTheme.border,
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-xl"
              style={{ background: currentTheme.badgeBg, color: currentTheme.primary }}
            >
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white tracking-wide">
                Interface Customization
              </h2>
              <p className="text-xs text-white/50">
                Personalize themes, solar physics, holographic HUD, and runtime telemetry
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (settings.soundEffects) playSolarTone('click', settings.soundVolume);
              onClose();
            }}
            className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Close Customization"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 py-2.5 border-b border-white/10 bg-white/[0.02] overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (settings.soundEffects) playSolarTone('click', settings.soundVolume);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive 
                    ? 'text-black font-semibold shadow-sm' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                style={isActive ? {
                  backgroundColor: currentTheme.primary,
                  boxShadow: `0 0 12px ${currentTheme.glow}`
                } : undefined}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: THEME / COLOR SPECTRUM */}
          {activeTab === 'theme' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-white/90 mb-1">Stellar Color Spectrum</h3>
                <p className="text-xs text-white/50">Select your preferred quantum frequency palette</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(Object.keys(THEMES) as ColorTheme[]).map((themeKey) => {
                  const t = THEMES[themeKey];
                  const isSelected = settings.colorTheme === themeKey;
                  return (
                    <button
                      key={themeKey}
                      onClick={() => handleThemeChange(themeKey)}
                      className={`relative p-3.5 rounded-xl border text-left transition-all group overflow-hidden ${
                        isSelected 
                          ? 'border-white/40 bg-white/[0.08] shadow-lg' 
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                      style={isSelected ? {
                        borderColor: t.primary,
                        boxShadow: `0 0 20px -5px ${t.glow}`
                      } : undefined}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div 
                          className="w-7 h-7 rounded-full shadow-inner border border-white/20"
                          style={{ background: t.swatchGradient }}
                        />
                        {isSelected && (
                          <div 
                            className="p-1 rounded-full text-black"
                            style={{ backgroundColor: t.primary }}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="font-medium text-sm text-white">{t.name}</div>
                      <div className="text-[11px] text-white/50">{t.subtitle}</div>
                    </button>
                  );
                })}
              </div>

              {/* Background Glow Intensity */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-white/80">Ambient Nebula Glow</label>
                  <span className="text-xs text-white/40 uppercase">{settings.glowIntensity}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(['subtle', 'moderate', 'radiant', 'blinding'] as GlowIntensity[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => handleOptionChange('glowIntensity', g)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-medium capitalize border transition-all ${
                        settings.glowIntensity === g
                          ? 'text-white border-white/40 bg-white/10'
                          : 'text-white/60 border-white/10 hover:border-white/20'
                      }`}
                      style={settings.glowIntensity === g ? {
                        borderColor: currentTheme.primary,
                        color: currentTheme.primary,
                      } : undefined}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORB DYNAMICS */}
          {activeTab === 'orb' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-white/90 mb-1">Solar Core Dynamics</h3>
                <p className="text-xs text-white/50">Configure geometry and reaction physics of the central star</p>
              </div>

              {/* Orb Styles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'corona', name: 'Corona Radiant', desc: 'Concentric photon pulses with radiant aura' },
                  { id: 'pulsar', name: 'Nova Pulsar', desc: 'High-frequency relativistic energy rings' },
                  { id: 'quantum', name: 'Quantum Core', desc: 'Subatomic multi-layer electron orb' },
                  { id: 'shield', name: 'Plasma Aegis', desc: 'Geometric protective solar hexagonal shell' },
                  { id: 'cyber', name: 'Cybernetic Matrix', desc: 'Segmented orbital targeting compass' },
                ].map((style) => {
                  const isSelected = settings.orbStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => handleOptionChange('orbStyle', style.id as OrbStyle)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSelected 
                          ? 'border-white/40 bg-white/[0.08]' 
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                      style={isSelected ? {
                        borderColor: currentTheme.primary,
                        boxShadow: `0 0 15px -5px ${currentTheme.glow}`
                      } : undefined}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{style.name}</span>
                        {isSelected && (
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: currentTheme.primary }}
                          />
                        )}
                      </div>
                      <p className="text-xs text-white/50">{style.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Pulse Speed */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-white/80">Fusion Pulse Rate</label>
                  <span className="text-xs text-white/40 capitalize">{settings.pulseSpeed}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(['slow', 'balanced', 'turbo', 'hyper'] as PulseSpeed[]).map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleOptionChange('pulseSpeed', speed)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-medium capitalize border transition-all ${
                        settings.pulseSpeed === speed
                          ? 'text-white border-white/40 bg-white/10'
                          : 'text-white/60 border-white/10 hover:border-white/20'
                      }`}
                      style={settings.pulseSpeed === speed ? {
                        borderColor: currentTheme.primary,
                        color: currentTheme.primary,
                      } : undefined}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 flex flex-col gap-2">
                <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer">
                  <div>
                    <div className="text-xs font-medium text-white">Eruptive Solar Flares</div>
                    <div className="text-[11px] text-white/50">Dynamic arc loops discharging from the stellar surface</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.solarFlares}
                    onChange={(e) => handleOptionChange('solarFlares', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 text-yellow-500 focus:ring-0 focus:ring-offset-0 bg-black/40"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer">
                  <div>
                    <div className="text-xs font-medium text-white">Equalizer Waveform Ring</div>
                    <div className="text-[11px] text-white/50">Audio reactive spectrum bars around the central star</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showEqualizer}
                    onChange={(e) => handleOptionChange('showEqualizer', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 text-yellow-500 focus:ring-0 focus:ring-offset-0 bg-black/40"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: HUD & TELEMETRY */}
          {activeTab === 'hud' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-white/90 mb-1">Holographic HUD & Telemetry</h3>
                <p className="text-xs text-white/50">Control data density, reticle rings, and system readouts</p>
              </div>

              {/* Master HUD Toggle */}
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-white">Enable HUD Matrix</div>
                  <div className="text-xs text-white/50">Show real-time telemetry panels, CPU clocks, and solar indicators</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showHUD}
                  onChange={(e) => handleOptionChange('showHUD', e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 text-yellow-500 focus:ring-0 bg-black/40"
                />
              </label>

              {/* Density selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/80">HUD Matrix Density</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'minimal', title: 'Minimalist', desc: 'Reticle & vital status only' },
                    { id: 'balanced', title: 'Balanced', desc: 'Equalizer, core clock & telemetry' },
                    { id: 'dense', title: 'Full Matrix', desc: 'Comprehensive sci-fi holographic array' },
                  ].map((d) => {
                    const isSelected = settings.hudDensity === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => handleOptionChange('hudDensity', d.id as HudDensity)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected 
                            ? 'border-white/40 bg-white/[0.08]' 
                            : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                        }`}
                        style={isSelected ? {
                          borderColor: currentTheme.primary,
                          color: currentTheme.primary,
                        } : undefined}
                      >
                        <div className="text-xs font-medium text-white mb-0.5">{d.title}</div>
                        <div className="text-[11px] text-white/40 leading-tight">{d.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* HUD Modules */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer">
                  <div>
                    <div className="text-xs font-medium text-white">Rotating Coordinate Reticles</div>
                    <div className="text-[11px] text-white/50">360° circular degree compass and cardinal vectors</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showReticle}
                    onChange={(e) => handleOptionChange('showReticle', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 text-yellow-500 focus:ring-0 bg-black/40"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer">
                  <div>
                    <div className="text-xs font-medium text-white">Diagnostic Telemetry Readouts</div>
                    <div className="text-[11px] text-white/50">Solar flux, core Kelvin temp, and neural latency meters</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showTelemetry}
                    onChange={(e) => handleOptionChange('showTelemetry', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 text-yellow-500 focus:ring-0 bg-black/40"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer">
                  <div>
                    <div className="text-xs font-medium text-white">CRT Matrix Scanlines</div>
                    <div className="text-[11px] text-white/50">Subtle retro-futuristic holographic raster lines</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.crtScanlines}
                    onChange={(e) => handleOptionChange('crtScanlines', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 text-yellow-500 focus:ring-0 bg-black/40"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-white/90 mb-1">Typography & Visual Scaling</h3>
                <p className="text-xs text-white/50">Select interface typeface and reading proportions</p>
              </div>

              {/* Font Family */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/80">Font Family</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'space-grotesk', name: 'Space Grotesk', desc: 'Futuristic geometric neo-grotesque (Default)' },
                    { id: 'inter', name: 'Inter Display', desc: 'Ultra-clean, modern precision sans-serif' },
                    { id: 'jetbrains-mono', name: 'JetBrains Mono', desc: 'Technical monospace matrix coder style' },
                    { id: 'orbitron', name: 'Orbitron Cyber', desc: 'Sci-fi holographic cockpit typography' },
                  ].map((font) => {
                    const isSelected = settings.fontFamily === font.id;
                    return (
                      <button
                        key={font.id}
                        onClick={() => handleOptionChange('fontFamily', font.id as FontFamily)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected 
                            ? 'border-white/40 bg-white/[0.08]' 
                            : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                        }`}
                        style={isSelected ? {
                          borderColor: currentTheme.primary,
                          color: currentTheme.primary,
                        } : undefined}
                      >
                        <div className="text-xs font-medium text-white mb-0.5">{font.name}</div>
                        <div className="text-[11px] text-white/40">{font.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Scale */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <label className="text-xs font-medium text-white/80">Interface Scale</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['compact', 'balanced', 'spacious'] as FontScale[]).map((scale) => (
                    <button
                      key={scale}
                      onClick={() => handleOptionChange('fontScale', scale)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all ${
                        settings.fontScale === scale
                          ? 'text-white border-white/40 bg-white/10'
                          : 'text-white/60 border-white/10 hover:border-white/20'
                      }`}
                      style={settings.fontScale === scale ? {
                        borderColor: currentTheme.primary,
                        color: currentTheme.primary,
                      } : undefined}
                    >
                      {scale}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AUDIO SYNTHESIZER */}
          {activeTab === 'sound' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-white/90 mb-1">Acoustic Synthesizer</h3>
                <p className="text-xs text-white/50">Manage audio chimes, harmonic tones, and feedback</p>
              </div>

              {/* Master Sound Toggle */}
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-white">Sound Effects & Acoustic Tones</div>
                  <div className="text-xs text-white/50">Futuristic harmonic sine beeps for mic activation, auto-dispatch, and answers</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={(e) => handleOptionChange('soundEffects', e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 text-yellow-500 focus:ring-0 bg-black/40"
                />
              </label>

              {/* Volume Slider */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-white/60" />
                    <span className="text-xs font-medium text-white/80">Synthesizer Volume</span>
                  </div>
                  <span className="text-xs font-mono text-white/60">
                    {Math.round(settings.soundVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateSettings({ soundVolume: val });
                  }}
                  onMouseUp={() => playSolarTone('warp_chirp', settings.soundVolume)}
                  className="w-full accent-yellow-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/30">
                  <span>Mute</span>
                  <span>50%</span>
                  <span>Maximum</span>
                </div>
              </div>

              {/* Test Audio Chimes */}
              <div className="pt-2">
                <div className="text-xs font-medium text-white/80 mb-2">Audition Sound FX</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Uplink Ping', tone: 'listen_start' as const },
                    { label: 'Release Tone', tone: 'listen_stop' as const },
                    { label: 'Harmonic Bell', tone: 'response_start' as const },
                    { label: 'Sonar Radar', tone: 'research_pulse' as const },
                  ].map((s) => (
                    <button
                      key={s.tone}
                      onClick={() => playSolarTone(s.tone, settings.soundVolume)}
                      className="py-2 px-2.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs text-white/80 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3 h-3 text-yellow-400" />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AUTO-UPDATE TELEMETRY */}
          {activeTab === 'autoupdate' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-white/90 mb-1">Auto-Update Telemetry</h3>
                <p className="text-xs text-white/50">Automatic background release detection & hot-patching</p>
              </div>

              {/* Enabled toggle */}
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-white">Enable Auto-Update Checks</div>
                  <div className="text-xs text-white/50">Poll repository releases in the background without interrupting sessions</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoUpdateSettings.enabled}
                  onChange={(e) => onUpdateAutoUpdateSettings({ enabled: e.target.checked })}
                  className="w-5 h-5 rounded border-white/20 text-yellow-500 focus:ring-0 bg-black/40"
                />
              </label>

              {/* Startup check */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer">
                <div>
                  <div className="text-xs font-medium text-white">Check Upon Session Launch</div>
                  <div className="text-[11px] text-white/50">Silently query latest build telemetry whenever the app initializes</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoUpdateSettings.checkOnStartup}
                  onChange={(e) => onUpdateAutoUpdateSettings({ checkOnStartup: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 text-yellow-500 focus:ring-0 bg-black/40"
                />
              </label>

              {/* Check Interval */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/80">Polling Cadence</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'startup', label: 'Startup' },
                    { id: 'hourly', label: '1 Hour' },
                    { id: 'daily', label: '24 Hours' },
                    { id: 'manual', label: 'Manual' },
                  ].map((item) => {
                    const isSelected = autoUpdateSettings.checkInterval === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onUpdateAutoUpdateSettings({ checkInterval: item.id as any })}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? 'text-white border-white/40 bg-white/10'
                            : 'text-white/60 border-white/10 hover:border-white/20'
                        }`}
                        style={isSelected ? {
                          borderColor: currentTheme.primary,
                          color: currentTheme.primary,
                        } : undefined}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Release Channel */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/80">Release Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'stable', title: 'Stable', desc: 'Tested production builds' },
                    { id: 'beta', title: 'Beta Flare', desc: 'Early experimental features' },
                    { id: 'nightly', title: 'Quantum Nightly', desc: 'Bleeding-edge code commits' },
                  ].map((c) => {
                    const isSelected = autoUpdateSettings.releaseChannel === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => onUpdateAutoUpdateSettings({ releaseChannel: c.id as any })}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected 
                            ? 'border-white/40 bg-white/[0.08]' 
                            : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                        }`}
                        style={isSelected ? {
                          borderColor: currentTheme.primary,
                          color: currentTheme.primary,
                        } : undefined}
                      >
                        <div className="text-xs font-medium text-white mb-0.5">{c.title}</div>
                        <div className="text-[10px] text-white/40">{c.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direct trigger */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (onTriggerUpdateCheck) {
                      onTriggerUpdateCheck();
                      onClose();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-xs text-black transition-all shadow-md"
                  style={{
                    backgroundColor: currentTheme.primary,
                    boxShadow: `0 0 15px ${currentTheme.glow}`
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Trigger Manual Update Verification Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-black/40">
          <button
            onClick={() => {
              if (settings.soundEffects) playSolarTone('click', settings.soundVolume);
              if (onResetDefaults) onResetDefaults();
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={() => {
              if (settings.soundEffects) playSolarTone('toggle', settings.soundVolume);
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-black transition-all shadow-md"
            style={{
              backgroundColor: currentTheme.primary,
              boxShadow: `0 0 15px ${currentTheme.glow}`
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
