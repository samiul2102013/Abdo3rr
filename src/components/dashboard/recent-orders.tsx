"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, ChevronDown } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RecentOrder } from "@/types/dashboard";
import { OrderStatus } from "@/types/order";
import Link from "next/link";

interface Props {
  orders: RecentOrder[];
  loading?: boolean;
  onView: (id: number) => void;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  order_confirmed: "Accepted",
  processing:      "Processing",
  in_transit:      "In Transit",
  delivered:       "Delivered",
  cancelled:       "Cancelled",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  order_confirmed: "bg-blue-50 text-blue-600",
  processing:      "bg-orange-50 text-orange-500",
  in_transit:      "bg-purple-50 text-purple-600",
  delivered:       "bg-emerald-50 text-emerald-600",
  cancelled:       "bg-red-50 text-red-500",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[status] ?? "bg-slate-100 text-slate-400"}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <td key={n} className="py-3.5 pr-4">
          <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: n === 1 ? 80 : n === 2 ? 100 : 60 }} />
        </td>
      ))}
    </tr>
  );
}

export function RecentOrders({ orders, loading = false, onView }: Props) {
  return (
    <Card className="rounded-2xl border-0 bg-white shadow-sm">
      <CardHeader className="px-6 pt-5 pb-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Recent Orders</h3>
            <p className="text-xs text-slate-400 mt-0.5">Latest transactions</p>
          </div>
          <Link href="/orders" className="text-xs font-medium text-[#D13D3D] hover:underline transition-colors">
            See all orders →
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-5 pt-4">
        {/* Mobile */}
        <div className="md:hidden space-y-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="space-y-1.5">
                    <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-28 bg-slate-100 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
                </div>
              ))
            : orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div>
                    <p className="text-xs font-semibold text-slate-700 font-mono">{order.order_number}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{order.customer_name || "Guest"}</p>
                    <p className="text-xs text-slate-400 mt-0.5 capitalize">{order.payment_method}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-xs font-bold text-slate-700">﷼{order.total}</span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))
          }
        </div>

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["Order #", "Customer", "Total", "Payment", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3 pr-4 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                : orders.length === 0
                ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">No recent orders.</td>
                  </tr>
                )
                : orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 pr-4 text-xs text-slate-400 font-mono">{order.order_number}</td>
                    <td className="py-3.5 pr-4 text-sm font-medium text-slate-700">
                      {order.customer_name || <span className="text-slate-400 italic">Guest</span>}
                    </td>
                    <td className="py-3.5 pr-4 text-sm text-slate-600">﷼{order.total}</td>
                    <td className="py-3.5 pr-4 text-sm text-slate-500 capitalize">{order.payment_method}</td>
                    <td className="py-3.5 pr-4"><StatusBadge status={order.status} /></td>
                    <td className="py-3.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center gap-1.5 h-7 px-3 text-xs font-medium rounded-lg bg-[#D13D3D] text-white hover:bg-[#b93333] transition-colors focus:outline-none cursor-pointer">
                          Action <ChevronDown className="h-3 w-3" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem className="gap-2 cursor-pointer text-sm" onClick={() => onView(order.id)}>
                            <Eye className="w-3.5 h-3.5" /> View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
