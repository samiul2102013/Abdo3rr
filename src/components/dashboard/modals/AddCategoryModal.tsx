"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { CreateCategoryPayload } from "@/types/category";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit?: (data: CreateCategoryPayload) => void;
  submitting?: boolean;
}

export function AddCategoryModal({ open, onOpenChange, onSubmit, submitting = false }: Props) {
  const [name,     setName]     = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [status,   setStatus]   = useState(true);
  const [image,    setImage]    = useState<File | null>(null);

  const reset = () => { setName(""); setSubtitle(""); setStatus(true); setImage(null); };

  useEffect(() => { if (open) reset(); }, [open]);

  const handleConfirm = () => {
    if (!name.trim() || submitting) return;
    const payload: CreateCategoryPayload = {
      name: name.trim(),
      status,
      ...(subtitle.trim() && { subtitle: subtitle.trim() }),
      ...(image && { image }),
    };
    onSubmit?.(payload);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && !submitting) { reset(); onOpenChange(v); } }}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-xl font-bold text-slate-800">Add New Category</DialogTitle>
          <p className="text-sm text-slate-400">Fill in the details below</p>
        </DialogHeader>
        <div className="space-y-4 mt-5">
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Name <span className="text-red-400">*</span></Label>
            <Input
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className="h-11 border-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Subtitle</Label>
            <Input
              placeholder="Enter subtitle (optional)"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              disabled={submitting}
              className="h-11 border-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
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
            disabled={submitting || !name.trim()}
          >
            {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>) : "Create Category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
