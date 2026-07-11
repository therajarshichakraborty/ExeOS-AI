"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HomeIcon, MailIcon, SettingsIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: any;
}

export function SidebarNav() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      label: "Monitoring",
      href: "/monitoring",
      icon: MailIcon,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: SettingsIcon,
    },
  ];

  return (
    <nav className="flex-1 space-y-1 w-full px-3 py-4 flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link href={item.href} key={item.href} className="w-full">
            <span
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/10 text-primary dark:bg-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r bg-primary" />
              )}
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span>{item.label}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
