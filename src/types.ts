export type TabType = 'home' | 'products' | 'cart' | 'account' | 'help';

export interface Product {
  id: string;
  titleKhmer: string;
  titleEn: string;
  price: number;
  salesCount: string;
  category: 'ai' | 'design' | 'streaming' | 'social' | 'tools';
  imageType: string;
  imageUrl?: string;
  badge?: string;
  tag?: string;
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
  activationLink?: string;
  status: 'completed' | 'processing';
}
