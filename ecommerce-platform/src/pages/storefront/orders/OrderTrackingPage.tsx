import { Link, useNavigate } from 'react-router-dom';
import { useGetOrdersQuery } from '@/entities/order';
import { useAppSelector } from '@/app/providers/hooks';
import { Card } from '@/shared/ui/Card';
import { ROUTES } from '@/shared/config';
import type { OrderStatus } from '@/shared/types';

export function OrderTrackingPage() {
  const { user } = useAppSelector((s) => s.session);
  const navigate = useNavigate();

  // Fetch orders specifically for this customer
  const customerId = user?.id || 'user-1';
  const { data: orders = [], isLoading } = useGetOrdersQuery({ customerId });

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const steps = [
    { title: 'Order Placed', desc: 'Received & confirmed with seller' },
    { title: 'Processing', desc: 'Items packed & quality checked' },
    { title: 'Shipped', desc: 'In transit with courier partner' },
    { title: 'Delivered', desc: 'Package arrived at destination' },
  ];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-slate-500">
        Loading your orders and live tracking...
      </div>
    );
  }

  // If user has not placed any orders yet
  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl mb-4">
          📦
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Orders Placed Yet</h2>
        <p className="mt-2 text-sm text-slate-500">
          Tracking is available after you complete a purchase. Place an order to track shipments live!
        </p>
        <button
          onClick={() => navigate(ROUTES.home)}
          className="mt-6 inline-flex rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Track Your Orders</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time fulfillment timeline and delivery updates for your purchases.
          </p>
        </div>
        <Link
          to={ROUTES.home}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
        >
          ← Continue Shopping
        </Link>
      </div>

      <div className="space-y-8">
        {orders.map((order) => {
          const currentStep = getStepIndex(order.status);
          const isCancelled = order.status === 'cancelled';

          return (
            <Card key={order.id} className="overflow-hidden p-6 border-slate-200 shadow-sm">
              {/* Order Header Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 text-base">Order #{order.id}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'shipped'
                          ? 'bg-indigo-100 text-indigo-800'
                          : order.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Placed on: <span className="font-medium text-slate-600">{order.createdAt}</span>
                    {order.transactionId && (
                      <span className="ml-3 font-mono text-slate-500">Txn: {order.transactionId}</span>
                    )}
                  </p>
                </div>

                <div className="text-right sm:self-center">
                  <span className="text-xs text-slate-400 block">Total Paid:</span>
                  <span className="text-lg font-bold text-slate-900">${order.total.toFixed(2)}</span>
                  {order.paymentMethod && (
                    <span className="block text-[11px] font-semibold uppercase text-indigo-600">
                      via {order.paymentMethod}
                    </span>
                  )}
                </div>
              </div>

              {/* LIVE STEPPER TRACKING PROGRESS BAR */}
              <div className="py-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
                  Shipment Tracking Status
                </h4>

                {isCancelled ? (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700 flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <p className="font-semibold">This order has been cancelled.</p>
                      <p className="text-xs text-rose-600 mt-0.5">
                        If payment was deducted, refund is processed to your original payment mode within 3-5 business days.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Stepper Line */}
                    <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{
                          width: `${Math.max(0, ((currentStep - 1) / (steps.length - 1)) * 100)}%`,
                        }}
                      />
                    </div>

                    {/* Stepper Nodes */}
                    <div className="relative z-10 grid grid-cols-4 text-center">
                      {steps.map((st, idx) => {
                        const stepNum = idx + 1;
                        const isDone = currentStep >= stepNum;
                        const isCurrent = currentStep === stepNum;

                        return (
                          <div key={st.title} className="flex flex-col items-center">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold shadow-xs transition-colors ${
                                isDone
                                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                                  : 'bg-white text-slate-400 border-2 border-slate-300'
                              }`}
                            >
                              {isDone ? '✓' : stepNum}
                            </div>
                            <span
                              className={`mt-2 text-xs font-semibold ${
                                isCurrent
                                  ? 'text-emerald-700'
                                  : isDone
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {st.title}
                            </span>
                            <span className="hidden sm:block mt-0.5 text-[11px] text-slate-400 max-w-[130px]">
                              {st.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Items in this Order */}
              <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Purchased Items ({order.items.length})
                </p>
                <div className="divide-y divide-slate-200/60">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium text-slate-800">{item.productName}</p>
                        <p className="text-xs text-slate-400">Qty: {item.quantity} · Vendor: {item.vendorId}</p>
                      </div>
                      <span className="font-semibold text-slate-700">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {order.shippingAddress && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Delivery Address: </span>
                    {order.shippingAddress}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
