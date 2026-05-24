"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
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
import { Search, Plus, ChevronDown, Pencil, Trash2, ToggleLeft, Loader2 } from "lucide-react";
import { AddPackagingTypeModal } from "@/components/dashboard/modals/AddPackagingTypeModal";
import { packagingService } from "@/services/packaging-service";
import { PackagingType } from "@/types/packaging";

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
            <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
          </TableCell>
          <TableCell className="py-4">
            <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

// ── Edit Modal ──────────────────────────────────────────────────────────────
function EditPackagingTypeModal({ open, onOpenChange, item, onSave, saving }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: PackagingType | null;
  onSave: (name: string) => void;
  saving: boolean;
}) {
  const [name, setName] = useState(item?.name ?? "");

  useEffect(() => {
    if (item) {
      setName(item.name);
    }
  }, [item]);

  const handleSave = () => {
    if (!item || !name.trim() || saving) return;
    onSave(name);
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !saving && onOpenChange(v)}>
      <DialogContent className="sm:max-w-sm rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-xl font-bold text-slate-800">Edit Packaging Type</DialogTitle>
          <p className="text-sm text-slate-400">Update the details below</p>
        </DialogHeader>
        <div className="space-y-4 mt-5">
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Packaging Type</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              disabled={saving}
              className="h-11 border-slate-200 animate-in fade-in" 
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button 
            variant="outline" 
            className="flex-1 border-slate-200" 
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-[#D13D3D] hover:bg-[#b93333] text-white" 
            onClick={handleSave}
            disabled={saving || !name.trim()}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Confirm Delete Modal ───────────────────────────────────────────────────
function ConfirmDeleteModal({ open, onOpenChange, onConfirm, deleting }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !deleting && onOpenChange(v)}>
      <DialogContent className="sm:max-w-sm rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-xl font-bold text-slate-800">Delete Packaging Type</DialogTitle>
          <p className="text-sm text-slate-400 mt-1">
            Are you sure you want to delete this packaging type? This action cannot be undone.
          </p>
        </DialogHeader>
        <div className="flex gap-3 mt-6">
          <Button 
            variant="outline" 
            className="flex-1 border-slate-200" 
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-red-500 hover:bg-red-600 text-white" 
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page Component ─────────────────────────────────────────────────────
export default function PackagingTypePage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<PackagingType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals visibility states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<PackagingType | null>(null);
  const [deleteItem, setDeleteItem] = useState<PackagingType | null>(null);

  // Modals submitting/processing states
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

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

  // Fetch packaging types from API
  const fetchPackagingTypes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await packagingService.getPackagingTypes();
      if (res.success && Array.isArray(res.data)) {
        setItems(res.data);
      } else {
        showToast(res.message || "Failed to load packaging types.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while loading packaging types.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPackagingTypes();
  }, [fetchPackagingTypes]);

  // Filter list based on search query
  const filtered = useMemo(() => {
    return items.filter((i) => 
      i.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  // Handle Add New Packaging Type
  const handleAdd = async (data: { name: string; status: boolean }) => {
    try {
      setAddSubmitting(true);
      const res = await packagingService.createPackagingType(data);
      if (res.success && res.data) {
        setItems((prev) => [res.data, ...prev]);
        showToast("Packaging type created successfully!", "success");
        setAddModalOpen(false);
      } else {
        showToast(res.message || "Failed to create packaging type.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while creating.", "error");
    } finally {
      setAddSubmitting(false);
    }
  };

  // Handle Edit Save Changes
  const handleSave = async (updatedName: string) => {
    if (!editItem) return;
    try {
      setEditSubmitting(true);
      const res = await packagingService.updatePackagingType(editItem.id, { name: updatedName });
      if (res.success && res.data) {
        setItems((prev) => prev.map((i) => i.id === editItem.id ? res.data : i));
        showToast("Packaging type updated successfully!", "success");
        setEditItem(null);
      } else {
        showToast(res.message || "Failed to update packaging type.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while saving.", "error");
    } finally {
      setEditSubmitting(false);
    }
  };

  // Handle Toggle Status
  const handleToggleStatus = async (id: number) => {
    try {
      setTogglingId(id);
      const res = await packagingService.togglePackagingStatus(id);
      if (res.success && res.data) {
        setItems((prev) => prev.map((i) => i.id === id ? res.data : i));
        showToast(res.message || "Status updated successfully!", "success");
      } else {
        showToast(res.message || "Failed to update status.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while toggling status.", "error");
    } finally {
      setTogglingId(null);
    }
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      setDeleteSubmitting(true);
      const res = await packagingService.deletePackagingType(deleteItem.id);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i.id !== deleteItem.id));
        showToast("Packaging type deleted successfully!", "success");
        setDeleteItem(null);
      } else {
        showToast(res.message || "Failed to delete packaging type.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while deleting.", "error");
    } finally {
      setDeleteSubmitting(false);
    }
  };

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
          <h1 className="text-xl font-semibold text-slate-800">Packaging Type</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage available packaging options</p>
        </div>
        <Button
          className="h-9 gap-1.5 text-sm font-medium bg-[#D13D3D] hover:bg-[#b93333] text-white shadow-sm w-full sm:w-auto cursor-pointer"
          onClick={() => setAddModalOpen(true)}
        >
          <Plus className="h-4 w-4" /> Add New Type
        </Button>
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search types..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm border-slate-200 bg-white"
        />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100" style={{ backgroundColor: "rgba(209,61,61,0.04)" }}>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide pl-5">Packaging Type</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-16 text-slate-400 text-sm">No items found.</TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors animate-in fade-in duration-200">
                  <TableCell className="pl-5 py-3.5 text-sm font-medium text-slate-700">{item.name}</TableCell>
                  <TableCell className="py-3.5">
                    {togglingId === item.id ? (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#D13D3D]" />
                        Updating...
                      </span>
                    ) : (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        item.status ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400"
                      }`}>
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger 
                        disabled={togglingId === item.id}
                        className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg bg-[#D13D3D] text-white hover:bg-[#b93333] transition-colors focus:outline-none cursor-pointer disabled:opacity-50"
                      >
                        Action <ChevronDown className="h-3 w-3" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44 rounded-xl">
                        <DropdownMenuItem className="text-sm gap-2 cursor-pointer" onClick={() => setEditItem(item)}>
                          <Pencil className="h-3.5 w-3.5 text-slate-400" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm gap-2 cursor-pointer" onClick={() => handleToggleStatus(item.id)}>
                          <ToggleLeft className="h-3.5 w-3.5 text-slate-400" />
                          {item.status ? "Deactivate" : "Activate"}
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

      {/* Add Modal */}
      <AddPackagingTypeModal 
        open={addModalOpen} 
        onOpenChange={setAddModalOpen} 
        onSubmit={handleAdd} 
        submitting={addSubmitting} 
      />

      {/* Edit Modal */}
      <EditPackagingTypeModal 
        open={!!editItem} 
        onOpenChange={(v) => !v && setEditItem(null)} 
        item={editItem} 
        onSave={handleSave} 
        saving={editSubmitting} 
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal 
        open={!!deleteItem} 
        onOpenChange={(v) => !v && setDeleteItem(null)} 
        onConfirm={handleConfirmDelete} 
        deleting={deleteSubmitting} 
      />
    </div>
  );
}