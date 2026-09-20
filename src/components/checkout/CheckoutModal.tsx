import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Address, Order } from '../../types';
import {
  X,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  Plus,
  ArrowRight,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartTotals,
    addresses,
    addAddress,
    placeOrder,
    setCurrentView,
    showToast,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses[0]?.id || ''
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // New Address form
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddressLine1, setNewAddressLine1] = useState('');
  const [newAddressLine2, setNewAddressLine2] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('Karnataka');
  const [newPinCode, setNewPinCode] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newAddressType, setNewAddressType] = useState<'home' | 'work' | 'other'>('home');

  // Delivery method
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiVpa, setUpiVpa] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Confirmation Order info
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isCheckoutOpen) return null;

  const expressFee = deliveryMethod === 'express' ? 149 : 0;
  const finalPayable = cartTotals.total + expressFee;

  const selectedAddress =
    addresses.find((a: Address) => a.id === selectedAddressId) || addresses[0];

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone || !newAddressLine1 || !newCity || !newPinCode) {
      showToast('Missing details', 'Please complete the required address fields.', 'error');
      return;
    }

    const newAddr: Omit<Address, 'id' | 'userId'> = {
      fullName: newFullName,
      phone: newPhone,
      addressLine1: newAddressLine1,
      addressLine2: newAddressLine2,
      city: newCity,
      state: newState,
      pinCode: newPinCode,
      landmark: newLandmark,
      isDefault: addresses.length === 0,
      type: newAddressType,
    };

    addAddress(newAddr);
    setIsAddingNewAddress(false);
    showToast('Address Saved', 'New delivery destination registered.');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showToast('Select Delivery Address', 'Please choose a shipping destination.', 'error');
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      const order = await placeOrder(selectedAddress, deliveryMethod, paymentMethod);
      setConfirmedOrder(order);
      setStep(4);
    } catch (err) {
      showToast('Order Failed', 'Could not process order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] max-w-2xl w-full rounded-2xl shadow-2xl border border-[#EAE6DF] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#EAE6DF] flex items-center justify-between bg-white">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B38F4D]">
              NEXORA CONCIERGE CHECKOUT
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              {step === 1
                ? 'Delivery Address'
                : step === 2
                ? 'Shipping Method'
                : step === 3
                ? 'Payment & Place Order'
                : 'Order Confirmed!'}
            </h2>
          </div>
          {step !== 4 && (
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1.5 rounded-full text-[#7A746E] hover:text-[#1A1A1A] hover:bg-[#F2EDE2]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Stepper Progress Indicator */}
        {step !== 4 && (
          <div className="bg-[#F7F4EE] px-6 py-2.5 border-b border-[#EAE6DF] flex items-center justify-between text-xs">
            <div
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 cursor-pointer font-semibold ${
                step >= 1 ? 'text-[#1A1A1A]' : 'text-[#8C8275]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === 1 ? 'bg-[#1A1A1A] text-white' : 'bg-[#DCD4C7] text-[#1A1A1A]'
                }`}
              >
                1
              </span>
              <span>Address</span>
            </div>
            <div className="w-8 h-0.5 bg-[#DCD4C7]" />
            <div
              onClick={() => selectedAddress && setStep(2)}
              className={`flex items-center gap-1.5 cursor-pointer font-semibold ${
                step >= 2 ? 'text-[#1A1A1A]' : 'text-[#8C8275]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === 2 ? 'bg-[#1A1A1A] text-white' : 'bg-[#DCD4C7] text-[#1A1A1A]'
                }`}
              >
                2
              </span>
              <span>Delivery</span>
            </div>
            <div className="w-8 h-0.5 bg-[#DCD4C7]" />
            <div
              className={`flex items-center gap-1.5 font-semibold ${
                step >= 3 ? 'text-[#1A1A1A]' : 'text-[#8C8275]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === 3 ? 'bg-[#1A1A1A] text-white' : 'bg-[#DCD4C7] text-[#1A1A1A]'
                }`}
              >
                3
              </span>
              <span>Payment</span>
            </div>
          </div>
        )}

        {/* Step Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Address Selection / Creation */}
          {step === 1 && (
            <div className="space-y-4">
              {!isAddingNewAddress ? (
                <>
                  <div className="space-y-2.5">
                    {addresses.map((addr: Address) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-white border-[#1A1A1A] shadow-md ring-1 ring-[#1A1A1A]'
                              : 'bg-white border-[#EAE6DF] hover:border-[#B38F4D]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-[#1A1A1A]">{addr.fullName}</span>
                              <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#F2EDE2] text-[#8C8275]">
                                {addr.type}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-[#666]">{addr.phone}</span>
                          </div>
                          <p className="text-xs text-[#555] mt-1.5 leading-relaxed">
                            {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pinCode}
                          </p>
                          {addr.landmark && (
                            <p className="text-[11px] text-[#888]">Landmark: {addr.landmark}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setIsAddingNewAddress(true)}
                    className="w-full py-3 border-2 border-dashed border-[#DCD4C7] hover:border-[#1A1A1A] rounded-xl text-xs font-semibold text-[#1A1A1A] flex items-center justify-center gap-2 transition-colors bg-white"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Delivery Address</span>
                  </button>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      className="px-8 py-3 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#333] transition-colors flex items-center gap-2 shadow-md"
                    >
                      <span>Proceed to Shipping Method</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                /* Add New Address Form */
                <form onSubmit={handleAddNewAddress} className="space-y-3 bg-white p-5 rounded-xl border border-[#EAE6DF]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                    Enter New Shipping Destination
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#444] mb-1">Recipient Name</label>
                      <input
                        type="text"
                        required
                        value={newFullName}
                        onChange={(e) => setNewFullName(e.target.value)}
                        placeholder="e.g. Ananya Sharma"
                        className="w-full bg-[#FAF8F5] border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#444] mb-1">10-Digit Mobile Number</label>
                      <input
                        type="tel"
                        required
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full bg-[#FAF8F5] border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#444] mb-1">Flat, Villa, Street Address</label>
                    <input
                      type="text"
                      required
                      value={newAddressLine1}
                      onChange={(e) => setNewAddressLine1(e.target.value)}
                      placeholder="e.g. 402, Sterling Orchid Enclave, Lavelle Road"
                      className="w-full bg-[#FAF8F5] border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#444] mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        placeholder="Bengaluru"
                        className="w-full bg-[#FAF8F5] border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#444] mb-1">State</label>
                      <select
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#DCD4C7] px-2.5 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                      >
                        <option value="Karnataka">Karnataka</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Rajasthan">Rajasthan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#444] mb-1">PIN Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={newPinCode}
                        onChange={(e) => setNewPinCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="560001"
                        className="w-full bg-[#FAF8F5] border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#444] mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={newLandmark}
                      onChange={(e) => setNewLandmark(e.target.value)}
                      placeholder="Near UB City Mall"
                      className="w-full bg-[#FAF8F5] border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl"
                    >
                      Save & Select
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(false)}
                      className="px-4 py-2.5 text-xs text-[#666] hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: Delivery Speed */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div
                  onClick={() => setDeliveryMethod('standard')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    deliveryMethod === 'standard'
                      ? 'bg-white border-[#1A1A1A] shadow-md ring-1 ring-[#1A1A1A]'
                      : 'bg-white border-[#EAE6DF] hover:border-[#B38F4D]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-[#B38F4D]" />
                      <div>
                        <h4 className="text-xs font-bold text-[#1A1A1A]">Standard Express Transit</h4>
                        <p className="text-[11px] text-[#7A746E]">
                          Delivery in 3-4 business days via BlueDart or Delhivery Air.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#1E7E34]">
                      {cartTotals.deliveryFee === 0 ? 'FREE' : `₹${cartTotals.deliveryFee}`}
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setDeliveryMethod('express')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    deliveryMethod === 'express'
                      ? 'bg-white border-[#1A1A1A] shadow-md ring-1 ring-[#1A1A1A]'
                      : 'bg-white border-[#EAE6DF] hover:border-[#B38F4D]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-[#D4AF37]" />
                      <div>
                        <h4 className="text-xs font-bold text-[#1A1A1A]">
                          Priority Next-Day Runway Dispatch
                        </h4>
                        <p className="text-[11px] text-[#7A746E]">
                          Guaranteed overnight dispatch with priority gift packaging.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#1A1A1A]">₹149</span>
                  </div>
                </div>
              </div>

              {/* Delivery To Review */}
              <div className="p-4 bg-white rounded-xl border border-[#EAE6DF] text-xs">
                <span className="text-[#8C8275] uppercase text-[10px] font-bold block mb-1">
                  Delivering To:
                </span>
                <p className="font-semibold text-[#1A1A1A]">{selectedAddress?.fullName}</p>
                <p className="text-[#666]">
                  {selectedAddress?.addressLine1}, {selectedAddress?.city} - {selectedAddress?.pinCode}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-[#666] hover:underline font-semibold"
                >
                  Back to Address
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-8 py-3 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#333] transition-colors flex items-center gap-2 shadow-md"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Options */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-3">
                {/* UPI */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-white border-[#1A1A1A] shadow-md ring-1 ring-[#1A1A1A]'
                      : 'bg-white border-[#EAE6DF] hover:border-[#B38F4D]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-[#B38F4D]" />
                      <div>
                        <h4 className="text-xs font-bold text-[#1A1A1A]">
                          Instant UPI / Google Pay / PhonePe / Paytm / QR
                        </h4>
                        <p className="text-[11px] text-[#7A746E]">
                          Fast, zero-fee payment with approval on your mobile phone.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-[#EBF7EE] text-[#1E7E34] px-2 py-0.5 rounded">
                      RECOMMENDED
                    </span>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-[#F5F2EB] space-y-2">
                      <input
                        type="text"
                        value={upiVpa}
                        onChange={(e) => setUpiVpa(e.target.value)}
                        placeholder="Enter UPI ID (e.g. mobile@okaxis, user@okhdfcbank)"
                        className="w-full bg-[#FAF8F5] border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                      />
                      <span className="text-[10px] text-[#8C8275] block">
                        Or approve instantaneous dynamic QR code upon placing order.
                      </span>
                    </div>
                  )}
                </div>

                {/* Credit / Debit Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-white border-[#1A1A1A] shadow-md ring-1 ring-[#1A1A1A]'
                      : 'bg-white border-[#EAE6DF] hover:border-[#B38F4D]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#B38F4D]" />
                    <div>
                      <h4 className="text-xs font-bold text-[#1A1A1A]">Credit or Debit Card</h4>
                      <p className="text-[11px] text-[#7A746E]">
                        Visa, MasterCard, RuPay, and American Express with 3D Secure OTP.
                      </p>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-3 pt-3 border-t border-[#F5F2EB] space-y-2.5">
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number (•••• •••• •••• ••••)"
                        className="w-full bg-[#FAF8F5] border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM / YY"
                          className="bg-[#FAF8F5] border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                        />
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="CVV"
                          className="bg-[#FAF8F5] border border-[#DCD4C7] px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-[#B38F4D]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* COD */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-white border-[#1A1A1A] shadow-md ring-1 ring-[#1A1A1A]'
                      : 'bg-white border-[#EAE6DF] hover:border-[#B38F4D]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#B38F4D]" />
                    <div>
                      <h4 className="text-xs font-bold text-[#1A1A1A]">Cash on Delivery (COD)</h4>
                      <p className="text-[11px] text-[#7A746E]">
                        Pay in cash or via delivery agent UPI QR at your doorstep.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Payable Summary */}
              <div className="p-4 bg-[#FAF6EC] border border-[#E8DCB8] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#8C6B24] uppercase text-[10px] font-bold block">
                    Final Payable Amount
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#1A1A1A]">
                    ₹{finalPayable.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[11px] text-[#7A746E]">Inclusive of all GST & shipping</span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-[#666] hover:underline font-semibold"
                >
                  Back to Delivery
                </button>
                <button
                  disabled={loading}
                  onClick={handlePlaceOrder}
                  className="px-8 py-3.5 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#333] transition-colors flex items-center gap-2 shadow-lg"
                >
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>{loading ? 'Processing Order...' : 'Pay & Confirm Order'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Order Confirmation */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EBF7EE] text-[#1E7E34] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                Thank You for Choosing NEXORA
              </h3>

              <p className="text-xs text-[#6B655D] max-w-md mx-auto leading-relaxed">
                Your order has been placed into our atelier dispatch queue. A confirmation receipt
                and real-time tracking link have been dispatched to your email and SMS.
              </p>

              <div className="bg-white p-5 rounded-2xl border border-[#EAE6DF] max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-[#F5F2EB] pb-2">
                  <span className="text-[#8C8275]">Order ID</span>
                  <span className="font-mono font-bold text-[#1A1A1A]">{confirmedOrder?.orderNumber || confirmedOrder?.id}</span>
                </div>
                <div className="flex justify-between border-b border-[#F5F2EB] pb-2">
                  <span className="text-[#8C8275]">Shipping Destination</span>
                  <span className="font-semibold text-[#1A1A1A]">
                    {selectedAddress?.city}, {selectedAddress?.pinCode}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#F5F2EB] pb-2">
                  <span className="text-[#8C8275]">Amount Paid</span>
                  <span className="font-bold text-[#1A1A1A]">
                    ₹{(confirmedOrder?.total || finalPayable).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[#8C8275]">Expected Dispatch</span>
                  <span className="font-semibold text-[#1E7E34]">Within 24 Hours</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setCurrentView('account');
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#333] transition-colors shadow-md"
                >
                  Track Order & Shipment
                </button>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setCurrentView('shop');
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-white border border-[#DCD4C7] text-[#1A1A1A] text-xs font-semibold rounded-xl hover:bg-[#FAF8F5] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
