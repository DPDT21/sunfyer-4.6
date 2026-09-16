import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  Copy,
  Check,
  Volume2,
  Sparkles,
  User,
  Sun,
  Globe,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ChatMessage, QuickPrompt } from '../types';
import { SpinningSun } from './SpinningSun';

interface MessageListProps {
  messages: ChatMessage[];
  onSpeakMessage: (text: string) => void;
  speakingMessageId: string | null;
  onSelectPrompt: (prompt: string) => void;
  isProcessing: boolean;
  isDeepSearch?: boolean;
}

const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: '1',
    label: 'Solar Flare Physics',
    prompt: 'Explain what happens during a major solar flare and coronal mass ejection.',
    category: 'solar',
  },
  {
    id: '2',
    label: 'DeepSearch: Fusion Physics',
    prompt: 'DeepSearch: Compare magnetic confinement vs inertial confinement fusion, current Q-factor milestones, and major engineering bottlenecks.',
    category: 'deepsearch',
  },
  {
    id: '3',
    label: 'Code Efficiency Audit',
    prompt: 'Give me practical guidelines for minimizing re-renders in high-frequency real-time React apps.',
    category: 'code',
  },
  {
    id: '4',
    label: 'DeepSearch: Quantum Qubits',
    prompt: 'DeepSearch: Explain how superconducting qubits maintain superposition and quantum coherence compared to trapped ions.',
    category: 'deepsearch',
  },
];

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onSpeakMessage,
  speakingMessageId,
  onSelectPrompt,
  isProcessing,
  isDeepSearch = false,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  const toggleSources = (id: string) => {
    setExpandedSources((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Render text with basic markdown code block and bold styling
  const renderFormattedText = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0]?.match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : '';
        const code = language ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div
            key={index}
            className="my-3 rounded-xl bg-[#09090c] border border-neutral-800/80 p-3 font-mono text-xs text-yellow-200/90 overflow-x-auto relative group shadow-inner"
          >
            {language && (
              <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                {language}
              </span>
            )}
            <pre>
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Handle simple markdown inline formatting (bold, italic, inline code)
      const paragraphs = part.split('\n\n');
      return (
        <div key={index} className="space-y-2">
          {paragraphs.map((para, pIdx) => {
            if (!para.trim()) return null;
            return (
              <p key={pIdx} className="leading-relaxed">
                {para.split('\n').map((line, lIdx) => (
                  <React.Fragment key={lIdx}>
                    {lIdx > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl w-full mx-auto space-y-6">
      {/* Empty State / Welcome Screen */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-8">
          <div className="mb-6">
            <SpinningSun state="idle" size={130} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-neutral-100 mb-2">
            Sunfyer Systems Ready
          </h2>
          <p className="text-sm text-neutral-400 max-w-md mb-8 leading-relaxed">
            A minimalist solar intelligence assistant with voice controls and high-level DeepSearch reasoning.
          </p>

          {/* Quick prompts grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-2xl">
            {QUICK_PROMPTS.map((qp) => (
              <button
                key={qp.id}
                type="button"
                onClick={() => onSelectPrompt(qp.prompt)}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all duration-200 group cursor-pointer shadow-sm ${
                  qp.category === 'deepsearch'
                    ? 'bg-cyan-950/20 hover:bg-cyan-950/40 border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800/80 hover:border-yellow-400/40 hover:shadow-[0_0_15px_rgba(250,204,21,0.12)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-semibold transition-colors ${
                    qp.category === 'deepsearch' ? 'text-cyan-200 group-hover:text-cyan-300' : 'text-neutral-200 group-hover:text-yellow-300'
                  }`}>
                    {qp.label}
                  </span>
                  {qp.category === 'deepsearch' ? (
                    <Globe className="w-3 h-3 text-cyan-400" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-neutral-500 group-hover:text-yellow-400 transition-colors" />
                  )}
                </div>
                <span className="text-xs text-neutral-400 line-clamp-2 leading-snug">
                  {qp.prompt}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map((message) => {
        const isUser = message.role === 'user';
        const isSpeaking = speakingMessageId === message.id;
        const hasSources = message.sources && message.sources.length > 0;
        const areSourcesOpen = Boolean(expandedSources[message.id]);

        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
          >
            {/* Sender metadata badge */}
            <div className="flex items-center gap-1.5 mb-1.5 px-1 text-[11px] font-mono text-neutral-400">
              {isUser ? (
                <>
                  <span>You</span>
                  {message.isVoiceInput && (
                    <span className="flex items-center gap-0.5 text-yellow-400 text-[10px] bg-yellow-400/10 px-1.5 py-0.2 rounded border border-yellow-400/30">
                      <Mic className="w-2.5 h-2.5" /> Voice
                    </span>
                  )}
                  <User className="w-3 h-3 text-neutral-500 ml-0.5" />
                </>
              ) : (
                <>
                  <Sun className="w-3 h-3 text-yellow-400" />
                  <span className="font-semibold text-yellow-400/90">Sunfyer</span>
                  {message.isDeepSearch && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                      <Globe className="w-2.5 h-2.5" /> DeepSearch
                    </span>
                  )}
                  {message.latencyMs && (
                    <span className="text-neutral-500 text-[10px]">
                      &bull; {message.latencyMs}ms
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Bubble Container */}
            <div
              className={`relative max-w-2xl rounded-2xl p-4 text-sm sm:text-[15px] leading-relaxed transition-all shadow-md ${
                isUser
                  ? 'bg-neutral-900/90 text-neutral-100 border border-neutral-800'
                  : message.isDeepSearch
                  ? 'bg-[#0b1016] text-neutral-100 border border-cyan-500/30 hover:border-cyan-400/50 shadow-[0_4px_30px_rgba(6,182,212,0.15)]'
                  : 'bg-[#0f0f14] text-neutral-100 border border-neutral-800 hover:border-yellow-400/30 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
              }`}
            >
              {/* Message text */}
              <div className="prose prose-invert max-w-none text-neutral-200">
                {renderFormattedText(message.text)}
              </div>

              {/* DeepSearch Grounded Sources & Citations Box */}
              {hasSources && (
                <div className="mt-3 pt-3 border-t border-cyan-500/20">
                  <button
                    type="button"
                    onClick={() => toggleSources(message.id)}
                    className="flex items-center justify-between w-full py-1 text-xs font-mono text-cyan-300 hover:text-cyan-200 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      <span>DeepSearch Grounding ({message.sources!.length} Sources)</span>
                    </div>
                    {areSourcesOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {areSourcesOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-2 overflow-hidden"
                      >
                        {message.sources!.map((src, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-2 rounded-lg bg-black/40 border border-neutral-800/80 text-xs font-mono"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-neutral-200 truncate">
                                [{sIdx + 1}] {src.title}
                              </span>
                              {src.url && (
                                <a
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-cyan-400 hover:underline inline-flex items-center gap-1 shrink-0"
                                >
                                  <span>Open</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                            {src.snippet && (
                              <p className="mt-1 text-[11px] text-neutral-400 font-sans line-clamp-2">
                                {src.snippet}
                              </p>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Action buttons (copy / speak) */}
              <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-neutral-800/60 text-xs font-mono text-neutral-400">
                <div className="text-[10px] text-neutral-500 truncate">
                  {message.model && <span>{message.model}</span>}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(message.id, message.text)}
                    className="flex items-center gap-1 hover:text-yellow-300 transition-colors cursor-pointer p-1"
                    title="Copy message to clipboard"
                  >
                    {copiedId === message.id ? (
                      <>
                        <Check className="w-3 h-3 text-yellow-400" />
                        <span className="text-yellow-400 text-[10px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </button>

                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => onSpeakMessage(message.text)}
                      className={`flex items-center gap-1 transition-colors cursor-pointer p-1 ${
                        isSpeaking
                          ? 'text-yellow-400 font-bold'
                          : 'hover:text-yellow-300 text-neutral-400'
                      }`}
                      title={isSpeaking ? 'Speaking this message' : 'Speak this response'}
                    >
                      <Volume2 className={`w-3 h-3 ${isSpeaking ? 'animate-pulse' : ''}`} />
                      <span className="text-[10px]">{isSpeaking ? 'Speaking' : 'Speak'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Thinking indicator when awaiting response */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-start"
        >
          <div className={`flex items-center gap-1.5 mb-1.5 px-1 text-[11px] font-mono ${
            isDeepSearch ? 'text-cyan-400' : 'text-yellow-400'
          }`}>
            {isDeepSearch ? (
              <Globe className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            ) : (
              <Sun className="w-3 h-3 text-yellow-400 animate-spin-slow" />
            )}
            <span>
              {isDeepSearch
                ? 'Sunfyer DeepSearch active: Synthesizing live knowledge & high reasoning...'
                : 'Sunfyer synthesising transmission...'}
            </span>
          </div>
          <div className={`rounded-2xl p-4 flex items-center gap-2 ${
            isDeepSearch
              ? 'bg-[#0a1218] border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
              : 'bg-[#0e0e13] border border-yellow-500/30 shadow-[0_0_20px_rgba(250,204,21,0.15)]'
          }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${isDeepSearch ? 'bg-cyan-400' : 'bg-yellow-400'}`} />
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${isDeepSearch ? 'bg-cyan-400' : 'bg-yellow-400'}`}
              style={{ animationDelay: '0.2s' }}
            />
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${isDeepSearch ? 'bg-cyan-400' : 'bg-yellow-400'}`}
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        </motion.div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

