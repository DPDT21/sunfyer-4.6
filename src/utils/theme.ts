import { ColorTheme } from '../types';

export interface ThemeConfig {
  id: ColorTheme;
  name: string;
  subtitle: string;
  primary: string; // e.g. #facc15
  primaryRgb: string; // e.g. 250, 204, 21
  secondary: string;
  accent: string;
  glow: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  bgGlow: string;
  swatchGradient: string;
}

export const THEMES: Record<ColorTheme, ThemeConfig> = {
  solar: {
    id: 'solar',
    name: 'Solar Flare',
    subtitle: 'Amber & Radiant Gold',
    primary: '#facc15',
    primaryRgb: '250, 204, 21',
    secondary: '#f59e0b',
    accent: '#fef08a',
    glow: 'rgba(250, 204, 21, 0.45)',
    border: 'rgba(250, 204, 21, 0.35)',
    badgeBg: 'rgba(250, 204, 21, 0.15)',
    badgeText: '#fef08a',
    bgGlow: 'radial-gradient(ellipse at 50% 0%, rgba(250, 204, 21, 0.15) 0%, transparent 65%)',
    swatchGradient: 'linear-gradient(135deg, #facc15 0%, #f59e0b 50%, #b45309 100%)',
  },
  supernova: {
    id: 'supernova',
    name: 'Supernova Azure',
    subtitle: 'Deep Space Cyan & Cobalt',
    primary: '#06b6d4',
    primaryRgb: '6, 182, 212',
    secondary: '#0284c7',
    accent: '#67e8f9',
    glow: 'rgba(6, 182, 212, 0.45)',
    border: 'rgba(6, 182, 212, 0.35)',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    badgeText: '#67e8f9',
    bgGlow: 'radial-gradient(ellipse at 50% 0%, rgba(6, 182, 212, 0.16) 0%, transparent 65%)',
    swatchGradient: 'linear-gradient(135deg, #67e8f9 0%, #06b6d4 50%, #0369a1 100%)',
  },
  plasma: {
    id: 'plasma',
    name: 'Plasma Violet',
    subtitle: 'Ultraviolet & Neon Fuchsia',
    primary: '#c084fc',
    primaryRgb: '192, 132, 252',
    secondary: '#d946ef',
    accent: '#f0abfc',
    glow: 'rgba(192, 132, 252, 0.45)',
    border: 'rgba(192, 132, 252, 0.35)',
    badgeBg: 'rgba(192, 132, 252, 0.15)',
    badgeText: '#f5d0fe',
    bgGlow: 'radial-gradient(ellipse at 50% 0%, rgba(192, 132, 252, 0.16) 0%, transparent 65%)',
    swatchGradient: 'linear-gradient(135deg, #f0abfc 0%, #c084fc 50%, #7e22ce 100%)',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Aurora',
    subtitle: 'Bio-Luminescent Jade & Mint',
    primary: '#10b981',
    primaryRgb: '16, 185, 129',
    secondary: '#059669',
    accent: '#6ee7b7',
    glow: 'rgba(16, 185, 129, 0.45)',
    border: 'rgba(16, 185, 129, 0.35)',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeText: '#a7f3d0',
    bgGlow: 'radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.16) 0%, transparent 65%)',
    swatchGradient: 'linear-gradient(135deg, #6ee7b7 0%, #10b981 50%, #047857 100%)',
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Pulsar',
    subtitle: 'Blood Orange & Flare Red',
    primary: '#f43f5e',
    primaryRgb: '244, 63, 94',
    secondary: '#e11d48',
    accent: '#fda4af',
    glow: 'rgba(244, 63, 94, 0.45)',
    border: 'rgba(244, 63, 94, 0.35)',
    badgeBg: 'rgba(244, 63, 94, 0.15)',
    badgeText: '#fecdd3',
    bgGlow: 'radial-gradient(ellipse at 50% 0%, rgba(244, 63, 94, 0.16) 0%, transparent 65%)',
    swatchGradient: 'linear-gradient(135deg, #fda4af 0%, #f43f5e 50%, #be123c 100%)',
  },
  eclipse: {
    id: 'eclipse',
    name: 'Eclipse Stealth',
    subtitle: 'Titanium Silver & Carbon',
    primary: '#e2e8f0',
    primaryRgb: '226, 232, 240',
    secondary: '#94a3b8',
    accent: '#ffffff',
    glow: 'rgba(226, 232, 240, 0.35)',
    border: 'rgba(226, 232, 240, 0.25)',
    badgeBg: 'rgba(226, 232, 240, 0.12)',
    badgeText: '#f8fafc',
    bgGlow: 'radial-gradient(ellipse at 50% 0%, rgba(226, 232, 240, 0.12) 0%, transparent 65%)',
    swatchGradient: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #475569 100%)',
  },
};

export function applyThemeVariables(themeId: ColorTheme) {
  const theme = THEMES[themeId] || THEMES.solar;
  const root = document.documentElement;
  root.style.setProperty('--solar-primary', theme.primary);
  root.style.setProperty('--solar-primary-rgb', theme.primaryRgb);
  root.style.setProperty('--solar-secondary', theme.secondary);
  root.style.setProperty('--solar-accent', theme.accent);
  root.style.setProperty('--solar-glow', theme.glow);
  root.style.setProperty('--solar-border', theme.border);
}
