"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Phone, MapPin, Package, Loader2 } from "lucide-react";
import { orderService } from "@/services/order-service";
import { OrderDetail, OrderStatus } from "@/types/order";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  orderId: number | null;
}

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "order_confirmed", label: "Accepted"  },
  { key: "processing",      label: "Processing" },
  { key: "in_transit",      label: "In Transit" },
  { key: "delivered",       label: "Delivered"  },
];

function getStepIndex(status: OrderStatus): number {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function OrderDetailsModal({ open, onOpenChange, orderId }: Props) {
  const [detail,  setDetail]  = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !orderId) return;
    setLoading(true);
    orderService.getOrderById(orderId)
      .then((res) => { if (res.success && res.data) setDetail(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, orderId]);

  useEffect(() => { if (!open) setDetail(null); }, [open]);

  const activeStep = detail ? getStepIndex(detail.status) : 0;
  const isCancelled = detail?.status === "cancelled";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 gap-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-slate-800">Order Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#D13D3D]" />
          </div>
        ) : detail ? (
          <>
            {/* Order number + date */}
            <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-xs text-slate-400">Order Number</p>
                <p className="text-sm font-bold text-slate-800 font-mono">{detail.order_number}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Date</p>
                <p className="text-sm font-medium text-slate-700">{formatDate(detail.created_at)}</p>
              </div>
            </div>

            {/* Customer + Delivery */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="h-9 w-9 rounded-full bg-[#D13D3D]/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-[#D13D3D]">
                    {detail.customer_name ? detail.customer_name.charAt(0).toUpperCase() : "?"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {detail.customer_name || "Guest"}
                  </p>
                  {detail.customer_email && (
                    <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <Mail className="h-2.5 w-2.5 shrink-0" />
                      <span className="truncate">{detail.customer_email}</span>
                    </p>
                  )}
                  {detail.customer_phone && (
                    <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <Phone className="h-2.5 w-2.5 shrink-0" />
                      {detail.customer_phone}
                    </p>
                  )}
                </div>
              </div>

              {detail.delivery_address ? (
                <div className="flex items-start gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <MapPin className="h-4 w-4 text-[#D13D3D] mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Delivery Address</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{detail.delivery_address.title}</p>
                    <p className="text-xs text-slate-400 leading-tight">{detail.delivery_address.full_address}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <MapPin className="h-4 w-4 text-slate-300 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Receive Method</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5 capitalize">
                      {detail.receive_method.replace("_", " ")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Purchased Items */}
            <p className="text-sm font-semibold text-slate-800 mb-2">Purchased Items</p>
            <div className="space-y-2 mb-4">
              {detail.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
                  {item.product_image ? (
                    <img src={item.product_image} alt={item.product_name} className="h-11 w-11 rounded-lg object-cover bg-slate-100 shrink-0" />
                  ) : (
                    <div className="h-11 w-11 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5 text-slate-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{item.product_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Qty: {item.quantity}
                      {item.cut_type_name && ` · ${item.cut_type_name}`}
                      {item.packaging_type_name && ` · ${item.packaging_type_name}`}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 shrink-0">﷼{item.subtotal}</p>
                </div>
              ))}
            </div>

            {/* Order Status Steps */}
            {!isCancelled && (
              <>
                <p className="text-sm font-semibold text-slate-800 mb-3">Order Status</p>
                <div className="flex items-center justify-between mb-5 px-1">
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step.key} className="flex flex-col items-center flex-1">
                      <div className="flex items-center w-full">
                        {i > 0 && (
                          <div className={`flex-1 h-px ${i <= activeStep ? "bg-[#D13D3D]" : "bg-slate-200"}`} />
                        )}
                        <div className={`h-4 w-4 rounded-full border-2 shrink-0 transition-colors ${
                          i <= activeStep ? "border-[#D13D3D] bg-[#D13D3D]" : "border-slate-200 bg-white"
                        }`} />
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`flex-1 h-px ${i < activeStep ? "bg-[#D13D3D]" : "bg-slate-200"}`} />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5 text-center leading-tight">{step.label}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {isCancelled && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-center">
                <p className="text-sm font-semibold text-red-500">Order Cancelled</p>
              </div>
            )}

            {/* Tracking Notes */}
            {detail.tracking.length > 0 && (
              <>
                <p className="text-sm font-semibold text-slate-800 mb-2">Tracking History</p>
                <div className="space-y-2 mb-4">
                  {detail.tracking.map((t) => (
                    <div key={t.id} className="flex gap-2.5 text-xs text-slate-500">
                      <span className="shrink-0 text-slate-300 mt-0.5">•</span>
                      <div>
                        <p>{t.note}</p>
                        <p className="text-slate-400 mt-0.5">{new Date(t.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Payment Summary */}
            <p className="text-sm font-semibold text-slate-800 mb-2">Payment Summary</p>
            <div className="rounded-xl border border-slate-100 p-4 space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span><span>﷼{detail.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Delivery Fee</span><span>﷼{detail.delivery_fee}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-slate-800 border-t border-slate-100 pt-2 mt-2">
                <span>Total</span><span>﷼{detail.total}</span>
              </div>
              <div className="pt-1 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Payment Method</p>
                  <p className="text-sm font-medium text-slate-700 mt-0.5 capitalize">{detail.payment_method}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                  detail.payment_status === "paid"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : detail.payment_status === "failed"
                    ? "bg-red-50 text-red-500"
                    : "bg-orange-50 text-orange-500"
                }`}>
                  {detail.payment_status}
                </span>
              </div>
              {detail.notes && (
                <div className="pt-1 border-t border-slate-100 mt-2">
                  <p className="text-xs text-slate-400">Notes</p>
                  <p className="text-xs text-slate-600 mt-0.5">{detail.notes}</p>
                </div>
              )}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
