"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Plus, ChevronDown, Pencil, Trash2, MapPin, Loader2, Search } from "lucide-react";
import { AddPickupLocationModal } from "@/components/dashboard/modals/AddPickupLocationModal";
import { pickupService } from "@/services/pickup-service";
import {
  PickupLocation,
  CreatePickupLocationPayload,
  UpdatePickupLocationPayload,
} from "@/types/pickup";

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
      {[1, 2, 3].map((n) => (
        <TableRow key={n} className="border-slate-50">
          <TableCell className="pl-5 py-4"><div className="h-4 w-40 bg-slate-100 rounded animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-4 w-56 bg-slate-100 rounded animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-4 w-24 bg-slate-100 rounded animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditPickupLocationModal({ open, onOpenChange, item, onSave, saving }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: PickupLocation | null;
  onSave: (id: number, payload: UpdatePickupLocationPayload) => void;
  saving: boolean;
}) {
  const [name,     setName]     = useState("");
  const [address,  setAddress]  = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (item) { setName(item.name); setAddress(item.address); setIsActive(item.is_active); }
  }, [item]);

  const handleSave = () => {
    if (!item || !name.trim() || saving) return;
    onSave(item.id, { name: name.trim(), address: address.trim(), is_active: isActive });
  };

  if (!item) return null;
  return (
    <Dialog open={open} onOpenChange={(v) => !saving && onOpenChange(v)}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-xl font-bold text-slate-800">Edit Pickup Location</DialogTitle>
          <p className="text-sm text-slate-400">Update the location details</p>
        </DialogHeader>
        <div className="space-y-4 mt-5">
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
              className="h-11 border-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Address</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={saving}
              className="h-11 border-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Status</Label>
            <Select value={isActive ? "true" : "false"} onValueChange={(v) => setIsActive(v === "true")} disabled={saving}>
              <SelectTrigger className="h-11 border-slate-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {isActive && !item.is_active && (
              <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-1">
                Setting this as active will deactivate the current active location.
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1 border-slate-200" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button className="flex-1 bg-[#D13D3D] hover:bg-[#b93333] text-white" onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Confirm Delete Modal ──────────────────────────────────────────────────────
function ConfirmDeleteModal({ open, onOpenChange, onConfirm, deleting }: {
  open: boolean; onOpenChange: (v: boolean) => void; onConfirm: () => void; deleting: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !deleting && onOpenChange(v)}>
      <DialogContent className="sm:max-w-sm rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-xl font-bold text-slate-800">Delete Pickup Location</DialogTitle>
          <p className="text-sm text-slate-400 mt-1">Are you sure you want to delete this location? This action cannot be undone.</p>
        </DialogHeader>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1 border-slate-200" onClick={() => onOpenChange(false)} disabled={deleting}>Cancel</Button>
          <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={onConfirm} disabled={deleting}>
            {deleting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Deleting...</>) : "Confirm Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PickupLocationsPage() {
  const [search,  setSearch]  = useState("");
  const [items,   setItems]   = useState<PickupLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const [addOpen,      setAddOpen]      = useState(false);
  const [editItem,     setEditItem]     = useState<PickupLocation | null>(null);
  const [deleteItem,   setDeleteItem]   = useState<PickupLocation | null>(null);

  const [addSubmitting,    setAddSubmitting]    = useState(false);
  const [editSubmitting,   setEditSubmitting]   = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const [toast, setToast] = useState<{ open: boolean; message: string; type: "success" | "error" }>({
    open: false, message: "", type: "success",
  });
  const showToast  = useCallback((message: string, type: "success" | "error") => setToast({ open: true, message, type }), []);
  const closeToast = useCallback(() => setToast((p) => ({ ...p, open: false })), []);

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await pickupService.getPickupLocations();
      if (res.success && Array.isArray(res.data)) {
        setItems(res.data);
      } else {
        showToast(res.message || "Failed to load pickup locations.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while loading.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchLocations(); }, [fetchLocations]);

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (payload: CreatePickupLocationPayload) => {
    try {
      setAddSubmitting(true);
      const res = await pickupService.createPickupLocation(payload);
      if (res.success && res.data) {
        // If new location is active, deactivate others locally
        setItems((prev) => {
          const updated = payload.is_active
            ? prev.map((i) => ({ ...i, is_active: false }))
            : [...prev];
          return [res.data, ...updated];
        });
        showToast("Pickup location created successfully!", "success");
        setAddOpen(false);
      } else {
        showToast(res.message || "Failed to create pickup location.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while creating.", "error");
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleSave = async (id: number, payload: UpdatePickupLocationPayload) => {
    try {
      setEditSubmitting(true);
      const res = await pickupService.updatePickupLocation(id, payload);
      if (res.success && res.data) {
        setItems((prev) => {
          // If this location is now active, deactivate all others
          const updated = payload.is_active
            ? prev.map((i) => ({ ...i, is_active: i.id === id ? false : false }))
            : prev;
          return updated.map((i) => i.id === id ? res.data : i);
        });
        showToast("Pickup location updated successfully!", "success");
        setEditItem(null);
      } else {
        showToast(res.message || "Failed to update pickup location.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while saving.", "error");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      setDeleteSubmitting(true);
      const res = await pickupService.deletePickupLocation(deleteItem.id);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i.id !== deleteItem.id));
        showToast("Pickup location deleted successfully!", "success");
        setDeleteItem(null);
      } else {
        showToast(res.message || "Failed to delete pickup location.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while deleting.", "error");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <ToastNotification message={toast.message} type={toast.type} open={toast.open} onClose={closeToast} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Pickup Locations</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage store pickup points</p>
        </div>
        <Button
          className="h-9 gap-1.5 text-sm font-medium bg-[#D13D3D] hover:bg-[#b93333] text-white shadow-sm w-full sm:w-auto cursor-pointer"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-4 w-4" /> Add New Location
        </Button>
      </div>

      {/* Active location banner */}
      {!loading && (() => {
        const active = items.find((i) => i.is_active);
        return active ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
            <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-700">Active Location: {active.name}</p>
              <p className="text-xs text-emerald-600 mt-0.5">{active.address}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100">
            <MapPin className="h-4 w-4 text-amber-500 shrink-0" />
            <p className="text-sm font-medium text-amber-600">No active pickup location. Set one as active to enable pickup orders.</p>
          </div>
        );
      })()}

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm border-slate-200 bg-white"
        />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100" style={{ backgroundColor: "rgba(209,61,61,0.04)" }}>
              {["Name", "Address", "Coordinates", "Status", "Action"].map((h) => (
                <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wide first:pl-5 whitespace-nowrap">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-slate-400 text-sm">No pickup locations found.</TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors animate-in fade-in duration-200">
                  <TableCell className="pl-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                        item.is_active ? "bg-emerald-50" : "bg-slate-100"
                      }`}>
                        <MapPin className={`h-4 w-4 ${item.is_active ? "text-emerald-500" : "text-slate-400"}`} />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 text-sm text-slate-500 max-w-[220px] truncate">{item.address}</TableCell>
                  <TableCell className="py-3.5">
                    <span className="text-xs font-mono text-slate-400">
                      {parseFloat(item.latitude).toFixed(4)}, {parseFloat(item.longitude).toFixed(4)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      item.is_active
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-slate-100 text-slate-400"
                    }`}>
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg bg-[#D13D3D] text-white hover:bg-[#b93333] transition-colors focus:outline-none cursor-pointer">
                        Action <ChevronDown className="h-3 w-3" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44 rounded-xl">
                        <DropdownMenuItem className="text-sm gap-2 cursor-pointer" onClick={() => setEditItem(item)}>
                          <Pencil className="h-3.5 w-3.5 text-slate-400" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-sm gap-2 cursor-pointer text-red-500 focus:text-red-500"
                          onClick={() => setDeleteItem(item)}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
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

      <AddPickupLocationModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        submitting={addSubmitting}
      />

      <EditPickupLocationModal
        open={!!editItem}
        onOpenChange={(v) => !v && setEditItem(null)}
        item={editItem}
        onSave={handleSave}
        saving={editSubmitting}
      />

      <ConfirmDeleteModal
        open={!!deleteItem}
        onOpenChange={(v) => !v && setDeleteItem(null)}
        onConfirm={handleConfirmDelete}
        deleting={deleteSubmitting}
      />
    </div>
  );
}
