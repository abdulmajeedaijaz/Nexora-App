import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Category,
  Product,
  Collection,
  Banner,
  Coupon,
  Address,
  Order,
  CartItem,
  ProductReview,
  NotificationItem,
  SizeChart,
  OrderStatus,
  ReturnRequest,
} from '../types';
import {
  initialCategories,
  initialProducts,
  initialCollections,
  initialBanners,
  initialCoupons,
  initialUsers,
  initialAddresses,
  initialOrders,
  initialReviews,
  initialNotifications,
  initialSizeCharts,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  // Auth & Roles
  currentUser: User | null;
  activeRole: UserRole;
  isAuthenticated: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (name: string, email: string, pass: string, phone?: string) => Promise<boolean>;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  
  // Products & Categories
  categories: Category[];
  products: Product[];
  collections: Collection[];
  banners: Banner[];
  sizeCharts: SizeChart[];
  addCategory: (cat: Partial<Category>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  toggleCategoryActive: (id: string) => void;
  addProduct: (prod: Partial<Product>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductPublish: (id: string) => void;
  updateInventoryStock: (variantId: string, newStock: number, reason?: string) => void;
  
  // Banners & Homepage
  updateBanner: (id: string, updates: Partial<Banner>) => void;
  addBanner: (banner: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  
  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, size: string, colorName: string, colorHex: string, quantity?: number) => boolean;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, qty: number) => void;
  updateCartVariant: (cartItemId: string, newSize: string, newColor: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartTotals: {
    subtotal: number;
    discount: number;
    deliveryFee: number;
    tax: number;
    total: number;
  };
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Orders & Tracking & Returns
  orders: Order[];
  placeOrder: (
    address: Address,
    deliveryMethod: 'standard' | 'express',
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'
  ) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, courier?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  requestReturn: (orderId: string, reason: ReturnRequest['reason'], comments?: string) => void;
  updateReturnStatus: (orderId: string, status: ReturnRequest['status']) => void;
  
  // Addresses
  addresses: Address[];
  addAddress: (addr: Omit<Address, 'id' | 'userId'>) => void;
  updateAddress: (id: string, addr: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  
  // Reviews
  reviews: ProductReview[];
  addReview: (review: Omit<ProductReview, 'id' | 'createdAt' | 'likes' | 'isApproved'>) => void;
  toggleReviewApproval: (reviewId: string) => void;
  
  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Coupons (Admin)
  coupons: Coupon[];
  addCoupon: (c: Coupon) => void;
  toggleCouponActive: (code: string) => void;
  deleteCoupon: (code: string) => void;
  
  // Customers (Admin)
  allUsers: User[];
  
  // Navigation & Modals UI state
  currentView: 'home' | 'shop' | 'wishlist' | 'cart' | 'account' | 'admin' | 'product_detail';
  setCurrentView: (view: 'home' | 'shop' | 'wishlist' | 'cart' | 'account' | 'admin' | 'product_detail') => void;
  activeProductId: string | null;
  openProductDetail: (productId: string) => void;
  closeProductDetail: () => void;
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (slug: string | null) => void;
  selectedSubcategoryFilter: string | null;
  setSelectedSubcategoryFilter: (slug: string | null) => void;
  selectedCollectionFilter: string | null;
  setSelectedCollectionFilter: (slug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
  
  // Modal states
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register' | 'otp';
  setAuthModalTab: (tab: 'login' | 'register' | 'otp') => void;
  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (open: boolean) => void;
  isSizeGuideModalOpen: boolean;
  setIsSizeGuideModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  
  // Splash & Onboarding
  showSplash: boolean;
  dismissSplash: () => void;
  showOnboarding: boolean;
  dismissOnboarding: () => void;
  
  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_PREFIX = 'nexora_v1_';

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Splash and onboarding
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Show splash on first load in session
    return !sessionStorage.getItem('nexora_splash_seen');
  });
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem(STORAGE_PREFIX + 'onboarding_seen');
  });

  // Auth
  const [allUsers, setAllUsers] = useState<User[]>(() => loadStorage('users', initialUsers));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = loadStorage<User | null>('current_user', initialUsers[0]);
    return saved;
  });
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return currentUser?.role || 'customer';
  });

  // Core records
  const [categories, setCategories] = useState<Category[]>(() => loadStorage('categories', initialCategories));
  const [products, setProducts] = useState<Product[]>(() => loadStorage('products', initialProducts));
  const [collections, setCollections] = useState<Collection[]>(() => loadStorage('collections', initialCollections));
  const [banners, setBanners] = useState<Banner[]>(() => loadStorage('banners', initialBanners));
  const [sizeCharts] = useState<SizeChart[]>(() => loadStorage('size_charts', initialSizeCharts));
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadStorage('coupons', initialCoupons));
  const [addresses, setAddresses] = useState<Address[]>(() => loadStorage('addresses', initialAddresses));
  const [orders, setOrders] = useState<Order[]>(() => loadStorage('orders', initialOrders));
  const [reviews, setReviews] = useState<ProductReview[]>(() => loadStorage('reviews', initialReviews));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadStorage('notifications', initialNotifications));

  // User state
  const [cart, setCart] = useState<CartItem[]>(() => loadStorage('cart', []));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => loadStorage('applied_coupon', null));
  const [wishlist, setWishlist] = useState<string[]>(() => loadStorage('wishlist', ['prod-glitter-sandal']));
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    loadStorage('recent_searches', ['Champagne Sandal', 'Block Heel', 'Bow Flat', 'Glitter Shoes'])
  );

  // View state
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'wishlist' | 'cart' | 'account' | 'admin' | 'product_detail'>('home');
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState<string | null>(null);
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'otp'>('login');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isSizeGuideModalOpen, setIsSizeGuideModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, description?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state to local storage
  useEffect(() => {
    saveStorage('categories', categories);
  }, [categories]);

  useEffect(() => {
    saveStorage('products', products);
  }, [products]);

  useEffect(() => {
    saveStorage('banners', banners);
  }, [banners]);

  useEffect(() => {
    saveStorage('coupons', coupons);
  }, [coupons]);

  useEffect(() => {
    saveStorage('cart', cart);
  }, [cart]);

  useEffect(() => {
    saveStorage('wishlist', wishlist);
  }, [wishlist]);

  useEffect(() => {
    saveStorage('orders', orders);
  }, [orders]);

  useEffect(() => {
    saveStorage('addresses', addresses);
  }, [addresses]);

  useEffect(() => {
    saveStorage('reviews', reviews);
  }, [reviews]);

  useEffect(() => {
    saveStorage('notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    saveStorage('recent_searches', recentSearches);
  }, [recentSearches]);

  useEffect(() => {
    saveStorage('current_user', currentUser);
  }, [currentUser]);

  const dismissSplash = () => {
    setShowSplash(false);
    sessionStorage.setItem('nexora_splash_seen', 'true');
  };

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem(STORAGE_PREFIX + 'onboarding_seen', 'true');
  };

  // Auth methods
  const loginWithEmail = async (email: string): Promise<boolean> => {
    const user = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      setActiveRole(user.role);
      showToast(`Welcome back, ${user.name}`, 'You are now signed into NEXORA');
      return true;
    }
    // Auto-create demo customer
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0],
      email: email,
      role: 'customer',
      createdAt: new Date().toISOString(),
      status: 'active',
      totalOrders: 0,
      totalSpent: 0,
    };
    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setActiveRole('customer');
    showToast(`Welcome to NEXORA, ${newUser.name}`);
    return true;
  };

  const registerWithEmail = async (name: string, email: string, _pass: string, phone?: string): Promise<boolean> => {
    const existing = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      showToast('Account already exists', 'Please sign in with your email.', 'error');
      return false;
    }
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name,
      email,
      phone,
      role: 'customer',
      createdAt: new Date().toISOString(),
      status: 'active',
      totalOrders: 0,
      totalSpent: 0,
    };
    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setActiveRole('customer');
    showToast(`Account created successfully`, 'Welcome to NEXORA Modern Couture!');
    return true;
  };

  const verifyOtp = async (phone: string, otp: string): Promise<boolean> => {
    if (otp.length === 4 || otp.length === 6) {
      const existing = allUsers.find((u) => u.phone === phone);
      if (existing) {
        setCurrentUser(existing);
        setActiveRole(existing.role);
        showToast(`Verified`, `Welcome back, ${existing.name}`);
      } else {
        const newUser: User = {
          id: 'usr_' + Date.now(),
          name: 'NEXORA Member',
          email: `${phone.replace(/\D/g, '')}@nexora.mobile`,
          phone,
          role: 'customer',
          createdAt: new Date().toISOString(),
          status: 'active',
          totalOrders: 0,
          totalSpent: 0,
        };
        setAllUsers((prev) => [...prev, newUser]);
        setCurrentUser(newUser);
        setActiveRole('customer');
        showToast('Phone verified successfully');
      }
      return true;
    }
    showToast('Invalid OTP', 'Please enter a valid OTP code.', 'error');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveRole('customer');
    if (currentView === 'admin' || currentView === 'account') {
      setCurrentView('home');
    }
    showToast('Signed out', 'You have been securely logged out.');
  };

  const switchUserRole = (role: UserRole) => {
    setActiveRole(role);
    if (role === 'super_admin' || role === 'manager') {
      const adminUser = allUsers.find((u) => u.role === 'super_admin') || initialUsers[1];
      setCurrentUser(adminUser);
      showToast('Admin Mode Active', 'Full catalog, inventory & order management permissions granted.');
    } else {
      const customer = allUsers.find((u) => u.role === 'customer') || initialUsers[0];
      setCurrentUser(customer);
      if (currentView === 'admin') {
        setCurrentView('home');
      }
      showToast('Customer Mode Active', 'Browsing as fashion shopper Ananya Sharma.');
    }
  };

  // Cart methods
  const addToCart = (
    product: Product,
    size: string,
    colorName: string,
    colorHex: string,
    quantity = 1
  ): boolean => {
    const variant = product.variants.find((v) => v.size === size && v.colorName === colorName);
    const maxStock = variant ? variant.stock : 10;

    if (maxStock <= 0) {
      showToast('Out of Stock', `Size ${size} in ${colorName} is currently unavailable.`, 'error');
      return false;
    }

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.productId === product.id && item.size === size && item.colorName === colorName
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIdx].quantity + quantity, maxStock);
        updated[existingIdx].quantity = newQty;
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          productId: product.id,
          variantId: variant?.id || `var_${Date.now()}`,
          name: product.name,
          brand: product.brand,
          size,
          colorName,
          colorHex,
          image: product.images[variant?.imageIndex || 0] || product.images[0],
          price: product.price,
          mrp: product.mrp,
          quantity: Math.min(quantity, maxStock),
          maxStock,
        };
        return [...prev, newItem];
      }
    });

    showToast('Added to Shopping Bag', `${product.name} (Size: ${size}, ${colorName})`);
    return true;
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item removed from bag');
  };

  const updateCartQuantity = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          return { ...item, quantity: Math.min(qty, item.maxStock) };
        }
        return item;
      })
    );
  };

  const updateCartVariant = (cartItemId: string, newSize: string, newColor: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const prod = products.find((p) => p.id === item.productId);
          const v = prod?.variants.find((vr) => vr.size === newSize && vr.colorName === newColor);
          return {
            ...item,
            size: newSize,
            colorName: newColor,
            colorHex: v?.colorHex || item.colorHex,
            maxStock: v?.stock || 5,
          };
        }
        return item;
      })
    );
    showToast('Updated item selection');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === trimmed && c.isActive);
    if (!coupon) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    const rawSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (rawSubtotal < coupon.minOrder) {
      return {
        success: false,
        message: `Minimum order value for ${coupon.code} is ₹${coupon.minOrder.toLocaleString('en-IN')}`,
      };
    }
    setAppliedCoupon(coupon);
    showToast(`Coupon Applied: ${coupon.code}`, `You saved on your NEXORA order!`);
    return { success: true, message: 'Coupon applied successfully.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // Calculate Cart Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    } else {
      discount = appliedCoupon.discountValue;
    }
  }
  const deliveryFee = subtotal > 1499 || subtotal === 0 ? 0 : 99;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.05); // 5% GST for footwear/apparel
  const total = Math.max(0, taxableAmount + deliveryFee + tax);

  const cartTotals = { subtotal, discount, deliveryFee, tax, total };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist', 'View anytime in your favorites');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const placeOrder = async (
    address: Address,
    deliveryMethod: 'standard' | 'express',
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'
  ): Promise<Order> => {
    const orderNum = `NX-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: orderNum,
      userId: currentUser?.id || 'guest',
      customerName: address.fullName,
      customerEmail: currentUser?.email || 'customer@nexora.fashion',
      customerPhone: address.phone,
      items: cart.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        brand: item.brand,
        size: item.size,
        colorName: item.colorName,
        colorHex: item.colorHex,
        image: item.image,
        price: item.price,
        mrp: item.mrp,
        quantity: item.quantity,
      })),
      shippingAddress: address,
      deliveryMethod,
      deliveryFee: deliveryMethod === 'express' ? deliveryFee + 149 : deliveryFee,
      subtotal,
      discount,
      couponCode: appliedCoupon?.code,
      tax,
      total: total + (deliveryMethod === 'express' ? 149 : 0),
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      status: 'confirmed',
      tracking: {
        courier: 'BlueDart Luxury Express',
        trackingNumber: `BD-${Math.floor(100000000 + Math.random() * 900000000)}IN`,
        estimatedDelivery: deliveryMethod === 'express' ? 'Tomorrow, by 1:00 PM' : '3-4 Business Days',
        steps: [
          { status: 'placed', label: 'Order Placed', date: 'Just now', completed: true },
          { status: 'confirmed', label: 'Payment Verified & Confirmed', date: 'Just now', completed: true, current: true },
          { status: 'packed', label: 'Gift Packaging at Atelier', date: 'Pending', completed: false },
          { status: 'shipped', label: 'Dispatched via Courier', date: 'Pending', completed: false },
          { status: 'out_for_delivery', label: 'Out for Delivery', date: 'Pending', completed: false },
          { status: 'delivered', label: 'Doorstep Handover', date: 'Pending', completed: false },
        ],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Deduct stock
    setProducts((prev) =>
      prev.map((prod) => {
        const itemMatch = cart.filter((c) => c.productId === prod.id);
        if (itemMatch.length > 0) {
          const updatedVariants = prod.variants.map((v) => {
            const match = itemMatch.find((c) => c.size === v.size && c.colorName === v.colorName);
            if (match) {
              return { ...v, stock: Math.max(0, v.stock - match.quantity) };
            }
            return v;
          });
          return { ...prod, variants: updatedVariants };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Add order notification
    const orderNotif: NotificationItem = {
      id: 'notif_' + Date.now(),
      userId: currentUser?.id || 'guest',
      title: `Order Confirmed: ${newOrder.orderNumber}`,
      message: `Your luxury package of ${newOrder.items.length} item(s) has been confirmed and is preparing at the NEXORA atelier.`,
      type: 'order',
      read: false,
      link: '/account/orders',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [orderNotif, ...prev]);

    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    courier?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nowStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
          const updatedSteps = ord.tracking.steps.map((s) => {
            if (s.status === status) {
              return { ...s, completed: true, current: true, date: nowStr };
            }
            return s;
          });
          return {
            ...ord,
            status,
            tracking: {
              ...ord.tracking,
              courier: courier || ord.tracking.courier,
              trackingNumber: trackingNumber || ord.tracking.trackingNumber,
              steps: updatedSteps,
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
    showToast('Order Status Updated', `Order marked as ${status.replace('_', ' ').toUpperCase()}`);
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: 'cancelled',
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
    showToast('Order Cancelled', reason || 'Your cancellation request has been processed.');
  };

  const requestReturn = (orderId: string, reason: ReturnRequest['reason'], comments?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const returnDetails: ReturnRequest = {
            id: 'ret_' + Date.now(),
            orderId,
            requestedAt: new Date().toISOString(),
            reason,
            comments,
            status: 'requested',
            pickupDate: 'In 2 business days',
            refundAmount: ord.total,
          };
          return {
            ...ord,
            status: 'return_requested',
            returnDetails,
            updatedAt: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
    showToast('Return Requested', 'A doorstep quality check & pickup will be scheduled.');
  };

  const updateReturnStatus = (orderId: string, status: ReturnRequest['status']) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId && ord.returnDetails) {
          const nextOrderStatus: OrderStatus =
            status === 'refund_completed' ? 'refunded' : status === 'received' ? 'returned' : 'return_requested';
          return {
            ...ord,
            status: nextOrderStatus,
            returnDetails: {
              ...ord.returnDetails,
              status,
              refundTransactionId:
                status === 'refund_completed' ? `REF-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
            },
          };
        }
        return ord;
      })
    );
    showToast('Return Status Updated', `Status changed to ${status}`);
  };

  // Addresses
  const addAddress = (addr: Omit<Address, 'id' | 'userId'>) => {
    const newAddr: Address = {
      ...addr,
      id: 'addr_' + Date.now(),
      userId: currentUser?.id || 'guest',
      isDefault: addresses.length === 0 ? true : addr.isDefault,
    };
    if (newAddr.isDefault) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat(newAddr));
    } else {
      setAddresses((prev) => [...prev, newAddr]);
    }
    showToast('Address Saved');
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...updates };
        }
        if (updates.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      })
    );
    showToast('Address Updated');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Address removed');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    showToast('Default address set');
  };

  // Products & Categories (Admin & Customer)
  const addCategory = (cat: Partial<Category>) => {
    const newCat: Category = {
      id: 'cat_' + Date.now(),
      name: cat.name || 'New Category',
      slug: (cat.name || 'new-category').toLowerCase().replace(/\s+/g, '-'),
      department: cat.department || 'girls',
      type: cat.type || 'footwear',
      subcategories: cat.subcategories || [],
      attributeDefinitions: cat.attributeDefinitions || [],
      image: cat.image || 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
      isActive: true,
      displayOrder: categories.length + 1,
      ...cat,
    };
    setCategories((prev) => [...prev, newCat]);
    showToast('Category Added', `${newCat.name} created successfully.`);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Category Updated');
  };

  const toggleCategoryActive = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    showToast('Category status updated');
  };

  const addProduct = (prod: Partial<Product>) => {
    const discount = prod.mrp && prod.price ? Math.round(((prod.mrp - prod.price) / prod.mrp) * 100) : 0;
    const newProd: Product = {
      id: 'prod_' + Date.now(),
      name: prod.name || 'New NEXORA Product',
      slug: (prod.name || 'new-product').toLowerCase().replace(/\s+/g, '-'),
      brand: prod.brand || 'NEXORA Atelier',
      categoryId: prod.categoryId || categories[0]?.id || 'cat-girls-footwear',
      subcategoryId: prod.subcategoryId || 'sub-sandals',
      description: prod.description || 'Modern luxury design handcrafted with precision.',
      price: prod.price || 1999,
      mrp: prod.mrp || 2999,
      discountPercent: discount,
      rating: 5.0,
      reviewCount: 0,
      images: prod.images && prod.images.length > 0 ? prod.images : [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
      ],
      badges: prod.badges || ['NEW'],
      tags: prod.tags || ['fashion'],
      collections: prod.collections || ['new-arrivals'],
      attributes: prod.attributes || { 'Sole Material': 'Anti-Skid TPR', 'Fit Type': 'Regular Fit' },
      materialAndCare: prod.materialAndCare || 'Wipe with soft cloth. Store in dustbag.',
      specifications: prod.specifications || { 'Craftsmanship': 'Handcrafted Luxury' },
      sizeChartId: prod.sizeChartId || 'sc-girls-footwear',
      isActive: true,
      isArchived: false,
      variants: prod.variants || [
        {
          id: 'var_' + Date.now() + '_1',
          sku: `NX-${Math.floor(1000 + Math.random() * 9000)}-12`,
          size: '12',
          colorName: 'Champagne Gold',
          colorHex: '#D4AF37',
          price: prod.price || 1999,
          mrp: prod.mrp || 2999,
          stock: 10,
          imageIndex: 0,
          isAvailable: true,
        },
      ],
      createdAt: new Date().toISOString(),
      ...prod,
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast('Product Created', `${newProd.name} is now in the catalog.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const price = updates.price !== undefined ? updates.price : p.price;
          const mrp = updates.mrp !== undefined ? updates.mrp : p.mrp;
          const discountPercent = mrp && price ? Math.round(((mrp - price) / mrp) * 100) : p.discountPercent;
          return { ...p, ...updates, price, mrp, discountPercent };
        }
        return p;
      })
    );
    showToast('Product Updated');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog');
  };

  const toggleProductPublish = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
    showToast('Product publish status changed');
  };

  const updateInventoryStock = (variantId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        const hasVariant = p.variants.some((v) => v.id === variantId);
        if (hasVariant) {
          const updated = p.variants.map((v) =>
            v.id === variantId ? { ...v, stock: Math.max(0, newStock), isAvailable: newStock > 0 } : v
          );
          return { ...p, variants: updated };
        }
        return p;
      })
    );
    showToast('Inventory Updated', `Stock adjusted to ${newStock} units`);
  };

  // Banners
  const addBanner = (banner: Partial<Banner>) => {
    const newBanner: Banner = {
      id: 'ban_' + Date.now(),
      title: banner.title || 'NEW ARRIVALS',
      subtitle: banner.subtitle || 'Discover Modern Luxury',
      ctaText: banner.ctaText || 'SHOP NOW',
      ctaLink: banner.ctaLink || '/shop',
      imageUrl: banner.imageUrl || 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=1600&auto=format&fit=crop',
      type: banner.type || 'hero',
      isActive: true,
      displayOrder: banners.length + 1,
      ...banner,
    };
    setBanners((prev) => [...prev, newBanner]);
    showToast('Banner Added');
  };

  const updateBanner = (id: string, updates: Partial<Banner>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    showToast('Banner Updated');
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    showToast('Banner removed');
  };

  // Coupons
  const addCoupon = (c: Coupon) => {
    setCoupons((prev) => [c, ...prev]);
    showToast('Coupon Created', `Code ${c.code} is now live.`);
  };

  const toggleCouponActive = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
    showToast('Coupon status updated');
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showToast('Coupon deleted');
  };

  // Reviews
  const addReview = (rev: Omit<ProductReview, 'id' | 'createdAt' | 'likes' | 'isApproved'>) => {
    const newRev: ProductReview = {
      ...rev,
      id: 'rev_' + Date.now(),
      createdAt: new Date().toISOString(),
      likes: 0,
      isApproved: true,
    };
    setReviews((prev) => [newRev, ...prev]);
    // update product rating count
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === rev.productId) {
          const count = p.reviewCount + 1;
          const newAvg = Number(((p.rating * p.reviewCount + rev.rating) / count).toFixed(1));
          return { ...p, reviewCount: count, rating: newAvg };
        }
        return p;
      })
    );
    showToast('Review Submitted', 'Thank you for reviewing your NEXORA piece!');
  };

  const toggleReviewApproval = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, isApproved: !r.isApproved } : r))
    );
    showToast('Review moderation updated');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  // Search terms
  const addRecentSearch = (term: string) => {
    const cleaned = term.trim();
    if (!cleaned) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== cleaned.toLowerCase());
      return [cleaned, ...filtered].slice(0, 8);
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const openProductDetail = (productId: string) => {
    setActiveProductId(productId);
    setCurrentView('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeProductDetail = () => {
    setActiveProductId(null);
    setCurrentView('shop');
  };

  const value: StoreContextType = {
    currentUser,
    activeRole,
    isAuthenticated: !!currentUser,
    loginWithEmail,
    registerWithEmail,
    verifyOtp,
    logout,
    switchUserRole,
    categories,
    products,
    collections,
    banners,
    sizeCharts,
    addCategory,
    updateCategory,
    toggleCategoryActive,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductPublish,
    updateInventoryStock,
    updateBanner,
    addBanner,
    deleteBanner,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    updateCartVariant,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartTotals,
    wishlist,
    toggleWishlist,
    isInWishlist,
    orders,
    placeOrder,
    updateOrderStatus,
    cancelOrder,
    requestReturn,
    updateReturnStatus,
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    reviews,
    addReview,
    toggleReviewApproval,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    coupons,
    addCoupon,
    toggleCouponActive,
    deleteCoupon,
    allUsers,
    currentView,
    setCurrentView,
    activeProductId,
    openProductDetail,
    closeProductDetail,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedSubcategoryFilter,
    setSelectedSubcategoryFilter,
    selectedCollectionFilter,
    setSelectedCollectionFilter,
    searchQuery,
    setSearchQuery,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    isSupportModalOpen,
    setIsSupportModalOpen,
    isSizeGuideModalOpen,
    setIsSizeGuideModalOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    showSplash,
    dismissSplash,
    showOnboarding,
    dismissOnboarding,
    toasts,
    showToast,
    removeToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
