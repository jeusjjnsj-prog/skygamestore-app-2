// Helper to store and retrieve user-uploaded custom images for each product
const STORAGE_PREFIX = 'skypro_custom_img_';

export const getCustomProductImage = (productId: string): string | null => {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${productId}`);
  } catch {
    return null;
  }
};

export const setCustomProductImage = (productId: string, dataUrl: string): void => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${productId}`, dataUrl);
  } catch (e) {
    console.error('Failed to save image in localStorage', e);
  }
};

export const removeCustomProductImage = (productId: string): void => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${productId}`);
  } catch {
    // ignore
  }
};

export const getAllCustomProductImages = (): Record<string, string> => {
  const images: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const productId = key.replace(STORAGE_PREFIX, '');
        const val = localStorage.getItem(key);
        if (val) images[productId] = val;
      }
    }
  } catch {
    // ignore
  }
  return images;
};
