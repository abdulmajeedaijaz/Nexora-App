import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductVariant, Order, Category, Coupon, Banner, User } from '../../types';
import {
  BarChart3,
  Package,
  Boxes,
  FolderTree,
  Image as ImageIcon,
  ShoppingBag,
  Tag,
  Users,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Search,
  SlidersHorizontal,
  X,
  Truck,
  RotateCcw,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Eye,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    addCategory,
    updateCategory,
    orders,
    updateOrderStatus,
    banners,
    addBanner,
    deleteBanner,
    coupons,
    addCoupon,
    deleteCoupon,
    allUsers,
    updateInventoryStock,
    setCurrentView,
    activeRole,
    switchUserRole,
    showToast,
  } = useStore();

  const users = allUsers;

  const [adminTab, setAdminTab] = useState<
    | 'overview'
    | 'products'
    | 'inventory'
    | 'categories'
    | 'banners'
    | 'orders'
    | 'coupons'
    | 'customers'
    | 'analytics'
  >('overview');

  // Search in tables
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Product Form State
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('NEXORA Atelier');
  const [formCategoryId, setFormCategoryId] = useState(categories[0]?.id || '');
  const [formSubcategorySlug, setFormSubcategorySlug] = useState('sandals');
  const [formPrice, setFormPrice] = useState(1499);
  const [formMrp, setFormMrp] = useState(2499);
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formBadges, setFormBadges] = useState<('NEW' | 'TRENDING' | 'SALE' | 'PREMIUM' | 'BESTSELLER')[]>(['NEW']);
  // Variants editor: list of variants
  const [formVariants, setFormVariants] = useState<ProductVariant[]>([
    { id: 'var-11', size: '11', colorName: 'Champagne Gold', colorHex: '#E5C158', price: 1499, mrp: 2499, stock: 10, sku: 'NX-11-CG', imageIndex: 0, isAvailable: true },
    { id: 'var-12', size: '12', colorName: 'Champagne Gold', colorHex: '#E5C158', price: 1499, mrp: 2499, stock: 8, sku: 'NX-12-CG', imageIndex: 0, isAvailable: true },
    { id: 'var-13', size: '13', colorName: 'Champagne Gold', colorHex: '#E5C158', price: 1499, mrp: 2499, stock: 4, sku: 'NX-13-CG', imageIndex: 0, isAvailable: true },
    { id: 'var-1', size: '1', colorName: 'Champagne Gold', colorHex: '#E5C158', price: 1499, mrp: 2499, stock: 6, sku: 'NX-1-CG', imageIndex: 0, isAvailable: true },
  ]);
  // Dynamic category attributes
  const [formAttributes, setFormAttributes] = useState<Record<string, string>>({
    'Sole Material': 'Anti-Skid TPR Sole',
    'Heel Height': '1.25 Inch Block Heel',
    'Fit Type': 'Comfort Cushioned Fit',
    'Upper Material': 'Embroidered Shimmer Velvet',
  });

  // Order status update modal
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status']>('confirmed');
  const [newTrackingNumber, setNewTrackingNumber] = useState('');
  const [newCourier, setNewCourier] = useState('BlueDart Express');

  // New Category Form
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatType, setNewCatType] = useState<'footwear' | 'apparel' | 'accessories'>('footwear');
  const [newCatDesc, setNewCatDesc] = useState('');

  // New Coupon Form
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(15);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(1499);

  // New Banner Form
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('');
  const [newBannerCta, setNewBannerCta] = useState('Explore Collection');

  // KPI Calculations
  const metrics = useMemo(() => {
    const totalRev = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
    const nonCancelledOrders = orders.filter((o) => o.status !== 'cancelled');
    const aov = nonCancelledOrders.length > 0 ? Math.round(totalRev / nonCancelledOrders.length) : 0;
    const returnedOrders = orders.filter((o) => o.status === 'returned').length;
    const returnRate = orders.length > 0 ? ((returnedOrders / orders.length) * 100).toFixed(1) : '0';

    let lowStockCount = 0;
    products.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.stock <= 3) lowStockCount++;
      });
    });

    return {
      totalRevenue: totalRev,
      totalOrders: orders.length,
      totalCustomers: users.length,
      totalProducts: products.length,
      lowStockVariants: lowStockCount,
      aov,
      returnRate,
    };
  }, [orders, products, users]);

  // Handle opening Product Modal for Edit
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setFormName(prod.name);
    setFormBrand(prod.brand);
    setFormCategoryId(prod.categoryId);
    setFormSubcategorySlug(prod.subcategoryId);
    setFormPrice(prod.price);
    setFormMrp(prod.mrp);
    setFormDescription(prod.description);
    setFormImageUrl(prod.images[0] || '');
    setFormBadges(prod.badges);
    setFormVariants([...prod.variants]);
    setFormAttributes({ ...prod.attributes });
    setShowProductModal(true);
  };

  // Handle opening Product Modal for New
  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setFormName('');
    setFormBrand('NEXORA Atelier');
    setFormCategoryId(categories[0]?.id || '');
    setFormSubcategorySlug('sandals');
    setFormPrice(1499);
    setFormMrp(2499);
    setFormDescription('Artisanal footwear handcrafted with cushioned footbeds and anti-skid TPR soles.');
    setFormImageUrl('https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop');
    setFormBadges(['NEW']);
    setFormVariants([
      { id: `var-${Date.now()}-11`, size: '11', colorName: 'Champagne Gold', colorHex: '#E5C158', price: 1499, mrp: 2499, stock: 10, sku: `NX-${Date.now()}-11`, imageIndex: 0, isAvailable: true },
      { id: `var-${Date.now()}-12`, size: '12', colorName: 'Champagne Gold', colorHex: '#E5C158', price: 1499, mrp: 2499, stock: 8, sku: `NX-${Date.now()}-12`, imageIndex: 0, isAvailable: true },
      { id: `var-${Date.now()}-13`, size: '13', colorName: 'Champagne Gold', colorHex: '#E5C158', price: 1499, mrp: 2499, stock: 4, sku: `NX-${Date.now()}-13`, imageIndex: 0, isAvailable: true },
      { id: `var-${Date.now()}-1`, size: '1', colorName: 'Champagne Gold', colorHex: '#E5C158', price: 1499, mrp: 2499, stock: 6, sku: `NX-${Date.now()}-1`, imageIndex: 0, isAvailable: true },
    ]);
    setFormAttributes({
      'Sole Material': 'Anti-Skid TPR Sole',
      'Fit Type': 'Comfort Cushioned Fit',
      'Upper Material': 'Metallic Pearl Sheen Polyurethane',
    });
    setShowProductModal(true);
  };

  // Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) return;

    const discount = formMrp > formPrice ? Math.round(((formMrp - formPrice) / formMrp) * 100) : 0;
    const cat = categories.find((c) => c.id === formCategoryId);

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: formName,
        brand: formBrand,
        categoryId: formCategoryId,
        subcategoryId: formSubcategorySlug,
        price: Number(formPrice),
        mrp: Number(formMrp),
        discountPercent: discount,
        description: formDescription,
        images: formImageUrl ? [formImageUrl] : undefined,
        badges: formBadges,
        variants: formVariants,
        attributes: formAttributes,
      });
      showToast('Product Updated', `Saved changes for ${formName}`);
    } else {
      const newProd: Product = {
        id: `nx-prod-${Date.now()}`,
        name: formName,
        slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        brand: formBrand,
        categoryId: formCategoryId,
        subcategoryId: formSubcategorySlug,
        price: Number(formPrice),
        mrp: Number(formMrp),
        discountPercent: discount,
        description: formDescription,
        images: [
          formImageUrl ||
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
        ],
        rating: 5.0,
        reviewCount: 1,
        badges: formBadges,
        tags: ['footwear', 'couture'],
        collections: ['girls-partywear'],
        attributes: formAttributes,
        materialAndCare: 'Wipe with a soft dry cloth. Store in bespoke dust bag.',
        specifications: { ...formAttributes },
        sizeChartId: 'girls-footwear-chart',
        variants: formVariants,
        isActive: true,
        isArchived: false,
        createdAt: new Date().toISOString(),
      };
      addProduct(newProd);
      showToast('Product Created', `Added ${formName} to collection`);
    }

    setShowProductModal(false);
  };

  // Order status submit
  const handleUpdateOrderStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForEdit) return;

    updateOrderStatus(
      selectedOrderForEdit.id,
      newStatus,
      newTrackingNumber || selectedOrderForEdit.tracking?.trackingNumber || 'NX-TRK-DEFAULT',
      newCourier || selectedOrderForEdit.tracking?.courier || 'BlueDart Express'
    );
    setSelectedOrderForEdit(null);
  };

  // Create Category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatSlug) return;

    const newCat: Category = {
      id: `cat-${newCatSlug}`,
      name: newCatName,
      slug: newCatSlug,
      department: 'girls',
      type: newCatType === 'footwear' ? 'footwear' : newCatType === 'apparel' ? 'apparel' : 'accessories',
      isActive: true,
      displayOrder: categories.length + 1,
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
      seoDescription: newCatDesc || `${newCatName} collection by NEXORA.`,
      subcategories: [
        { id: `sub-${newCatSlug}-1`, name: 'Signature Collection', slug: 'signature', isActive: true },
        { id: `sub-${newCatSlug}-2`, name: 'Celebration Edit', slug: 'celebration', isActive: true },
      ],
      attributeDefinitions:
        newCatType === 'footwear'
          ? [
              { id: 'sole-mat', name: 'Sole Material', type: 'select', options: ['TPR Sole', 'Sheet Sole'], required: true },
              { id: 'heel-hgt', name: 'Heel Height', type: 'text', required: true },
            ]
          : [
              { id: 'fabric', name: 'Fabric Composition', type: 'text', required: true },
              { id: 'lining', name: 'Inner Lining', type: 'text', required: true },
            ],
    };

    addCategory(newCat);
    setShowCategoryModal(false);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
    showToast('Category Created', `${newCatName} added to dynamic catalog`);
  };

  // Create Coupon
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    const cp: Coupon = {
      code: newCouponCode.toUpperCase(),
      description: newCouponDesc || `Enjoy discount on NEXORA collection`,
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      minOrder: Number(newCouponMinOrder),
      startDate: new Date().toISOString(),
      endDate: '2026-12-31T23:59:59.000Z',
      usageLimit: 1000,
      usedCount: 0,
      isActive: true,
    };

    addCoupon(cp);
    setShowCouponModal(false);
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  // Create Banner
  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle || !newBannerImage) return;

    const b: Banner = {
      id: `banner-${Date.now()}`,
      title: newBannerTitle,
      subtitle: newBannerSubtitle || 'NEW ATELIER LAUNCH',
      imageUrl: newBannerImage,
      ctaText: newBannerCta,
      ctaLink: '/shop',
      type: 'hero',
      displayOrder: banners.length + 1,
      isActive: true,
    };

    addBanner(b);
    setShowBannerModal(false);
    setNewBannerTitle('');
    setNewBannerImage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Navigation Header */}
      <div className="bg-[#1A1A1A] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
              NEXORA ATELIER MANAGEMENT ENGINE
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
            Enterprise Admin Dashboard
          </h1>
          <p className="text-xs text-[#A39E93] mt-1">
            Product catalog, size-specific inventory audits, order fulfillment, and brand expansion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => switchUserRole('customer')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition-colors"
          >
            ← Back to Customer Storefront
          </button>
          <button
            onClick={handleOpenNewProduct}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C5A030] text-[#1A1A1A] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex border-b border-[#EAE6DF] bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto no-scrollbar gap-1">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'products', label: 'Products', count: products.length, icon: Package },
          { id: 'inventory', label: 'Inventory & Audits', count: metrics.lowStockVariants, icon: Boxes },
          { id: 'categories', label: 'Categories & Schema', count: categories.length, icon: FolderTree },
          { id: 'orders', label: 'Orders & Fulfillment', count: orders.length, icon: ShoppingBag },
          { id: 'coupons', label: 'Coupons & Promos', count: coupons.length, icon: Tag },
          { id: 'banners', label: 'Homepage Banners', count: banners.length, icon: ImageIcon },
          { id: 'customers', label: 'Customers', count: users.length, icon: Users },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'text-[#6B655D] hover:text-[#1A1A1A] hover:bg-[#FAF8F5]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-[#D4AF37] text-[#1A1A1A]' : 'bg-[#F2EDE2] text-[#8C8275]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================
          TAB 1: OVERVIEW METRICS
          ========================================================= */}
      {adminTab === 'overview' && (
        <div className="space-y-8">
          {/* Key KPI Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#EAE6DF] shadow-sm">
              <span className="text-[10px] uppercase font-bold text-[#8C8275] block">Total Revenue</span>
              <span className="font-serif text-xl font-bold text-[#1A1A1A] block mt-1">
                ₹{metrics.totalRevenue.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-[#1E7E34] font-semibold mt-1 block">↑ 18.4% vs last month</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#EAE6DF] shadow-sm">
              <span className="text-[10px] uppercase font-bold text-[#8C8275] block">Total Orders</span>
              <span className="font-serif text-xl font-bold text-[#1A1A1A] block mt-1">
                {metrics.totalOrders}
              </span>
              <span className="text-[10px] text-[#7A746E] mt-1 block">100% processed</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#EAE6DF] shadow-sm">
              <span className="text-[10px] uppercase font-bold text-[#8C8275] block">Total Customers</span>
              <span className="font-serif text-xl font-bold text-[#1A1A1A] block mt-1">
                {metrics.totalCustomers}
              </span>
              <span className="text-[10px] text-[#1E7E34] font-semibold mt-1 block">+12 this week</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#EAE6DF] shadow-sm">
              <span className="text-[10px] uppercase font-bold text-[#8C8275] block">Active Styles</span>
              <span className="font-serif text-xl font-bold text-[#1A1A1A] block mt-1">
                {metrics.totalProducts}
              </span>
              <span className="text-[10px] text-[#7A746E] mt-1 block">Footwear & Couture</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#EAE6DF] shadow-sm">
              <span className="text-[10px] uppercase font-bold text-[#8C8275] block">Low Stock Alerts</span>
              <span className="font-serif text-xl font-bold text-amber-600 block mt-1">
                {metrics.lowStockVariants}
              </span>
              <span className="text-[10px] text-amber-700 font-semibold mt-1 block">Variants ≤ 3 pairs</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#EAE6DF] shadow-sm">
              <span className="text-[10px] uppercase font-bold text-[#8C8275] block">Average Order Value</span>
              <span className="font-serif text-xl font-bold text-[#1A1A1A] block mt-1">
                ₹{metrics.aov.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-[#1E7E34] font-semibold mt-1 block">Luxury basket size</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#EAE6DF] shadow-sm">
              <span className="text-[10px] uppercase font-bold text-[#8C8275] block">Return Rate</span>
              <span className="font-serif text-xl font-bold text-[#1A1A1A] block mt-1">
                {metrics.returnRate}%
              </span>
              <span className="text-[10px] text-[#7A746E] mt-1 block">Well below 5% norm</span>
            </div>
          </div>

          {/* Quick Action Tables in Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders Overview */}
            <div className="bg-white p-6 rounded-2xl border border-[#EAE6DF] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Recent Storefront Orders</h3>
                <button
                  onClick={() => setAdminTab('orders')}
                  className="text-xs text-[#B38F4D] hover:underline font-semibold"
                >
                  View All Orders →
                </button>
              </div>

              <div className="divide-y divide-[#F5F2EB]">
                {orders.slice(0, 4).map((o) => (
                  <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#1A1A1A]">{o.orderNumber || o.id}</span>
                      <p className="text-[11px] text-[#777]">
                        {o.shippingAddress?.fullName || 'Customer'} • {o.items.length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#1A1A1A]">
                        ₹{o.total.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] font-semibold uppercase text-[#B38F4D]">
                        {o.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Attention Overview */}
            <div className="bg-white p-6 rounded-2xl border border-[#EAE6DF] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Low Stock Footwear Alerts</h3>
                <button
                  onClick={() => setAdminTab('inventory')}
                  className="text-xs text-[#B38F4D] hover:underline font-semibold"
                >
                  Manage Stock Levels →
                </button>
              </div>

              <div className="divide-y divide-[#F5F2EB]">
                {products
                  .flatMap((p) => p.variants.map((v) => ({ ...v, productName: p.name, productId: p.id })))
                  .filter((v) => v.stock <= 4)
                  .slice(0, 4)
                  .map((v, i) => (
                    <div key={i} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#1A1A1A] line-clamp-1">{v.productName}</span>
                        <p className="text-[11px] text-[#777]">
                          Size: <strong className="text-[#1A1A1A]">{v.size}</strong> • {v.colorName}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                          {v.stock} left
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: PRODUCTS MANAGEMENT
          ========================================================= */}
      {adminTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-[#8C8275] absolute left-3.5 top-3" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search styles by title, category, brand..."
                className="w-full bg-white border border-[#DCD4C7] pl-10 pr-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
              />
            </div>

            <button
              onClick={handleOpenNewProduct}
              className="px-4 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#333] transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create Product</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-[#EAE6DF] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#EAE6DF] text-[#7A746E] uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 font-bold">Product</th>
                    <th className="py-3 px-4 font-bold">Category</th>
                    <th className="py-3 px-4 font-bold">Price / MRP</th>
                    <th className="py-3 px-4 font-bold">Total Stock</th>
                    <th className="py-3 px-4 font-bold">Variants</th>
                    <th className="py-3 px-4 font-bold">Rating</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F2EB] text-[#1A1A1A]">
                  {products
                    .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                    .map((p) => {
                      const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                      return (
                        <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-10 h-12 rounded-lg object-cover bg-[#F5F2EB] shrink-0 border border-[#EAE6DF]"
                              />
                              <div>
                                <span className="font-bold block line-clamp-1">{p.name}</span>
                                <span className="text-[10px] text-[#8C8275]">{p.brand}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-[#4A453F]">
                              {categories.find((c) => c.id === p.categoryId)?.name || 'Footwear'}
                            </span>
                            <span className="text-[10px] text-[#8C8275] block">/{p.subcategoryId}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold">₹{p.price.toLocaleString('en-IN')}</span>
                            <span className="text-[10px] text-[#999] block line-through">
                              ₹{p.mrp.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                                totalStock <= 5
                                  ? 'bg-red-50 text-red-700'
                                  : 'bg-[#EBF7EE] text-[#1E7E34]'
                              }`}
                            >
                              {totalStock} units
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#666]">
                            {p.variants.length} size/color options
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-[#1A1A1A]">★ {p.rating}</span>
                            <span className="text-[10px] text-[#888]"> ({p.reviewCount})</span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 text-[#1A1A1A] hover:text-[#B38F4D] transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${p.name}?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 text-red-600 hover:text-red-800 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 3: INVENTORY & STOCK AUDIT LOG
          ========================================================= */}
      {adminTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-[#8C8275] absolute left-3.5 top-3" />
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Filter variants by size, SKU, style..."
                className="w-full bg-white border border-[#DCD4C7] pl-10 pr-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
              />
            </div>
          </div>

          {/* Real-Time Variant Stock Adjustment Grid */}
          <div className="bg-white rounded-2xl border border-[#EAE6DF] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[#EAE6DF] bg-[#FAF8F5] flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold text-[#1A1A1A]">
                Footwear Size & Color Stock Matrix
              </h3>
              <span className="text-xs text-[#8C8275]">Real-time adjustments sync directly to customer bag</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#EAE6DF] text-[#7A746E] uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 font-bold">Product Style</th>
                    <th className="py-3 px-4 font-bold">SKU</th>
                    <th className="py-3 px-4 font-bold">Size</th>
                    <th className="py-3 px-4 font-bold">Color</th>
                    <th className="py-3 px-4 font-bold">Current Stock</th>
                    <th className="py-3 px-4 font-bold text-right">Quick Stock Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F2EB] text-[#1A1A1A]">
                  {products.flatMap((prod) =>
                    prod.variants
                      .filter(
                        (v) =>
                          v.sku.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                          prod.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                          v.size.includes(inventorySearch)
                      )
                      .map((v) => (
                        <tr key={v.sku} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="py-3 px-4 font-semibold">{prod.name}</td>
                          <td className="py-3 px-4 font-mono text-[11px] text-[#7A746E]">{v.sku}</td>
                          <td className="py-3 px-4 font-bold text-[#B38F4D]">Size {v.size}</td>
                          <td className="py-3 px-4">
                            <span className="flex items-center gap-1.5">
                              <span
                                style={{ backgroundColor: v.colorHex }}
                                className="w-2.5 h-2.5 rounded-full border border-[#CCC]"
                              />
                              <span>{v.colorName}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-bold ${
                                v.stock <= 3 ? 'text-red-600' : 'text-[#1A1A1A]'
                              }`}
                            >
                              {v.stock} pairs
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  updateInventoryStock(v.id, v.stock - 1)
                                }
                                disabled={v.stock <= 0}
                                className="w-7 h-7 rounded-lg bg-[#FAF8F5] hover:bg-[#EAE6DF] border border-[#DCD4C7] font-bold text-xs"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-bold text-xs">{v.stock}</span>
                              <button
                                onClick={() =>
                                  updateInventoryStock(v.id, v.stock + 1)
                                }
                                className="w-7 h-7 rounded-lg bg-[#FAF8F5] hover:bg-[#EAE6DF] border border-[#DCD4C7] font-bold text-xs"
                              >
                                +
                              </button>
                              <button
                                onClick={() =>
                                  updateInventoryStock(v.id, v.stock + 10)
                                }
                                className="px-2 py-1 bg-[#1A1A1A] text-white text-[10px] font-semibold rounded-lg ml-1"
                              >
                                +10
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stock Threshold Alerts */}
          <div className="bg-white rounded-2xl border border-[#EAE6DF] p-6 space-y-4 shadow-sm">
            <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Atelier Inventory Thresholds</h3>
            <p className="text-xs text-[#666]">
              All items with 4 or fewer units remaining trigger instant low-stock indicators in customer search and product detail pages.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 4: CATEGORIES & SCHEMA (Expansion Proofing)
          ========================================================= */}
      {adminTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
                Category Architecture & Dynamic Schemas
              </h3>
              <p className="text-xs text-[#7A746E]">
                NEXORA's schema is category-agnostic: easily expand from footwear into women's couture, jewelry, or handbags.
              </p>
            </div>

            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-4 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#333] transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white p-6 rounded-2xl border border-[#EAE6DF] space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#1A1A1A]">{cat.name}</h4>
                    <span className="text-xs text-[#8C8275]">Slug: /{cat.slug}</span>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                      cat.isActive ? 'bg-[#EBF7EE] text-[#1E7E34]' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {cat.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <p className="text-xs text-[#666] leading-relaxed">{cat.seoDescription || `${cat.name} collection by NEXORA.`}</p>

                {/* Subcategories list */}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8275] block mb-1.5">
                    Subcategories / Silhouette Edits:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subcategories.map((sub) => (
                      <span
                        key={sub.id}
                        className="px-2.5 py-1 bg-[#FAF8F5] border border-[#EAE6DF] rounded-lg text-xs font-medium text-[#1A1A1A]"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Category Dynamic Attributes */}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8275] block mb-1.5">
                    Dynamic Schema Attributes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.attributeDefinitions?.map((attr) => (
                      <span
                        key={attr.id}
                        className="px-2 py-0.5 bg-[#FAF6EC] border border-[#E8DCB8] rounded text-[11px] font-semibold text-[#8C6B24]"
                      >
                        {attr.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F5F2EB] flex items-center justify-between text-xs">
                  <button
                    onClick={() => updateCategory(cat.id, { isActive: !cat.isActive })}
                    className="text-[#B38F4D] hover:underline font-semibold"
                  >
                    {cat.isActive ? 'Disable Category' : 'Enable Category'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 5: ORDERS & FULFILLMENT
          ========================================================= */}
      {adminTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-[#8C8275] absolute left-3.5 top-3" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search orders by customer, tracking, order ID..."
                className="w-full bg-white border border-[#DCD4C7] pl-10 pr-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EAE6DF] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#EAE6DF] text-[#7A746E] uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 font-bold">Order ID</th>
                    <th className="py-3 px-4 font-bold">Customer / City</th>
                    <th className="py-3 px-4 font-bold">Items</th>
                    <th className="py-3 px-4 font-bold">Total</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Courier & Tracking</th>
                    <th className="py-3 px-4 font-bold text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F2EB] text-[#1A1A1A]">
                  {orders
                    .filter(
                      (o) =>
                        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.shippingAddress?.city.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        (o.shippingAddress?.fullName || '').toLowerCase().includes(orderSearch.toLowerCase())
                    )
                    .map((o) => (
                      <tr key={o.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold">{o.orderNumber || o.id}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold block">{o.shippingAddress?.fullName}</span>
                          <span className="text-[10px] text-[#8C8275]">
                            {o.shippingAddress?.city} ({o.shippingAddress?.pinCode})
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#666]">{o.items.length} designs</td>
                        <td className="py-3 px-4 font-bold">
                          ₹{o.total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              o.status === 'delivered'
                                ? 'bg-[#EBF7EE] text-[#1E7E34]'
                                : o.status === 'cancelled'
                                ? 'bg-red-50 text-red-700'
                                : o.status === 'returned'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-[#FAF6EC] text-[#B38F4D]'
                            }`}
                          >
                            {o.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="block font-medium">{o.tracking?.courier || 'BlueDart'}</span>
                          <span className="text-[10px] font-mono text-[#8C8275]">{o.tracking?.trackingNumber}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrderForEdit(o);
                              setNewStatus(o.status);
                              setNewTrackingNumber(o.tracking?.trackingNumber || '');
                              setNewCourier(o.tracking?.courier || 'BlueDart');
                            }}
                            className="px-3 py-1 bg-[#1A1A1A] text-white text-[11px] font-semibold rounded-lg hover:bg-[#333] transition-colors"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 6: COUPONS & DISCOUNTS
          ========================================================= */}
      {adminTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">Promotional Coupons</h3>
            <button
              onClick={() => setShowCouponModal(true)}
              className="px-4 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#333] transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coupons.map((cp) => (
              <div
                key={cp.code}
                className="bg-white p-6 rounded-2xl border border-[#EAE6DF] space-y-3 shadow-sm relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-[#1A1A1A] bg-[#FAF8F5] px-3 py-1 rounded-lg border border-[#DCD4C7]">
                    {cp.code}
                  </span>
                  <button
                    onClick={() => deleteCoupon(cp.code)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[#666]">{cp.description}</p>
                <div className="text-xs space-y-1 text-[#7A746E] pt-2 border-t border-[#F5F2EB]">
                  <div>
                    Benefit:{' '}
                    <strong className="text-[#1A1A1A]">
                      {cp.discountType === 'percentage'
                        ? `${cp.discountValue}% OFF`
                        : `₹${cp.discountValue} FLAT OFF`}
                    </strong>
                  </div>
                  <div>
                    Min Order: <strong className="text-[#1A1A1A]">₹{cp.minOrder}</strong>
                  </div>
                  <div>
                    Usage Count: <strong className="text-[#1A1A1A]">{cp.usedCount} times</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 7: HOMEPAGE BANNERS
          ========================================================= */}
      {adminTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">Homepage Banners & Hero Ads</h3>
            <button
              onClick={() => setShowBannerModal(true)}
              className="px-4 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#333] transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Banner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-[#EAE6DF] overflow-hidden shadow-sm flex flex-col"
              >
                <div className="relative aspect-video w-full bg-[#FAF8F5]">
                  <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-[#1A1A1A]/80 text-[#D4AF37] px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold">
                    {b.type}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#B38F4D]">{b.subtitle}</span>
                    <h4 className="font-serif text-lg font-bold text-[#1A1A1A]">{b.title}</h4>
                  </div>
                  <div className="pt-4 border-t border-[#F5F2EB] flex justify-between items-center text-xs">
                    <span className="text-[#666]">CTA: {b.ctaText}</span>
                    {banners.length > 1 && (
                      <button
                        onClick={() => deleteBanner(b.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 8: CUSTOMERS
          ========================================================= */}
      {adminTab === 'customers' && (
        <div className="space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">Registered Shoppers & Privileged Members</h3>
          <div className="bg-white rounded-2xl border border-[#EAE6DF] overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EAE6DF] text-[#7A746E] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-bold">Shopper Name</th>
                  <th className="py-3 px-4 font-bold">Email</th>
                  <th className="py-3 px-4 font-bold">Mobile</th>
                  <th className="py-3 px-4 font-bold">Role</th>
                  <th className="py-3 px-4 font-bold">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2EB] text-[#1A1A1A]">
                {users.map((u: User) => (
                  <tr key={u.id} className="hover:bg-[#FAF8F5]">
                    <td className="py-3 px-4 font-bold">{u.name}</td>
                    <td className="py-3 px-4 text-[#666]">{u.email}</td>
                    <td className="py-3 px-4 text-[#666]">{u.phone || '+91 98765 43210'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#F2EDE2] text-[#1A1A1A] font-semibold uppercase text-[10px]">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#8C8275]">{u.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 9: ANALYTICS
          ========================================================= */}
      {adminTab === 'analytics' && (
        <div className="space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">Executive Performance Metrics</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#EAE6DF] space-y-4 shadow-sm">
              <h4 className="font-serif text-base font-bold text-[#1A1A1A]">Category Revenue Distribution</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Girls Footwear (Block Heels & Ballerinas)</span>
                    <strong className="text-[#1A1A1A]">82% (₹{Math.round(metrics.totalRevenue * 0.82).toLocaleString('en-IN')})</strong>
                  </div>
                  <div className="w-full h-2 bg-[#F2EDE2] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1A1A1A] w-[82%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Girls Couture Apparel & Dresses</span>
                    <strong className="text-[#1A1A1A]">18% (₹{Math.round(metrics.totalRevenue * 0.18).toLocaleString('en-IN')})</strong>
                  </div>
                  <div className="w-full h-2 bg-[#F2EDE2] rounded-full overflow-hidden">
                    <div className="h-full bg-[#B38F4D] w-[18%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EAE6DF] space-y-4 shadow-sm">
              <h4 className="font-serif text-base font-bold text-[#1A1A1A]">Top Footwear Sizes Sold</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#F5F2EB]">
                  <span>Size 12 (18 cm)</span>
                  <strong className="text-[#1E7E34]">34% of volume</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5F2EB]">
                  <span>Size 13 (18.5 cm)</span>
                  <strong className="text-[#1E7E34]">28% of volume</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5F2EB]">
                  <span>Size 1 (20 cm)</span>
                  <strong className="text-[#1E7E34]">20% of volume</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Sizes 11, 2, 3</span>
                  <strong className="text-[#666]">18% of volume</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          PRODUCT CREATION / EDIT MODAL
          ========================================================= */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] max-w-3xl w-full rounded-2xl shadow-2xl border border-[#EAE6DF] overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 border-b border-[#EAE6DF] flex items-center justify-between bg-white">
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                {editingProductId ? 'Edit Product & Variant Stock' : 'Create New Atelier Design'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-[#888] hover:text-[#1A1A1A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-5 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Aurelia Pearl Shimmer Block Heel"
                    className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1">Category</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full bg-white border border-[#DCD4C7] px-2.5 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={formSubcategorySlug}
                    onChange={(e) => setFormSubcategorySlug(e.target.value)}
                    placeholder="sandals, heels, flats"
                    className="w-full bg-white border border-[#DCD4C7] px-2.5 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-white border border-[#DCD4C7] px-2.5 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={formMrp}
                    onChange={(e) => setFormMrp(Number(e.target.value))}
                    className="w-full bg-white border border-[#DCD4C7] px-2.5 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">Image URL</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                />
              </div>

              {/* Dynamic Variants Engine (Size + Color + Stock) */}
              <div className="bg-white p-4 rounded-xl border border-[#EAE6DF] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                    Variant Matrix (Sizes & Inventory Per Color)
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setFormVariants([
                        ...formVariants,
                        {
                          id: `var_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                          sku: `NX-${Date.now()}-${formVariants.length + 1}`,
                          size: '2',
                          colorName: formVariants[0]?.colorName || 'Rose Gold',
                          colorHex: '#B76E79',
                          price: formPrice || 1999,
                          mrp: formMrp || 2999,
                          stock: 5,
                          imageIndex: 0,
                          isAvailable: true,
                        },
                      ]);
                    }}
                    className="text-[11px] text-[#B38F4D] hover:underline font-semibold"
                  >
                    + Add Size Variant
                  </button>
                </div>

                <div className="space-y-2">
                  {formVariants.map((v, vIdx) => (
                    <div key={vIdx} className="grid grid-cols-5 gap-2 items-center text-xs">
                      <input
                        type="text"
                        value={v.size}
                        onChange={(e) => {
                          const updated = [...formVariants];
                          updated[vIdx].size = e.target.value;
                          setFormVariants(updated);
                        }}
                        placeholder="Size (e.g. 11, 12, 13, 1)"
                        className="bg-[#FAF8F5] border border-[#DDD] px-2 py-1.5 rounded-lg"
                      />
                      <input
                        type="text"
                        value={v.colorName}
                        onChange={(e) => {
                          const updated = [...formVariants];
                          updated[vIdx].colorName = e.target.value;
                          setFormVariants(updated);
                        }}
                        placeholder="Color Name"
                        className="bg-[#FAF8F5] border border-[#DDD] px-2 py-1.5 rounded-lg"
                      />
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => {
                          const updated = [...formVariants];
                          updated[vIdx].stock = Number(e.target.value);
                          setFormVariants(updated);
                        }}
                        placeholder="Stock count"
                        className="bg-[#FAF8F5] border border-[#DDD] px-2 py-1.5 rounded-lg"
                      />
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => {
                          const updated = [...formVariants];
                          updated[vIdx].sku = e.target.value;
                          setFormVariants(updated);
                        }}
                        placeholder="SKU"
                        className="bg-[#FAF8F5] border border-[#DDD] px-2 py-1.5 rounded-lg font-mono text-[10px]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (formVariants.length > 1) {
                            setFormVariants(formVariants.filter((_, idx) => idx !== vIdx));
                          }
                        }}
                        className="text-red-500 hover:text-red-700 text-right pr-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 text-xs text-[#666] hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#333] transition-colors shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          ORDER UPDATE MODAL
          ========================================================= */}
      {selectedOrderForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] max-w-md w-full rounded-2xl shadow-2xl border border-[#EAE6DF] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                Fulfill Order {selectedOrderForEdit.id}
              </h3>
              <button
                onClick={() => setSelectedOrderForEdit(null)}
                className="text-[#888] hover:text-[#1A1A1A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateOrderStatus} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">
                  Update Order Pipeline Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as Order['status'])}
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                >
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="packed">Packed at Atelier</option>
                  <option value="shipped">Shipped to Courier</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned / Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">Courier Partner</label>
                <select
                  value={newCourier}
                  onChange={(e) => setNewCourier(e.target.value)}
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                >
                  <option value="BlueDart Express">BlueDart Express</option>
                  <option value="Delhivery Surface">Delhivery Air / Surface</option>
                  <option value="DTDC Priority">DTDC Priority</option>
                  <option value="FedEx India">FedEx India</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">
                  Air Waybill / Tracking Number
                </label>
                <input
                  type="text"
                  value={newTrackingNumber}
                  onChange={(e) => setNewTrackingNumber(e.target.value)}
                  placeholder="e.g. BLU-74829103"
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs font-mono rounded-xl focus:outline-none focus:border-[#B38F4D]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl"
                >
                  Save & Notify Customer
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrderForEdit(null)}
                  className="px-4 py-2.5 text-xs text-[#666] hover:underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          CATEGORY MODAL
          ========================================================= */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] max-w-md w-full rounded-2xl shadow-2xl border border-[#EAE6DF] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Create New Category</h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-[#888] hover:text-[#1A1A1A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    setNewCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  placeholder="e.g. Women Handbags"
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  placeholder="women-handbags"
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">Archetype</label>
                <select
                  value={newCatType}
                  onChange={(e) => setNewCatType(e.target.value as any)}
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                >
                  <option value="footwear">Footwear (Sizing: 11, 12, 13, 1, 2, 3)</option>
                  <option value="apparel">Apparel (Sizing: XS, S, M, L, XL)</option>
                  <option value="accessories">Accessories / Jewelry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Luxury handcrafted leather and satin bags..."
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl"
                >
                  Provision Category
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2.5 text-xs text-[#666] hover:underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          COUPON MODAL
          ========================================================= */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] max-w-md w-full rounded-2xl shadow-2xl border border-[#EAE6DF] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Create New Promo Coupon</h3>
              <button onClick={() => setShowCouponModal(false)} className="text-[#888] hover:text-[#1A1A1A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DIWALI20"
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs uppercase font-mono rounded-xl focus:outline-none focus:border-[#B38F4D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">Min Order Value (₹)</label>
                <input
                  type="number"
                  value={newCouponMinOrder}
                  onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">Description</label>
                <input
                  type="text"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  placeholder="Festive celebration discount"
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl"
                >
                  Activate Coupon
                </button>
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2.5 text-xs text-[#666] hover:underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          BANNER MODAL
          ========================================================= */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] max-w-md w-full rounded-2xl shadow-2xl border border-[#EAE6DF] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Create New Hero Banner</h3>
              <button onClick={() => setShowBannerModal(false)} className="text-[#888] hover:text-[#1A1A1A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBanner} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={newBannerTitle}
                  onChange={(e) => setNewBannerTitle(e.target.value)}
                  placeholder="Royal Wedding & Party Edit"
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">Eyebrow Subtitle</label>
                <input
                  type="text"
                  value={newBannerSubtitle}
                  onChange={(e) => setNewBannerSubtitle(e.target.value)}
                  placeholder="FESTIVE SPECIAL"
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newBannerImage}
                  onChange={(e) => setNewBannerImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl"
                >
                  Publish Banner
                </button>
                <button
                  type="button"
                  onClick={() => setShowBannerModal(false)}
                  className="px-4 py-2.5 text-xs text-[#666] hover:underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
