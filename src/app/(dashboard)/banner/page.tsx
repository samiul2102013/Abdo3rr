"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Pencil, Loader2, ImageIcon } from "lucide-react";
import { AddBannerModal, EditBannerModal } from "@/components/dashboard/modals/AddBannerModal";
import { bannerService } from "@/services/banner-service";
import { Banner, CreateBannerPayload, UpdateBannerPayload } from "@/types/banner";

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

// ── Skeleton Cards ────────────────────────────────────────────────────────────
function BannerSkeleton() {
  return (
    <>
      {[1, 2, 3].map((n) => (
        <div key={n} className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="h-44 w-full bg-slate-100 animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
            <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </>
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
          <DialogTitle className="text-xl font-bold text-slate-800">Delete Banner</DialogTitle>
          <p className="text-sm text-slate-400 mt-1">Are you sure you want to delete this banner? This action cannot be undone.</p>
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
export default function BannerPage() {
  const [banners,  setBanners]  = useState<Banner[]>([]);
  const [loading,  setLoading]  = useState(true);

  const [addOpen,       setAddOpen]       = useState(false);
  const [editBanner,    setEditBanner]    = useState<Banner | null>(null);
  const [deleteBanner,  setDeleteBanner]  = useState<Banner | null>(null);

  const [addSubmitting,    setAddSubmitting]    = useState(false);
  const [editSubmitting,   setEditSubmitting]   = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const [toast, setToast] = useState<{ open: boolean; message: string; type: "success" | "error" }>({
    open: false, message: "", type: "success",
  });
  const showToast  = useCallback((message: string, type: "success" | "error") => setToast({ open: true, message, type }), []);
  const closeToast = useCallback(() => setToast((p) => ({ ...p, open: false })), []);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const res = await bannerService.getBanners();
      if (res.success && Array.isArray(res.data)) {
        setBanners(res.data);
      } else {
        showToast(res.message || "Failed to load banners.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while loading banners.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const handleAdd = async (payload: CreateBannerPayload) => {
    try {
      setAddSubmitting(true);
      const res = await bannerService.createBanner(payload);
      if (res.success && res.data) {
        setBanners((prev) => [res.data, ...prev]);
        showToast("Banner created successfully!", "success");
        setAddOpen(false);
      } else {
        showToast(res.message || "Failed to create banner.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while creating.", "error");
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleEdit = async (id: number, payload: UpdateBannerPayload) => {
    try {
      setEditSubmitting(true);
      const res = await bannerService.updateBanner(id, payload);
      if (res.success && res.data) {
        setBanners((prev) => prev.map((b) => b.id === id ? res.data : b));
        showToast("Banner updated successfully!", "success");
        setEditBanner(null);
      } else {
        showToast(res.message || "Failed to update banner.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "An error occurred while updating.", "error");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteBanner) return;
    try {
      setDeleteSubmitting(true);
      const res = await bannerService.deleteBanner(deleteBanner.id);
      if (res.success) {
        setBanners((prev) => prev.filter((b) => b.id !== deleteBanner.id));
        showToast("Banner deleted successfully!", "success");
        setDeleteBanner(null);
      } else {
        showToast(res.message || "Failed to delete banner.", "error");
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
          <h1 className="text-xl font-semibold text-slate-800">Banner</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage promotional banners</p>
        </div>
        <Button
          className="h-9 gap-1.5 text-sm font-medium bg-[#D13D3D] hover:bg-[#b93333] text-white shadow-sm w-full sm:w-auto cursor-pointer"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="h-4 w-4" /> Add New Banner
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <BannerSkeleton />
        </div>
      ) : banners.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center justify-center py-24">
          <div className="text-center">
            <ImageIcon className="h-10 w-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No banners yet.</p>
            <Button
              className="mt-3 h-9 gap-1.5 text-sm bg-[#D13D3D] hover:bg-[#b93333] text-white cursor-pointer"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="h-4 w-4" /> Add Banner
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow animate-in fade-in duration-200"
            >
              {/* Image */}
              <div className="relative h-44 w-full bg-slate-100">
                {banner.image ? (
                  <img src={banner.image} alt={banner.headline ?? "Banner"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-slate-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {/* Active badge */}
                <span className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  banner.is_active ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"
                }`}>
                  {banner.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800 leading-snug truncate">
                      {banner.headline ?? <span className="text-slate-400 italic">No headline</span>}
                    </h3>
                    {banner.tagline && (
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{banner.tagline}</p>
                    )}
                  </div>
                  {/* Action buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditBanner(banner)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#D13D3D] hover:bg-red-50 transition-colors cursor-pointer"
                      title="Edit banner"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteBanner(banner)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete banner"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {banner.call_to_action && (
                  <Button
                    size="sm"
                    className="mt-3 h-7 text-xs bg-[#D13D3D] hover:bg-[#b93333] text-white px-4 rounded-lg pointer-events-none"
                  >
                    {banner.call_to_action}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddBannerModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
        submitting={addSubmitting}
      />

      <EditBannerModal
        open={!!editBanner}
        onOpenChange={(v) => !v && setEditBanner(null)}
        banner={editBanner}
        onSubmit={handleEdit}
        submitting={editSubmitting}
      />

      <ConfirmDeleteModal
        open={!!deleteBanner}
        onOpenChange={(v) => !v && setDeleteBanner(null)}
        onConfirm={handleConfirmDelete}
        deleting={deleteSubmitting}
      />
    </div>
  );
}
