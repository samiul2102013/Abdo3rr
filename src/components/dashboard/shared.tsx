// src/components/dashboard/shared.tsx
// Shared primitives reused across all pages

import { cn } from "@/lib/utils";

// ── Page Shell ─────────────────────────────────────────────────────────────
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Status Badge ────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active:     "bg-emerald-50 text-emerald-600",
    Inactive:   "bg-slate-100 text-slate-400",
    Delivered:  "bg-emerald-50 text-emerald-600",
    Processing: "bg-orange-50 text-orange-500",
    Cancel:     "bg-red-50 text-red-500",
    Pending:    "bg-yellow-50 text-yellow-600",
  };
  return (
    <span className={cn(
      "text-xs font-medium px-2.5 py-1 rounded-full",
      styles[status] ?? "bg-slate-100 text-slate-500"
    )}>
      {status}
    </span>
  );
}

// ── Table Header Row ────────────────────────────────────────────────────────
export const tableHeaderBg = { backgroundColor: "rgba(209,61,61,0.04)" };

// ── Action Dropdown Trigger ─────────────────────────────────────────────────
export function ActionTrigger() {
  return (
    <span className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg bg-[#D13D3D] text-white hover:bg-[#b93333] transition-colors focus:outline-none cursor-pointer">
      Action <span className="text-[10px]">▾</span>
    </span>
  );
}