"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Settings, Tag, ShoppingCart,
  ShoppingBag, Warehouse, ImageIcon, Users, LogOut, BoxSelect, X, Layers, MapPin, Scissors
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/header";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";

const navItems = [
  { label: "Dashboard",      href: "/",               icon: LayoutDashboard },
  { label: "Categories",     href: "/categories",     icon: Tag             },
  { label: "Sub-Categories", href: "/subcategories",  icon: Layers          },
  { label: "Packaging Type", href: "/packaging-type", icon: BoxSelect       },
  { label: "Cut Type",       href: "/cut-type",       icon: Scissors        },
  { label: "Inventory",      href: "/inventory",      icon: Warehouse       },
  { label: "Customers",      href: "/customers",      icon: Users           },
  { label: "Products",       href: "/products",       icon: ShoppingBag     },
  { label: "Orders",         href: "/orders",         icon: ShoppingCart    },
  { label: "Pickup Location",href: "/pickup-locations", icon: MapPin        },
  { label: "Banner",         href: "/banner",         icon: ImageIcon       },
  { label: "Settings",       href: "/settings",       icon: Settings        },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <nav className="flex h-full flex-col justify-between py-6 px-3">
      <div className="space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium",
                isActive
                  ? "bg-[#D13D3D] text-white shadow-sm shadow-red-200"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </div>
      <button
        onClick={() => { logout(); onClose?.(); }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#D13D3D] hover:bg-red-50 transition-colors cursor-pointer"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </nav>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D13D3D] border-t-transparent" />
          <p className="text-sm font-medium text-slate-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.name || user.email.split("@")[0];

  const avatarUrl = user.profile_picture ?? null;

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Header
        user={{ name: displayName, image: avatarUrl ?? undefined }}
        onMenuClick={() => setMobileOpen(true)}
      />

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 z-50 bg-white shadow-2xl transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100">
          <span className="font-semibold text-slate-800">Menu</span>
          <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      <aside className="hidden md:block fixed top-16 left-0 h-[calc(100vh-64px)] w-56 border-r border-slate-100 bg-white z-30">
        <SidebarContent />
      </aside>

      <main className="md:ml-56 pt-16 min-h-screen">
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
