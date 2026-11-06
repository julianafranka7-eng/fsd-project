import { StatTile } from '@/shared/ui/StatTile';
import type { AnalyticsSummary } from '@/shared/types';

export function VendorStatsPanel({ summary }: { summary: AnalyticsSummary }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatTile label="Revenue" value={`$${summary.totalRevenue.toLocaleString()}`} />
      <StatTile label="Orders" value={summary.totalOrders.toLocaleString()} />
      <StatTile label="Customers" value={summary.totalCustomers.toLocaleString()} />
      <StatTile label="Vendors" value={summary.totalVendors.toLocaleString()} />
    </div>
  );
}
