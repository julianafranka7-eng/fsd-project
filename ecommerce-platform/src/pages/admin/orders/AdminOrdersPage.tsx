import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '@/entities/order';
import { Card } from '@/shared/ui/Card';
import type { OrderStatus } from '@/shared/types';

const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useGetOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Platform Orders & Fulfillment</h1>
          <p className="text-xs text-slate-500 mt-1">
            Admin Governance: Monitor platform purchases and update fulfillment status (e.g. mark as delivered).
          </p>
        </div>
        <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
          Total: {orders.length}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {isLoading && <p className="text-sm text-slate-400">Loading orders...</p>}
        {orders.length === 0 && !isLoading && (
          <p className="text-sm text-slate-500">No orders recorded yet.</p>
        )}
        {orders.map((order) => (
          <Card key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-slate-900">Order #{order.id}</span>
                {order.paymentMethod && (
                  <span className="text-[11px] font-medium uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {order.paymentMethod}
                  </span>
                )}
                {order.transactionId && (
                  <span className="text-[10px] font-mono text-slate-400">
                    Txn: {order.transactionId}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                ${order.total.toFixed(2)} · {order.items.length} item(s) · {order.createdAt}
              </p>
              {order.shippingAddress && (
                <p className="text-xs text-slate-400 mt-0.5">
                  📍 {order.shippingAddress}
                </p>
              )}
            </div>

            {/* Admin Delivery Status Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-xs font-medium text-slate-500">Status:</span>
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus({ id: order.id, status: e.target.value as OrderStatus })
                }
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
