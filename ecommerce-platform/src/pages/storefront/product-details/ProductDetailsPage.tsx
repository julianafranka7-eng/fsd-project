import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '@/entities/product';
import { useGetVendorByIdQuery } from '@/entities/vendor';
import { useAppDispatch } from '@/app/providers/hooks';
import { addItem } from '@/entities/cart';
import { Button } from '@/shared/ui/Button';

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useGetProductByIdQuery(id ?? '', { skip: !id });
  const { data: vendor } = useGetVendorByIdQuery(product?.vendorId ?? '', { skip: !product });
  const dispatch = useAppDispatch();

  if (isLoading) return <p className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-400">Loading...</p>;
  if (!product) return <p className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-400">Product not found.</p>;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-2">
      <img src={product.imageUrl} alt={product.name} className="w-full rounded-xl object-cover" />
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{product.name}</h1>
        {vendor && <p className="mt-1 text-sm text-slate-500">Sold by {vendor.name}</p>}
        <p className="mt-4 text-3xl font-bold text-indigo-600">${product.price.toFixed(2)}</p>
        <p className="mt-4 text-slate-600">{product.description}</p>
        <p className="mt-2 text-sm text-slate-400">{product.stock} in stock · ★ {product.rating.toFixed(1)} ({product.reviewCount} reviews)</p>
        <Button className="mt-6" onClick={() => dispatch(addItem({ productId: product.id }))}>
          Add to cart
        </Button>
      </div>
    </div>
  );
}
