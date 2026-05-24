import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, X, Upload } from "lucide-react";
import { CreateProductPayload } from "@/types/product";
import { subcategoryService } from "@/services/subcategory-service";
import { cutTypeService } from "@/services/cut-type-service";
import { packagingService } from "@/services/packaging-service";
import { Subcategory, Category } from "@/types/category";
import { CutType } from "@/types/cut-type";
import { PackagingType } from "@/types/packaging";
import { Badge } from "@/components/ui/badge";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit?: (data: CreateProductPayload) => void;
  submitting?: boolean;
  categories: Category[];
}

export function AddProductModal({ open, onOpenChange, onSubmit, submitting = false, categories }: Props) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notesEnabled, setNotesEnabled] = useState(false);
  const [status, setStatus] = useState(true);
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

  const handleCategoryChange = (val: string) => {
    setCategoryId(val);
    setSubcategoryId("");
  };

  const reset = () => {
    setName("");
    setCategoryId("");
    setSubcategoryId("");
    setPrice("");
    setStock("");
    setDescription("");
    setImage(null);
    setImagePreview(null);
    setNotesEnabled(false);
    setStatus(true);
    setSelectedCutType("");
    setSelectedPackagingType("");
  };

  useEffect(() => {
    if (open) reset();
  }, [open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (!name.trim() || !categoryId || !price || submitting) return;
    const payload: CreateProductPayload = {
      name: name.trim(),
      category_id: Number(categoryId),
      price,
      subcategory_id: subcategoryId ? Number(subcategoryId) : null,
      ...(description.trim() && { description: description.trim() }),
      ...(stock && { initial_stock: Number(stock) }),
      image,
      notes_enabled: notesEnabled,
      status,
      cut_type_ids: selectedCutType ? Number(selectedCutType) : undefined,
      packaging_type_ids: selectedPackagingType ? Number(selectedPackagingType) : undefined,
    };
    onSubmit?.(payload);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && !submitting) { reset(); onOpenChange(v); } }}>
      <DialogContent className="sm:max-w-2xl rounded-2xl p-6 gap-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-xl font-bold text-slate-800">Add New Product</DialogTitle>
          <p className="text-sm text-slate-400">Fill in the product details</p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-600">Name</Label>
              <Input
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
                className="h-11 border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-slate-600">Category</Label>
                <Select value={categoryId} onValueChange={handleCategoryChange} disabled={submitting}>
                  <SelectTrigger className="h-11 border-slate-200">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-slate-600">Subcategory</Label>
                <Select value={subcategoryId} onValueChange={setSubcategoryId} disabled={submitting || !categoryId}>
                  <SelectTrigger className="h-11 border-slate-200">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubcategories.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-slate-600">Price (﷼)</Label>
                <Input
                  placeholder="0.00"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={submitting}
                  className="h-11 border-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-slate-600">Initial Stock</Label>
                <Input
                  placeholder="0"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  disabled={submitting}
                  className="h-11 border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-slate-600">Description</Label>
              <textarea
                placeholder="Enter product description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitting}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-background px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#D13D3D] disabled:opacity-50"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="notes_enabled"
                  checked={notesEnabled}
                  onChange={(e) => setNotesEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#D13D3D]"
                />
                <Label htmlFor="notes_enabled" className="text-sm text-slate-600 cursor-pointer">Enable Notes</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="status"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  className="w-4 h-4 accent-[#D13D3D]"
                />
                <Label htmlFor="status" className="text-sm text-slate-600 cursor-pointer">Active Status</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-600">Product Image</Label>
              <div className="relative group">
                {imagePreview ? (
                  <div className="relative h-40 w-full rounded-xl overflow-hidden border border-slate-200">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => { setImage(null); setImagePreview(null); }}
                      className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white text-red-500 shadow-sm"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-40 w-full rounded-xl border-2 border-dashed border-slate-200 hover:border-[#D13D3D]/50 hover:bg-slate-50 transition-all cursor-pointer">
                    <Upload className="h-8 w-8 text-slate-300 mb-2" />
                    <span className="text-xs text-slate-400">Click to upload image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-slate-600">Cut Type</Label>
              <Select value={selectedCutType} onValueChange={setSelectedCutType} disabled={submitting}>
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
              <Select value={selectedPackagingType} onValueChange={setSelectedPackagingType} disabled={submitting}>
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
          <Button
            variant="outline"
            className="flex-1 border-slate-200"
            onClick={() => { if (!submitting) { reset(); onOpenChange(false); } }}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#D13D3D] hover:bg-[#b93333] text-white"
            onClick={handleConfirm}
            disabled={submitting || !name.trim() || !categoryId || !price}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Save Product"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
