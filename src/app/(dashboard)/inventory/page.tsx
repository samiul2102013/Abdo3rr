"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { inventoryService } from "@/services/inventory-service";
import { InventoryItem } from "@/types/inventory";

// ── Custom Toast Notification Component ─────────────────────────────────────
function ToastNotification({ message, type, open, onClose }: {
  message: string;
  type: "success" | "error";
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-lg border transition-all duration-300 animate-in fade-in slide-in-from-top-5 ${
      type === "success"
        ? "bg-emerald-50 border-emerald-100 text-emerald-800"
        : "bg-red-50 border-red-100 text-red-800"
    }`}>
      {type === "success" ? (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">✓</span>
      ) : (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">!</span>
      )}
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75 transition-opacity text-xs font-bold p-1 cursor-pointer">✕</button>
    </div>
  );
}

// ── Skeleton Loader Rows ───────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4].map((n) => (
        <TableRow key={n} className="border-slate-50">
          <TableCell className="pl-5 py-4">
            <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
          </TableCell>
          <TableCell className="py-4">
            <div className="h-9 w-9 bg-slate-100 rounded-lg animate-pulse" />
          </TableCell>
          <TableCell className="py-4">
            <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
          </TableCell>
          <TableCell className="py-4">
            <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
          </TableCell>
          <TableCell className="py-4">
            <div className="h-4 w-12 bg-slate-100 rounded animate-pulse" />
          </TableCell>
          <TableCell className="py-4">
            <div className="h-4 w-12 bg-slate-100 rounded animate-pulse" />
          </TableCell>
          <TableCell className="py-4">
            <div className="h-4 w-12 bg-slate-100 rounded animate-pulse" />
          </TableCell>
          <TableCell className="py-4">
            <div className="h-4 w-12 bg-slate-100 rounded animate-pulse" />
          </TableCell>
          <TableCell className="py-4">
            <div className="h-4 w-12 bg-slate-100 rounded animate-pulse" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Toast notifications state
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({
    open: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ open: true, message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  // Fetch inventory from API
  const fetchInventory = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await inventoryService.getInventory(pageNum);
      if (res.success && res.data?.results) {
        setItems(res.data.results);
        setTotal(res.data.total);
        setTotalPages(res.data.total_pages);
      } else {
        showToast(res.message || "Failed to load inventory.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while loading inventory.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchInventory(page); }, [fetchInventory, page]);

  const filtered = useMemo(
    () => items.filter((i) =>
      i.product_name.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase())
    ),
    [items, search]
  );

  return (
    <div className="space-y-5">
      {/* Toast Alert System */}
      <ToastNotification
        message={toast.message}
        type={toast.type}
        open={toast.open}
        onClose={closeToast}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Inventory</h1>
          <p className="text-sm text-slate-400 mt-0.5">Track stock levels and movements</p>
        </div>
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-9 h-9 text-sm border-slate-200 bg-white"
        />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100" style={{ backgroundColor: "rgba(209,61,61,0.04)" }}>
              {["Name", "Img", "SKU", "Category", "Price", "Stock", "Reserved", "Preorder", "In Transit"].map((h) => (
                <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wide first:pl-5 whitespace-nowrap">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-16 text-slate-400 text-sm">No items found.</TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => {
                const stockNum = parseFloat(item.stock);
                return (
                  <TableRow key={item.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors animate-in fade-in duration-200">
                    <TableCell className="pl-5 py-3.5 text-sm font-medium text-slate-700 whitespace-nowrap">{item.product_name}</TableCell>
                    <TableCell className="py-3.5">
                      <div className="relative h-9 w-9 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                        {item.product_image ? (
                          <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5 text-xs font-mono text-slate-400">{item.sku}</TableCell>
                    <TableCell className="py-3.5 text-sm text-slate-500">{item.category}</TableCell>
                    <TableCell className="py-3.5 text-sm text-slate-600">﷼{item.price}</TableCell>
                    <TableCell className="py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        stockNum <= 10
                          ? "bg-red-50 text-red-500"
                          : "text-slate-600"
                      }`}>
                        {item.stock}Kg
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 text-sm text-slate-400">{item.reserved} Kg</TableCell>
                    <TableCell className="py-3.5 text-sm text-slate-400">{item.preorder} Kg</TableCell>
                    <TableCell className="py-3.5 text-sm text-slate-400">{item.in_transit} Kg</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Page {page} of {totalPages} · {total} total items
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="h-8 text-xs border-slate-200">
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages || totalPages === 0} className="h-8 text-xs border-slate-200">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
