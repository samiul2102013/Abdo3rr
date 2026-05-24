"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2, ImageIcon } from "lucide-react";
import { Banner, CreateBannerPayload, UpdateBannerPayload } from "@/types/banner";
import { Input } from "@/components/ui/input";

// ── Add Modal ─────────────────────────────────────────────────────────────────
interface AddProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit?: (data: CreateBannerPayload) => void;
  submitting?: boolean;
}

export function AddBannerModal({ open, onOpenChange, onSubmit, submitting = false }: AddProps) {
  const [headline,     setHeadline]     = useState("");
  const [tagline,      setTagline]      = useState("");
  const [isActive,     setIsActive]     = useState(true);
  const [imageFile,    setImageFile]    = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => { 
    setHeadline("");
    setTagline("");
    setIsActive(true); 
    setImageFile(null); 
    setImagePreview(null); 
  };

  useEffect(() => { if (open) reset(); }, [open]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleConfirm = () => {
    if (!imageFile || submitting) return;
    onSubmit?.({ 
      image: imageFile, 
      headline: headline.trim(),
      tagline: tagline.trim(),
      is_active: isActive 
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && !submitting) { reset(); onOpenChange(v); } }}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-xl font-bold text-slate-800">Add New Banner</DialogTitle>
          <p className="text-sm text-slate-400">Upload a banner image and details</p>
        </DialogHeader>
        <div className="space-y-4 mt-5">
          {/* Headline */}
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Headline (Name)</Label>
            <Input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              disabled={submitting}
              placeholder="Summer Sale 2024"
              className="h-11 border-slate-200"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Tagline (Title)</Label>
            <Input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              disabled={submitting}
              placeholder="Up to 50% off on all products"
              className="h-11 border-slate-200"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Banner Image <span className="text-red-400">*</span></Label>
            <div
              onClick={() => !submitting && fileRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-2 h-40 rounded-xl border-2 border-dashed transition-colors overflow-hidden ${
                submitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-[#D13D3D] hover:bg-red-50/30"
              } ${imagePreview ? "border-slate-200" : "border-slate-200"}`}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-slate-400" />
                  <p className="text-xs text-slate-400 text-center">
                    Click to upload image<br />
                    <span className="text-[11px]">PNG, JPG or WEBP (max. 5MB)</span>
                  </p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={submitting} />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Status</Label>
            <Select value={isActive ? "true" : "false"} onValueChange={(v) => setIsActive(v === "true")} disabled={submitting}>
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
            disabled={submitting || !imageFile}
          >
            {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</>) : "Save Banner"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
interface EditProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  banner: Banner | null;
  onSubmit?: (id: number, payload: UpdateBannerPayload) => void;
  submitting?: boolean;
}

export function EditBannerModal({ open, onOpenChange, banner, onSubmit, submitting = false }: EditProps) {
  const [headline, setHeadline] = useState("");
  const [tagline, setTagline] = useState("");

  useEffect(() => {
    if (banner) {
      setHeadline(banner.headline ?? "");
      setTagline(banner.tagline ?? "");
    }
  }, [banner]);

  const handleConfirm = () => {
    if (!banner || submitting) return;
    onSubmit?.(banner.id, { 
      headline: headline.trim(),
      tagline: tagline.trim()
    });
  };

  if (!banner) return null;
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && !submitting) onOpenChange(v); }}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-xl font-bold text-slate-800">Edit Banner</DialogTitle>
          <p className="text-sm text-slate-400">Update the banner details</p>
        </DialogHeader>

        {/* Current image preview */}
        {banner.image && (
          <div className="mt-4 rounded-xl overflow-hidden h-36 bg-slate-100 border border-slate-200">
            <img src={banner.image} alt="banner" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="space-y-4 mt-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Headline (Name)</Label>
            <Input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              disabled={submitting}
              placeholder="Summer Sale 2024"
              className="h-11 border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Tagline (Title)</Label>
            <Input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              disabled={submitting}
              placeholder="Up to 50% off"
              className="h-11 border-slate-200"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1 border-slate-200"
            onClick={() => { if (!submitting) onOpenChange(false); }}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#D13D3D] hover:bg-[#b93333] text-white"
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
