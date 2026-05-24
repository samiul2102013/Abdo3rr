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
import {
  Search, Plus, ChevronDown, Eye, Pencil, Trash2,
  Package, Tag, Hash, Loader2, Upload, X,
} from "lucide-react";
import { AddProductModal } from "@/components/dashboard/modals/AddProductModal";
import { productService } from "@/services/product-service";
import { subcategoryService } from "@/services/subcategory-service";
import { cutTypeService } from "@/services/cut-type-service";
import { packagingService } from "@/services/packaging-service";
import { categoryService } from "@/services/category-service";
import { Product, ProductDetail, ProductCategory, CreateProductPayload, UpdateProductPayload } from "@/types/product";
import { Category, Subcategory } from "@/types/category";
import { CutType } from "@/types/cut-type";
import { PackagingType } from "@/types/packaging";
import { Badge } from "@/components/ui/badge";

// ── Toast ────────────────────────────────────────────────────────────────────
function ToastNotification({ message, type, open, onClose }: {
  message: string; type: "success" | "error"; open: boolean; onClose: () => void;
}) {
  useEffect(() => {
    if (open) {
      const t = setTimeout(onClose, 4000);
      return () => clearTimeout(t);
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

// ── Skeleton ─────────────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((n) => (
        <TableRow key={n} className="border-slate-50">
          <TableCell className="pl-5 py-4"><div className="h-4 w-36 bg-slate-100 rounded animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-4 w-20 bg-slate-100 rounded animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-4 w-24 bg-slate-100 rounded animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" /></TableCell>
          <TableCell className="py-4"><div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

// ── View Modal ────────────────────────────────────────────────────────────────
function ViewProductModal({ open, onOpenChange, productId }: {
  open: boolean; onOpenChange: (v: boolean) => void; productId: number | null;
}) {
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !productId) return;
    setLoading(true);
    productService.getProductById(productId)
      .then((res) => { if (res.success && res.data) setDetail(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, productId]);

  useEffect(() => {
    if (!open) setDetail(null);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-2xl p-6 gap-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-slate-800">Product Details</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#D13D3D]" />
          </div>
        ) : detail ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {detail.image ? (
                  <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100">
                    <img src={detail.image} alt={detail.name} className="w-full h-full object-cover" />
                    <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                      detail.status ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"
                    }`}>{detail.status ? "Active" : "Inactive"}</span>
                  </div>
                ) : (
                  <div className="h-64 w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center">
                    <Package className="h-16 w-16 text-slate-200" />
                  </div>
                )}
                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{detail.name}</h3>
                  <p className="text-xs font-mono text-slate-400">SKU: {detail.sku}</p>
                  {detail.description && (
                    <p className="text-sm text-slate-500 mt-3 leading-relaxed">{detail.description}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Tag, label: "Category", value: detail.category.name },
                    { icon: Tag, label: "Subcategory", value: detail.subcategory?.name || "None" },
                    { icon: Hash, label: "Price", value: `﷼${detail.price}` },
                    { icon: Package, label: "Available", value: detail.inventory?.available_stock ?? detail.stock },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="p-3.5 rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <Icon className="h-4 w-4 text-[#D13D3D] mb-1.5" />
                      <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Cut Types</p>
                    <div className="flex flex-wrap gap-2">
                      {detail.cut_types.length > 0 ? (
                        detail.cut_types.map((ct) => (
                          <span key={ct.id} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                            {ct.cut_type.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">No cut types</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Packaging Types</p>
                    <div className="flex flex-wrap gap-2">
                      {detail.packaging_types.length > 0 ? (
                        detail.packaging_types.map((pt) => (
                          <span key={pt.id} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                            {pt.packaging_type.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">No packaging types</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditProductModal({ open, onOpenChange, product, onSave, saving, categories }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: Product | null;
  onSave: (id: number, payload: UpdateProductPayload) => void;
  saving: boolean;
  categories: ProductCategory[];
}) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [notesEnabled, setNotesEnabled] = useState(false);
  const [status, setStatus] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCutType, setSelectedCutType] = useState<string>("");
  const [selectedPackagingType, setSelectedPackagingType] = useState<string>("");

  const [cutTypes, setCutTypes] = useState<CutType[]>([]);
  const [packagingTypes, setPackagingTypes] = useState<PackagingType[]>([]);
  const [loadingExtras, setLoadingExtras] = useState(false);

  useEffect(() => {
    if (open) {
      setLoadingExtras(true);
      Promise.all([
        cutTypeService.getCutTypes(),
        packagingService.getPackagingTypes()
      ]).then(([cutRes, packRes]) => {
        if (cutRes.success && Array.isArray(cutRes.data)) setCutTypes(cutRes.data);
        if (packRes.success && Array.isArray(packRes.data)) setPackagingTypes(packRes.data);
      }).finally(() => setLoadingExtras(false));
    }
  }, [open]);

  const filteredSubcategories = useMemo(() => {
    if (!categoryId) return [];
    const selectedCategory = categories.find(c => String(c.id) === String(categoryId));
    return selectedCategory?.subcategories || [];
  }, [categories, categoryId]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      const newCatId = String(product.category.id);
      const newSubCatId = product.subcategory ? String(product.subcategory.id) : "";
      
      setCategoryId(newCatId);
      setSubcategoryId(newSubCatId);
      setPrice(product.price);
      setNotesEnabled(product.notes_enabled);
      setStatus(product.status);
      setImagePreview(product.image);
      
      // Fetch full details for description and selected types
      productService.getProductById(product.id).then(res => {
        if (res.success && res.data) {
          setDescription(res.data.description || "");
          if (res.data.cut_types.length > 0) {
            setSelectedCutType(String(res.data.cut_types[0].cut_type.id));
          } else {
            setSelectedCutType("");
          }
          if (res.data.packaging_types.length > 0) {
            setSelectedPackagingType(String(res.data.packaging_types[0].packaging_type.id));
          } else {
            setSelectedPackagingType("");
          }
        }
      });
    }
  }, [product]);

  // Handle manual category change to clear subcategory
  const handleCategoryChange = (newId: string) => {
    setCategoryId(newId);
    setSubcategoryId("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!product || !name.trim() || saving) return;
    onSave(product.id, {
      name: name.trim(),
      price,
      category_id: Number(categoryId),
      subcategory_id: subcategoryId ? Number(subcategoryId) : null,
      description,
      notes_enabled: notesEnabled,
      status,
      cut_type_ids: selectedCutType ? [Number(selectedCutType)] : undefined,
      packaging_type_ids: selectedPackagingType ? [Number(selectedPackagingType)] : undefined,
      ...(image && { image }),
    });
  };

  if (!product) return null;
  return (
    <Dialog open={open} onOpenChange={(v) => !saving && onOpenChange(v)}>
      <DialogContent className="sm:max-w-2xl rounded-2xl p-6 gap-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-xl font-bold text-slate-800">Edit Product</DialogTitle>
          <p className="text-sm text-slate-400">Update product information</p>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-600">Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} disabled={saving} className="h-11 border-slate-200" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-slate-600">Category</Label>
                <Select value={categoryId} onValueChange={handleCategoryChange} disabled={saving}>
                  <SelectTrigger className="h-11 border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-slate-600">Subcategory</Label>
                <Select value={subcategoryId} onValueChange={setSubcategoryId} disabled={saving}>
                  <SelectTrigger className="h-11 border-slate-200"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {filteredSubcategories.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-600">Price (﷼)</Label>
              <Input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} disabled={saving} className="h-11 border-slate-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-600">Description</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={saving}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-background px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#D13D3D] disabled:opacity-50"
              />
            </div>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="edit_notes_enabled" checked={notesEnabled} onChange={(e) => setNotesEnabled(e.target.checked)} className="w-4 h-4 accent-[#D13D3D]" />
                <Label htmlFor="edit_notes_enabled" className="text-sm text-slate-600 cursor-pointer">Enable Notes</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="edit_status" checked={status} onChange={(e) => setStatus(e.target.checked)} className="w-4 h-4 accent-[#D13D3D]" />
                <Label htmlFor="edit_status" className="text-sm text-slate-600 cursor-pointer">Active Status</Label>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-600">Product Image</Label>
              <div className="relative group">
                {imagePreview ? (
                  <div className="relative h-48 w-full rounded-xl overflow-hidden border border-slate-200">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload className="h-8 w-8 text-white" />
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 w-full rounded-xl border-2 border-dashed border-slate-200 hover:border-[#D13D3D]/50 hover:bg-slate-50 transition-all cursor-pointer">
                    <Upload className="h-8 w-8 text-slate-300 mb-2" />
                    <span className="text-xs text-slate-400">Click to upload image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-slate-600">Cut Type</Label>
              <Select value={selectedCutType} onValueChange={setSelectedCutType} disabled={saving}>
                <SelectTrigger className="h-11 border-slate-200">
                  <SelectValue placeholder="Select cut type" />
                </SelectTrigger>
                <SelectContent>
                  {loadingExtras ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
                    </div>
                  ) : cutTypes.length > 0 ? (
                    cutTypes.map((ct) => (
                      <SelectItem key={ct.id} value={String(ct.id)}>{ct.name}</SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-xs text-slate-400 text-center">No cut types available</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-slate-600">Packaging Type</Label>
              <Select value={selectedPackagingType} onValueChange={setSelectedPackagingType} disabled={saving}>
                <SelectTrigger className="h-11 border-slate-200">
                  <SelectValue placeholder="Select packaging type" />
                </SelectTrigger>
                <SelectContent>
                  {loadingExtras ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
                    </div>
                  ) : packagingTypes.length > 0 ? (
                    packagingTypes.map((pt) => (
                      <SelectItem key={pt.id} value={String(pt.id)}>{pt.name}</SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-xs text-slate-400 text-center">No packaging types available</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
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
          <DialogTitle className="text-xl font-bold text-slate-800">Delete Product</DialogTitle>
          <p className="text-sm text-slate-400 mt-1">Are you sure you want to delete this product? This action cannot be undone.</p>
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
export default function ProductsPage() {
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [items, setItems]     = useState<Product[]>([]);
  const [total, setTotal]     = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  // Modal states
  const [addOpen,     setAddOpen]     = useState(false);
  const [viewId,      setViewId]      = useState<number | null>(null);
  const [editItem,    setEditItem]    = useState<Product | null>(null);
  const [deleteItem,  setDeleteItem]  = useState<Product | null>(null);

  // Submitting states
  const [addSubmitting,    setAddSubmitting]    = useState(false);
  const [editSubmitting,   setEditSubmitting]   = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ open: boolean; message: string; type: "success" | "error" }>({
    open: false, message: "", type: "success",
  });
  const showToast  = useCallback((message: string, type: "success" | "error") => setToast({ open: true, message, type }), []);
  const closeToast = useCallback(() => setToast((p) => ({ ...p, open: false })), []);

  // Fetch products and categories
  const fetchData = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        productService.getProducts(pageNum),
        categoryService.getCategories(),
      ]);

      if (prodRes.success && prodRes.data) {
        setItems(prodRes.data.results);
        setTotal(prodRes.data.total);
        setTotalPages(prodRes.data.total_pages);
      } else {
        showToast(prodRes.message || "Failed to load products.", "error");
      }

      if (catRes.success && Array.isArray(catRes.data)) {
        setCategories(catRes.data);
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while loading.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(page); }, [fetchData, page]);

  // Client-side search filter (searches within current page)
  const filtered = useMemo(
    () => items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  // Handlers
  const handleAdd = async (payload: CreateProductPayload) => {
    try {
      setAddSubmitting(true);
      const res = await productService.createProduct(payload);
      if (res.success && res.data) {
        await fetchData(page);
        showToast("Product created successfully!", "success");
        setAddOpen(false);
      } else {
        showToast(res.message || "Failed to create product.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while creating.", "error");
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleSave = async (id: number, payload: UpdateProductPayload) => {
    try {
      setEditSubmitting(true);
      const res = await productService.updateProduct(id, payload);
      if (res.success && res.data) {
        setItems((prev) => prev.map((p) => p.id === id ? { ...p, ...res.data } : p));
        showToast("Product updated successfully!", "success");
        setEditItem(null);
      } else {
        showToast(res.message || "Failed to update product.", "error");
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
      const res = await productService.deleteProduct(deleteItem.id);
      if (res.success) {
        setItems((prev) => prev.filter((p) => p.id !== deleteItem.id));
        setTotal((t) => t - 1);
        showToast("Product deleted successfully!", "success");
        setDeleteItem(null);
      } else {
        showToast(res.message || "Failed to delete product.", "error");
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
          <h1 className="text-xl font-semibold text-slate-800">Products</h1>
          <p className="text-sm text-slate-400 mt-0.5">{total} total products</p>
        </div>
        <Button
          className="h-9 gap-1.5 text-sm bg-[#D13D3D] hover:bg-[#b93333] text-white shadow-sm w-full sm:w-auto cursor-pointer"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-4 w-4" /> Add New Product
        </Button>
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
              {["Name", "SKU", "Category", "Price", "Stock", "Status", "Action"].map((h) => (
                <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wide first:pl-5 whitespace-nowrap">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-slate-400 text-sm">No products found.</TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow key={product.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors animate-in fade-in duration-200">
                  <TableCell className="pl-5 py-3.5 text-sm font-medium text-slate-700 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="h-8 w-8 rounded-lg object-cover bg-slate-100 shrink-0" />
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <Package className="h-4 w-4 text-slate-300" />
                        </div>
                      )}
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 text-xs text-slate-400 font-mono">{product.sku}</TableCell>
                  <TableCell className="py-3.5 text-sm text-slate-500">{product.category.name}</TableCell>
                  <TableCell className="py-3.5 text-sm font-medium text-slate-700">﷼{product.price}</TableCell>
                  <TableCell className="py-3.5">
                    <span className={`text-xs font-semibold ${product.stock <= 10 ? "text-red-500" : "text-slate-600"}`}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      product.status ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400"
                    }`}>
                      {product.status ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg bg-[#D13D3D] text-white hover:bg-[#b93333] transition-colors focus:outline-none cursor-pointer">
                        Action <ChevronDown className="h-3 w-3" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44 rounded-xl">
                        <DropdownMenuItem className="text-sm gap-2 cursor-pointer" onClick={() => setViewId(product.id)}>
                          <Eye className="h-3.5 w-3.5 text-slate-400" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm gap-2 cursor-pointer" onClick={() => setEditItem(product)}>
                          <Pencil className="h-3.5 w-3.5 text-slate-400" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm gap-2 cursor-pointer text-red-500 focus:text-red-500" onClick={() => setDeleteItem(product)}>
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

      {!loading && total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Page {page} of {totalPages} · {total} total products
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="h-8 text-xs border-slate-200">Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="h-8 text-xs border-slate-200">Next</Button>
          </div>
        </div>
      )}

      <AddProductModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        submitting={addSubmitting}
        categories={categories}
      />

      <ViewProductModal
        open={!!viewId}
        onOpenChange={(v) => !v && setViewId(null)}
        productId={viewId}
      />

      <EditProductModal
        open={!!editItem}
        onOpenChange={(v) => !v && setEditItem(null)}
        product={editItem}
        onSave={handleSave}
        saving={editSubmitting}
        categories={categories}
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
