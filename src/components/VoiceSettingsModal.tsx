import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, Mic, Sliders, Play, Bell, RefreshCw, Globe, FileText } from 'lucide-react';
import { VoiceSettings } from '../types';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VoiceSettings;
  onUpdateSettings: (newSettings: Partial<VoiceSettings>) => void;
  availableVoices: SpeechSynthesisVoice[];
  onTestVoice: () => void;
  isSpeaking: boolean;
  onOpenUpdate?: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  availableVoices,
  onTestVoice,
  isSpeaking,
  onOpenUpdate,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md rounded-2xl bg-[#0d0d12] border border-neutral-800 shadow-[0_0_50px_rgba(250,204,21,0.15)] overflow-hidden"
        >
          {/* Modal Header */}
          <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-yellow-400" />
              <h3 className="text-base font-bold text-neutral-100 font-sans tracking-wide">
                Voice & Solar Controls
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 space-y-5 text-sm">
            {/* Auto-Speak Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-neutral-200 block">
                  Vocalize Responses
                </label>
                <p className="text-xs text-neutral-400">
                  Automatically speak Sunfyer's answers aloud
                </p>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ autoSpeak: !settings.autoSpeak })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.autoSpeak ? 'bg-yellow-400' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-neutral-950 transition-transform ${
                    settings.autoSpeak ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* DeepSearch & High-Level Reasoning Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
              <div>
                <label className="font-medium text-cyan-200 block flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>DeepSearch Intelligence Mode</span>
                </label>
                <p className="text-xs text-neutral-400">
                  Enables high cognitive reasoning (<code className="text-cyan-300">thinkingLevel: HIGH</code>) & live entity grounding
                </p>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ deepSearch: !settings.deepSearch })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.deepSearch ? 'bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-neutral-950 transition-transform ${
                    settings.deepSearch ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Hands-Free Mode Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-neutral-200 block flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Hands-Free Activation</span>
                </label>
                <p className="text-xs text-neutral-400">
                  Auto-transmits prompt after natural speech pause
                </p>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ handsFree: !settings.handsFree })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.handsFree ? 'bg-yellow-400' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-neutral-950 transition-transform ${
                    settings.handsFree ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sound Effects Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-neutral-200 block flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Solar Chime Effects</span>
                </label>
                <p className="text-xs text-neutral-400">
                  Synthesized harmonic feedback when recording & answering
                </p>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ soundFx: !settings.soundFx })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.soundFx ? 'bg-yellow-400' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-neutral-950 transition-transform ${
                    settings.soundFx ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Don't Read Punctuation Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
              <div>
                <label className="font-medium text-amber-200 block flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Don't Read Punctuation</span>
                </label>
                <p className="text-xs text-neutral-400">
                  Prevents voice from pronouncing punctuation marks, quotes, brackets, and symbols aloud
                </p>
              </div>
              <button
                type="button"
                id="voice-skip-punctuation-toggle"
                onClick={() => onUpdateSettings({ stripPunctuation: settings.stripPunctuation === false ? true : false })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.stripPunctuation !== false ? 'bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.4)]' : 'bg-neutral-800'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-neutral-950 transition-transform ${
                    settings.stripPunctuation !== false ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Voice Model Selector */}
            {availableVoices.length > 0 && (
              <div className="space-y-1.5">
                <label className="font-medium text-neutral-200 block flex items-center justify-between">
                  <span>Synthesizer Voice Profile</span>
                  <span className="text-[11px] font-mono text-neutral-500">
                    {availableVoices.length} available
                  </span>
                </label>
                <select
                  value={settings.voiceName}
                  onChange={(e) => onUpdateSettings({ voiceName: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-yellow-400/60 font-mono"
                >
                  <option value="">System Default Voice</option>
                  {availableVoices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Speech Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-medium text-neutral-200 text-xs">
                  Cadence Speed ({settings.rate.toFixed(2)}x)
                </label>
                <span className="text-[10px] font-mono text-neutral-400">0.8x - 1.5x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={settings.rate}
                onChange={(e) => onUpdateSettings({ rate: parseFloat(e.target.value) })}
                className="w-full accent-yellow-400 cursor-pointer"
              />
            </div>

            {/* Speech Pitch Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-medium text-neutral-200 text-xs">
                  Solar Harmonic Pitch ({settings.pitch.toFixed(2)})
                </label>
                <span className="text-[10px] font-mono text-neutral-400">0.8 - 1.3</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={settings.pitch}
                onChange={(e) => onUpdateSettings({ pitch: parseFloat(e.target.value) })}
                className="w-full accent-yellow-400 cursor-pointer"
              />
            </div>

            {/* Windows Executable Auto-Update & Maintenance Section */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
              <div>
                <label className="font-medium text-neutral-200 text-xs block flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Windows Executable Update</span>
                </label>
                <p className="text-[11px] text-neutral-400">
                  Update Sunfyer.exe to latest build or run in-place updater
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenUpdate?.();
                }}
                className="px-3 py-1.5 rounded-lg bg-yellow-400/15 hover:bg-yellow-400 border border-yellow-400/40 hover:text-neutral-950 text-yellow-300 font-mono text-xs font-semibold transition-all cursor-pointer shrink-0 shadow-sm"
              >
                Update EXE
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-5 py-3.5 bg-neutral-900/60 border-t border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onTestVoice}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 hover:bg-yellow-400/25 text-xs font-mono transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isSpeaking ? 'Testing...' : 'Test Voice'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono transition-colors cursor-pointer"
            >
              Save & Dismiss
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
