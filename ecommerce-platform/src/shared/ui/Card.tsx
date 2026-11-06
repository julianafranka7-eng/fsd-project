import type { HTMLAttributes } from 'react';
import { clsx } from '@/shared/lib/clsx';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('rounded-xl border border-slate-200 bg-white shadow-sm', className)}
      {...props}
    />
  );
}
