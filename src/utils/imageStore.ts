// Global helper to store and retrieve product images, backed by storeSync service and local cache
import { storeSync } from '../services/storeSync';

/**
 * Appends a cache-busting query parameter (?v=timestamp) to an image URL.
 * Automatically cleans any old ?v= param and replaces it with the latest timestamp.
 * Preserves data: and blob: URLs without modification.
 */
export const appendCacheBuster = (
  url: string | null | undefined,
  timestamp?: number
): string => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const v = timestamp || Date.now();
  const [base, query] = url.split('?');
  const params = new URLSearchParams(query || '');
  params.set('v', v.toString());
  return `${base}?${params.toString()}`;
};

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
