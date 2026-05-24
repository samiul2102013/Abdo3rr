"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, ChevronDown, Eye, Pencil, Loader2 } from "lucide-react";
import { OrderDetailsModal } from "@/components/dashboard/modals/OrderDetailsModal";
import { orderService } from "@/services/order-service";
import { OrderListItem, OrderStatus, UpdateOrderStatusPayload } from "@/types/order";

// ── Toast ─────────────────────────────────────────────────────────────────────
function ToastNotification({ message, type, open, onClose }: {
  message: string; type: "success" | "error"; open: boolean; onClose: () => void;
}) {
  useEffect(() => {
    if (open) { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-lg border transition-all duration-300 animate-in fade-in slide-in-from-top-5 ${
      type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-red-50 border-red-100 text-red-800"
    }`}>
      {type === "success"
        ? <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">✓</span>
        : <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">!</span>
      }
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75 transition-opacity text-xs font-bold p-1 cursor-pointer">✕</button>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((n) => (
        <TableRow key={n} className="border-slate-50">
          <TableCell className="pl-5 py-4"><div className="h-4 w-24 bg-slate-100 rounded animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-4 w-28 bg-slate-100 rounded animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-4 w-20 bg-slate-100 rounded animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

// ── Status helpers ────────────────────────────────────────────────────────────
const STATUS_LABELS: Record<OrderStatus, string> = {
  order_confirmed: "Accepted",
  processing:      "Processing",
  in_transit:      "In Transit",
  delivered:       "Delivered",
  cancelled:       "Cancelled",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  order_confirmed: "bg-blue-50 text-blue-600 border border-blue-100",
  processing:      "bg-orange-50 text-orange-500 border border-orange-100",
  in_transit:      "bg-purple-50 text-purple-600 border border-purple-100",
  delivered:       "bg-emerald-50 text-emerald-600 border border-emerald-100",
  cancelled:       "bg-red-50 text-red-500 border border-red-100",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[status] ?? "bg-slate-100 text-slate-400"}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Update Status Modal ───────────────────────────────────────────────────────
function UpdateStatusModal({ open, onOpenChange, order, onSave, saving }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  order: OrderListItem | null;
  onSave: (id: number, payload: UpdateOrderStatusPayload) => void;
  saving: boolean;
}) {
  const [status, setStatus] = useState<OrderStatus>("order_confirmed");

  useEffect(() => { if (order) setStatus(order.status); }, [order]);

  const handleSave = () => {
    if (!order || saving) return;
    onSave(order.id, { status });
  };

  if (!order) return null;
  return (
    <Dialog open={open} onOpenChange={(v) => !saving && onOpenChange(v)}>
      <DialogContent className="sm:max-w-sm rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-5">
          <DialogTitle className="text-xl font-bold text-slate-800">Update Order Status</DialogTitle>
          <p className="text-sm text-slate-400">Order {order.order_number}</p>
        </DialogHeader>
        <div className="space-y-1.5 mb-6">
          <Label className="text-sm text-slate-600">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)} disabled={saving}>
            <SelectTrigger className="h-11 border-slate-200"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="order_confirmed">Accepted</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 border-slate-200" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button className="flex-1 bg-[#D13D3D] hover:bg-[#b93333] text-white" onClick={handleSave} disabled={saving}>
            {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</>) : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [items, setItems]     = useState<OrderListItem[]>([]);
  const [total, setTotal]     = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [viewId,       setViewId]       = useState<number | null>(null);
  const [editOrder,    setEditOrder]    = useState<OrderListItem | null>(null);
  const [editSaving,   setEditSaving]   = useState(false);

  const [toast, setToast] = useState<{ open: boolean; message: string; type: "success" | "error" }>({
    open: false, message: "", type: "success",
  });
  const showToast  = useCallback((message: string, type: "success" | "error") => setToast({ open: true, message, type }), []);
  const closeToast = useCallback(() => setToast((p) => ({ ...p, open: false })), []);

  const fetchOrders = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await orderService.getOrders(pageNum);
      if (res.success && res.data) {
        setItems(res.data.results);
        setTotal(res.data.total);
        setTotalPages(res.data.total_pages);
      } else {
        showToast(res.message || "Failed to load orders.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while loading orders.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchOrders(page); }, [fetchOrders, page]);

  const filtered = useMemo(
    () => items.filter((o) =>
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase())
    ),
    [items, search]
  );

  const paginated = filtered;

  const handleUpdateStatus = async (id: number, payload: UpdateOrderStatusPayload) => {
    try {
      setEditSaving(true);
      const res = await orderService.updateOrderStatus(id, payload);
      if (res.success && res.data) {
        setItems((prev) => prev.map((o) => o.id === id ? { ...o, status: res.data.status } : o));
        showToast("Order status updated successfully!", "success");
        setEditOrder(null);
      } else {
        showToast(res.message || "Failed to update order status.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while updating.", "error");
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <ToastNotification message={toast.message} type={toast.type} open={toast.open} onClose={closeToast} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Orders Management</h1>
          <p className="text-sm text-slate-400 mt-0.5">{total} total orders</p>
        </div>
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by order # or customer..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-9 h-9 text-sm border-slate-200 bg-white"
        />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100" style={{ backgroundColor: "rgba(209,61,61,0.04)" }}>
              {["Order #", "Customer", "Total", "Payment", "Date", "Status", "Action"].map((h) => (
                <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wide first:pl-5 whitespace-nowrap">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-slate-400 text-sm">No orders found.</TableCell>
              </TableRow>
            ) : (
              paginated.map((order) => (
                <TableRow key={order.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors animate-in fade-in duration-200">
                  <TableCell className="pl-5 py-3.5 text-xs font-mono text-slate-500">{order.order_number}</TableCell>
                  <TableCell className="py-3.5 text-sm font-medium text-slate-700 whitespace-nowrap">
                    {order.customer_name || <span className="text-slate-400 italic">Guest</span>}
                  </TableCell>
                  <TableCell className="py-3.5 text-sm font-medium text-slate-700">﷼{order.total}</TableCell>
                  <TableCell className="py-3.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-md capitalize ${
                      order.payment_status === "paid"
                        ? "bg-emerald-50 text-emerald-600"
                        : order.payment_status === "failed"
                        ? "bg-red-50 text-red-500"
                        : "bg-orange-50 text-orange-500"
                    }`}>
                      {order.payment_method} · {order.payment_status}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 text-sm text-slate-400 whitespace-nowrap">{formatDate(order.created_at)}</TableCell>
                  <TableCell className="py-3.5"><StatusBadge status={order.status} /></TableCell>
                  <TableCell className="py-3.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg bg-[#D13D3D] text-white hover:bg-[#b93333] transition-colors focus:outline-none cursor-pointer">
                        Action <ChevronDown className="h-3 w-3" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44 rounded-xl">
                        <DropdownMenuItem className="text-sm gap-2 cursor-pointer" onClick={() => setViewId(order.id)}>
                          <Eye className="h-3.5 w-3.5 text-slate-400" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm gap-2 cursor-pointer" onClick={() => setEditOrder(order)}>
                          <Pencil className="h-3.5 w-3.5 text-slate-400" /> Update Status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Page {page} of {totalPages} · {total} total orders
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="h-8 text-xs border-slate-200">Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="h-8 text-xs border-slate-200">Next</Button>
          </div>
        </div>
      )}

      <OrderDetailsModal
        open={!!viewId}
        onOpenChange={(v) => !v && setViewId(null)}
        orderId={viewId}
      />

      <UpdateStatusModal
        open={!!editOrder}
        onOpenChange={(v) => !v && setEditOrder(null)}
        order={editOrder}
        onSave={handleUpdateStatus}
        saving={editSaving}
      />
    </div>
  );
}
