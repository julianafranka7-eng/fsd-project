import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '@/entities/order';
import { Card } from '@/shared/ui/Card';
import { useAppSelector } from '@/app/providers/hooks';
import type { OrderStatus } from '@/shared/types';

const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export function VendorOrdersPage() {
  const { user } = useAppSelector((s) => s.session);
  const { data: orders = [], isLoading } = useGetOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();

  const isAdmin = user?.role === 'admin';

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Orders Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdmin
              ? 'Administrator access: You can change the fulfillment and delivery status for any order.'
              : 'Customer/Vendor view: Real-time fulfillment status of placed orders.'}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {isLoading && <p className="text-sm text-slate-400">Loading orders...</p>}
        {orders.length === 0 && !isLoading && (
          <p className="text-sm text-slate-500">No orders found.</p>
        )}
        {orders.map((order) => {
          const statusColors: Record<OrderStatus, string> = {
            pending: 'bg-amber-50 text-amber-700 border-amber-200',
            processing: 'bg-blue-50 text-blue-700 border-blue-200',
            shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
          };

          return (
            <Card key={order.id} className="flex items-center justify-between p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">Order #{order.id}</p>
                  {order.paymentMethod && (
                    <span className="text-[11px] font-medium uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {order.paymentMethod}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  ${order.total.toFixed(2)} · {order.items.length} item(s) · Placed on {order.createdAt}
                </p>
                {order.shippingAddress && (
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    Ship to: {order.shippingAddress}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {isAdmin ? (
                  /* Admin can change status (delivered, shipped, etc.) */
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">Update Status:</span>
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
                ) : (
                  /* Non-admin user gets a read-only badge, CANNOT modify status */
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                      statusColors[order.status] || 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {order.status}
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
