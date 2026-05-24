"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Phone, MapPin } from "lucide-react";

interface Customer {
  name: string;
  image: string;
  email: string;
  phone: string;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  customer: Customer | null;
}

const mockOrders = [
  { id: "#12345", date: "2026-04-27", price: "320", status: "Delivery" },
  { id: "#12346", date: "2026-04-27", price: "320", status: "Delivery" },
];

export function CustomerDetailsModal({ open, onOpenChange, customer }: Props) {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-slate-800">Customer Details</DialogTitle>
        </DialogHeader>

        {/* Profile */}
        <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 mb-4">
          <img
            src={customer.image}
            alt={customer.name}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow shrink-0"
          />
          <div>
            <p className="font-semibold text-slate-800">{customer.name}</p>
            <div className="flex flex-wrap gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Mail className="h-3 w-3" /> {customer.email}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Phone className="h-3 w-3" /> {customer.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[{ label: "Home", address: "Riyadh, Al Olaya, Street 12" }, { label: "Office", address: "Riyadh, Al Olaya, Street 12" }].map((loc) => (
            <div key={loc.label} className="flex items-start gap-2 p-3 rounded-xl border border-slate-100">
              <MapPin className="h-4 w-4 text-[#D13D3D] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-700">{loc.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{loc.address}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order History */}
        <p className="text-sm font-semibold text-slate-800 mb-2">Order History</p>
        <div className="rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "rgba(209,61,61,0.04)" }}>
              <tr>
                {["Order ID", "Date", "Price", "Status"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order, i) => (
                <tr key={i} className="border-t border-slate-50">
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{order.id}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{order.date}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">﷼{order.price}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}