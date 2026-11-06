import { APP_NAME } from '@/shared/config';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-400">
      © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
    </footer>
  );
}
