import { Outlet } from 'react-router-dom';
import { SidebarNav } from '@/widgets/sidebar-nav';
import { ROUTES } from '@/shared/config';

const navItems = [
  { label: 'Overview', to: ROUTES.vendor.dashboard },
  { label: 'Products', to: ROUTES.vendor.products },
  { label: 'Orders', to: ROUTES.vendor.orders },
  { label: 'Analytics', to: ROUTES.vendor.analytics },
];

export function VendorLayout() {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-[200px_1fr] gap-8 px-4 py-8">
      <SidebarNav items={navItems} />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
