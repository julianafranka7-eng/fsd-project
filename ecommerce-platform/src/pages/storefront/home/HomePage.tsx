import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '@/entities/product';
import { useGetCategoriesQuery } from '@/entities/category';
import { ProductGrid } from '@/widgets/product-grid';
import { clsx } from '@/shared/lib/clsx';
import { useAppSelector } from '@/app/providers/hooks';
import { APP_NAME, ROUTES } from '@/shared/config';

export function HomePage() {
  const { user } = useAppSelector((s) => s.session);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: products = [], isLoading } = useGetProductsQuery(categoryId ? { categoryId } : undefined);

  // If user is not logged in, DO NOT show the product listing or vendor products.
  // Show clean landing with app logo, title, and sign in invitation.
  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-600 text-white font-extrabold text-3xl shadow-xl shadow-indigo-200 mb-6">
          MV
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {APP_NAME}
        </h1>
        <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
          A unified, multi-vendor marketplace platform. Please sign in or register to browse vendor catalogues, manage your store, or view analytics.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to={ROUTES.login}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition"
          >
            Sign in to Your Account
          </Link>
          <Link
            to={ROUTES.register}
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Create an Account
          </Link>
        </div>
      </div>
    );
  }

  // LOGGED-IN VIEW: Show full catalog & shopping experience
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">Shop all vendors</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setCategoryId(undefined)}
          className={clsx(
            'rounded-full px-3 py-1 text-sm font-medium transition-colors',
            !categoryId ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
          )}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryId(c.id)}
            className={clsx(
              'rounded-full px-3 py-1 text-sm font-medium transition-colors',
              categoryId === c.id ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {isLoading ? <p className="text-sm text-slate-400">Loading products...</p> : <ProductGrid products={products} />}
      </div>
    </div>
  );
}
