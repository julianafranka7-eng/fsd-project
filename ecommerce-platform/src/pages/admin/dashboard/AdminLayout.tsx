import { Outlet } from 'react-router-dom';
import { SidebarNav } from '@/widgets/sidebar-nav';
import { ROUTES } from '@/shared/config';

const navItems = [
  { label: 'Overview', to: ROUTES.admin.dashboard },
  { label: 'Orders', to: ROUTES.admin.orders },
  { label: 'Vendors', to: ROUTES.admin.vendors },
  { label: 'Analytics', to: ROUTES.admin.analytics },
  { label: 'Users', to: ROUTES.admin.users },
];

export function AdminLayout() {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-[200px_1fr] gap-8 px-4 py-8">
      <SidebarNav items={navItems} />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
