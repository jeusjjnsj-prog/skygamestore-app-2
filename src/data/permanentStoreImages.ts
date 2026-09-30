// Permanent images committed directly to the repository and bundled in public builds
// This guarantees images will never disappear after publishing, exporting to GitHub, or deploying

export const DEFAULT_PERMANENT_HERO_BANNER: string = '/images/skypro_hero_banner.jpg';
export const DEFAULT_PERMANENT_QR: string = '/images/khqr_custom.jpg';
export const DEFAULT_PERMANENT_LOGO: string = '/images/skypro_logo.jpg';

export const DEFAULT_PERMANENT_IMAGES: Record<string, string> = {
  'gemini-pro-18m-admin': '/images/gemini-pro-18m-admin.jpg',
  'gemini-ai-pro-18m': '/images/gemini-pro-18m-admin.jpg',
  'capcut-pro-1m': '/images/capcut-pro-1m.jpg',
  'chatgpt-plus-1m': '/images/chatgpt-plus-1m.jpg',
  'canva-pro-1y': '/images/canva-pro-1y.jpg',
  'super-grok-9-10d': '/images/banner_ai_pro.jpg',
  'netflix-premium-1m': '/images/banner_ai_pro.jpg',
  'youtube-premium-1y': '/images/banner_canva_pro.jpg',
  'claude-3-5-sonnet-1m': '/images/chatgpt-plus-1m.jpg',
  'spotify-premium-3m': '/images/banner_capcut_pro.jpg',
  'telegram-premium-3m': '/images/banner_ai_pro.jpg',
  'duolingo-super-1y': '/images/canva-pro-1y.jpg',
};
