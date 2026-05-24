"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

interface HeaderProps {
  user?: { name?: string; image?: string };
  onMenuClick?: () => void;
}

function getInitials(name?: string): string {
  if (!name) return "A";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const initials = getInitials(user?.name);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <Menu className="h-5 w-5 text-slate-600" />
        </button>
        <Link href="/">
          <img
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </Link>
      </div>

      <div className="flex items-center gap-2.5">
        {user?.image ? (
          <img
            src={user.image}
            alt={user.name ?? "Admin"}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-200 bg-slate-100"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-[#D13D3D] flex items-center justify-center ring-2 ring-red-100 shrink-0">
            <span className="text-xs font-bold text-white">{initials}</span>
          </div>
        )}
        <div className="hidden sm:flex flex-col">
          <span className="text-sm font-semibold text-slate-700 leading-tight">
            {user?.name ?? "Admin"}
          </span>
          <span className="text-[11px] text-slate-400 leading-tight">Administrator</span>
        </div>
      </div>
    </header>
  );
}
