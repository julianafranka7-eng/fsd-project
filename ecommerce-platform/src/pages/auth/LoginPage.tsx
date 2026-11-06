import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLoginMutation, setCredentials } from '@/entities/user';
import { useAppDispatch } from '@/app/providers/hooks';
import { ROUTES } from '@/shared/config';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.home;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await login({ email, password }).unwrap();
      if (res.token && res.user) {
        dispatch(setCredentials({ token: res.token, user: res.user }));
        // Role based redirection if they didn't come from a specific page
        if (from === ROUTES.home) {
          if (res.user.role === 'admin') {
            navigate(ROUTES.admin.dashboard);
            return;
          }
          if (res.user.role === 'vendor') {
            navigate(ROUTES.vendor.dashboard);
            return;
          }
        }
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Failed to sign in. Please check your credentials.');
    }
  };

  const handleQuickLogin = async (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('Secret123!');
    try {
      const res = await login({ email: roleEmail, password: 'Secret123!' }).unwrap();
      if (res.token && res.user) {
        dispatch(setCredentials({ token: res.token, user: res.user }));
        if (res.user.role === 'admin') {
          navigate(ROUTES.admin.dashboard);
        } else if (res.user.role === 'vendor') {
          navigate(ROUTES.vendor.dashboard);
        } else {
          navigate(ROUTES.home);
        }
      }
    } catch (err: any) {
      setErrorMsg('Failed to sign in.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-slate-600">
            Or{' '}
            <Link to={ROUTES.register} className="font-semibold text-indigo-600 hover:text-indigo-500">
              create a new account
            </Link>
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-center mb-3">
            Quick demo logins
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('awsjoseph1977@outlook.com')}
              className="rounded border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('ava@novaelectronics.com')}
              className="rounded border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Vendor
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@marketplace.dev')}
              className="rounded border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
