import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Radio,
  Sparkles,
  Command,
  Zap,
  Globe,
} from 'lucide-react';
import { VoiceState } from '../types';

interface VoiceControlsBarProps {
  voiceState: VoiceState;
  audioLevel: number;
  interimTranscript: string;
  autoSendCountdown?: number | null;
  isHandsFree: boolean;
  onToggleListening: () => void;
  onToggleHandsFree: () => void;
  isDeepSearch?: boolean;
  onToggleDeepSearch?: () => void;
  isAutoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export const VoiceControlsBar: React.FC<VoiceControlsBarProps> = ({
  voiceState,
  audioLevel,
  interimTranscript,
  autoSendCountdown = null,
  isHandsFree,
  onToggleListening,
  onToggleHandsFree,
  isDeepSearch = false,
  onToggleDeepSearch,
  isAutoSpeak,
  onToggleAutoSpeak,
  isSpeaking,
  onStopSpeaking,
  onSendMessage,
  disabled = false,
}) => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync interim transcript into input field when listening
  useEffect(() => {
    if (interimTranscript) {
      setInputText(interimTranscript);
    }
  }, [interimTranscript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || disabled) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  // Keyboard shortcut: Cmd/Ctrl+K to focus input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 font-mono">
      {/* Main Bar Card with Futuristic Cyber Borders */}
      <div className="relative rounded-2xl bg-[#0b0c12]/95 backdrop-blur-xl border border-yellow-400/25 p-2 sm:p-2.5 shadow-[0_0_35px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-yellow-400/45">
        {/* Sci-fi corner brackets */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-yellow-400 pointer-events-none" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-yellow-400 pointer-events-none" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-yellow-400 pointer-events-none" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-yellow-400 pointer-events-none" />

        <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
          {/* Main Voice Listening Button */}
          <button
            id="voice-bar-mic-toggle"
            type="button"
            onClick={onToggleListening}
            disabled={disabled}
            className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 cursor-pointer focus:outline-none ${
              voiceState === 'listening'
                ? 'bg-yellow-400 text-black shadow-[0_0_25px_rgba(250,204,21,0.8)] scale-105 border border-yellow-300'
                : 'bg-neutral-900/90 hover:bg-neutral-800 text-yellow-400 border border-yellow-500/30 hover:border-yellow-400/70 shadow-[0_0_12px_rgba(250,204,21,0.15)]'
            }`}
            title={voiceState === 'listening' ? 'Stop listening' : 'Engage voice sensors'}
          >
            {voiceState === 'listening' ? (
              <MicOff className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <Mic className="w-5 h-5 stroke-[2.5]" />
            )}

            {/* Ripple ring when listening */}
            {voiceState === 'listening' && (
              <span className="absolute inset-0 rounded-xl border-2 border-yellow-400 animate-ping opacity-60" />
            )}
          </button>

          {/* Holographic Cyber Audio Wave Equalizer */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 h-10 border-r border-neutral-800/90">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const baseHeight = 4;
              let height = baseHeight;
              if (voiceState === 'listening') {
                height = Math.max(
                  baseHeight,
                  Math.sin(i * 0.8 + Date.now() / 180) * 16 * audioLevel + 18 * audioLevel + 4
                );
              } else if (voiceState === 'speaking') {
                height = 6 + Math.sin(i * 1.2 + Date.now() / 140) * 12;
              }

              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-75 ${
                    voiceState === 'listening'
                      ? 'bg-yellow-400 shadow-[0_0_8px_#facc15]'
                      : voiceState === 'speaking'
                      ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                      : 'bg-neutral-800'
                  }`}
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>

          {/* Text input for hybrid voice / keyboard entry */}
          <div className="relative flex-1">
            <input
              id="voice-input-text-field"
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                voiceState === 'listening'
                  ? 'Vocal stream listening... (pause to auto-send)'
                  : isSpeaking
                  ? 'Sunfyer speaking (press Space to interrupt)...'
                  : isDeepSearch
                  ? '⚡ DeepSearch Active: Ask any deep question...'
                  : 'Transmit message or speak aloud...'
              }
              disabled={disabled}
              className={`w-full bg-black/50 rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none transition-all font-sans ${
                isDeepSearch
                  ? 'border border-cyan-500/60 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'border border-neutral-800/80 focus:border-yellow-400/80 focus:ring-1 focus:ring-yellow-400/40'
              }`}
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>

