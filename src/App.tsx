import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { SolarOrb } from './components/SolarOrb';
import { VoiceControlsBar } from './components/VoiceControlsBar';
import { MessageList } from './components/MessageList';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { DownloadModal } from './components/DownloadModal';
import { UpdateModal } from './components/UpdateModal';
import { FuturisticHUD } from './components/FuturisticHUD';
import { CustomizationModal } from './components/CustomizationModal';
import { HomePanel } from './components/HomePanel';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { playSolarTone } from './utils/audio';
import {
  ChatMessage,
  AssistantPersona,
  VoiceSettings,
  VoiceState,
  CustomizationSettings,
  AutoUpdateSettings,
} from './types';
import { applyThemeVariables, THEMES } from './utils/theme';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Terminal, Zap, CheckCircle2 } from 'lucide-react';

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  autoSpeak: true,
  handsFree: false,
  deepSearch: true,
  voiceName: '',
  rate: 1.05,
  pitch: 1.0,
  soundFx: true,
  stripPunctuation: true,
};

const DEFAULT_CUSTOMIZATION: CustomizationSettings = {
  assistantName: 'Sunfyer',
  userName: 'Commander',
  assistantCallsign: 'Solar Intelligence Core',
  colorTheme: 'solar',
  hudDensity: 'balanced',
  orbStyle: 'corona',
  pulseSpeed: 'balanced',
  glowIntensity: 'radiant',
  fontFamily: 'mono',
  showHUD: true,
  showEqualizer: true,
  solarFlares: true,
  audioVolume: 0.8,
  soundVolume: 0.8,
  soundEffects: true,
};

