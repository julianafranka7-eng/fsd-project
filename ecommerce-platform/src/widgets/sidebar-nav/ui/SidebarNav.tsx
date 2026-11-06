import { NavLink } from 'react-router-dom';
import { clsx } from '@/shared/lib/clsx';

interface SidebarNavProps {
  items: { label: string; to: string }[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={({ isActive }) =>
            clsx(
              'rounded-lg px-3 py-2 text-sm font-medium',
              isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