          {/* DeepSearch Reasoning Toggle */}
          {onToggleDeepSearch && (
            <button
              id="voice-bar-deepsearch-toggle"
              type="button"
              onClick={onToggleDeepSearch}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer ${
                isDeepSearch
                  ? 'bg-cyan-500/20 border border-cyan-400/80 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-cyan-400'
              }`}
              title={isDeepSearch ? 'DeepSearch mode: ACTIVE' : 'DeepSearch mode: OFF (Click for comprehensive deep reasoning)'}
            >
              <Globe className={`w-3.5 h-3.5 ${isDeepSearch ? 'text-cyan-300' : 'text-neutral-400'}`} />
              <span>DeepSearch</span>
              {isDeepSearch && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
            </button>
          )}

          {/* Hands-Free Voice Mode Toggle */}
          <button
            id="voice-bar-hands-free-toggle"
            type="button"
            onClick={onToggleHandsFree}
            className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer ${
              isHandsFree
                ? 'bg-yellow-400/20 border border-yellow-400/60 text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.25)]'
                : 'bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
            title="Continuous hands-free voice loop with auto-dispatch"
          >
            <Radio className={`w-3.5 h-3.5 ${isHandsFree ? 'text-yellow-400 animate-pulse' : ''}`} />
            <span>VAD Loop</span>
          </button>

          {/* HIGH-TECH INTERRUPT BUTTON (Visible when speaking) */}
          {isSpeaking ? (
            <button
              id="voice-bar-interrupt-speech"
              type="button"
              onClick={onStopSpeaking}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 font-black text-xs font-mono transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.7)] hover:scale-105 active:scale-95 animate-pulse"
              title="Immediately silence Sunfyer and take control"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>INTERRUPT</span>
            </button>
          ) : (
            <button
              id="voice-bar-auto-speak-toggle"
              type="button"
              onClick={onToggleAutoSpeak}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all cursor-pointer ${
                isAutoSpeak
                  ? 'text-yellow-400 hover:text-yellow-300 bg-neutral-900 border border-yellow-500/40 shadow-[0_0_10px_rgba(250,204,21,0.2)]'
                  : 'text-neutral-500 hover:text-neutral-300 bg-neutral-900/50 border border-neutral-800'
              }`}
              title={isAutoSpeak ? 'Voice output: ACTIVE' : 'Voice output: MUTED'}
            >
              {isAutoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}

          {/* Send Button */}
          <button
            id="voice-bar-submit-btn"
            type="submit"
            disabled={!inputText.trim() || disabled}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 cursor-pointer ${
              inputText.trim() && !disabled
                ? 'bg-yellow-400 hover:bg-yellow-300 text-neutral-950 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                : 'bg-neutral-800/60 text-neutral-500 cursor-not-allowed'
            }`}
            title="Send transmission"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Voice Command Hints */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/70 px-1 text-[11px] text-neutral-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-yellow-400/90 font-bold">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span>Vocal Uplink</span>
            </span>
            <span className="text-neutral-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline">Auto-sends when you pause</span>
            <span className="text-neutral-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-neutral-300">Tap Orb or <kbd className="px-1 py-0.2 rounded bg-neutral-800 text-yellow-300 border border-neutral-700">Space</kbd> to Interrupt</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-500">
            <Command className="w-3 h-3" />
            <span>K search</span>
          </div>
        </div>
      </div>
    </div>
  );
};
