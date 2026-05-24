import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Package } from "lucide-react";
import { TopInventoryItem } from "@/types/dashboard";

interface Props {
  items: TopInventoryItem[];
  loading?: boolean;
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-100 animate-pulse shrink-0" />
        <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
      </div>
      <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
    </div>
  );
}

export function TopInventory({ items, loading = false }: Props) {
  return (
    <Card className="rounded-2xl border-0 bg-white shadow-sm">
      <CardHeader className="px-6 pt-5 pb-0">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Top Inventory</h3>
          <p className="text-xs text-slate-400 mt-0.5">Most stocked items</p>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-5 pt-4 space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No inventory data available.</p>
        ) : (
          items.map((item) => (
            <div key={item.product_id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                  {item.product_image ? (
                    <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="h-4 w-4 text-slate-300" />
                  )}
                </div>
                <span className="text-sm text-slate-700 font-medium truncate max-w-[140px]">{item.product_name}</span>
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 shrink-0">
                {item.stock} Left
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
