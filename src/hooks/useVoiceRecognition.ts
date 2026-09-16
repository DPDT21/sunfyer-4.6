import { useState, useEffect, useRef, useCallback } from 'react';

interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

interface UseVoiceRecognitionOptions {
  onFinalTranscript?: (text: string) => void;
  onSilenceTimeout?: (text: string) => void;
  onBargeIn?: () => void;
  isSpeaking?: boolean;
  handsFree?: boolean;
  autoSend?: boolean;
  silenceDelayMs?: number;
}

export function useVoiceRecognition({
  onFinalTranscript,
  onSilenceTimeout,
  onBargeIn,
  isSpeaking = false,
  handsFree = false,
  autoSend = true,
  silenceDelayMs = 1350,
}: UseVoiceRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  
  // Real-time VAD countdown timer in seconds (e.g., 1.3 -> 0)
  const [autoSendCountdown, setAutoSendCountdown] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fullTranscriptRef = useRef('');
  
  // Strict reference to speaking state to completely drop AI self-voice transcripts
  const isSpeakingRef = useRef(isSpeaking);
  isSpeakingRef.current = isSpeaking;

  const onBargeInRef = useRef(onBargeIn);
  onBargeInRef.current = onBargeIn;

  const onSilenceTimeoutRef = useRef(onSilenceTimeout);
  onSilenceTimeoutRef.current = onSilenceTimeout;

  const onFinalTranscriptRef = useRef(onFinalTranscript);
  onFinalTranscriptRef.current = onFinalTranscript;

  useEffect(() => {
    const win = typeof window !== 'undefined' ? (window as unknown as IWindowWithSpeech) : null;
    const SpeechRecognitionClass = win?.SpeechRecognition || win?.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setIsSupported(false);
    }
  }, []);

  const clearSilenceTimers = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setAutoSendCountdown(null);
  }, []);

  // Audio level meter using Web Audio API with Acoustic Barge-in detection
  const startAudioMeter = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.6;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let highEnergyConsecutiveFrames = 0;

      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalized = Math.min(1, Math.max(0, average / 128));
        setAudioLevel(normalized);

        // Acoustic Barge-in detection:
        // If AI is currently vocalizing and microphone picks up sustained loud user voice (e.g. speech energy > 0.45)
        if (isSpeakingRef.current && normalized > 0.45) {
          highEnergyConsecutiveFrames++;
          if (highEnergyConsecutiveFrames >= 6) { // ~100ms of sustained speech
            highEnergyConsecutiveFrames = 0;
            if (onBargeInRef.current) {
              onBargeInRef.current();
            }
          }
        } else {
          highEnergyConsecutiveFrames = 0;
        }

        animFrameRef.current = requestAnimationFrame(updateMeter);
      };

      updateMeter();
    } catch {
      // Fallback pulse if mic permission blocked
      const interval = setInterval(() => {
        setAudioLevel((prev) => (prev > 0.4 ? 0.15 : 0.45));
      }, 300);
      return () => clearInterval(interval);
    }
  }, []);

  const stopAudioMeter = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const stopListening = useCallback(() => {
    clearSilenceTimers();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    stopAudioMeter();
    setIsListening(false);
  }, [clearSilenceTimers, stopAudioMeter]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    fullTranscriptRef.current = '';
    clearSilenceTimers();
  }, [clearSilenceTimers]);

  const startListening = useCallback(() => {
    // If AI is speaking, do not allow speech recognition to start (prevent picking up own voice)
    if (isSpeakingRef.current) {
      return;
    }

    setError(null);
    setTranscript('');
    setInterimTranscript('');
    fullTranscriptRef.current = '';
    clearSilenceTimers();

    const win = typeof window !== 'undefined' ? (window as unknown as IWindowWithSpeech) : null;
    const SpeechRecognitionClass = win?.SpeechRecognition || win?.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setError('Voice recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        startAudioMeter();
      };

      recognition.onresult = (event: any) => {
        // CRITICAL: If the AI is currently speaking, DROP and DISCARD all transcripts!
        // This stops Sunfyer from hearing and transcribing its own voice.
        if (isSpeakingRef.current) {
          return;
        }

        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const text = item[0].transcript;
          if (item.isFinal) {
            currentFinal += text + ' ';
          } else {
            currentInterim += text;
          }
        }

        if (currentFinal) {
          fullTranscriptRef.current += currentFinal;
          setTranscript(fullTranscriptRef.current.trim());
          if (onFinalTranscriptRef.current) {
            onFinalTranscriptRef.current(fullTranscriptRef.current.trim());
          }
        }

        setInterimTranscript(currentInterim);

        const currentSpoken = (fullTranscriptRef.current + ' ' + currentInterim).trim();

        // AUTOMATIC VOICE DISPATCH (VAD):
        // As soon as the user speaks words, arm the silence countdown timer!
        if (autoSend && currentSpoken.length > 0) {
          clearSilenceTimers();

          const startTime = Date.now();
          const targetDuration = silenceDelayMs;

          // Tick state for futuristic UI countdown
          setAutoSendCountdown(parseFloat((targetDuration / 1000).toFixed(1)));
          countdownIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, targetDuration - elapsed);
            setAutoSendCountdown(parseFloat((remaining / 1000).toFixed(1)));
          }, 100);

          silenceTimerRef.current = setTimeout(() => {
            clearSilenceTimers();
            const finalSpoken = (fullTranscriptRef.current + ' ' + currentInterim).trim();
            if (finalSpoken.length > 0 && onSilenceTimeoutRef.current) {
              onSilenceTimeoutRef.current(finalSpoken);
              stopListening();
              resetTranscript();
            }
          }, targetDuration);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          setError(`Recognition notice: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        stopAudioMeter();
        clearSilenceTimers();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setError(err?.message || 'Failed to initialize speech recognition.');
      setIsListening(false);
      stopAudioMeter();
    }
  }, [autoSend, clearSilenceTimers, resetTranscript, silenceDelayMs, startAudioMeter, stopAudioMeter, stopListening]);

  // When isSpeaking changes:
  // If AI starts speaking, immediately suspend recognition and clear buffers
  useEffect(() => {
    if (isSpeaking) {
      clearSilenceTimers();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }
      setIsListening(false);
      setInterimTranscript('');
    } else if (handsFree) {
      // Once AI finishes speaking and hands-free is on, seamlessly re-engage listening
      const timeout = setTimeout(() => {
        startListening();
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [isSpeaking, handsFree, clearSilenceTimers, startListening]);

  useEffect(() => {
    return () => {
      clearSilenceTimers();
      stopListening();
    };
  }, [clearSilenceTimers, stopListening]);

  return {
    isListening,
    transcript,
    interimTranscript,
    audioLevel,
    isSupported,
    error,
    autoSendCountdown,
    startListening,
    stopListening,
    resetTranscript,
  };
}
