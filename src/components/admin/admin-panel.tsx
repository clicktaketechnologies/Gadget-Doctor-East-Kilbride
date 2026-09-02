"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { AdminLogin } from "./admin-login";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { Overview } from "./overview";
import { BookingsManager } from "./bookings-manager";
import { ServicesCMS } from "./services-cms";
import { ReviewsManager } from "./reviews-manager";
import { ContentManager } from "./content-manager";
import { BrandingManager } from "./branding-manager";
import { BlogManager } from "./blog-manager";
import { PagesEditor } from "./pages-editor";
import { EmailSettings } from "./email-settings";

export function AdminPanel() {
  const adminToken = useAppStore((s) => s.adminToken);
  const adminModule = useAppStore((s) => s.adminModule);
  const setAdminModule = useAppStore((s) => s.setAdminModule);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  if (!adminToken) {
    return <AdminLogin />;
  }

  const handleSearchChange = (v: string) => {
    setGlobalSearch(v);
    if (v && adminModule !== "bookings") {
      setAdminModule("bookings");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <AdminSidebar
        mobileOpen={mobileNavOpen}
        onMobileOpenChange={setMobileNavOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          onMenuClick={() => setMobileNavOpen(true)}
          search={globalSearch}
          onSearchChange={handleSearchChange}
        />

        <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
          {adminModule === "overview" && <Overview />}
          {adminModule === "bookings" && (
            <BookingsManager
              search={globalSearch}
              onSearchChange={setGlobalSearch}
            />
          )}
          {adminModule === "services" && <ServicesCMS />}
          {adminModule === "reviews" && <ReviewsManager />}
          {adminModule === "content" && <ContentManager />}
          {adminModule === "branding" && <BrandingManager />}
          {adminModule === "blog" && <BlogManager />}
          {adminModule === "pages" && <PagesEditor />}
          {adminModule === "email" && <EmailSettings />}
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;
