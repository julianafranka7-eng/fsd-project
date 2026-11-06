import { useGetAnalyticsSummaryQuery } from '@/entities/order';
import { VendorStatsPanel } from '@/widgets/vendor-stats-panel';

const CURRENT_VENDOR_ID = 'vendor-1';

export function VendorOverviewPage() {
  const { data: summary, isLoading } = useGetAnalyticsSummaryQuery({ vendorId: CURRENT_VENDOR_ID });

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Vendor overview</h1>
      <p className="mt-1 text-sm text-slate-500">Nova Electronics</p>
      <div className="mt-6">
        {isLoading || !summary ? <p className="text-sm text-slate-400">Loading...</p> : <VendorStatsPanel summary={summary} />}
      </div>
    </div>
  );
}
