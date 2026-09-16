import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  Terminal,
  ShieldCheck,
  Check,
  FileCode,
  Laptop,
  RefreshCw,
  AlertTriangle,
  FolderArchive,
  Sparkles,
  ExternalLink,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import { CustomizationSettings } from '../types';
import { THEMES } from '../utils/theme';
import {
  downloadSunfyerExe,
  downloadInstallBat,
  downloadSunfyerZip,
} from '../utils/desktopAppAssets';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUpdate?: () => void;
  customization?: CustomizationSettings;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  onOpenUpdate,
  customization,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadedItem, setDownloadedItem] = useState<string | null>(null);
  const theme = THEMES[customization?.colorTheme || 'solar'] || THEMES.solar;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  const handleDownloadExe = () => {
    downloadSunfyerExe();
    setDownloadedItem('exe');
    setTimeout(() => setDownloadedItem(null), 4000);
  };

  const handleDownloadBat = async () => {
    await downloadInstallBat();
    setDownloadedItem('bat');
    setTimeout(() => setDownloadedItem(null), 4000);
  };

  const handleDownloadZip = () => {
    downloadSunfyerZip();
    setDownloadedItem('zip');
    setTimeout(() => setDownloadedItem(null), 4000);
  };

  const copyDirectUrl = () => {
    navigator.clipboard.writeText(`${currentOrigin}/Sunfyer.exe`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-[#0d0d12] border border-neutral-800 p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            style={{
              borderColor: `rgba(${theme.primaryRgb}, 0.35)`,
              boxShadow: `0 0 40px -10px ${theme.glow}`,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 rounded-xl border bg-black"
                  style={{
                    borderColor: theme.primary,
                    color: theme.primary,
                    boxShadow: `0 0 15px ${theme.glow}`,
                  }}
                >
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-100 font-mono tracking-wide flex items-center gap-2">
                    <span>INSTALL SUNFYER PC APP</span>
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Windows Desktop App &bull; Verified Build
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Resolved 403 & Download Issue Notice */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs font-mono">
                <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Fixes Applied: Error 403 &amp; Executable Download</span>
              </div>
              <ul className="text-xs text-neutral-300 leading-relaxed font-sans space-y-1 pl-1">
                <li>
                  <strong className="text-yellow-300">1. Error 403 (Forbidden) Fixed:</strong> The PC app previously opened Microsoft Edge, which did not have your active Google AI Studio session. The updated executable now automatically launches with <strong>Google Chrome</strong> (or your default browser) where your account is signed in!
                </li>
                <li>
                  <strong className="text-yellow-300">2. EXE Won't Download Fixed:</strong> Browser preview iframes block direct <code className="text-amber-300 font-mono">.exe</code> file downloads. Use the <strong>&ldquo;Open Download in New Tab&rdquo;</strong> button or download the <strong>Sunfyer-Windows.zip</strong> archive below!
                </li>
              </ul>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 mb-5">
              {/* 1. Recommended: ZIP Archive (Bypasses all iframe download blocks) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  className="flex-1 flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-black font-semibold shadow-[0_0_25px_rgba(250,204,21,0.3)] transition-all group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-black/15 flex items-center justify-center shrink-0">
                      <FolderArchive className="w-5 h-5 text-neutral-950" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono tracking-tight flex items-center gap-2">
                        <span>Sunfyer-Windows.zip</span>
                        <span className="text-[10px] bg-black text-yellow-400 px-1.5 py-0.2 rounded font-sans uppercase font-bold">
                          Recommended
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-900 font-sans font-medium">
                        Contains Sunfyer.exe + Installer + Icon (Zero browser download blocks)
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold uppercase bg-black text-yellow-400 px-2.5 py-1 rounded-lg shadow-sm group-hover:scale-105 transition-transform shrink-0">
                    {downloadedItem === 'zip' ? 'Downloaded!' : 'Download .ZIP'}
                  </span>
                </button>
              </div>

              {/* 2. Direct Standalone .EXE with New Tab Fallback */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadExe}
                  className="flex-1 flex items-center justify-between p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-yellow-500/40 hover:border-yellow-400 text-neutral-100 transition-all group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-yellow-400 shrink-0">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-neutral-100 flex items-center gap-1.5">
                        <span>Sunfyer.exe</span>
                        <span className="text-[10px] bg-yellow-400/20 text-yellow-300 px-1.5 py-0.2 rounded font-sans">
                          24.5 KB &bull; Chrome-prioritized
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Launches with Google Chrome session to prevent 403 error
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-yellow-400 group-hover:underline shrink-0">
                    {downloadedItem === 'exe' ? 'Downloaded!' : 'Download .EXE'}
                  </span>
                </button>

                <a
                  href="/api/download/Sunfyer.exe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-yellow-400 text-yellow-400 flex items-center gap-1.5 text-xs font-mono transition-colors shrink-0"
                  title="Open download in a new browser tab to bypass iframe security"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">New Tab</span>
                </a>
              </div>

              {/* 3. 1-Click Installer & Repair Tool */}
              <button
                type="button"
                onClick={handleDownloadBat}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 hover:border-yellow-400/40 text-neutral-300 transition-all group cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-yellow-400/80 shrink-0" />
                  <div>
                    <div className="text-xs font-mono font-semibold text-neutral-200 flex items-center gap-1.5">
                      <span>Install-Sunfyer.bat</span>
                      <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.2 rounded font-sans">
                        Auto Setup
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      Creates Desktop &amp; Start Menu shortcuts with custom solar icon
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-neutral-400 group-hover:text-yellow-300 shrink-0">
                  {downloadedItem === 'bat' ? 'Downloaded!' : 'Download .BAT'}
                </span>
              </button>
            </div>

            {/* SmartScreen & Run Guidance */}
            <div className="rounded-xl bg-neutral-900/80 border border-neutral-800/90 p-4 mb-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-yellow-300 font-semibold font-mono">
                <ShieldCheck className="w-4 h-4 text-yellow-400" />
                <span>How to Install on Windows:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-neutral-300 leading-relaxed font-sans pl-1">
                <li>
                  Run <strong>Install-Sunfyer.bat</strong> (or launch <strong>Sunfyer.exe</strong>).
                </li>
                <li>
                  If Windows SmartScreen prompts <em>&ldquo;Windows protected your PC&rdquo;</em>, click{' '}
                  <strong className="text-white underline cursor-default">&ldquo;More info&rdquo;</strong> then click{' '}
                  <strong className="text-yellow-400">&ldquo;Run anyway&rdquo;</strong>.
                </li>
                <li>
                  Sunfyer installs into your Windows applications, adds a custom solar desktop shortcut, and launches in a distraction-free windowed PC app!
                </li>
              </ol>
            </div>

            {/* Existing User Auto-Update Banner */}
            {onOpenUpdate && (
              <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-3 mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin-slow shrink-0" />
                  <span className="text-xs text-neutral-300">
                    Need to hot-patch or update an existing installation?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenUpdate();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-yellow-300 text-xs font-mono font-semibold transition-colors cursor-pointer shrink-0 border border-yellow-400/30"
                >
                  Updater Hub
                </button>
              </div>
            )}

            {/* Direct URL Link */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
              <span className="text-[11px] font-mono text-neutral-500">
                Direct URL: /Sunfyer.exe
              </span>
              <button
                type="button"
                onClick={copyDirectUrl}
                className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-yellow-300 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <FileCode className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Direct Link'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
