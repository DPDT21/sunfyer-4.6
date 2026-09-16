import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechSynthesisProps {
  rate?: number;
  pitch?: number;
  voiceName?: string;
  stripPunctuation?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

/**
 * Sanitizes text for natural speech synthesis.
 * Strips out punctuation marks (quotes, brackets, colons, dashes, symbols, emojis)
 * that speech synthesizers notoriously vocalize aloud as words.
 */
export function sanitizeTextForSpeech(text: string, stripPunctuation = true): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Remove code blocks entirely
  cleaned = cleaned.replace(/```[\s\S]*?```/g, ' Code snippet omitted. ');
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // 2. Remove URLs so TTS does not spell out "h t t p s colon slash slash..."
  cleaned = cleaned.replace(/https?:\/\/\S+/gi, ' link ');

  // 3. Remove markdown links [title](url) -> title
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 4. Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, ' ');

  // 5. Remove headers, blockquotes, horizontal rules
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');
  cleaned = cleaned.replace(/^>\s+/gm, '');
  cleaned = cleaned.replace(/^[-*_]{3,}\s*$/gm, ' ');

  // 6. Remove list bullets and numbered prefixes (so TTS does not say "dash" or "one dot")
  cleaned = cleaned.replace(/^[\s]*[-•*+]\s+/gm, ' ');
  cleaned = cleaned.replace(/^[\s]*\d+[\.\)]\s+/gm, ' ');

  // 7. Strip markdown decoration characters
  cleaned = cleaned.replace(/[*_~#^|]/g, ' ');

  if (stripPunctuation) {
    // 8. Strip quotation marks, brackets, slashes, and symbols that voices read aloud
    cleaned = cleaned.replace(/["'“”‘’«»`]/g, ' ');
    cleaned = cleaned.replace(/[()[\]{}<>]/g, ' ');
    cleaned = cleaned.replace(/[/\\|@#$%&=+~^]/g, ' ');

    // 9. Convert dashes and hyphens to spaces so voice doesn't say "dash" or "hyphen"
    cleaned = cleaned.replace(/[—–-]/g, ' ');

    // 10. Convert colons and semicolons to gentle pauses (comma or space), never literal colons
    cleaned = cleaned.replace(/[:;]+/g, ', ');

    // 11. Remove emojis so synthesizer does not read out unicode emoji names
    cleaned = cleaned.replace(/[\u{1F300}-\u{1FAD6}\u{2600}-\u{27BF}]/gu, ' ');

    // 12. Collapse multiple periods/ellipses so voice doesn't say "dot dot dot"
    cleaned = cleaned.replace(/\.{2,}/g, '. ');
    cleaned = cleaned.replace(/[!?]{2,}/g, '! ');

    // 13. Remove stray, isolated punctuation marks surrounded by spaces
    cleaned = cleaned.replace(/\s+[,.!?]+\s+/g, ' ');
  }

  // 14. Normalize multiple whitespaces into a clean single space
  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

  return cleaned;
}

export function useSpeechSynthesis({
  rate = 1.05,
  pitch = 1.0,
  voiceName = '',
  stripPunctuation = true,
  onStart,
  onEnd,
  onError,
}: UseSpeechSynthesisProps = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const onStartRef = useRef(onStart);
  const onEndRef = useRef(onEnd);
  const onErrorRef = useRef(onError);
  onStartRef.current = onStart;
  onEndRef.current = onEnd;
  onErrorRef.current = onError;

  // Load available speech synthesis voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Choose preferred voice
  useEffect(() => {
    if (voices.length === 0) return;

    if (voiceName) {
      const match = voices.find((v) => v.name === voiceName);
      if (match) {
        setSelectedVoice(match);
        return;
      }
    }

    // Default to natural sounding English voice
    const preferred =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Neural'))) ||
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Karen'))) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];

    setSelectedVoice(preferred || null);
  }, [voices, voiceName]);

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (onEndRef.current) onEndRef.current();
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;

      // Clean Markdown, symbols, and punctuation for pristine natural voice readback
      const cleanText = sanitizeTextForSpeech(text, stripPunctuation);

      if (!cleanText) return;

      cancel();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = Math.max(0.6, Math.min(1.8, rate));
      utterance.pitch = Math.max(0.6, Math.min(1.5, pitch));

      utterance.onstart = () => {
        setIsSpeaking(true);
        if (onStartRef.current) onStartRef.current();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEndRef.current) onEndRef.current();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        if (onErrorRef.current) {
          onErrorRef.current();
        } else if (onEndRef.current) {
          onEndRef.current();
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [cancel, pitch, rate, selectedVoice, stripPunctuation]
  );

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    isSpeaking,
    voices,
    selectedVoice,
    speak,
    cancel,
    stop: cancel,
  };
}
