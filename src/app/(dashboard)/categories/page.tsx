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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, Plus, ChevronDown, Pencil, Trash2, ToggleLeft, Eye, Loader2, Tag,
} from "lucide-react";
import { AddCategoryModal } from "@/components/dashboard/modals/AddCategoryModal";
import { categoryService } from "@/services/category-service";
import { Category, CreateCategoryPayload, UpdateCategoryPayload } from "@/types/category";

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
          <TableCell className="pl-5 py-4"><div className="h-4 w-32 bg-slate-100 rounded animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-4 w-40 bg-slate-100 rounded animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-4 w-10 bg-slate-100 rounded animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

// ── View Modal ────────────────────────────────────────────────────────────────
function ViewCategoryModal({ open, onOpenChange, categoryId }: {
  open: boolean; onOpenChange: (v: boolean) => void; categoryId: number | null;
}) {
  const [detail,  setDetail]  = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !categoryId) return;
    setLoading(true);
    categoryService.getCategoryById(categoryId)
      .then((res) => { if (res.success && res.data) setDetail(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, categoryId]);

  useEffect(() => { if (!open) setDetail(null); }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-5">
          <DialogTitle className="text-xl font-bold text-slate-800">Category Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-[#D13D3D]" />
          </div>
        ) : detail ? (
          <>
            {/* Image or icon */}
            <div className="flex flex-col items-center gap-3 py-4 border border-slate-100 rounded-2xl bg-slate-50/50 mb-4">
              {detail.image ? (
                <img src={detail.image} alt={detail.name} className="h-16 w-16 rounded-xl object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-xl bg-[#D13D3D]/10 flex items-center justify-center">
                  <Tag className="h-7 w-7 text-[#D13D3D]" />
                </div>
              )}
              <div className="text-center">
                <p className="text-lg font-bold text-slate-800">{detail.name}</p>
                {detail.subtitle && <p className="text-xs text-slate-400 mt-0.5">{detail.subtitle}</p>}
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mt-2 inline-block ${
                  detail.status ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400"
                }`}>{detail.status ? "Active" : "Inactive"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl border border-slate-100 text-center">
                <p className="text-2xl font-bold text-slate-800">{detail.item_count}</p>
                <p className="text-xs text-slate-400 mt-0.5">Total Items</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-100 text-center">
                <p className="text-2xl font-bold text-slate-800">{detail.subcategories.length}</p>
                <p className="text-xs text-slate-400 mt-0.5">Subcategories</p>
              </div>
            </div>

            {detail.subcategories.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Subcategories</p>
                {detail.subcategories.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    {sub.icon ? (
                      <img src={sub.icon} alt={sub.name} className="h-7 w-7 rounded-lg object-cover bg-white" />
                    ) : (
                      <div className="h-7 w-7 rounded-lg bg-slate-200 flex items-center justify-center">
                        <Tag className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-700">{sub.name}</span>
                    <span className="ml-auto text-xs text-slate-400">{sub.item_count} items</span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditCategoryModal({ open, onOpenChange, category, onSave, saving }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  category: Category | null; onSave: (id: number, payload: UpdateCategoryPayload) => void;
  saving: boolean;
}) {
  const [name,     setName]     = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [status,   setStatus]   = useState(true);
  const [image,    setImage]    = useState<File | null>(null);

  useEffect(() => {
    if (category) { 
      setName(category.name); 
      setSubtitle(category.subtitle ?? ""); 
      setStatus(category.status);
      setImage(null);
    }
  }, [category]);

  const handleSave = () => {
    if (!category || !name.trim() || saving) return;
    onSave(category.id, {
      name: name.trim(),
      status,
      ...(subtitle.trim() && { subtitle: subtitle.trim() }),
      ...(image && { image }),
    });
  };

  if (!category) return null;
  return (
    <Dialog open={open} onOpenChange={(v) => !saving && onOpenChange(v)}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-xl font-bold text-slate-800">Edit Category</DialogTitle>
          <p className="text-sm text-slate-400">Update the category details</p>
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
            <Label className="text-sm text-slate-600">Subtitle</Label>
            <Input
              placeholder="Enter subtitle (optional)"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              disabled={saving}
              className="h-11 border-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Image (Leave blank to keep current)</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              disabled={saving}
              className="border-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Status</Label>
            <Select value={status ? "true" : "false"} onValueChange={(v) => setStatus(v === "true")} disabled={saving}>
              <SelectTrigger className="h-11 border-slate-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
          <DialogTitle className="text-xl font-bold text-slate-800">Delete Category</DialogTitle>
          <p className="text-sm text-slate-400 mt-1">Are you sure you want to delete this category? This action cannot be undone.</p>
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
export default function CategoriesPage() {
  const [search,  setSearch]  = useState("");
  const [items,   setItems]   = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [addOpen,      setAddOpen]      = useState(false);
  const [viewId,       setViewId]       = useState<number | null>(null);
  const [editItem,     setEditItem]     = useState<Category | null>(null);
  const [deleteItem,   setDeleteItem]   = useState<Category | null>(null);

  const [addSubmitting,    setAddSubmitting]    = useState(false);
  const [editSubmitting,   setEditSubmitting]   = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [togglingId,       setTogglingId]       = useState<number | null>(null);

  const [toast, setToast] = useState<{ open: boolean; message: string; type: "success" | "error" }>({
    open: false, message: "", type: "success",
  });
  const showToast  = useCallback((message: string, type: "success" | "error") => setToast({ open: true, message, type }), []);
  const closeToast = useCallback(() => setToast((p) => ({ ...p, open: false })), []);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories();
      if (res.success && Array.isArray(res.data)) {
        setItems(res.data);
      } else {
        showToast(res.message || "Failed to load categories.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while loading categories.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const filtered = useMemo(
    () => items.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const handleAdd = async (payload: CreateCategoryPayload) => {
    try {
      setAddSubmitting(true);
      const res = await categoryService.createCategory(payload);
      if (res.success && res.data) {
        setItems((prev) => [res.data, ...prev]);
        showToast("Category created successfully!", "success");
        setAddOpen(false);
      } else {
        showToast(res.message || "Failed to create category.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while creating.", "error");
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleSave = async (id: number, payload: UpdateCategoryPayload) => {
    try {
      setEditSubmitting(true);
      const res = await categoryService.updateCategory(id, payload);
      if (res.success && res.data) {
        setItems((prev) => prev.map((c) => c.id === id ? res.data : c));
        showToast("Category updated successfully!", "success");
        setEditItem(null);
      } else {
        showToast(res.message || "Failed to update category.", "error");
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
      const res = await categoryService.toggleCategoryStatus(id);
      if (res.success && res.data) {
        setItems((prev) => prev.map((c) => c.id === id ? res.data : c));
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
      const res = await categoryService.deleteCategory(deleteItem.id);
      if (res.success) {
        setItems((prev) => prev.filter((c) => c.id !== deleteItem.id));
        showToast("Category deleted successfully!", "success");
        setDeleteItem(null);
      } else {
        showToast(res.message || "Failed to delete category.", "error");
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
          <h1 className="text-xl font-semibold text-slate-800">Categories</h1>
          <p className="text-sm text-slate-400 mt-0.5">{items.length} total categories</p>
        </div>
        <Button
          className="h-9 gap-1.5 text-sm bg-[#D13D3D] hover:bg-[#b93333] text-white shadow-sm w-full sm:w-auto cursor-pointer"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-4 w-4" /> Add New Category
        </Button>
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm border-slate-200 bg-white"
        />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100" style={{ backgroundColor: "rgba(209,61,61,0.04)" }}>
              {["Name", "Subtitle", "Items", "Status", "Action"].map((h) => (
                <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wide first:pl-5 whitespace-nowrap">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-slate-400 text-sm">No categories found.</TableCell>
              </TableRow>
            ) : (
              filtered.map((cat) => (
                <TableRow key={cat.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors animate-in fade-in duration-200">
                  <TableCell className="pl-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="h-8 w-8 rounded-lg object-cover bg-slate-100 shrink-0" />
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-[#D13D3D]/10 flex items-center justify-center shrink-0">
                          <Tag className="h-4 w-4 text-[#D13D3D]" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 text-sm text-slate-400 max-w-[180px] truncate">
                    {cat.subtitle ?? <span className="italic text-slate-300">—</span>}
                  </TableCell>
                  <TableCell className="py-3.5 text-sm text-slate-500">{cat.item_count}</TableCell>
                  <TableCell className="py-3.5">
                    {togglingId === cat.id ? (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#D13D3D]" />
                        Updating...
                      </span>
                    ) : (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        cat.status ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400"
                      }`}>
                        {cat.status ? "Active" : "Inactive"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        disabled={togglingId === cat.id}
                        className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg bg-[#D13D3D] text-white hover:bg-[#b93333] transition-colors focus:outline-none cursor-pointer disabled:opacity-50"
                      >
                        Action <ChevronDown className="h-3 w-3" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44 rounded-xl">
                        <DropdownMenuItem className="text-sm gap-2 cursor-pointer" onClick={() => setViewId(cat.id)}>
                          <Eye className="h-3.5 w-3.5 text-slate-400" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm gap-2 cursor-pointer" onClick={() => setEditItem(cat)}>
                          <Pencil className="h-3.5 w-3.5 text-slate-400" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm gap-2 cursor-pointer" onClick={() => handleToggleStatus(cat.id)}>
                          <ToggleLeft className="h-3.5 w-3.5 text-slate-400" />
                          {cat.status ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-sm gap-2 cursor-pointer text-red-500 focus:text-red-500"
                          onClick={() => setDeleteItem(cat)}
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

      <AddCategoryModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        submitting={addSubmitting}
      />

      <ViewCategoryModal
        open={!!viewId}
        onOpenChange={(v) => !v && setViewId(null)}
        categoryId={viewId}
      />

      <EditCategoryModal
        open={!!editItem}
        onOpenChange={(v) => !v && setEditItem(null)}
        category={editItem}
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
