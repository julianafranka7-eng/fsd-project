import { useGetAnalyticsSummaryQuery } from '@/entities/order';
import { AdminAnalyticsPanel } from '@/widgets/admin-analytics-panel';

const CURRENT_VENDOR_ID = 'vendor-1';

export function VendorAnalyticsPage() {
  const { data: summary, isLoading } = useGetAnalyticsSummaryQuery({ vendorId: CURRENT_VENDOR_ID });

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Analytics</h1>
      <div className="mt-4">
        {isLoading || !summary ? <p className="text-sm text-slate-400">Loading...</p> : <AdminAnalyticsPanel summary={summary} />}
      </div>
    </div>
  );
}
