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
import { BannerSlider } from './components/BannerSlider';
import { PRODUCTS } from './data/products';
import { Product, CartItem, OrderItem, TabType } from './types';
import { 
  getAllCustomProductImages, 
  setCustomProductImage, 
  removeCustomProductImage 
} from './utils/imageStore';
import { storeSync } from './services/storeSync';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Custom Product Images synchronized live across all visitors without redeploy
  const [customImages, setCustomImages] = useState<Record<string, string>>(() => {
    return storeSync.getData().productImages;
  });
  const [imageTimestamp, setImageTimestamp] = useState<number>(() => storeSync.getLastUpdated());

  useEffect(() => {
    const unsubscribe = storeSync.subscribe((data, ts) => {
      setCustomImages({ ...data.productImages });
      setImageTimestamp(ts || Date.now());
    });
    return unsubscribe;
  }, []);

  const handleUpdateCustomImage = async (productId: string, dataUrl: string | null) => {
    const now = Date.now();
    setImageTimestamp(now);

    // 1. Instant local state update (0ms) so front page updates in real-time
    setCustomImages((prev) => {
      const updated = { ...prev };
      if (dataUrl) {
        updated[productId] = dataUrl;
      } else {
        delete updated[productId];
      }
      return updated;
    });

    // 2. Persist to server & broadcast
    await storeSync.updateProductImage(productId, dataUrl);

    // 3. Trigger 1-second auto-fetch to guarantee front-page visitor synchronization
    setTimeout(async () => {
      await storeSync.forceRefresh();
      setImageTimestamp(Date.now());
    }, 1000);

    showToast(dataUrl ? 'បានប្តូររូបភាពថ្មីជោគជ័យ (ទំព័រមុខបង្ហាញភ្លាមៗ)!' : 'បានកំណត់រូបភាពដើមឡើងវិញ!');
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

  // Master Admin verification (Strictly Phone: 0969749477 with Admin Session)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const isLogged = localStorage.getItem('skypro_is_logged_in') === 'true';
      let phone = (localStorage.getItem('skypro_user_phone') || '').replace(/[\s-+]/g, '');
      if (phone.startsWith('855')) phone = '0' + phone.slice(3);
      const isAdminFlag = localStorage.getItem('skypro_is_admin') === 'true';
      return isLogged && isAdminFlag && phone === '0969749477';
    } catch {
      return false;
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

    // If customer is not logged in, enforce creating an account / login first!
    if (!isLoggedIn || !userPhone.trim()) {
      setPendingCartPayment(true);
      setIsPayingInCart(false);
      setActiveTab('account');
      showToast('សូមបង្កើតគណនី ឬចូលប្រើជាមុនសិន ទើបអាចទិញទំនិញបាន!');
      return;
    }

    // If already logged in, proceed directly to payment checkout
    const payingItem: Product = {
      ...product,
      price: itemPrice,
      durations: chosenPlan ? [chosenPlan] : product.durations
    };
    setCartPayingProduct(payingItem);
    setIsPayingInCart(true);
    setActiveTab('cart');
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
  const handleLoginSuccess = (phone: string, isAdminUser: boolean = false) => {
    let cleanPhone = phone.replace(/[\s-+]/g, '');
    if (cleanPhone.startsWith('855')) cleanPhone = '0' + cleanPhone.slice(3);

    const isMasterAdmin = isAdminUser && cleanPhone === '0969749477';

    setUserPhone(cleanPhone);
    setIsLoggedIn(true);
    setIsAdmin(isMasterAdmin);

    try {
      localStorage.setItem('skypro_is_logged_in', 'true');
      localStorage.setItem('skypro_user_phone', cleanPhone);
      if (isMasterAdmin) {
        localStorage.setItem('skypro_is_admin', 'true');
      } else {
        localStorage.removeItem('skypro_is_admin');
      }
    } catch {
      // ignore
    }

    showToast(isMasterAdmin ? '👑 សូមស្វាគមន៍ Master Admin! (មានសិទ្ធិកែប្រែរូបភាព)' : 'ចូលគណនីជោគជ័យ!');

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
    setIsAdmin(false);
    setUserPhone('');
    setIsPayingInCart(false);
    try {
      localStorage.removeItem('skypro_is_logged_in');
      localStorage.removeItem('skypro_user_phone');
      localStorage.removeItem('skypro_is_admin');
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

  // Top 4 exact products for Home Screen
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
          imageTimestamp={imageTimestamp}
          onUpdateCustomImage={handleUpdateCustomImage}
          isAdmin={isAdmin}
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

      {/* Outer wrapper: responsive sizing with ample room for mobile (2 cols) and desktop (4 cols) */}
      <div className="w-full max-w-md mx-auto sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl flex-1 flex flex-col bg-white min-h-screen shadow-xs">
        {/* Top Navbar */}
        <Navbar
          cartCount={totalCartCount}
          onOpenCart={() => {
            setIsPayingInCart(false);
            setActiveTab('cart');
          }}
          onOpenDrawer={() => setIsDrawerOpen(true)}
        />

        {/* Main Tab Content */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <div className="px-2.5 sm:px-6 py-3.5 sm:py-6 space-y-4 sm:space-y-6">
              {/* Image Banner Slider with Auto-slide, Touch Swipe & Arrows */}
              <BannerSlider
                onSelectProduct={(productId) => {
                  const targetProd = PRODUCTS.find((p) => p.id === productId);
                  if (targetProd) {
                    setViewingProduct(targetProd);
                  } else {
                    setActiveTab('products');
                  }
                }}
                onExploreAll={() => setActiveTab('products')}
                products={PRODUCTS}
              />

              {/* Section Header */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Flame size={18} className="text-amber-500 fill-amber-500" />
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      ផលិតផលលក់ដាច់បំផុត (Popular Items)
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
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

              {/* 2 Cards per row on Mobile (Full Grid Width), and 4 Cards per row on Desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[11px] sm:gap-4 md:gap-5 lg:gap-6 pt-1">
                {homeFeaturedProducts.map((product) => (
                  <ProductCard
                    key={`${product.id}-${imageTimestamp}`}
                    product={product}
                    onBuyNow={(prod) => handleBuyNow(prod)}
                    onSelectProduct={(prod) => setViewingProduct(prod)}
                    onAddToCart={(prod) => handleAddToCart(prod)}
                    customImage={customImages[product.id]}
                    imageTimestamp={imageTimestamp}
                    onUpdateCustomImage={handleUpdateCustomImage}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>

              {/* More Subscriptions Banner with SkyPro Logo colors */}
              <div className="mt-6 p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-950 via-[#070e28] to-slate-900 border border-cyan-500/20 text-white flex items-center justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping" />
                    <span className="text-[11px] font-semibold text-cyan-300">សេវាកម្មពេញនិយម</span>
                  </div>
                  <h3 className="font-bold text-white text-xs sm:text-sm">
                    Canva Pro, ChatGPT, CapCut & Gemini AI
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-300/80 mt-0.5">
                    មានក្នុងស្តុកស្រាប់ ធានាដូរថ្មី ១០០% ប្រគល់ជូនស្វ័យប្រវត្តិ
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('products')}
                  className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#0052fe] to-[#00d2ff] hover:from-[#0047dc] hover:to-[#00bfe6] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer shrink-0 ml-2"
                >
                  មើលបន្ថែម
                </button>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="px-2.5 sm:px-6 py-3.5 sm:py-6 space-y-4 sm:space-y-6">
              {/* Catalog Header */}
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
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

              {/* Products Grid: 2 Cards per row on Mobile (Full Grid Width), and 4 Cards per row on Desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[11px] sm:gap-4 md:gap-5 lg:gap-6 pt-1">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={`${product.id}-${imageTimestamp}`}
                    product={product}
                    onBuyNow={(prod) => handleBuyNow(prod)}
                    onSelectProduct={(prod) => setViewingProduct(prod)}
                    onAddToCart={(prod) => handleAddToCart(prod)}
                    customImage={customImages[product.id]}
                    imageTimestamp={imageTimestamp}
                    onUpdateCustomImage={handleUpdateCustomImage}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Cart Tab: Payment is strictly placed here */}
          {activeTab === 'cart' && (
            <div className={isPayingInCart ? "py-2 sm:py-4 flex justify-center w-full" : "p-4 sm:p-5"}>
              {isPayingInCart && cartPayingProduct ? (
                <PaymentScreen
                  product={cartPayingProduct}
                  onCancel={() => setIsPayingInCart(false)}
                  onSuccessOrder={handleSuccessOrder}
                  userContact={userPhone || ''}
                  isAdmin={isAdmin}
                  customProductImage={customImages[cartPayingProduct.id]}
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
                isAdmin={isAdmin}
                userPhone={userPhone}
                orders={orders}
                pendingCartCheckout={pendingCartPayment}
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
              />
            </div>
          )}

          {/* Footer */}
          <footer className="mt-8 mb-6 border-t border-slate-200/80 pt-6 pb-2 text-center text-xs text-slate-500 font-normal">
            <p>© 2026 SkyPro Store. All rights reserved.</p>
          </footer>
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
