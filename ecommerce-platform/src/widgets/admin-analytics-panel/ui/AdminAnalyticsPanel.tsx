import { Card } from '@/shared/ui/Card';
import type { AnalyticsSummary } from '@/shared/types';

export function AdminAnalyticsPanel({ summary }: { summary: AnalyticsSummary }) {
  const maxRevenue = Math.max(...summary.revenueByDay.map((d) => d.revenue));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Revenue (last 14 days)</h3>
        <div className="flex h-32 items-end gap-1">
          {summary.revenueByDay.map((d) => (
            <div
              key={d.date}
              title={`${d.date}: $${d.revenue}`}
              className="flex-1 rounded-t bg-indigo-500"
              style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
            />
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Top vendors</h3>
        <ul className="space-y-2 text-sm">
          {summary.topVendors.map((v) => (
            <li key={v.vendorId} className="flex justify-between text-slate-600">
              <span>{v.vendorName}</span>
              <span className="font-medium text-slate-900">${v.revenue.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
