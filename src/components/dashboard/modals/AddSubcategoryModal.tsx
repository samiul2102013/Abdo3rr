"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Category, CreateSubcategoryPayload } from "@/types/category";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit?: (data: CreateSubcategoryPayload) => void;
  submitting?: boolean;
  categories: Category[];
}

export function AddSubcategoryModal({ open, onOpenChange, onSubmit, submitting = false, categories }: Props) {
  const [name,       setName]       = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status,     setStatus]     = useState(true);
  const [icon,       setIcon]       = useState<File | null>(null);

  const reset = () => { setName(""); setCategoryId(""); setStatus(true); setIcon(null); };

  useEffect(() => { if (open) reset(); }, [open]);

  const handleConfirm = () => {
    if (!name.trim() || !categoryId || submitting) return;
    onSubmit?.({ name: name.trim(), category: Number(categoryId), status, ...(icon && { icon }) });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && !submitting) { reset(); onOpenChange(v); } }}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-xl font-bold text-slate-800">Add New Sub-Category</DialogTitle>
          <p className="text-sm text-slate-400">Fill in the details below</p>
        </DialogHeader>
        <div className="space-y-4 mt-5">
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Name <span className="text-red-400">*</span></Label>
            <Input
              placeholder="Enter sub-category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className="h-11 border-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Parent Category <span className="text-red-400">*</span></Label>
            <Select value={categoryId} onValueChange={setCategoryId} disabled={submitting}>
              <SelectTrigger className="h-11 border-slate-200">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Icon</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setIcon(e.target.files?.[0] || null)}
              disabled={submitting}
              className="border-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Status</Label>
            <Select value={status ? "true" : "false"} onValueChange={(v) => setStatus(v === "true")} disabled={submitting}>
              <SelectTrigger className="h-11 border-slate-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
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
            disabled={submitting || !name.trim() || !categoryId}
          >
            {submitting
              ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>)
              : "Create Sub-Category"
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
