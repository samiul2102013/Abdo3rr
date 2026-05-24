"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { Users, ShoppingCart, DollarSign, Package } from "lucide-react";
import { TopInventory } from "@/components/dashboard/top-inventory";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { OrderDetailsModal } from "@/components/dashboard/modals/OrderDetailsModal";
import { dashboardService } from "@/services/dashboard-service";
import { DashboardStats, TopInventoryItem, RecentOrder, SalesDataPoint } from "@/types/dashboard";

// ── Stat Card ─────────────────────────────────────────────────────────────────
const STAT_CONFIG = [
  {
    key: "total_customers" as const,
    label: "Total Customers",
    icon: Users,
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: "today_orders" as const,
    label: "Today's Orders",
    icon: ShoppingCart,
    bg: "bg-orange-50",
    iconColor: "text-orange-500",
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: "total_revenue" as const,
    label: "Total Revenue",
    icon: DollarSign,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    format: (v: number) => `﷼${v.toLocaleString()}`,
  },
  {
    key: "total_orders" as const,
    label: "Total Orders",
    icon: Package,
    bg: "bg-purple-50",
    iconColor: "text-purple-500",
    format: (v: number) => v.toLocaleString(),
  },
];

function StatCard({ label, value, icon: Icon, bg, iconColor, loading }: {
  label: string; value: string; icon: React.ElementType;
  bg: string; iconColor: string; loading: boolean;
}) {
  return (
    <Card className="rounded-2xl border-0 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`h-11 w-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
        {loading ? (
          <div className="space-y-2">
            <div className="h-7 w-24 bg-slate-100 rounded animate-pulse" />
            <div className="h-3 w-28 bg-slate-100 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">{label}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ── Sales Performance ─────────────────────────────────────────────────────────
function SalesPerformance({ data, loading }: { data: SalesDataPoint[]; loading: boolean }) {
  // Fallback empty chart shape when API returns []
  const chartData = data.length > 0
    ? data
    : [{ label: "", revenue: 0 }];

  return (
    <Card className="rounded-2xl border-0 bg-white shadow-sm">
      <CardHeader className="px-6 pt-5 pb-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Sales Performance</h3>
            <p className="text-xs text-slate-400 mt-0.5">Revenue over time</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-5 pt-4">
        {loading ? (
          <div className="h-48 md:h-56 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-[#D13D3D] border-t-transparent" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-48 md:h-56 flex items-center justify-center">
            <p className="text-sm text-slate-400">No sales data available yet.</p>
          </div>
        ) : (
          <div className="h-48 md:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    fontSize: "12px",
                    padding: "8px 12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#D13D3D"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: "#D13D3D", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats,        setStats]        = useState<DashboardStats | null>(null);
  const [sales,        setSales]        = useState<SalesDataPoint[]>([]);
  const [topInventory, setTopInventory] = useState<TopInventoryItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  const [statsLoading,     setStatsLoading]     = useState(true);
  const [salesLoading,     setSalesLoading]     = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [ordersLoading,    setOrdersLoading]    = useState(true);

  const [viewOrderId, setViewOrderId] = useState<number | null>(null);

  const fetchAll = useCallback(async () => {
    // Fetch all 4 in parallel, each with its own loading state
    dashboardService.getStats()
      .then((res) => { if (res.success && res.data) setStats(res.data); })
      .catch(() => {})
      .finally(() => setStatsLoading(false));

    dashboardService.getSales()
      .then((res) => { if (res.success && Array.isArray(res.data)) setSales(res.data); })
      .catch(() => {})
      .finally(() => setSalesLoading(false));

    dashboardService.getTopInventory()
      .then((res) => { if (res.success && Array.isArray(res.data)) setTopInventory(res.data); })
      .catch(() => {})
      .finally(() => setInventoryLoading(false));

    dashboardService.getRecentOrders()
      .then((res) => { if (res.success && Array.isArray(res.data)) setRecentOrders(res.data); })
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {STAT_CONFIG.map(({ key, label, icon, bg, iconColor, format }) => (
          <StatCard
            key={key}
            label={label}
            value={stats ? format(stats[key]) : "—"}
            icon={icon}
            bg={bg}
            iconColor={iconColor}
            loading={statsLoading}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SalesPerformance data={sales} loading={salesLoading} />
        <TopInventory items={topInventory} loading={inventoryLoading} />
      </div>

      {/* Recent Orders */}
      <RecentOrders
        orders={recentOrders}
        loading={ordersLoading}
        onView={(id) => setViewOrderId(id)}
      />

      <OrderDetailsModal
        open={!!viewOrderId}
        onOpenChange={(v) => !v && setViewOrderId(null)}
        orderId={viewOrderId}
      />
    </div>
  );
}
