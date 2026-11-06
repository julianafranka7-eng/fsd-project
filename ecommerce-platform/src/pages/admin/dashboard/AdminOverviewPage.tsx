import { useGetAnalyticsSummaryQuery } from '@/entities/order';
import { VendorStatsPanel } from '@/widgets/vendor-stats-panel';
import { AdminAnalyticsPanel } from '@/widgets/admin-analytics-panel';

export function AdminOverviewPage() {
  const { data: summary, isLoading } = useGetAnalyticsSummaryQuery();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Platform overview</h1>
      <div className="mt-6 space-y-6">
        {isLoading || !summary ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : (
          <>
            <VendorStatsPanel summary={summary} />
            <AdminAnalyticsPanel summary={summary} />
          </>
        )}
      </div>
    </div>
  );
}
