import { useState } from 'react';
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from '@/entities/product';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

const CURRENT_VENDOR_ID = 'vendor-1';

export function VendorProductsPage() {
  const { data: products = [], isLoading } = useGetProductsQuery({ vendorId: CURRENT_VENDOR_ID });
  const [createProduct] = useCreateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleAdd = async () => {
    if (!name || !price) return;
    await createProduct({ vendorId: CURRENT_VENDOR_ID, categoryId: 'cat-1', name, price: Number(price), stock: 10 }).unwrap();
    setName('');
    setPrice('');
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">My products</h1>

      <Card className="mt-4 flex flex-wrap gap-2 p-4">
        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <Button onClick={handleAdd}>Add product</Button>
      </Card>

      <div className="mt-4 space-y-2">
        {isLoading && <p className="text-sm text-slate-400">Loading...</p>}
        {products.map((p) => (
          <Card key={p.id} className="flex items-center justify-between p-3">
            <div>
              <p className="text-sm font-medium text-slate-900">{p.name}</p>
              <p className="text-sm text-slate-500">${p.price.toFixed(2)} · {p.stock} in stock</p>
            </div>
            <Button variant="danger" onClick={() => deleteProduct(p.id)}>Delete</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
