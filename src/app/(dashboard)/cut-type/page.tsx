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
import {
  Search, Plus, ChevronDown, Pencil, Trash2, ToggleLeft, Eye, Loader2,
} from "lucide-react";
import { AddCutTypeModal } from "@/components/dashboard/modals/AddCutTypeModal";
import { cutTypeService } from "@/services/cut-type-service";
import { CutType } from "@/types/cut-type";

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

function formatDate(value?: string) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}

function ViewCutTypeModal({ open, onOpenChange, cutTypeId }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  cutTypeId: number | null;
}) {
  const [detail, setDetail] = useState<CutType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !cutTypeId) return;
    setLoading(true);
    cutTypeService.getCutTypeById(cutTypeId)
      .then((res) => {
        if (res.success && res.data) {
          setDetail(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, cutTypeId]);

  useEffect(() => {
    if (!open) {
      setDetail(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-slate-800">Cut Type Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-[#D13D3D]" />
          </div>
        ) : detail ? (
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/50">
              <p className="text-xs text-slate-400 mb-1">Name</p>
              <p className="text-sm font-semibold text-slate-700 break-words">{detail.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 p-3 text-center">
                <p className="text-xs text-slate-400 mb-1">Status</p>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  detail.status ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400"
                }`}>
                  {detail.status ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="rounded-xl border border-slate-100 p-3 text-center">
                <p className="text-xs text-slate-400 mb-1">ID</p>
                <p className="text-sm font-semibold text-slate-700">{detail.id}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="rounded-xl border border-slate-100 p-3">
                <p className="text-xs text-slate-400 mb-0.5">Created At</p>
                <p className="text-sm text-slate-600">{formatDate(detail.created_at)}</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-3">
                <p className="text-xs text-slate-400 mb-0.5">Updated At</p>
                <p className="text-sm text-slate-600">{formatDate(detail.updated_at)}</p>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function EditCutTypeModal({ open, onOpenChange, item, onSave, saving }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: CutType | null;
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
    onSave(name.trim());
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !saving && onOpenChange(v)}>
      <DialogContent className="sm:max-w-sm rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-xl font-bold text-slate-800">Edit Cut Type</DialogTitle>
          <p className="text-sm text-slate-400">Update the details below</p>
        </DialogHeader>
        <div className="space-y-4 mt-5">
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Cut Type</Label>
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
          <DialogTitle className="text-xl font-bold text-slate-800">Delete Cut Type</DialogTitle>
          <p className="text-sm text-slate-400 mt-1">
            Are you sure you want to delete this cut type? This action cannot be undone.
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

export default function CutTypePage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<CutType[]>([]);
  const [loading, setLoading] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewId, setViewId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<CutType | null>(null);
  const [deleteItem, setDeleteItem] = useState<CutType | null>(null);

  const [addSubmitting, setAddSubmitting] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

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

  const fetchCutTypes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await cutTypeService.getCutTypes();
      if (res.success && Array.isArray(res.data)) {
        setItems(res.data);
      } else {
        showToast(res.message || "Failed to load cut types.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while loading cut types.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCutTypes();
  }, [fetchCutTypes]);

  const filtered = useMemo(() => {
    return items.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  const handleAdd = async (data: { name: string; status: boolean }) => {
    try {
      setAddSubmitting(true);
      const res = await cutTypeService.createCutType(data);
      if (res.success && res.data) {
        setItems((prev) => [res.data, ...prev]);
        showToast("Cut type created successfully!", "success");
        setAddModalOpen(false);
      } else {
        showToast(res.message || "Failed to create cut type.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while creating.", "error");
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleSave = async (updatedName: string) => {
    if (!editItem) return;
    try {
      setEditSubmitting(true);
      const res = await cutTypeService.updateCutType(editItem.id, { name: updatedName });
      if (res.success && res.data) {
        setItems((prev) => prev.map((i) => i.id === editItem.id ? res.data : i));
        showToast("Cut type updated successfully!", "success");
        setEditItem(null);
      } else {
        showToast(res.message || "Failed to update cut type.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while saving.", "error");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      setTogglingId(id);
      const res = await cutTypeService.toggleCutTypeStatus(id);
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

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      setDeleteSubmitting(true);
      const res = await cutTypeService.deleteCutType(deleteItem.id);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i.id !== deleteItem.id));
        showToast("Cut type deleted successfully!", "success");
        setDeleteItem(null);
      } else {
        showToast(res.message || "Failed to delete cut type.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while deleting.", "error");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <ToastNotification
        message={toast.message}
        type={toast.type}
        open={toast.open}
        onClose={closeToast}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Cut Type</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage available cut options</p>
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
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wide pl-5">Cut Type</TableHead>
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
                        <DropdownMenuItem className="text-sm gap-2 cursor-pointer" onClick={() => setViewId(item.id)}>
                          <Eye className="h-3.5 w-3.5 text-slate-400" /> View Details
                        </DropdownMenuItem>
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

      <AddCutTypeModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSubmit={handleAdd}
        submitting={addSubmitting}
      />

      <ViewCutTypeModal
        open={!!viewId}
        onOpenChange={(v) => !v && setViewId(null)}
        cutTypeId={viewId}
      />

      <EditCutTypeModal
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
