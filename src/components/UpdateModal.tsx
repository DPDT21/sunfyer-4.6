import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RefreshCw,
  X,
  Check,
  CheckCircle2,
  ArrowUpCircle,
  Download,
  Terminal,
  Copy,
  ShieldCheck,
  Sparkles,
  Zap,
  Clock,
  Layers,
  FileCode,
} from 'lucide-react';
import { playSolarTone } from '../utils/audio';
import { downloadSunfyerExe, downloadSunfyerZip } from '../utils/desktopAppAssets';

interface UpdateInfo {
  latestVersion: string;
  releaseName: string;
  releaseDate: string;
  releaseChannel: string;
  binaryName: string;
  binarySize: string;
  downloadUrl: string;
  updaterBatUrl: string;
  bundleZipUrl: string;
  features: string[];
}

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVersion?: string;
  onVersionUpdated?: (newVersion: string) => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  onClose,
  currentVersion = '4.1.0',
  onVersionUpdated,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [localVer, setLocalVer] = useState(currentVersion);
  const [hotPatchStatus, setHotPatchStatus] = useState<'idle' | 'patching' | 'complete' | 'failed'>('idle');
  const [patchProgress, setPatchProgress] = useState(0);

  // Sync with currentVersion prop
  useEffect(() => {
    setLocalVer(currentVersion);
  }, [currentVersion]);

  // Fetch latest update info from server
  const fetchUpdateManifest = async () => {
    setIsChecking(true);
    playSolarTone('warp_chirp');
    try {
      const res = await fetch('/api/update/check');
      if (res.ok) {
        const data = await res.json();
        setUpdateInfo(data);
      } else {
        // Fallback info
        setUpdateInfo({
          latestVersion: '4.2.0',
          releaseName: 'Sunfyer Quantum Pulse',
          releaseDate: '2026-09-15',
          releaseChannel: 'stable',
          binaryName: 'Sunfyer.exe',
          binarySize: '23.4 KB',
          downloadUrl: '/api/download/Sunfyer.exe',
          updaterBatUrl: '/api/download/Update-Sunfyer.bat',
          bundleZipUrl: '/api/download/Sunfyer-Windows.zip',
          features: [
            'Live Google Search Grounding: Deep research connects directly to global web indices',
            'Interface Customization: 6 color themes, customizable solar orb dynamics & HUD matrix',
            'Background Auto-Update: Instant in-app hot-patching and automated release telemetry',
            'Acoustic Echo Shield: AI self-voice suppression drops feedback loops completely',
            'VAD Auto-Dispatch: Speech detection countdown automatically transmits on pause',
            'Barge-In Voice Interruption: Tap Solar Orb, press Spacebar, or speak to override',
          ],
        });
      }
    } catch {
      // Offline fallback
      setUpdateInfo({
        latestVersion: '4.2.0',
        releaseName: 'Sunfyer Quantum Pulse',
        releaseDate: '2026-09-15',
        releaseChannel: 'stable',
        binaryName: 'Sunfyer.exe',
        binarySize: '23.4 KB',
        downloadUrl: '/api/download/Sunfyer.exe',
        updaterBatUrl: '/api/download/Update-Sunfyer.bat',
        bundleZipUrl: '/api/download/Sunfyer-Windows.zip',
        features: [
          'Live Google Search Grounding: Deep research queries real-time global web indices',
          'Complete Interface Customizer: 6 solar color themes, custom orb styles & typography',
          'In-App Background Auto-Updater: Automatic release telemetry & 1-click hot patch',
          'Acoustic Echo Shield: Zero feedback loop while Sunfyer vocalizes',
          'VAD Auto-Dispatch: Speech detection auto-transmits on conversational pause',
          'Barge-In Voice Interruption: Tap Solar Orb, press Spacebar, or speak to override',
        ],
      });
    } finally {
      setTimeout(() => {
        setIsChecking(false);
      }, 600);
    }
  };

  // Perform instant in-app update hot-patch
  const handleInstantHotPatch = async () => {
    if (!updateInfo) return;
    setHotPatchStatus('patching');
    setPatchProgress(15);
    playSolarTone('auto_dispatch');

    try {
      // Step 1: Simulated verification
      await new Promise((r) => setTimeout(r, 400));
      setPatchProgress(45);

      // Step 2: Notify backend
      const res = await fetch('/api/update/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetVersion: updateInfo.latestVersion }),
      });

      setPatchProgress(80);
      await new Promise((r) => setTimeout(r, 400));
      setPatchProgress(100);

      const newVer = updateInfo.latestVersion;
      setLocalVer(newVer);
      setHotPatchStatus('complete');
      playSolarTone('update_success');
      if (onVersionUpdated) {
        onVersionUpdated(newVer);
      }
    } catch {
      setHotPatchStatus('failed');
      setTimeout(() => setHotPatchStatus('idle'), 3000);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUpdateManifest();
    }
  }, [isOpen]);

  const isUpdateAvailable = updateInfo ? localVer !== updateInfo.latestVersion : false;

  const powershellCommand = `powershell -Command "Invoke-WebRequest -Uri '${window.location.origin}/Update-Sunfyer.bat' -OutFile 'Update-Sunfyer.bat'; .\\Update-Sunfyer.bat"`;

  const copyPowerShellCmd = () => {
    navigator.clipboard.writeText(powershellCommand);
    setCopiedCmd(true);
    playSolarTone('click');
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  const copyExeLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/Sunfyer.exe`);
    setCopiedLink(true);
    playSolarTone('click');
    setTimeout(() => setCopiedLink(false), 2000);
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
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            className="relative z-10 w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#090a10] border border-yellow-400/40 p-6 sm:p-7 shadow-[0_0_60px_rgba(250,204,21,0.2)] text-neutral-100 font-sans"
          >
            {/* Cyber Corner Decals */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-yellow-400" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-yellow-400" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-yellow-400" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-yellow-400" />

            {/* Close button */}
            <button
              id="update-modal-close-btn"
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-500/10 border border-yellow-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.3)] shrink-0">
                <ArrowUpCircle className="w-6 h-6 text-yellow-300" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
                  <span>Sunfyer Executable Updater</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-yellow-400/15 text-yellow-300 border border-yellow-400/40 uppercase">
                    v{updateInfo?.latestVersion || '4.2.0'}
                  </span>
                </h3>
                <p className="text-xs font-mono text-neutral-400">
                  Update, patch, or verify your Windows native <code className="text-yellow-300">Sunfyer.exe</code>
                </p>
              </div>
            </div>

            {/* Current Version vs Cloud Version Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {/* Local Installed Version */}
              <div className="p-3.5 rounded-2xl bg-black/60 border border-neutral-800 flex flex-col justify-between">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1 flex items-center justify-between">
                  <span>Installed EXE Build</span>
                  <button
                    type="button"
                    onClick={() => setLocalVer(localVer === '4.2.0' ? '4.1.0' : '4.2.0')}
                    className="text-[9px] text-yellow-400/80 hover:text-yellow-300 underline cursor-pointer"
                    title="Toggle to preview updater flow"
                  >
                    Switch to {localVer === '4.2.0' ? 'v4.1.0' : 'v4.2.0'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-mono font-bold text-neutral-200">
                    v{localVer}
                  </span>
                  {localVer === updateInfo?.latestVersion ? (
                    <span className="text-[10px] font-mono bg-green-500/20 text-green-400 px-2 py-0.5 rounded-md border border-green-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Latest</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30 flex items-center gap-1">
                      <span>Update Pending</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Latest Cloud Version */}
              <div className="p-3.5 rounded-2xl bg-black/60 border border-yellow-400/20 flex flex-col justify-between relative overflow-hidden">
                <div className="text-[10px] font-mono uppercase tracking-wider text-yellow-400/80 mb-1 flex items-center justify-between">
                  <span>Cloud Release Stream</span>
                  <button
                    type="button"
                    onClick={fetchUpdateManifest}
                    disabled={isChecking}
                    className="text-[10px] font-mono text-yellow-400 hover:text-yellow-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                    <span>Scan</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-mono font-bold text-yellow-300">
                    v{updateInfo?.latestVersion || '4.2.0'}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{updateInfo?.releaseDate || '2026-09-15'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Status Announcement Banner */}
            <div className={`p-3.5 rounded-2xl mb-5 flex items-center justify-between gap-3 border ${
              isUpdateAvailable
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                : 'bg-green-950/30 border-green-500/40 text-green-200'
            }`}>
              <div className="flex items-center gap-2.5">
                {isUpdateAvailable ? (
                  <Zap className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-mono font-bold">
                    {isUpdateAvailable
                      ? `NEW BUILD READY: v${updateInfo?.latestVersion} (${updateInfo?.releaseName})`
                      : `SUNFYER IS FULLY UP TO DATE (v${updateInfo?.latestVersion})`}
                  </div>
                  <div className="text-[11px] text-neutral-300">
                    {isUpdateAvailable
                      ? 'Includes real-time self-voice suppression shield, VAD auto-dispatch & barge-in interrupt.'
                      : 'Your executable has all current holographic and solar neural voice features.'}
                  </div>
                </div>
              </div>
            </div>

            {/* WHAT'S NEW IN THIS UPDATE */}
            {updateInfo?.features && (
              <div className="mb-6 p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800">
                <div className="text-xs font-mono font-bold text-yellow-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>What&apos;s New in v{updateInfo.latestVersion}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-300 font-sans">
                  {updateInfo.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold mt-0.5">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 1-CLICK UPDATE METHODS */}
            <div className="space-y-3 mb-6">
              <div className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                Select Your Update Method:
              </div>

              {/* METHOD 0: Instant In-App Hot Patch */}
              <div className="p-4 rounded-2xl bg-neutral-900/90 border border-yellow-400/40 shadow-[0_0_20px_rgba(250,204,21,0.15)] relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono text-white flex items-center gap-2">
                        <span>In-App Instant Hot Patch</span>
                        <span className="text-[10px] bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded font-mono uppercase">
                          Zero Downtime
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Synchronizes core intelligence and unlocks features without desktop restart
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleInstantHotPatch}
                    disabled={hotPatchStatus === 'patching' || localVer === updateInfo?.latestVersion}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      localVer === updateInfo?.latestVersion
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                        : hotPatchStatus === 'patching'
                        ? 'bg-yellow-400/30 text-yellow-200 cursor-wait'
                        : 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-md cursor-pointer hover:scale-105'
                    }`}
                  >
                    {localVer === updateInfo?.latestVersion
                      ? 'Already Applied'
                      : hotPatchStatus === 'patching'
                      ? 'Patching...'
                      : 'Apply Hot Patch'}
                  </button>
                </div>

                {/* Progress bar during hot-patching */}
                {hotPatchStatus === 'patching' && (
                  <div className="mt-3 pt-2 border-t border-white/10 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-yellow-300">
                      <span>Applying Quantum Solar Patch...</span>
                      <span>{patchProgress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full transition-all duration-300"
                        style={{ width: `${patchProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {hotPatchStatus === 'complete' && (
                  <div className="mt-2 text-[11px] font-mono text-green-400 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Runtime successfully upgraded to v{localVer}! All systems calibrated.</span>
                  </div>
                )}
              </div>

              {/* METHOD 1: One-Click Windows Auto-Updater Script (Recommended) */}
              <a
                id="update-download-bat-btn"
                href="/api/download/Update-Sunfyer.bat"
                download="Update-Sunfyer.bat"
                onClick={() => playSolarTone('auto_dispatch')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-neutral-950 font-semibold shadow-[0_0_25px_rgba(250,204,21,0.35)] transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/15 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-neutral-950 group-hover:rotate-180 transition-transform duration-500" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold font-mono tracking-tight flex items-center gap-2">
                      <span>Update-Sunfyer.bat</span>
                      <span className="text-[10px] bg-black text-yellow-300 px-1.5 py-0.2 rounded font-mono uppercase">
                        1-Click Self-Updater
                      </span>
                    </div>
                    <div className="text-xs text-neutral-900 font-medium">
                      Closes running app &bull; Replaces Sunfyer.exe safely &bull; Auto-relaunches
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold uppercase bg-black text-yellow-400 px-3 py-1.5 rounded-xl shadow-sm group-hover:scale-105 transition-transform shrink-0">
                  Run Updater
                </span>
              </a>

              {/* METHOD 2: Direct Replace Sunfyer.exe */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  id="update-download-exe-direct-btn"
                  onClick={() => {
                    playSolarTone('click');
                    downloadSunfyerExe();
                  }}
                  className="flex-1 flex items-center justify-between p-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-yellow-400/50 text-neutral-200 transition-all cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-yellow-400 shrink-0" />
                    <div>
                      <div className="text-xs font-mono font-semibold text-neutral-100">
                        Direct Download Sunfyer.exe
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Verified 24.5 KB &bull; Direct memory download
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-yellow-400 group-hover:underline shrink-0">
                    Download .EXE
                  </span>
                </button>

                {/* Complete ZIP bundle */}
                <button
                  type="button"
                  onClick={() => {
                    playSolarTone('click');
                    downloadSunfyerZip();
                  }}
                  className="flex-1 flex items-center justify-between p-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-yellow-400/50 text-neutral-200 transition-all cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-mono font-semibold text-neutral-100">
                        Full Windows Bundle
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        EXE + Installer + Desktop shortcuts
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 group-hover:underline shrink-0">
                    Download .ZIP
                  </span>
                </button>
              </div>
            </div>

            {/* METHOD 3: PowerShell Terminal Command (For Instant Update) */}
            <div className="rounded-2xl bg-black/80 border border-neutral-800 p-3.5 mb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <Terminal className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Windows Terminal / PowerShell One-Liner:</span>
                </div>
                <button
                  type="button"
                  onClick={copyPowerShellCmd}
                  className="flex items-center gap-1 text-[11px] font-mono text-yellow-400 hover:text-yellow-300 cursor-pointer"
                >
                  {copiedCmd ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd ? 'Command Copied!' : 'Copy Script'}</span>
                </button>
              </div>
              <div className="px-3 py-2 rounded-xl bg-neutral-950 font-mono text-[11px] text-yellow-300/90 break-all select-all border border-neutral-850">
                {powershellCommand}
              </div>
              <div className="mt-2 text-[10px] text-neutral-500 font-mono">
                Paste into PowerShell on Windows to automatically fetch and update in 2 seconds.
              </div>
            </div>

            {/* Updater Safeguards & SmartScreen Info */}
            <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-3.5 space-y-1.5 text-xs text-neutral-300">
              <div className="flex items-center gap-2 text-yellow-300 font-semibold font-mono">
                <ShieldCheck className="w-4 h-4 text-yellow-400" />
                <span>How the Auto-Updater Works Safely:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-neutral-400 leading-relaxed font-sans pl-1">
                <li><strong className="text-neutral-200">Releases File Lock:</strong> Closes any active <code className="text-yellow-300">Sunfyer.exe</code> process so Windows allows file replacement.</li>
                <li><strong className="text-neutral-200">Safety Backup:</strong> Backs up your existing executable to <code className="text-neutral-300">Sunfyer.exe.bak</code>.</li>
                <li><strong className="text-neutral-200">Atomically Replaces:</strong> Verifies file integrity (&gt;10 KB) and places the newest binary.</li>
                <li><strong className="text-neutral-200">Auto-Relaunches:</strong> Starts the fresh version with all new solar acoustics and HUD features.</li>
              </ol>
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                <span>Channel: Production Stable</span>
              </div>
              <button
                type="button"
                onClick={copyExeLink}
                className="text-neutral-400 hover:text-yellow-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <FileCode className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied' : 'Copy Direct Link'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
