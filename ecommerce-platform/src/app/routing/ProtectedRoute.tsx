import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/providers/hooks';
import type { Role } from '@/shared/types';
import { ROUTES } from '@/shared/config';

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user } = useAppSelector((s) => s.session);
  const location = useLocation();

  if (!user) {
    // If user is not logged in, redirect to login
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // If user's role is not allowed, redirect them to their appropriate dashboard or home
    if (user.role === 'admin') {
      return <Navigate to={ROUTES.admin.dashboard} replace />;
    }
    if (user.role === 'vendor') {
      return <Navigate to={ROUTES.vendor.dashboard} replace />;
    }
    return <Navigate to={ROUTES.home} replace />;
  }

  return <Outlet />;
}
