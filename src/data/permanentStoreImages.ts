// Permanent images committed directly to the repository and bundled in public builds
// This guarantees images will never disappear after publishing, exporting to GitHub, or deploying

export const DEFAULT_PERMANENT_IMAGES: Record<string, string> = {
  'gemini-pro-18m-admin': '/images/gemini-pro-18m-admin.jpg',
  'capcut-pro-1m': '/images/capcut-pro-1m.jpg',
  'chatgpt-plus-1m': '/images/chatgpt-plus-1m.jpg',
  'canva-pro-1y': '/images/canva-pro-1y.jpg',
};

export const DEFAULT_PERMANENT_QR: string = '/images/khqr_custom.jpg';
