"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Upload,
} from "lucide-react";
import { useSession } from "next-auth/react";

const getSidebarNavItems = (role?: string) => {
  const items = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Karya Ilmiah",
      href: "/dashboard/publications",
      icon: FileText,
    },
    {
      title: "Upload Karya",
      href: "/dashboard/publications/new",
      icon: Upload,
    },
  ];

  if (role === "ADMIN") {
    items.push({
      title: "Manajemen User",
      href: "/dashboard/users",
      icon: Users,
    });
    items.push({
      title: "Pengaturan",
      href: "/dashboard/settings",
      icon: Settings,
    });
  }

  return items;
};

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const sidebarNavItems = getSidebarNavItems(session?.user?.role);

  return (
    <nav className="flex flex-col space-y-1 w-full lg:w-64 bg-card border-r min-h-[calc(100vh-4rem)] p-4 shadow-sm">
      <div className="mb-8 px-4">
        <h2 className="text-xl font-bold tracking-tight text-primary">
          Admin Panel
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {session?.user?.role === "ADMIN" ? "Administrator" : "Dosen"}
        </p>
      </div>
      {sidebarNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            (item.href === "/dashboard" ? pathname === "/dashboard" : (pathname === item.href || pathname.startsWith(item.href + '/')))
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
