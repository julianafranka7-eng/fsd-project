import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/providers/hooks';
import { useGetProductsQuery } from '@/entities/product';
import { removeItem, setQuantity } from '@/entities/cart';
import { Button } from '@/shared/ui/Button';
import { ROUTES } from '@/shared/config';

export function CartPage() {
  const items = useAppSelector((s) => s.cart.items);
  const { data: products = [] } = useGetProductsQuery();
  const dispatch = useAppDispatch();

  const rows = items
    .map((item) => ({ item, product: products.find((p) => p.id === item.productId) }))
    .filter((r) => r.product);

  const total = rows.reduce((sum, r) => sum + (r.product!.price * r.item.quantity), 0);

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-slate-500">Your cart is empty.</p>
        <Link to={ROUTES.home}><Button className="mt-4">Continue shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">Your cart</h1>
      <div className="mt-6 divide-y divide-slate-200">
        {rows.map(({ item, product }) => (
          <div key={item.productId} className="flex items-center gap-4 py-4">
            <img src={product!.imageUrl} alt={product!.name} className="h-16 w-16 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{product!.name}</p>
              <p className="text-sm text-slate-500">${product!.price.toFixed(2)}</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => dispatch(setQuantity({ productId: item.productId, quantity: Number(e.target.value) }))}
              className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-sm"
            />
            <button onClick={() => dispatch(removeItem({ productId: item.productId }))} className="text-sm text-red-500 hover:underline">
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg font-semibold text-slate-900">Total: ${total.toFixed(2)}</p>
        <Link to={ROUTES.checkout}><Button>Checkout</Button></Link>
      </div>
    </div>
  );
}
