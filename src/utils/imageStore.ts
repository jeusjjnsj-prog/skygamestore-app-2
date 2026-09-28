// Global helper to store and retrieve product images, backed by storeSync service and local cache
import { storeSync } from '../services/storeSync';

export const getCustomProductImage = (productId: string): string | null => {
  return storeSync.getData().productImages[productId] || null;
};

export const setCustomProductImage = (productId: string, dataUrl: string): void => {
  storeSync.updateProductImage(productId, dataUrl);
};

export const removeCustomProductImage = (productId: string): void => {
  storeSync.updateProductImage(productId, null);
};

export const getAllCustomProductImages = (): Record<string, string> => {
  return storeSync.getData().productImages;
};
