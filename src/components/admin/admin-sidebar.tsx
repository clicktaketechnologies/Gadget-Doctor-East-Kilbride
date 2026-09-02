"use client";

import {
  LayoutDashboard,
  Wrench,
  Settings,
  Star,
  MessageSquare,
  LogOut,
  Globe,
  Palette,
  FileText,
  FileEdit,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppStore, type AdminModule } from "@/lib/store";
import { ADMIN_DEMO } from "@/lib/brand";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface NavItem {
  id: AdminModule;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: Wrench },
  { id: "services", label: "Services & Pricing", icon: Settings },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "content", label: "Content", icon: MessageSquare },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "pages", label: "Pages", icon: FileEdit },
  { id: "email", label: "Email", icon: Mail },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

export function AdminSidebar({ mobileOpen, onMobileOpenChange }: AdminSidebarProps) {
  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-border/60 bg-sidebar/40 lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sheet */}
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent
          side="left"
          className="w-[280px] border-r border-border/60 bg-sidebar p-0"
        >
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <SidebarContent onNavigate={() => onMobileOpenChange(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const adminModule = useAppStore((s) => s.adminModule);
  const setAdminModule = useAppStore((s) => s.setAdminModule);
  const clearAdminAuth = useAppStore((s) => s.clearAdminAuth);
  const adminName = useAppStore((s) => s.adminName);

  const displayName = adminName ?? ADMIN_DEMO.name;
  const initials = displayName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-border/60 px-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
          <Wrench className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-foreground">
            Gadget Doctor
          </div>
          <div className="truncate text-[11px] uppercase tracking-wider text-primary">
            Admin Console
          </div>
        </div>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-3" aria-label="Admin navigation">
          <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Workspace
          </div>
          {NAV_ITEMS.map((item) => {
            const active = adminModule === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setAdminModule(item.id);
                  onNavigate?.();
                }}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "border-l-2 border-primary bg-primary/10 text-primary"
                    : "border-l-2 border-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0 transition-colors",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer: user + actions */}
      <div className="border-t border-border/60 p-3">
        <div className="mb-3 flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary ring-1 ring-primary/30">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-foreground">
              {displayName}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {ADMIN_DEMO.email}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onNavigate?.();
            router.push("/");
          }}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <Globe className="size-4" />
          View Public Site
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clearAdminAuth();
          }}
          className="mt-1 w-full justify-start text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}

export default AdminSidebar;
