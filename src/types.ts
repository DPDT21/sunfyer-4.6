export type AssistantPersona = 'core' | 'radiant_coder' | 'creative_flare' | 'ultra_concise';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export type ColorTheme = 'solar' | 'supernova' | 'plasma' | 'emerald' | 'crimson' | 'eclipse';

export type HudDensity = 'minimal' | 'balanced' | 'dense';

export type BackgroundEffect = 'grid' | 'hex' | 'particles' | 'none';

export type OrbStyle = 'corona' | 'pulsar' | 'quantum' | 'shield' | 'cyber';

export type OrbSize = 'compact' | 'standard' | 'cinematic';

export type PulseSpeed = 'slow' | 'balanced' | 'turbo' | 'hyper';

export type GlowIntensity = 'subtle' | 'moderate' | 'radiant' | 'blinding';

export type FontScale = 'compact' | 'normal' | 'expanded';

export type FontFamily = 'mono' | 'sans' | 'tech';

export type InterfaceFont = 'outfit' | 'mono' | 'sora';

export type MessageTextSize = 'compact' | 'standard' | 'large';

export interface GroundingSource {
  title: string;
  url?: string;
  snippet?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  isVoiceInput?: boolean;
  latencyMs?: number;
  model?: string;
  isDeepSearch?: boolean;
  sources?: GroundingSource[];
  searchQueries?: string[];
  researchDepth?: string;
}

export interface CustomizationSettings {
  assistantName: string;
  userName: string;
  assistantCallsign?: string;
  colorTheme: ColorTheme;
  hudDensity: HudDensity;
  orbStyle: OrbStyle;
  pulseSpeed: PulseSpeed;
  glowIntensity: GlowIntensity;
  fontFamily: FontFamily;
  fontScale?: FontScale;
  showHUD: boolean;
  showEqualizer: boolean;
  solarFlares: boolean;
  showReticle?: boolean;
  showTelemetry?: boolean;
  crtScanlines?: boolean;
  audioVolume: number; // 0.0 to 1.0
  soundVolume: number; // 0.0 to 1.0
  soundEffects: boolean;
}

export interface AutoUpdateSettings {
  enabled: boolean;
  checkIntervalMinutes: number;
  channel: 'stable' | 'beta';
  autoDownload: boolean;
  notifyOnUpdate: boolean;
}

export interface VoiceSettings {
  autoSpeak: boolean;
  handsFree: boolean;
  deepSearch: boolean;
  voiceName: string;
  rate: number;
  pitch: number;
  soundFx: boolean;
  stripPunctuation?: boolean;
  autoUpdate?: AutoUpdateSettings;
}

export interface UpdateManifest {
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

export interface QuickPrompt {
  id: string;
  label: string;
  prompt: string;
  category: 'solar' | 'code' | 'creative' | 'query' | 'deepsearch';
}
