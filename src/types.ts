export type UserRole = 
  | 'customer'
  | 'super_admin'
  | 'manager'
  | 'product_manager'
  | 'inventory_manager'
  | 'marketing_manager'
  | 'customer_support';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  totalOrders?: number;
  totalSpent?: number;
  status: 'active' | 'suspended';
}

export interface AttributeDefinition {
  id: string;
  name: string;
  type: 'select' | 'text' | 'number';
  options?: string[];
  required: boolean;
}

export interface SizeChartEntry {
  size: string;
  measurementCm: number;
  measurementInches?: number;
  ukSize?: string;
  usSize?: string;
  euroSize?: string;
  ageGuideline?: string;
}

export interface SizeChart {
  id: string;
  name: string;
  categoryType: 'footwear' | 'apparel' | 'accessories';
  unit: 'cm' | 'inches';
  entries: SizeChartEntry[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string; // e.g. "Girls", "Women"
  slug: string;
  department: 'girls' | 'women' | 'unisex';
  type: 'footwear' | 'apparel' | 'accessories' | 'other';
  subcategories: Subcategory[];
  attributeDefinitions: AttributeDefinition[];
  defaultSizeChartId?: string;
  image: string;
  banner?: string;
  isActive: boolean;
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  price: number;
  mrp: number;
  stock: number;
  barcode?: string;
  imageIndex: number;
  isAvailable: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userCity?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  fitFeedback?: string;
  photos?: string[];
  createdAt: string;
  isApproved: boolean;
  likes: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  subcategoryId: string;
  description: string;
  price: number;
  mrp: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  images: string[];
  videoUrl?: string;
  badges: ('NEW' | 'TRENDING' | 'SALE' | 'PREMIUM' | 'BESTSELLER')[];
  tags: string[];
  collections: string[];
  
  // Dynamic category-agnostic attributes
  attributes: Record<string, string>; // e.g. { "Material": "Synthetic Leather", "Sole": "Anti-Skid TPR", "Fit": "True to Size" }
  materialAndCare: string;
  specifications: Record<string, string>;
  sizeChartId: string;
  variants: ProductVariant[];
  
  isActive: boolean;
  isArchived: boolean;
  weightGrams?: number;
  dimensions?: string;
  seoTitle?: string;
  seoDescription?: string;
  searchKeywords?: string[];
  createdAt: string;
}

export interface InventoryRecord {
  id: string;
  sku: string;
  productId: string;
  productName: string;
  variantId: string;
  size: string;
  color: string;
  inStock: number;
  reserved: number;
  damaged: number;
  lowStockThreshold: number;
  lastUpdated: string;
  history: {
    id: string;
    timestamp: string;
    change: number;
    reason: string;
    user: string;
  }[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
  isActive: boolean;
  displayOrder: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  tagline?: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  mobileImageUrl?: string;
  type: 'hero' | 'promo' | 'featured';
  isActive: boolean;
  displayOrder: number;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  variantId: string;
  name: string;
  brand: string;
  size: string;
  colorName: string;
  colorHex: string;
  image: string;
  price: number;
  mrp: number;
  quantity: number;
  maxStock: number;
}

export type OrderStatus = 
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded';

export interface TrackingStep {
  status: OrderStatus | string;
  label: string;
  date: string;
  time?: string;
  completed: boolean;
  current?: boolean;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  requestedAt: string;
  reason: 'wrong_size' | 'damaged' | 'wrong_product' | 'quality_issue' | 'changed_mind' | 'other';
  comments?: string;
  images?: string[];
  status: 'requested' | 'pickup_scheduled' | 'received' | 'refund_initiated' | 'refund_completed' | 'rejected';
  pickupDate?: string;
  refundAmount: number;
  refundTransactionId?: string;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  brand: string;
  size: string;
  colorName: string;
  colorHex: string;
  image: string;
  price: number;
  mrp: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: Address;
  deliveryMethod: 'standard' | 'express';
  deliveryFee: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  total: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  status: OrderStatus;
  tracking: {
    courier: string;
    trackingNumber: string;
    estimatedDelivery: string;
    steps: TrackingStep[];
  };
  returnDetails?: ReturnRequest;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  applicableCategories?: string[];
  forNewCustomersOnly?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'shipping' | 'price_drop' | 'stock' | 'promo' | 'system';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface SupportFaq {
  id: string;
  category: 'orders' | 'shipping' | 'returns' | 'payments' | 'sizing' | 'account';
  question: string;
  answer: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  orderId?: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  messages: {
    sender: 'user' | 'support';
    senderName: string;
    message: string;
    timestamp: string;
  }[];
}