const DEFAULT_AUTO_UPDATE: AutoUpdateSettings = {
  enabled: true,
  checkIntervalMinutes: 30,
  channel: 'stable',
  autoDownload: true,
  notifyOnUpdate: true,
};

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('sunfyer_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [persona, setPersona] = useState<AssistantPersona>('core');
  const [viewMode, setViewMode] = useState<'orb' | 'chat'>('orb');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isHomePanelOpen, setIsHomePanelOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [appVersion, setAppVersion] = useState('4.2.0');
  const [autoUpdateNotification, setAutoUpdateNotification] = useState<string | null>(null);

  const [settings, setSettings] = useState<VoiceSettings>(() => {
    try {
      const saved = localStorage.getItem('sunfyer_voice_settings');
      return saved ? { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(saved) } : DEFAULT_VOICE_SETTINGS;
    } catch {
      return DEFAULT_VOICE_SETTINGS;
    }
  });

  const [customization, setCustomization] = useState<CustomizationSettings>(() => {
    try {
      const saved = localStorage.getItem('sunfyer_customization');
      return saved ? { ...DEFAULT_CUSTOMIZATION, ...JSON.parse(saved) } : DEFAULT_CUSTOMIZATION;
    } catch {
      return DEFAULT_CUSTOMIZATION;
    }
  });

  const [autoUpdate, setAutoUpdate] = useState<AutoUpdateSettings>(() => {
    try {
      const saved = localStorage.getItem('sunfyer_auto_update');
      return saved ? { ...DEFAULT_AUTO_UPDATE, ...JSON.parse(saved) } : DEFAULT_AUTO_UPDATE;
    } catch {
      return DEFAULT_AUTO_UPDATE;
    }
  });

  // Apply CSS theme variables on theme update
  useEffect(() => {
    applyThemeVariables(customization.colorTheme);
  }, [customization.colorTheme]);

  // Persist customization settings
  useEffect(() => {
    try {
      localStorage.setItem('sunfyer_customization', JSON.stringify(customization));
    } catch {}
  }, [customization]);

  // Persist auto-update settings
  useEffect(() => {
    try {
      localStorage.setItem('sunfyer_auto_update', JSON.stringify(autoUpdate));
    } catch {}
  }, [autoUpdate]);

  // Save settings when modified
  useEffect(() => {
    try {
      localStorage.setItem('sunfyer_voice_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Save conversation history
  useEffect(() => {
    try {
      localStorage.setItem('sunfyer_history', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Background Auto-Update Checker
  useEffect(() => {
    if (!autoUpdate.enabled) return;

    const checkUpdates = async () => {
      try {
        const res = await fetch('/api/update/check');
        if (res.ok) {
          const data = await res.json();
          if (data.latestVersion && data.latestVersion !== appVersion) {
            if (autoUpdate.autoDownload) {
              // Apply hot patch silently
              await fetch('/api/update/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetVersion: data.latestVersion }),
              });
              setAppVersion(data.latestVersion);
              if (autoUpdate.notifyOnUpdate) {
                setAutoUpdateNotification(`Auto-updated to v${data.latestVersion} (${data.releaseName})`);
                if (settings.soundFx) playSolarTone('update_success', customization.audioVolume);
                setTimeout(() => setAutoUpdateNotification(null), 5000);
              }
            } else if (autoUpdate.notifyOnUpdate) {
              setAutoUpdateNotification(`New release available: v${data.latestVersion}`);
              setTimeout(() => setAutoUpdateNotification(null), 5000);
            }
          }
        }
      } catch {
        // Silently ignore background polling errors
      }
    };

    // Initial check after 3 seconds
    const initialTimer = setTimeout(checkUpdates, 3000);
    const intervalMs = Math.max(1, autoUpdate.checkIntervalMinutes) * 60 * 1000;
    const intervalTimer = setInterval(checkUpdates, intervalMs);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [autoUpdate, appVersion, settings.soundFx, customization.audioVolume]);

  // Speech Synthesis Hook (TTS Output)
  const { speak, stop: stopSpeech, isSpeaking, voices } = useSpeechSynthesis({
    rate: settings.rate,
    pitch: settings.pitch,
    voiceName: settings.voiceName,
    stripPunctuation: settings.stripPunctuation !== false,
    onEnd: () => {
      setSpeakingMessageId(null);
    },
    onError: () => {
      setSpeakingMessageId(null);
    },
  });

  // Interruption Handler (Instant Barge-In)
  const handleInterrupt = useCallback(() => {
    if (settings.soundFx) playSolarTone('interrupt', customization.audioVolume);
    stopSpeech();
    setSpeakingMessageId(null);
    
    // Automatically open listening channel so the user can immediately talk
    setTimeout(() => {
      startListening();
    }, 120);
  }, [settings.soundFx, stopSpeech, customization.audioVolume]);

  // Main message sender
  const handleSendMessage = useCallback(
    async (text: string, isVoiceInput = false) => {
      if (!text.trim() || isProcessing) return;

      // Stop speech if speaking
      stopSpeech();
      setSpeakingMessageId(null);

      const userMessageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const userMessage: ChatMessage = {
        id: userMessageId,
        role: 'user',
        text: text.trim(),
        timestamp: Date.now(),
        isVoiceInput,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsProcessing(true);

      const startTime = performance.now();

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            prompt: text.trim(),
            text: text.trim(),
            persona,
            deepSearch: settings.deepSearch,
            history: messages.slice(-10).map((m) => ({
              role: m.role,
              text: m.text,
            })),
            messages: messages.slice(-10).map((m) => ({
              role: m.role,
              text: m.text,
            })),
          }),
        });

        const data = await response.json().catch(() => ({}));
        const latencyMs = Math.round(performance.now() - startTime);

        if (!response.ok) {
          throw new Error(data?.error || `Server returned error status: ${response.status}`);
        }

        const replyContent = data.reply || data.text || data.message || 'Transmission received with zero payload.';

        const assistantMessageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const assistantMessage: ChatMessage = {
          id: assistantMessageId,
          role: 'assistant',
          text: replyContent,
          timestamp: Date.now(),
          latencyMs,
          model: data.model || (settings.deepSearch ? 'Gemini Deep Research (Google Grounded)' : 'Gemini Solar Core'),
          isDeepSearch: Boolean(data.isDeepSearch ?? settings.deepSearch),
          sources: data.sources || [],
          searchQueries: data.searchQueries || [],
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Auto-speak response if configured
        if (settings.autoSpeak) {
          setSpeakingMessageId(assistantMessageId);
          if (settings.soundFx) playSolarTone('response_start', customization.audioVolume);
          speak(replyContent);
        }
      } catch (err: any) {
        const anomalyText = `Sunfyer encountered an anomaly: ${err?.message || 'Connection failure'}. Uplink recalibrating.`;
        const errorMessage: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: anomalyText,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);

        if (settings.autoSpeak) {
          speak(anomalyText);
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, messages, persona, settings.autoSpeak, settings.deepSearch, settings.soundFx, speak, stopSpeech, customization.audioVolume]
  );

  // Voice Recognition Hook (VAD Auto-Dispatch + Echo Suppression)
  const {
    isListening,
    interimTranscript,
    audioLevel,
    autoSendCountdown,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition({
    isSpeaking,
    handsFree: settings.handsFree,
    autoSend: true,
    silenceDelayMs: 1350,
    onBargeIn: handleInterrupt,
    onSilenceTimeout: (spokenText) => {
      if (spokenText.trim()) {
        if (settings.soundFx) playSolarTone('auto_dispatch', customization.audioVolume);
        handleSendMessage(spokenText, true);
        resetTranscript();
      }
    },
  });

  // Calculate current high-level Voice State for animations
  const voiceState: VoiceState = isListening
    ? 'listening'
    : isProcessing
    ? 'processing'
    : isSpeaking
    ? 'speaking'
    : 'idle';

  // Toggle listening with sound fx
  const toggleListening = useCallback(() => {
    if (isSpeaking) {
      handleInterrupt();
      return;
    }

    if (isListening) {
      if (settings.soundFx) playSolarTone('listen_stop', customization.audioVolume);
      stopListening();
      if (interimTranscript.trim()) {
        handleSendMessage(interimTranscript.trim(), true);
        resetTranscript();
      }
    } else {
      stopSpeech();
      if (settings.soundFx) playSolarTone('listen_start', customization.audioVolume);
      startListening();
    }
  }, [
    handleInterrupt,
    handleSendMessage,
    interimTranscript,
    isListening,
    isSpeaking,
    resetTranscript,
    settings.soundFx,
    startListening,
    stopListening,
    stopSpeech,
    customization.audioVolume,
  ]);

  // Global keyboard shortcuts (Space to toggle voice / interrupt; Escape to cancel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable);

      if (e.code === 'Space' && !isInputActive && !isSettingsOpen && !isDownloadOpen && !isUpdateOpen && !isCustomizationOpen) {
        e.preventDefault();
        if (isSpeaking) {
          handleInterrupt();
        } else {
          toggleListening();
        }
      }

      if (e.code === 'Escape') {
        if (isCustomizationOpen) {
          setIsCustomizationOpen(false);
        } else if (isUpdateOpen) {
          setIsUpdateOpen(false);
        } else if (isSpeaking) {
          handleInterrupt();
        } else if (isListening) {
          stopListening();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInterrupt, isCustomizationOpen, isDownloadOpen, isListening, isSettingsOpen, isSpeaking, isUpdateOpen, stopListening, toggleListening]);

  const handleClearHistory = () => {
    stopSpeech();
    setMessages([]);
    try {
      localStorage.removeItem('sunfyer_history');
    } catch {}
    if (settings.soundFx) playSolarTone('click', customization.audioVolume);
  };

  const latestAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.role === 'assistant');

  const currentTheme = THEMES[customization.colorTheme] || THEMES.solar;

  return (
    <div 
      className="relative flex flex-col h-screen w-screen overflow-hidden bg-[#07070a] text-neutral-100 select-none"
      style={{
        fontFamily: customization.fontFamily === 'mono' ? 'monospace' : 'system-ui, sans-serif',
      }}
    >
      {/* Background Sci-Fi Tech Grid with theme color */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `linear-gradient(${currentTheme.primary} 1px, transparent 1px), linear-gradient(to right, ${currentTheme.primary} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Background ambient solar glow flare */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none opacity-30 blur-3xl z-0"
        style={{
          background: `radial-gradient(circle, rgba(${currentTheme.primaryRgb}, 0.35) 0%, transparent 70%)`,
        }}
      />

      {/* Auto-Update Notification Banner */}
      <AnimatePresence>
        {autoUpdateNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-6 z-50 p-3 rounded-2xl bg-black/90 border border-green-500/50 text-green-300 text-xs font-mono flex items-center gap-2.5 shadow-[0_0_25px_rgba(34,197,94,0.3)] backdrop-blur-md"
          >
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>{autoUpdateNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <Header
        persona={persona}
        onSelectPersona={(p) => {
          setPersona(p);
          if (settings.soundFx) playSolarTone('toggle', customization.audioVolume);
        }}
        viewMode={viewMode}
        onToggleViewMode={(m) => {
          setViewMode(m);
          if (settings.soundFx) playSolarTone('toggle', customization.audioVolume);
        }}
        soundFx={settings.soundFx}
        onToggleSoundFx={() => {
          setSettings((prev) => {
            const next = !prev.soundFx;
            if (next) playSolarTone('click', customization.audioVolume);
            return { ...prev, soundFx: next };
          });
        }}
        deepSearch={settings.deepSearch}
        onToggleDeepSearch={() => {
          setSettings((prev) => {
            const next = !prev.deepSearch;
            if (settings.soundFx) playSolarTone('toggle', customization.audioVolume);
            return { ...prev, deepSearch: next };
          });
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDownload={() => setIsDownloadOpen(true)}
        onOpenUpdate={() => setIsUpdateOpen(true)}
        onOpenCustomization={() => setIsCustomizationOpen(true)}
        onOpenHomePanel={() => setIsHomePanelOpen(true)}
        onClearHistory={handleClearHistory}
        messageCount={messages.length}
        customization={customization}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {/* Futuristic HUD Telemetry Banner */}
        <div className="pt-2 shrink-0">
          <FuturisticHUD
            voiceState={voiceState}
            audioLevel={audioLevel}
            interimTranscript={interimTranscript}
            autoSendCountdown={autoSendCountdown}
            isSpeaking={isSpeaking}
            isHandsFree={settings.handsFree}
            onInterrupt={handleInterrupt}
            onSendNow={() => {
              if (interimTranscript.trim()) {
                handleSendMessage(interimTranscript.trim(), true);
                resetTranscript();
              }
            }}
            onToggleHandsFree={() => {
              setSettings((prev) => ({ ...prev, handsFree: !prev.handsFree }));
              if (settings.soundFx) playSolarTone('toggle', customization.audioVolume);
            }}
            isDeepSearch={settings.deepSearch}
            onToggleDeepSearch={() => {
              setSettings((prev) => {
                const next = !prev.deepSearch;
                if (settings.soundFx) playSolarTone('toggle', customization.audioVolume);
                return { ...prev, deepSearch: next };
              });
            }}
            persona={persona}
            onOpenUpdate={() => setIsUpdateOpen(true)}
            customization={customization}
            onOpenCustomization={() => setIsCustomizationOpen(true)}
          />
        </div>

        {viewMode === 'orb' ? (
          /* ORB FOCUS MODE */
          <div className="flex-1 flex flex-col items-center justify-between px-4 pb-2 max-w-4xl w-full mx-auto overflow-y-auto">
            {/* Central Solar Orb with Holographic Reticle */}
            <div className="my-auto flex flex-col items-center">
              <SolarOrb
                state={voiceState}
                audioLevel={audioLevel}
                onClick={toggleListening}
                onInterrupt={handleInterrupt}
                isHandsFree={settings.handsFree}
                customization={customization}
              />

              {/* Latest Assistant Spoken Summary / Card if available */}
              <AnimatePresence>
                {latestAssistantMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-4 max-w-xl w-full rounded-2xl bg-neutral-900/90 border p-4 shadow-[0_0_25px_rgba(0,0,0,0.7)] text-left backdrop-blur-md relative overflow-hidden"
                    style={{
                      borderColor: `rgba(${currentTheme.primaryRgb}, 0.25)`,
                    }}
                  >
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: currentTheme.primary }} />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: currentTheme.primary }} />
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-semibold" style={{ color: currentTheme.primary }}>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Sunfyer Neural Stream {latestAssistantMessage.isDeepSearch && '(Deep Research)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSpeaking && (
                          <button
                            type="button"
                            onClick={handleInterrupt}
                            className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded cursor-pointer border"
                            style={{
                              backgroundColor: `rgba(${currentTheme.primaryRgb}, 0.2)`,
                              borderColor: `rgba(${currentTheme.primaryRgb}, 0.5)`,
                              color: currentTheme.accent,
                            }}
                          >
                            <Zap className="w-3 h-3 fill-current" />
                            <span>Interrupt</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setViewMode('chat')}
                          className="text-[11px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <Terminal className="w-3 h-3" />
                          <span>Console Log</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-200 line-clamp-3 leading-relaxed font-sans">
                      {latestAssistantMessage.text}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="w-full flex items-center justify-center gap-2 flex-wrap py-2">
              {[
                'DeepSearch: latest breakthroughs in fusion power 2026',
                'DeepSearch: quantum entanglement experiments',
                'Explain solar flares and CME mechanics',
                'How does the Sunfyer neural core operate?',
              ].map((promptText) => (
                <button
                  key={promptText}
                  type="button"
                  onClick={() => handleSendMessage(promptText)}
                  className="px-3 py-1 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-mono transition-all duration-200 cursor-pointer shadow-sm"
                  style={{
                    borderColor: 'rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = currentTheme.primary;
                    e.currentTarget.style.color = currentTheme.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = '#d4d4d4';
                  }}
                >
                  &ldquo;{promptText}&rdquo;
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* CHAT STREAM MODE */
          <div className="flex-1 flex flex-col overflow-hidden">
            <MessageList
              messages={messages}
              onSpeakMessage={(text) => {
                setSpeakingMessageId('manual');
                speak(text);
              }}
              speakingMessageId={speakingMessageId}
              onSelectPrompt={(p) => handleSendMessage(p)}
              isProcessing={isProcessing}
            />
          </div>
        )}

        {/* Bottom Voice Controls & Command Bar */}
        <VoiceControlsBar
          voiceState={voiceState}
          audioLevel={audioLevel}
          interimTranscript={interimTranscript}
          autoSendCountdown={autoSendCountdown}
          isHandsFree={settings.handsFree}
          onToggleListening={toggleListening}
          onToggleHandsFree={() => {
            setSettings((prev) => ({ ...prev, handsFree: !prev.handsFree }));
            if (settings.soundFx) playSolarTone('toggle', customization.audioVolume);
          }}
          isAutoSpeak={settings.autoSpeak}
          onToggleAutoSpeak={() => {
            setSettings((prev) => ({ ...prev, autoSpeak: !prev.autoSpeak }));
            if (settings.soundFx) playSolarTone('toggle', customization.audioVolume);
          }}
          isSpeaking={isSpeaking}
          onStopSpeaking={handleInterrupt}
          onSendMessage={(txt) => handleSendMessage(txt)}
          disabled={isProcessing}
        />
      </main>

      {/* Interface Customization & Auto-Update Modal */}
      <CustomizationModal
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        settings={customization}
        onUpdateSettings={(newVals) => setCustomization((prev) => ({ ...prev, ...newVals }))}
        autoUpdateSettings={autoUpdate}
        onUpdateAutoUpdateSettings={(newVals) => setAutoUpdate((prev) => ({ ...prev, ...newVals }))}
        onTriggerManualUpdate={() => {
          setIsCustomizationOpen(false);
          setIsUpdateOpen(true);
        }}
      />

      {/* Voice and Assistant Configuration Modal */}
      <VoiceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newVals) => setSettings((prev) => ({ ...prev, ...newVals }))}
        availableVoices={voices}
        onTestVoice={() => {
          speak(
            'Sunfyer neural voice output online. Acoustic echo shield calibrated, barge-in sensor active.'
          );
        }}
        isSpeaking={isSpeaking}
        onOpenUpdate={() => {
          setIsSettingsOpen(false);
          setIsUpdateOpen(true);
        }}
      />

      {/* Windows Desktop Executable (.EXE) Download Modal */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        onOpenUpdate={() => {
          setIsDownloadOpen(false);
          setIsUpdateOpen(true);
        }}
      />

      {/* Windows Executable (.EXE) Auto-Updater & Maintenance Modal */}
      <UpdateModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        currentVersion={appVersion}
        onVersionUpdated={(newVer) => setAppVersion(newVer)}
      />

      {/* Sunfyer Solar Command Hub / Home Panel (Sun Icon in Top Left) */}
      <HomePanel
        isOpen={isHomePanelOpen}
        onClose={() => setIsHomePanelOpen(false)}
        persona={persona}
        onSelectPersona={(p) => {
          setPersona(p);
          if (settings.soundFx) playSolarTone('toggle', customization.audioVolume);
        }}
        customization={customization}
        onUpdateTheme={(themeId) => setCustomization((prev) => ({ ...prev, colorTheme: themeId }))}
        onOpenCustomization={() => {
          setIsHomePanelOpen(false);
          setIsCustomizationOpen(true);
        }}
        onOpenDownload={() => {
          setIsHomePanelOpen(false);
          setIsDownloadOpen(true);
        }}
        onOpenUpdate={() => {
          setIsHomePanelOpen(false);
          setIsUpdateOpen(true);
        }}
        onOpenVoiceSettings={() => {
          setIsHomePanelOpen(false);
          setIsSettingsOpen(true);
        }}
        onClearHistory={handleClearHistory}
        messageCount={messages.length}
        deepSearch={settings.deepSearch}
        onToggleDeepSearch={() => {
          setSettings((prev) => {
            const next = !prev.deepSearch;
            if (settings.soundFx) playSolarTone('toggle', customization.audioVolume);
            return { ...prev, deepSearch: next };
          });
        }}
        handsFree={settings.handsFree}
        onToggleHandsFree={() => {
          setSettings((prev) => {
            const next = !prev.handsFree;
            if (settings.soundFx) playSolarTone('toggle', customization.audioVolume);
            return { ...prev, handsFree: next };
          });
        }}
        soundFx={settings.soundFx}
        onToggleSoundFx={() => {
          setSettings((prev) => {
            const next = !prev.soundFx;
            if (next) playSolarTone('click', customization.audioVolume);
            return { ...prev, soundFx: next };
          });
        }}
        appVersion={appVersion}
      />
    </div>
  );
}
