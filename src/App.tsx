import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Check, 
  Search, 
  Flame,
  ShieldCheck
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { CartScreen } from './components/CartScreen';
import { LoginScreen } from './components/LoginScreen';
import { DrawerMenu } from './components/DrawerMenu';
import { PRODUCTS } from './data/products';
import { Product, CartItem, OrderItem, TabType } from './types';
import { 
  getAllCustomProductImages, 
  setCustomProductImage, 
  removeCustomProductImage 
} from './utils/imageStore';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Custom Product Images uploaded by user/admin
  const [customImages, setCustomImages] = useState<Record<string, string>>(() => {
    return getAllCustomProductImages();
  });

  const handleUpdateCustomImage = (productId: string, dataUrl: string | null) => {
    if (dataUrl) {
      setCustomProductImage(productId, dataUrl);
      showToast('បានប្តូររូបភាពផលិតផលពិតរួចរាល់!');
    } else {
      removeCustomProductImage(productId);
      showToast('បានត្រឡប់ទៅរូបភាពដើមវិញ!');
    }
    setCustomImages(getAllCustomProductImages());
  };

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('skypro_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart Payment State - strictly within the Cart tab
  const [isPayingInCart, setIsPayingInCart] = useState(false);
  const [cartPayingProduct, setCartPayingProduct] = useState<Product | null>(null);

  // Authentication state - saved in localStorage so each phone number is isolated
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('skypro_is_logged_in') === 'true';
    } catch {
      return false;
    }
  });

  const [userPhone, setUserPhone] = useState<string>(() => {
    try {
      return localStorage.getItem('skypro_user_phone') || '';
    } catch {
      return '';
    }
  });

  const [pendingCartPayment, setPendingCartPayment] = useState(false);

  // Orders history state - strictly loaded from localStorage and isolated by phone
  const [orders, setOrders] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('skypro_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('skypro_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  /**
   * Flow when clicking "ទិញឥឡូវ" (Buy Now):
   * 1. Does NOT pay on home page!
   * 2. Adds the item to Cart.
   * 3. Jumps directly to the Cart tab (កន្ត្រកទំនិញ).
   * 4. Shows items in Cart matching IMG_1190.png.
   */
  const handleBuyNow = (product: Product, durationIndex: number = 0) => {
    const chosenPlan = product.durations[durationIndex] || product.durations[0];
    const itemPrice = chosenPlan ? chosenPlan.price : product.price;
    const planLabel = chosenPlan ? chosenPlan.label : 'Standard';

    // Check if already in cart
    const existing = cart.find(i => i.product.id === product.id && i.selectedDuration === planLabel);
    if (!existing) {
      setCart([
        ...cart,
        {
          cartId: `${product.id}-${Date.now()}`,
          product,
          selectedDuration: planLabel,
          price: itemPrice,
          quantity: 1,
          deliveryContact: userPhone || ''
        }
      ]);
    }

    // Close detail view if open
    setViewingProduct(null);
    setIsPayingInCart(false);

    // Navigate to Cart tab!
    setActiveTab('cart');
    showToast(`បានបញ្ចូល ${product.titleKhmer} ទៅកន្ត្រក!`);
  };

  const handleAddToCart = (product: Product, durationIndex: number = 0) => {
    const chosenPlan = product.durations[durationIndex] || product.durations[0];
    const itemPrice = chosenPlan ? chosenPlan.price : product.price;
    const planLabel = chosenPlan ? chosenPlan.label : 'Default';

    const existing = cart.find(i => i.product.id === product.id && i.selectedDuration === planLabel);
    if (existing) {
      setCart(cart.map(i => (i.product.id === product.id && i.selectedDuration === planLabel)
        ? { ...i, quantity: i.quantity + 1 }
        : i
      ));
    } else {
      setCart([
        ...cart,
        {
          cartId: `${product.id}-${Date.now()}`,
          product,
          selectedDuration: planLabel,
          price: itemPrice,
          quantity: 1,
          deliveryContact: userPhone || ''
        }
      ]);
    }
    showToast(`បានបញ្ចូល ${product.titleKhmer} ទៅកន្ត្រក!`);
  };

  const handleUpdateQty = (cartId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleRemoveCartItem = (cartId: string) => {
    setCart(cart.filter(item => item.cartId !== cartId));
    showToast('បានដកចេញពីកន្ត្រក');
  };

  const handleProceedCartCheckout = () => {
    if (cart.length === 0) return;

    if (!isLoggedIn || !userPhone.trim()) {
      setPendingCartPayment(true);
      showToast('សូមបង្កើតគណនី ឬចូលប្រើជាមុនសិន ដើម្បីបង់ប្រាក់!');
      setActiveTab('account');
      return;
    }

    const totalUsd = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const payingItem: Product = {
      ...cart[0].product,
      price: totalUsd,
      titleKhmer: cart.length === 1 ? cart[0].product.titleKhmer : `ទំនិញក្នុងកន្ត្រក (${cart.length} មុខ)`
    };

    setCartPayingProduct(payingItem);
    setIsPayingInCart(true);
  };

  const handleSuccessOrder = (newOrder: OrderItem) => {
    const updated = [newOrder, ...orders];
    setOrders(updated);
    try {
      localStorage.setItem('skypro_orders', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setCart([]);
  };

  // When user completes login / registration
  const handleLoginSuccess = (phone: string) => {
    setUserPhone(phone);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('skypro_is_logged_in', 'true');
      localStorage.setItem('skypro_user_phone', phone);
    } catch {
      // ignore
    }
    showToast('ចូលគណនីជោគជ័យ!');

    // If they were trying to checkout from Cart, take them back to Cart to pay!
    if (pendingCartPayment) {
      setPendingCartPayment(false);
      setActiveTab('cart');
      if (cart.length > 0) {
        const totalUsd = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const payingItem: Product = {
          ...cart[0].product,
          price: totalUsd,
          titleKhmer: cart.length === 1 ? cart[0].product.titleKhmer : `ទំនិញក្នុងកន្ត្រក (${cart.length} មុខ)`
        };
        setCartPayingProduct(payingItem);
        setIsPayingInCart(true);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserPhone('');
    setIsPayingInCart(false);
    try {
      localStorage.removeItem('skypro_is_logged_in');
      localStorage.removeItem('skypro_user_phone');
    } catch {
      // ignore
    }
    showToast('បានចាកចេញពីគណនី');
  };

  // Filter products
  const filteredProducts = PRODUCTS.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = p.titleKhmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.titleEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Top 4 exact products for Home Screen matching screenshot
  const homeFeaturedProducts = PRODUCTS.slice(0, 4);

  const totalCartCount = cart.reduce((s, i) => s + i.quantity, 0);

  // If viewing a single product in detail view
  if (viewingProduct) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-['Kantumruy_Pro',sans-serif]">
        {toastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <Check size={14} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <ProductDetailScreen
          product={viewingProduct}
          onBack={() => setViewingProduct(null)}
          onBuyNow={(prod, durIdx) => handleBuyNow(prod, durIdx)}
          onAddToCart={(prod, durIdx) => handleAddToCart(prod, durIdx)}
          cartCount={totalCartCount}
          onOpenCart={() => {
            setViewingProduct(null);
            setIsPayingInCart(false);
            setActiveTab('cart');
          }}
          customImage={customImages[viewingProduct.id]}
          onUpdateCustomImage={handleUpdateCustomImage}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-['Kantumruy_Pro',sans-serif] pb-20 selection:bg-blue-500/20 selection:text-blue-700">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Check size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Outer wrapper max-width for realistic phone/tablet presentation */}
      <div className="w-full max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl flex-1 flex flex-col bg-white min-h-screen shadow-xs">
        {/* Top Navbar */}
        <Navbar
          cartCount={totalCartCount}
          onOpenCart={() => {
            setIsPayingInCart(false);
            setActiveTab('cart');
          }}
          onOpenAccount={() => {
            setIsPayingInCart(false);
            setActiveTab('account');
          }}
          onOpenDrawer={() => setIsDrawerOpen(true)}
        />

        {/* Content View Based on Active Tab */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <div className="p-4 sm:p-5 space-y-4">
              {/* Section Header: "ទំនិញពិសេស" matching screenshot */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h1 className="text-[20px] sm:text-[22px] font-bold text-slate-900 tracking-tight">
                    ទំនិញពិសេស
                  </h1>
                  <p className="text-[12px] sm:text-[13px] text-slate-500 mt-0.5 font-normal">
                    ផលិតផលដែលអតិថិជនទិញច្រើនជាងគេ
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('products')}
                  className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <span>មើលទាំងអស់</span>
                  <ArrowRight size={13} className="text-slate-500" />
                </button>
              </div>

              {/* 2-Columns Grid with Change Image button */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
                {homeFeaturedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onBuyNow={(prod) => handleBuyNow(prod)}
                    onSelectProduct={(prod) => setViewingProduct(prod)}
                    onAddToCart={(prod) => handleAddToCart(prod)}
                    customImage={customImages[product.id]}
                    onUpdateCustomImage={handleUpdateCustomImage}
                  />
                ))}
              </div>

              {/* More Subscriptions Banner */}
              <div className="mt-6 p-4 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-between shadow-2xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Canva Pro, ChatGPT, Netflix & YouTube
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    មានក្នុងស្តុកស្រាប់ ធានាដូរថ្មី ១០០% ប្រគល់ជូនស្វ័យប្រវត្តិ
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('products')}
                  className="py-2 px-3.5 rounded-xl bg-[#4344e6] hover:bg-[#3839d4] text-white text-xs font-medium shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  មើលបន្ថែម
                </button>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="p-4 sm:p-5 space-y-4">
              {/* Catalog Header */}
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  ទំនិញ & គណនីទាំងអស់ (All Products)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Skypro store • សេវាកម្មឌីជីថលលំដាប់ខ្ពស់
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ស្វែងរក Gemini, CapCut, Grok, ChatGPT, Canva..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {[
                  { id: 'all', label: 'ទាំងអស់ (All)' },
                  { id: 'ai', label: '🤖 AI & Gemini' },
                  { id: 'design', label: '🎬 កាត់ត & រចនា' },
                  { id: 'streaming', label: '🍿 មើលកុន & ចម្រៀង' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#4344e6] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Products Grid with Change Image button */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onBuyNow={(prod) => handleBuyNow(prod)}
                    onSelectProduct={(prod) => setViewingProduct(prod)}
                    onAddToCart={(prod) => handleAddToCart(prod)}
                    customImage={customImages[product.id]}
                    onUpdateCustomImage={handleUpdateCustomImage}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Cart Tab: Payment is strictly placed here! */}
          {activeTab === 'cart' && (
            <div className="p-4 sm:p-5">
              {isPayingInCart && cartPayingProduct ? (
                /* Payment Screen directly in Cart (Matches IMG_1188.png) */
                <PaymentScreen
                  product={cartPayingProduct}
                  onCancel={() => setIsPayingInCart(false)}
                  onSuccessOrder={handleSuccessOrder}
                  userContact={userPhone || ''}
                />
              ) : (
                <CartScreen
                  items={cart}
                  onContinueShopping={() => setActiveTab('products')}
                  onUpdateQty={handleUpdateQty}
                  onRemoveItem={handleRemoveCartItem}
                  onProceedCheckout={handleProceedCartCheckout}
                  customImages={customImages}
                />
              )}
            </div>
          )}

          {/* Account Tab: Register / Login / Isolated Order History */}
          {activeTab === 'account' && (
            <div className="p-4 sm:p-5">
              <LoginScreen
                isLoggedIn={isLoggedIn}
                userPhone={userPhone}
                orders={orders}
                pendingCartCheckout={pendingCartPayment}
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
              />
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setActiveTab(tab);
            setViewingProduct(null);
            if (tab !== 'cart') {
              setIsPayingInCart(false);
            }
          }}
          cartCount={totalCartCount}
          isLoggedIn={isLoggedIn}
        />
      </div>

      {/* Drawer Menu */}
      <DrawerMenu
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setViewingProduct(null);
          setIsPayingInCart(false);
        }}
      />
    </div>
  );
}
