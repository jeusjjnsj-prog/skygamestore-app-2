import { DEFAULT_PERMANENT_IMAGES, DEFAULT_PERMANENT_QR } from '../data/permanentStoreImages';

export interface StoreSyncData {
  productImages: Record<string, string>;
  qrImage: string | null;
}

type SyncListener = (data: StoreSyncData) => void;

class StoreSyncService {
  private listeners: Set<SyncListener> = new Set();
  private eventSource: EventSource | null = null;
  private currentData: StoreSyncData = {
    productImages: { ...DEFAULT_PERMANENT_IMAGES },
    qrImage: DEFAULT_PERMANENT_QR,
  };

  constructor() {
    this.initFromLocalStorage();
    this.fetchInitialData();
    this.connectLiveSync();
  }

  private initFromLocalStorage() {
    try {
      const savedImgs = localStorage.getItem('skypro_custom_images');
      const savedQr = localStorage.getItem('skypro_custom_qr');
      if (savedImgs) {
        this.currentData.productImages = {
          ...DEFAULT_PERMANENT_IMAGES,
          ...JSON.parse(savedImgs),
        };
      }
      if (savedQr) {
        this.currentData.qrImage = savedQr;
      }
    } catch {
      // Ignore storage errors
    }
  }

  public getData(): StoreSyncData {
    return this.currentData;
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.currentData);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.currentData);
      } catch (err) {
        console.error('Error notifying sync listener', err);
      }
    }
  }

  private async fetchInitialData() {
    try {
      const res = await fetch('/api/store-data');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          this.applySyncData(json.data);
        }
      }
    } catch (err) {
      console.warn('Initial store data fetch fallback to local:', err);
    }
  }

  private connectLiveSync() {
    if (typeof window === 'undefined') return;

    try {
      if (this.eventSource) {
        this.eventSource.close();
      }

      this.eventSource = new EventSource('/api/live-sync');

      this.eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && payload.data) {
            this.applySyncData(payload.data);
          }
        } catch (err) {
          console.error('SSE parse error:', err);
        }
      };

      this.eventSource.onerror = () => {
        // Reconnect after brief pause
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        setTimeout(() => this.connectLiveSync(), 5000);
      };
    } catch (err) {
      console.warn('Live sync EventSource error:', err);
    }
  }

  private applySyncData(data: StoreSyncData) {
    this.currentData = {
      productImages: {
        ...DEFAULT_PERMANENT_IMAGES,
        ...this.currentData.productImages,
        ...(data.productImages || {}),
      },
      qrImage: (data.qrImage !== undefined && data.qrImage !== null) ? data.qrImage : (this.currentData.qrImage || DEFAULT_PERMANENT_QR),
    };

    // Cache locally as backup
    try {
      localStorage.setItem('skypro_custom_images', JSON.stringify(this.currentData.productImages));
      if (this.currentData.qrImage) {
        localStorage.setItem('skypro_custom_qr', this.currentData.qrImage);
      } else {
        localStorage.removeItem('skypro_custom_qr');
      }
    } catch {
      // Ignore
    }

    this.notify();
  }

  // Update a product's image and sync across all clients instantly
  public async updateProductImage(productId: string, dataUrl: string | null): Promise<boolean> {
    // 1. Optimistic update locally
    const newImages = { ...this.currentData.productImages };
    if (dataUrl) {
      newImages[productId] = dataUrl;
    } else {
      delete newImages[productId];
    }
    this.currentData.productImages = newImages;
    this.notify();

    try {
      localStorage.setItem('skypro_custom_images', JSON.stringify(newImages));
    } catch {
      // Ignore
    }

    // 2. Send to backend server to persist and broadcast to all visitors
    try {
      const res = await fetch('/api/product-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, dataUrl }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.productImages) {
          this.currentData.productImages = json.productImages;
          this.notify();
          return true;
        }
      }
    } catch (err) {
      console.error('Failed to sync product image to server:', err);
    }
    return false;
  }

  // Update custom ABA KHQR image and sync across all clients instantly
  public async updateStoreQr(qrImage: string | null): Promise<boolean> {
    // 1. Optimistic update locally
    this.currentData.qrImage = qrImage;
    this.notify();

    try {
      if (qrImage) {
        localStorage.setItem('skypro_custom_qr', qrImage);
      } else {
        localStorage.removeItem('skypro_custom_qr');
      }
    } catch {
      // Ignore
    }

    // 2. Send to backend server
    try {
      const res = await fetch('/api/store-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrImage }),
      });

      if (res.ok) {
        return true;
      }
    } catch (err) {
      console.error('Failed to sync store QR to server:', err);
    }
    return false;
  }
}

export const storeSync = new StoreSyncService();
