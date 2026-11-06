import { useGetVendorsQuery, useUpdateVendorStatusMutation } from '@/entities/vendor';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

export function AdminVendorsPage() {
  const { data: vendors = [], isLoading } = useGetVendorsQuery();
  const [updateStatus] = useUpdateVendorStatusMutation();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Vendors</h1>
      <div className="mt-4 space-y-2">
        {isLoading && <p className="text-sm text-slate-400">Loading...</p>}
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="flex items-center justify-between p-3">
            <div>
              <p className="text-sm font-medium text-slate-900">{vendor.name}</p>
              <p className="text-sm text-slate-500">
                {vendor.status} · ★ {vendor.rating.toFixed(1)} · ${vendor.totalSales.toLocaleString()} sales
              </p>
            </div>
            <div className="flex gap-2">
              {vendor.status !== 'approved' && (
                <Button onClick={() => updateStatus({ id: vendor.id, status: 'approved' })}>Approve</Button>
              )}
              {vendor.status !== 'suspended' && (
                <Button variant="danger" onClick={() => updateStatus({ id: vendor.id, status: 'suspended' })}>Suspend</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
