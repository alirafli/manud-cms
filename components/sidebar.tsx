"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Mountain, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/wisata", label: "Wisata", icon: Mountain },
  { href: "/umkm", label: "UMKM", icon: Store },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 shrink-0 border-r bg-sidebar">
      <div className="flex h-dvh flex-col gap-2 p-4 w-full">
        <div className="px-2 py-1">
          <Link href="/dashboard" className="block">
            <span className="text-xl font-semibold tracking-tight">
              Manud Jaya CMS
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">Admin Panel</p>
        </div>

        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className="block">
                <Button
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    active && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto text-xs text-muted-foreground px-2">
          <p>© {new Date().getFullYear()} Simple CMS</p>
        </div>
      </div>
    </aside>
  );
}
