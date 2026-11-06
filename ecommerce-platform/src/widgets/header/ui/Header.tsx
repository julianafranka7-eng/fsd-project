import { Link, useNavigate } from 'react-router-dom';
import { APP_NAME, ROUTES } from '@/shared/config';
import { useAppSelector, useAppDispatch } from '@/app/providers/hooks';
import { logout } from '@/entities/user';
import { useGetOrdersQuery } from '@/entities/order';

export function Header() {
  const cartCount = useAppSelector((s) => s.cart.items.reduce((sum, i) => sum + i.quantity, 0));
  const { user } = useAppSelector((s) => s.session);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isLoggedInCustomer = !!user && user.role === 'customer';
  const isLoggedInVendor = !!user && user.role === 'vendor';
  const isLoggedInAdmin = !!user && user.role === 'admin';
  const isAnonymousGuest = !user;

  const { data: myOrders = [] } = useGetOrdersQuery(
    { customerId: user?.id },
    { skip: !isLoggedInCustomer }
  );

  const hasPlacedOrders = isLoggedInCustomer && myOrders.length > 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.home);
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand Logo and Name */}
        <Link to={ROUTES.home} className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-extrabold text-xs shadow-xs">
            MV
          </span>
          <span className="text-base font-extrabold text-slate-900">{APP_NAME}</span>
          {isLoggedInAdmin && (
            <span className="ml-1 rounded-md bg-purple-100 px-2 py-0.5 text-[11px] font-bold text-purple-700 tracking-wide">
              ADMIN PORTAL
            </span>
          )}
          {isLoggedInVendor && (
            <span className="ml-1 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800 tracking-wide">
              SELLER HUB
            </span>
          )}
        </Link>

        {/* Dynamic Role-Specific Navigation Menu */}
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
          {/* 1. ANONYMOUS GUEST (NOT LOGGED IN) - ONLY Logo and Auth Buttons */}
          {isAnonymousGuest && (
            <div className="flex items-center gap-3">
              <Link
                to={ROUTES.login}
                className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to={ROUTES.register}
                className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}

          {/* 2. LOGGED-IN CUSTOMER */}
          {isLoggedInCustomer && (
            <>
              <Link to={ROUTES.home} className="hover:text-indigo-600 transition-colors">
                Shop Products
              </Link>
              {hasPlacedOrders && (
                <Link
                  to={ROUTES.myOrders}
                  className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-indigo-600 font-semibold"
                >
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Track Orders ({myOrders.length})
                </Link>
              )}
              <Link to={ROUTES.cart} className="relative hover:text-indigo-600 transition-colors flex items-center">
                Cart
                {cartCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-indigo-600 px-1.5 py-0.5 text-xs font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* 3. LOGGED-IN VENDOR ONLY */}
          {isLoggedInVendor && (
            <>
              <Link to={ROUTES.vendor.dashboard} className="hover:text-indigo-600 transition-colors">
                Overview
              </Link>
              <Link to={ROUTES.vendor.products} className="hover:text-indigo-600 transition-colors">
                My Products
              </Link>
              <Link to={ROUTES.vendor.orders} className="hover:text-indigo-600 transition-colors">
                Vendor Orders
              </Link>
              <Link to={ROUTES.vendor.analytics} className="hover:text-indigo-600 transition-colors">
                Sales Analytics
              </Link>
            </>
          )}

          {/* 4. LOGGED-IN ADMIN ONLY */}
          {isLoggedInAdmin && (
            <>
              <Link to={ROUTES.admin.dashboard} className="hover:text-indigo-600 transition-colors">
                Dashboard
              </Link>
              <Link to={ROUTES.admin.orders} className="hover:text-indigo-600 transition-colors">
                Order Fulfillment
              </Link>
              <Link to={ROUTES.admin.vendors} className="hover:text-indigo-600 transition-colors">
                Vendor Approvals
              </Link>
              <Link to={ROUTES.admin.analytics} className="hover:text-indigo-600 transition-colors">
                Platform Analytics
              </Link>
              <Link to={ROUTES.admin.users} className="hover:text-indigo-600 transition-colors">
                Users
              </Link>
            </>
          )}

          {user && <div className="h-4 w-px bg-slate-200 mx-1" />}

          {/* User Profile Badge & Logout */}
          {user && (
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border flex items-center gap-1.5 ${
                isLoggedInAdmin
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : isLoggedInVendor
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-100'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isLoggedInAdmin ? 'bg-purple-600' : isLoggedInVendor ? 'bg-amber-600' : 'bg-emerald-500'
                }`} />
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-slate-500 hover:text-red-600 transition-colors cursor-pointer font-medium"
              >
                Sign out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
