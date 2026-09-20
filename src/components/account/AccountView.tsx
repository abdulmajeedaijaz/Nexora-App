import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Address, Order, ReturnRequest } from '../../types';
import {
  Package,
  MapPin,
  Tag,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Truck,
  Plus,
  Trash2,
  X,
  RotateCcw,
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const {
    currentUser,
    orders,
    addresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    cancelOrder,
    requestReturn,
    coupons,
    setCurrentView,
    logout,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'coupons' | 'about'>('orders');

  // Return Request Modal
  const [returnOrder, setReturnOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState<ReturnRequest['reason']>('wrong_size');
  const [returnComments, setReturnComments] = useState<string>('');

  // Address modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrLine2, setAddrLine2] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('Karnataka');
  const [addrPinCode, setAddrPinCode] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrType, setAddrType] = useState<'home' | 'work' | 'other'>('home');

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrPhone || !addrLine1 || !addrCity || !addrPinCode) {
      showToast('Incomplete details', 'Please fill in all mandatory fields.', 'error');
      return;
    }

    addAddress({
      fullName: addrName,
      phone: addrPhone,
      addressLine1: addrLine1,
      addressLine2: addrLine2,
      city: addrCity,
      state: addrState,
      pinCode: addrPinCode,
      landmark: addrLandmark,
      isDefault: addresses.length === 0,
      type: addrType,
    });

    setShowAddressModal(false);
    setAddrName('');
    setAddrPhone('');
    setAddrLine1('');
    setAddrLine2('');
    setAddrCity('');
    setAddrPinCode('');
    setAddrLandmark('');
  };

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnOrder) return;
    requestReturn(returnOrder.id, returnReason, returnComments);
    setReturnOrder(null);
    setReturnComments('');
  };

  // Timeline helper
  const timelineSteps = [
    { key: 'placed', label: 'Order Placed' },
    { key: 'confirmed', label: 'Order Confirmed' },
    { key: 'packed', label: 'Packed at Atelier' },
    { key: 'shipped', label: 'Shipped (Courier)' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'confirmed':
        return 1;
      case 'packed':
        return 2;
      case 'shipped':
        return 3;
      case 'out_for_delivery':
        return 4;
      case 'delivered':
        return 5;
      default:
        return -1;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Account Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EAE6DF] shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#F4EFE6] border-2 border-[#DCD4C7] flex items-center justify-center font-serif text-2xl font-bold text-[#1A1A1A]">
            {currentUser ? currentUser.name.charAt(0) : 'N'}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38F4D]">
              PRIVILEGED MEMBER
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              {currentUser ? currentUser.name : 'Guest Shopper'}
            </h1>
            <p className="text-xs text-[#7A746E]">{currentUser?.email || 'shopper@nexora.luxury'}</p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            setCurrentView('home');
          }}
          className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Account Tabs & Views */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 bg-white p-3 rounded-2xl border border-[#EAE6DF] space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
              activeTab === 'orders'
                ? 'bg-[#1A1A1A] text-white shadow-sm'
                : 'text-[#4A453F] hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Orders & Returns</span>
            </div>
            <span className="text-[11px] opacity-80">({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
              activeTab === 'addresses'
                ? 'bg-[#1A1A1A] text-white shadow-sm'
                : 'text-[#4A453F] hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </div>
            <span className="text-[11px] opacity-80">({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
              activeTab === 'coupons'
                ? 'bg-[#1A1A1A] text-white shadow-sm'
                : 'text-[#4A453F] hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Tag className="w-4 h-4" />
              <span>Privilege Coupons</span>
            </div>
            <span className="text-[11px] opacity-80">({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
              activeTab === 'about'
                ? 'bg-[#1A1A1A] text-white shadow-sm'
                : 'text-[#4A453F] hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4" />
              <span>NEXORA Heritage</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>
        </div>

        {/* Tab Body (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: ORDERS & TRACKING */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">Order History & Shipments</h3>
                <span className="text-xs text-[#8C8275]">Showing {orders.length} orders</span>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-[#EAE6DF] text-center space-y-3">
                  <Package className="w-12 h-12 text-[#CCC] mx-auto" />
                  <h4 className="font-serif text-lg font-bold text-[#1A1A1A]">No Orders Placed Yet</h4>
                  <p className="text-xs text-[#7A746E]">
                    Explore our girls' footwear collections and place your first order with complimentary delivery.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setCurrentView('shop')}
                      className="px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const activeStepIndex = getStepIndex(order.status);
                    const isCancelled = order.status === 'cancelled';
                    const isReturned = order.status === 'returned' || order.status === 'return_requested';

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-[#EAE6DF] p-5 sm:p-6 space-y-4 shadow-sm"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F5F2EB] gap-2">
                          <div>
                            <span className="text-[10px] text-[#8C8275] uppercase font-bold tracking-wider">
                              Order ID:{' '}
                              <strong className="text-[#1A1A1A] font-mono">
                                {order.orderNumber || order.id}
                              </strong>
                            </span>
                            <p className="text-xs text-[#666] mt-0.5">
                              Placed on{' '}
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                                order.status === 'delivered'
                                  ? 'bg-[#EBF7EE] text-[#1E7E34]'
                                  : order.status === 'cancelled'
                                  ? 'bg-red-50 text-red-700'
                                  : isReturned
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-[#FAF6EC] text-[#B38F4D]'
                              }`}
                            >
                              {order.status.replace('_', ' ')}
                            </span>
                            <span className="text-sm font-bold text-[#1A1A1A]">
                              ₹{order.total.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                              <img
                                src={it.image}
                                alt={it.name}
                                className="w-16 h-16 rounded-xl object-cover bg-[#F5F2EB] shrink-0 border border-[#EAE6DF]"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-serif text-xs font-bold text-[#1A1A1A] truncate">
                                  {it.name}
                                </h4>
                                <p className="text-[11px] text-[#7A746E] mt-0.5">
                                  Size {it.size} • {it.colorName} • Qty: {it.quantity}
                                </p>
                                <span className="text-xs font-semibold text-[#1A1A1A] block mt-0.5">
                                  ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Real-time Order Tracking Timeline */}
                        {!isCancelled && !isReturned && (
                          <div className="pt-3 border-t border-[#F5F2EB] space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                                <Truck className="w-4 h-4 text-[#B38F4D]" />
                                <span>
                                  Tracking: {order.tracking?.courier || 'BlueDart Express'} (
                                  <strong className="font-mono">
                                    {order.tracking?.trackingNumber || 'NX-TRK-74829'}
                                  </strong>
                                  )
                                </span>
                              </span>
                              <span className="text-[11px] text-[#8C8275]">
                                Estimated Delivery: {order.tracking?.estimatedDelivery || 'In 3-4 days'}
                              </span>
                            </div>

                            {/* Stepper Bar */}
                            <div className="grid grid-cols-6 gap-1 pt-2">
                              {timelineSteps.map((st, sIdx) => {
                                const isDone = sIdx <= activeStepIndex;
                                return (
                                  <div key={st.key} className="flex flex-col items-center text-center">
                                    <div
                                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] mb-1 ${
                                        isDone
                                          ? 'bg-[#1A1A1A] text-white font-bold'
                                          : 'bg-[#EAE4D8] text-[#999]'
                                      }`}
                                    >
                                      {isDone ? '✓' : sIdx + 1}
                                    </div>
                                    <span
                                      className={`text-[9px] line-clamp-1 ${
                                        isDone ? 'font-bold text-[#1A1A1A]' : 'text-[#999]'
                                      }`}
                                    >
                                      {st.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons: Cancel or Return */}
                        <div className="pt-3 border-t border-[#F5F2EB] flex flex-wrap items-center justify-between gap-3">
                          <div className="text-[11px] text-[#7A746E]">
                            Ship to: <strong className="text-[#1A1A1A]">{order.shippingAddress?.city}</strong>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Cancel option if placed or confirmed */}
                            {(order.status === 'placed' || order.status === 'confirmed') && (
                              <button
                                onClick={() => cancelOrder(order.id, 'Customer requested cancellation')}
                                className="px-3.5 py-1.5 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors font-medium"
                              >
                                Cancel Order
                              </button>
                            )}

                            {/* Return / Exchange if delivered */}
                            {order.status === 'delivered' && (
                              <button
                                onClick={() => setReturnOrder(order)}
                                className="px-3.5 py-1.5 text-xs text-[#1A1A1A] hover:bg-[#FAF8F5] border border-[#DCD4C7] rounded-xl transition-colors font-medium flex items-center gap-1"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>7-Day Return / Exchange</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">Delivery Addresses</h3>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-4 py-2 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-5 rounded-2xl bg-white border transition-all ${
                      addr.isDefault ? 'border-[#1A1A1A] ring-1 ring-[#1A1A1A]' : 'border-[#EAE6DF]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#1A1A1A]">{addr.fullName}</h4>
                        <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#FAF8F5] text-[#8C8275] border border-[#EAE6DF]">
                          {addr.type}
                        </span>
                      </div>
                      {addr.isDefault && (
                        <span className="text-[10px] uppercase font-bold text-[#1E7E34] bg-[#EBF7EE] px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#666] leading-relaxed">
                      {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pinCode}
                    </p>
                    <p className="text-xs text-[#888] mt-1">Mobile: {addr.phone}</p>

                    <div className="pt-4 mt-3 border-t border-[#F5F2EB] flex items-center justify-between text-xs">
                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-[#B38F4D] hover:underline font-semibold"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-red-600 hover:underline flex items-center gap-1 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">Atelier Coupons & Privileges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="p-5 rounded-2xl bg-white border border-[#EAE6DF] space-y-2 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-[#1A1A1A] bg-[#FAF6EC] border border-[#E8DCB8] px-3 py-1 rounded-lg">
                        {c.code}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#1E7E34]">
                        Valid across collection
                      </span>
                    </div>
                    <p className="text-xs text-[#666] pt-1">{c.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-[#8C8275] pt-2 border-t border-[#F5F2EB]">
                      <span>Min Order: ₹{c.minOrder}</span>
                      <span>Expires: {c.endDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ABOUT NEXORA */}
          {activeTab === 'about' && (
            <div className="bg-white p-8 rounded-2xl border border-[#EAE6DF] space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38F4D]">
                OUR MANIFESTO
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                The Story Behind NEXORA
              </h2>
              <p className="text-xs sm:text-sm text-[#6B655D] leading-relaxed">
                NEXORA was founded on a singular conviction: modern girls and young women deserve celebratory footwear
                that harmonizes high-fashion couture with uncompromising ergonomic orthopedic safety.
              </p>
              <p className="text-xs sm:text-sm text-[#6B655D] leading-relaxed">
                Starting with celebration footwear—low stable block heels, crystal ballerinas, and memory foam party
                sandals—NEXORA's architecture is engineered to expand smoothly into complete apparel, festive couture,
                and women’s fashion.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#F5F2EB]">
                <div>
                  <h4 className="text-xs font-bold text-[#1A1A1A]">Handcrafted Precision</h4>
                  <p className="text-[11px] text-[#7A746E] mt-0.5">Artisanal stitching & TPR slip-resistant soles.</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1A1A1A]">100% Authentic</h4>
                  <p className="text-[11px] text-[#7A746E] mt-0.5">Direct from our specialized atelier workshops.</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1A1A1A]">Couture Sizing</h4>
                  <p className="text-[11px] text-[#7A746E] mt-0.5">Custom millimeter fit calculator per age bracket.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Return Request Modal */}
      {returnOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] max-w-md w-full rounded-2xl shadow-2xl border border-[#EAE6DF] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Request 7-Day Doorstep Return</h3>
              <button onClick={() => setReturnOrder(null)} className="text-[#888] hover:text-[#1A1A1A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#666]">
              Order ID:{' '}
              <strong className="text-[#1A1A1A] font-mono">
                {returnOrder.orderNumber || returnOrder.id}
              </strong>
            </p>

            <form onSubmit={handleConfirmReturn} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">Reason for Return / Exchange</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value as ReturnRequest['reason'])}
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                >
                  <option value="wrong_size">Size is too small / tight</option>
                  <option value="wrong_product">Received incorrect style</option>
                  <option value="quality_issue">Color tone differs from expectation</option>
                  <option value="changed_mind">Looking for another design</option>
                  <option value="damaged">Manufacturing defect or strap issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">Additional Notes</label>
                <textarea
                  rows={3}
                  value={returnComments}
                  onChange={(e) => setReturnComments(e.target.value)}
                  placeholder="e.g. Would like to exchange for Size 13 in Champagne Gold..."
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                />
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#EAE6DF] text-[11px] text-[#7A746E]">
                Our courier partner will arrive at your address within 48 hours for doorstep inspection and pickup.
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl"
                >
                  Confirm Return Request
                </button>
                <button
                  type="button"
                  onClick={() => setReturnOrder(null)}
                  className="px-4 py-2.5 text-xs text-[#666] hover:underline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] max-w-md w-full rounded-2xl shadow-2xl border border-[#EAE6DF] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Add New Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-[#888] hover:text-[#1A1A1A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={addrName}
                    onChange={(e) => setAddrName(e.target.value)}
                    placeholder="Recipient Name"
                    className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444] mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={addrLine1}
                  onChange={(e) => setAddrLine1(e.target.value)}
                  placeholder="House, Flat No., Street"
                  className="w-full bg-white border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    placeholder="City"
                    className="w-full bg-white border border-[#DCD4C7] px-2.5 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    placeholder="State"
                    className="w-full bg-white border border-[#DCD4C7] px-2.5 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addrPinCode}
                    onChange={(e) => setAddrPinCode(e.target.value)}
                    placeholder="PIN"
                    className="w-full bg-white border border-[#DCD4C7] px-2.5 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
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
