"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { CreatePickupLocationPayload } from "@/types/pickup";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit?: (data: CreatePickupLocationPayload) => void;
  submitting?: boolean;
}

export function AddPickupLocationModal({ open, onOpenChange, onSubmit, submitting = false }: Props) {
  const [name,      setName]      = useState("");
  const [address,   setAddress]   = useState("");
  const [latitude,  setLatitude]  = useState("");
  const [longitude, setLongitude] = useState("");
  const [isActive,  setIsActive]  = useState(false);

  const reset = () => {
    setName(""); setAddress(""); setLatitude(""); setLongitude(""); setIsActive(false);
  };

  useEffect(() => { if (open) reset(); }, [open]);

  const isValid = name.trim() && address.trim() && latitude.trim() && longitude.trim();

  const handleConfirm = () => {
    if (!isValid || submitting) return;
    onSubmit?.({
      name: name.trim(),
      address: address.trim(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      is_active: isActive,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && !submitting) { reset(); onOpenChange(v); } }}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-xl font-bold text-slate-800">Add Pickup Location</DialogTitle>
          <p className="text-sm text-slate-400">Fill in the location details below</p>
        </DialogHeader>

        <div className="space-y-4 mt-5">
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Name <span className="text-red-400">*</span></Label>
            <Input
              placeholder="e.g. Dubai Marina Mall Store"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className="h-11 border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Address <span className="text-red-400">*</span></Label>
            <Input
              placeholder="e.g. Ground Floor, Dubai Marina Mall"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={submitting}
              className="h-11 border-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-600">Latitude <span className="text-red-400">*</span></Label>
              <Input
                placeholder="e.g. 25.0780"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                disabled={submitting}
                className="h-11 border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-slate-600">Longitude <span className="text-red-400">*</span></Label>
              <Input
                placeholder="e.g. 55.1400"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                disabled={submitting}
                className="h-11 border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Status</Label>
            <Select value={isActive ? "true" : "false"} onValueChange={(v) => setIsActive(v === "true")} disabled={submitting}>
              <SelectTrigger className="h-11 border-slate-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {isActive && (
              <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-1">
                Setting this as active will deactivate the current active location.
              </p>
            )}
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
            disabled={submitting || !isValid}
          >
            {submitting
              ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>)
              : "Save Location"
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
