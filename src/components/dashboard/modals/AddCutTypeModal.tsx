"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit?: (data: { name: string; status: boolean }) => void;
  submitting?: boolean;
}

export function AddCutTypeModal({ open, onOpenChange, onSubmit, submitting = false }: Props) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<boolean>(true);

  const reset = () => {
    setName("");
    setStatus(true);
  };


  const handleConfirm = () => {
    if (!name.trim() || submitting) return;
    onSubmit?.({ name: name.trim(), status });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && !submitting) { reset(); onOpenChange(v); } }}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 gap-0">
        <DialogHeader className="mb-1">
          <DialogTitle className="text-xl font-bold text-slate-800">Add New Cut Type</DialogTitle>
          <p className="text-sm text-slate-400">Fill in the details below</p>
        </DialogHeader>
        <div className="space-y-4 mt-5">
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Cut Type</Label>
            <Input
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className="h-11 border-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-slate-600">Status</Label>
            <Select
              value={status ? "Active" : "Inactive"}
              onValueChange={(v) => setStatus(v === "Active")}
              disabled={submitting}
            >
              <SelectTrigger className="h-11 w-full border-slate-200">
                <SelectValue placeholder="Select one" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
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
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Type"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
