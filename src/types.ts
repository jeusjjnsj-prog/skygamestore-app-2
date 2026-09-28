export type TabType = 'home' | 'products' | 'cart' | 'account';

export interface Product {
  id: string;
  titleKhmer: string;
  titleEn: string;
  price: number;
  salesCount: string;
  category: 'ai' | 'design' | 'streaming' | 'social';
  imageType: 'gemini-banner' | 'gemini-logo' | 'capcut' | 'grok' | 'chatgpt' | 'canva' | 'netflix' | 'youtube';
  imageUrl?: string;
  badge?: string;
  descriptionKhmer: string;
  deliveryType: 'email' | 'credentials' | 'telegram';
  deliveryPlaceholder: string;
  features: string[];
  durations: {
    label: string;
    price: number;
    popular?: boolean;
  }[];
}

export interface CartItem {
  cartId: string;
  product: Product;
  selectedDuration: string;
  price: number;
  quantity: number;
  deliveryContact: string;
}

export interface OrderItem {
  orderId: string;
  date: string;
  productTitle: string;
  duration: string;
  price: number;
  paymentMethod: string;
  deliveryContact: string;
  credentialsOrKey: string;
  status: 'completed' | 'processing';
}
