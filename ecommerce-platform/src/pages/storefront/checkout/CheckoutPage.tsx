import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/providers/hooks';
import { useGetProductsQuery } from '@/entities/product';
import { useCreateOrderMutation } from '@/entities/order';
import { clearCart } from '@/entities/cart';
import { ROUTES } from '@/shared/config';
import type { PaymentMethod } from '@/shared/types';

export function CheckoutPage() {
  const items = useAppSelector((s) => s.cart.items);
  const { user } = useAppSelector((s) => s.session);
  const { data: products = [] } = useGetProductsQuery();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Checkout form state
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [shippingAddress, setShippingAddress] = useState(
    '12, Anna Salai, Easwari Enclave, Chennai - 600089'
  );
  const [phone, setPhone] = useState('+91 98765 43210');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');

  // Dummy payment details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardName, setCardName] = useState(user?.name || 'Juliana Franka');
  const [upiId, setUpiId] = useState('juliana@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrderDetails, setCreatedOrderDetails] = useState<{
    id: string;
    total: number;
    transactionId: string;
    paymentMethod: PaymentMethod;
  } | null>(null);

  const orderItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return {
        productId: product.id,
        productName: product.name,
        vendorId: product.vendorId,
        quantity: item.quantity,
        price: product.price,
      };
    })
    .filter(Boolean) as {
    productId: string;
    productName: string;
    vendorId: string;
    quantity: number;
    price: number;
  }[];

  const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.trim()) return;
    setStep('payment');
  };

  const handlePayAndPlaceOrder = async () => {
    setIsProcessing(true);
    const txnId = `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // Simulate real-world payment gateway latency (1.2s)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const res = await createOrder({
        customerId: user?.id || 'user-1',
        items: orderItems,
        total,
        paymentMethod: selectedMethod,
        paymentStatus: selectedMethod === 'cod' ? 'pending' : 'completed',
        transactionId: txnId,
        shippingAddress: `${shippingAddress} (Phone: ${phone})`,
      }).unwrap();

      dispatch(clearCart());
      setCreatedOrderDetails({
        id: res.id || `ORD-${Date.now()}`,
        total,
        transactionId: txnId,
        paymentMethod: selectedMethod,
      });
      setStep('success');
    } catch (err) {
      console.error('Failed to create order', err);
      alert('Order placement failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
          🛒
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="mt-2 text-sm text-slate-500">Add products to your cart before proceeding to checkout.</p>
        <Link
          to={ROUTES.home}
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700"
        >
          Explore Storefront
        </Link>
      </div>
    );
  }

  // Step 3: Success Screen
  if (step === 'success' && createdOrderDetails) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-2xl font-bold">
            ✓
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900">Payment Successful!</h2>
          <p className="mt-1 text-sm text-slate-600">Your order has been confirmed and placed with the vendors.</p>

          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left border border-slate-200/60 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Order Reference:</span>
              <span className="font-mono font-medium text-slate-900">{createdOrderDetails.id}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Transaction ID:</span>
              <span className="font-mono font-medium text-slate-900">{createdOrderDetails.transactionId}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Payment Mode:</span>
              <span className="font-semibold uppercase text-indigo-700">{createdOrderDetails.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-slate-600 border-t border-slate-200 pt-2 font-bold text-slate-900">
              <span>Amount Paid:</span>
              <span className="text-emerald-600">${createdOrderDetails.total.toFixed(2)}</span>
            </div>
          </div>

            <button
              onClick={() => navigate(ROUTES.myOrders)}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
            >
              Track Your Order Live →
            </button>
            <button
              onClick={() => navigate(ROUTES.home)}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Back to Store
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Checkout Progress Stepper */}
      <div className="mb-8 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-indigo-600 font-semibold text-sm">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs text-white ${step === 'details' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
              {step === 'payment' ? '✓' : '1'}
            </span>
            <span className="ml-2">Shipping Details</span>
          </div>
          <div className={`h-0.5 w-12 ${step === 'payment' ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          <div className={`flex items-center text-sm font-semibold ${step === 'payment' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${step === 'payment' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              2
            </span>
            <span className="ml-2">Payment Method</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-7">
          {step === 'details' ? (
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Delivery & Contact Information</h2>
              <form onSubmit={handleProceedToPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Recipient Name</label>
                  <input
                    type="text"
                    required
                    defaultValue={user?.name || 'Juliana Franka'}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Shipping Address</label>
                  <textarea
                    rows={3}
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
                >
                  Continue to Payment →
                </button>
              </form>
            </div>
          ) : (
            /* Step 2: Payment Method Selection */
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Choose Payment Method</h2>
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs text-indigo-600 hover:underline font-medium"
                >
                  ← Edit Address
                </button>
              </div>

              {/* Payment Tabs / Radio Options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { id: 'card' as PaymentMethod, label: 'Credit/Debit Card', icon: '💳' },
                  { id: 'upi' as PaymentMethod, label: 'UPI / QR', icon: '📱' },
                  { id: 'netbanking' as PaymentMethod, label: 'Net Banking', icon: '🏦' },
                  { id: 'cod' as PaymentMethod, label: 'Cash on Delivery', icon: '💵' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                      selectedMethod === m.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20 font-semibold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl mb-1">{m.icon}</span>
                    <span className="text-xs leading-tight">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Payment Details Section */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 mb-6">
                {selectedMethod === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'upi' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase text-slate-600">Enter UPI VPA / ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Popular apps supported:</span>
                      <span className="font-semibold text-slate-700">GPay, PhonePe, Paytm, BHIM</span>
                    </div>
                  </div>
                )}

                {selectedMethod === 'netbanking' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase text-slate-600">Select Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    >
                      <option>HDFC Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                    <p className="text-xs text-slate-500">You will be securely redirected to complete authorization.</p>
                  </div>
                )}

                {selectedMethod === 'cod' && (
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="text-2xl">📦</span>
                    <div>
                      <p className="font-semibold text-slate-800">Cash on Delivery</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Pay with cash or digital UPI upon receiving the delivery package at your doorstep.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Secure Checkout Assurance */}
              <div className="mb-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                <span>🔒 256-bit SSL encrypted checkout</span>
                <span>•</span>
                <span>PCI-DSS Compliant</span>
              </div>

              <button
                type="button"
                onClick={handlePayAndPlaceOrder}
                disabled={isProcessing || isLoading}
                className="w-full rounded-lg bg-emerald-600 py-3.5 text-base font-bold text-white shadow-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Authorizing Payment...</span>
                  </>
                ) : (
                  <span>
                    Pay ${total.toFixed(2)} & Complete Order
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary ({orderItems.length} {orderItems.length === 1 ? 'item' : 'items'})
            </h3>

            <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
              {orderItems.map((i) => (
                <div key={i.productId} className="flex justify-between items-center text-sm">
                  <div className="pr-4">
                    <p className="font-medium text-slate-800 line-clamp-1">{i.productName}</p>
                    <p className="text-xs text-slate-400">Qty: {i.quantity}</p>
                  </div>
                  <span className="font-semibold text-slate-700 whitespace-nowrap">
                    ${(i.price * i.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-emerald-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (GST/VAT)</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900">
                <span>Total Due</span>
                <span className="text-indigo-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
