import { DEFAULT_PERMANENT_IMAGES, DEFAULT_PERMANENT_QR } from '../data/permanentStoreImages';

export interface StoreSyncData {
  productImages: Record<string, string>;
  qrImage: string | null;
  lastUpdated?: number;
}

type SyncListener = (data: StoreSyncData, timestamp: number) => void;

class StoreSyncService {
  private listeners: Set<SyncListener> = new Set();
  private eventSource: EventSource | null = null;
  private lastUpdated: number = Date.now();
  private currentData: StoreSyncData = {
    productImages: { ...DEFAULT_PERMANENT_IMAGES },
    qrImage: DEFAULT_PERMANENT_QR,
    lastUpdated: Date.now(),
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
      const savedTs = localStorage.getItem('skypro_images_timestamp');
      if (savedTs) {
        this.lastUpdated = parseInt(savedTs, 10) || Date.now();
      }
      if (savedImgs) {
        this.currentData.productImages = {
          ...DEFAULT_PERMANENT_IMAGES,
          ...JSON.parse(savedImgs),
        };
      }
      if (savedQr) {
        this.currentData.qrImage = savedQr;
      }
      this.currentData.lastUpdated = this.lastUpdated;
    } catch {
      // Ignore storage errors
    }
  }

  public getData(): StoreSyncData {
    return this.currentData;
  }

  public getLastUpdated(): number {
    return this.lastUpdated;
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.currentData, this.lastUpdated);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.currentData, this.lastUpdated);
      } catch (err) {
        console.error('Error notifying sync listener', err);
      }
    }
  }

  private async fetchInitialData() {
    try {
      const res = await fetch(`/api/store-data?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
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

  /**
   * Force refresh store data from server with cache-busting
   */
  public async forceRefresh(): Promise<void> {
    try {
      const res = await fetch(`/api/store-data?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          this.lastUpdated = Date.now();
          this.applySyncData(json.data);
        }
      }
    } catch (err) {
      console.warn('Force refresh store data error:', err);
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
            this.lastUpdated = Date.now();
            this.applySyncData(payload.data);
          }
        } catch (err) {
          console.error('SSE parse error:', err);
        }
      };

      this.eventSource.onerror = () => {
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        setTimeout(() => this.connectLiveSync(), 4000);
      };
    } catch (err) {
      console.warn('Live sync EventSource error:', err);
    }
  }

  private applySyncData(data: StoreSyncData) {
    this.lastUpdated = Date.now();
    this.currentData = {
      productImages: {
        ...DEFAULT_PERMANENT_IMAGES,
        ...this.currentData.productImages,
        ...(data.productImages || {}),
      },
      qrImage: (data.qrImage !== undefined && data.qrImage !== null)
        ? data.qrImage
        : (this.currentData.qrImage || DEFAULT_PERMANENT_QR),
      lastUpdated: this.lastUpdated,
    };

    // Cache locally as backup
    try {
      localStorage.setItem('skypro_custom_images', JSON.stringify(this.currentData.productImages));
      localStorage.setItem('skypro_images_timestamp', this.lastUpdated.toString());
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
    const now = Date.now();
    this.lastUpdated = now;

    // 1. Instant optimistic update locally
    const newImages = { ...this.currentData.productImages };
    if (dataUrl) {
      newImages[productId] = dataUrl;
    } else {
      delete newImages[productId];
    }
    this.currentData.productImages = newImages;
    this.currentData.lastUpdated = now;
    
    // Notify all UI subscribers immediately (0ms)
    this.notify();

    try {
      localStorage.setItem('skypro_custom_images', JSON.stringify(newImages));
      localStorage.setItem('skypro_images_timestamp', now.toString());
    } catch {
      // Ignore
    }

    // 2. Persist to server
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
          this.lastUpdated = Date.now();
          this.notify();
        }
      }
    } catch (err) {
      console.error('Failed to sync product image to server:', err);
    }

    // 3. Trigger 1-second auto-refresh to guarantee front-page and all components reflect fresh image
    setTimeout(() => {
      this.forceRefresh();
    }, 1000);

    return true;
  }

  // Update custom ABA KHQR image and sync across all clients instantly
  public async updateStoreQr(qrImage: string | null): Promise<boolean> {
    const now = Date.now();
    this.lastUpdated = now;

    // 1. Instant optimistic update locally
    this.currentData.qrImage = qrImage;
    this.currentData.lastUpdated = now;
    this.notify();

    try {
      localStorage.setItem('skypro_images_timestamp', now.toString());
      if (qrImage) {
        localStorage.setItem('skypro_custom_qr', qrImage);
      } else {
        localStorage.removeItem('skypro_custom_qr');
      }
    } catch {
      // Ignore
    }

    // 2. Persist to server
    try {
      const res = await fetch('/api/store-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrImage }),
      });

      if (res.ok) {
        this.lastUpdated = Date.now();
        this.notify();
      }
    } catch (err) {
      console.error('Failed to sync store QR to server:', err);
    }

    // 3. Trigger 1-second auto-refresh
    setTimeout(() => {
      this.forceRefresh();
    }, 1000);

    return true;
  }
}

export const storeSync = new StoreSyncService();
