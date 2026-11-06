import { Link } from 'react-router-dom';
import { Card } from '@/shared/ui/Card';
import { ROUTES } from '@/shared/config';
import type { Product } from '@/shared/types';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden">
      <Link to={ROUTES.product(product.id)}>
        <img src={product.imageUrl} alt={product.name} className="h-40 w-full object-cover" />
        <div className="p-3">
          <p className="truncate text-sm font-medium text-slate-900">{product.name}</p>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm font-semibold text-indigo-600">${product.price.toFixed(2)}</span>
            <span className="text-xs text-slate-400">★ {product.rating.toFixed(1)}</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
