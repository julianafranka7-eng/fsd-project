import { useGetAnalyticsSummaryQuery } from '@/entities/order';
import { AdminAnalyticsPanel } from '@/widgets/admin-analytics-panel';
import { Card } from '@/shared/ui/Card';

export function AdminAnalyticsPage() {
  const { data: summary, isLoading } = useGetAnalyticsSummaryQuery();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Platform analytics</h1>
      <div className="mt-4 space-y-6">
        {isLoading || !summary ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : (
          <>
            <AdminAnalyticsPanel summary={summary} />
            <Card className="p-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-700">Top products</h3>
              <ul className="space-y-2 text-sm">
                {summary.topProducts.map((p) => (
                  <li key={p.productId} className="flex justify-between text-slate-600">
                    <span>{p.productName}</span>
                    <span className="font-medium text-slate-900">{p.unitsSold} sold</span>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
