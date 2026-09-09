"use client";

import { useEffect } from "react";

const RENDER_URL = "https://gadget-doctor-east-kilbride.onrender.com/admin";

export default function SuperAdminPage() {
  useEffect(() => {
    // Always redirect to the Render admin (the admin dashboard needs
    // server-side API access which only Render provides).
    const host = window.location.hostname;
    if (
      host.includes("web.app") ||
      host.includes("firebaseapp.com") ||
      host.includes("gadgetdoctorls.co.uk") ||
      host.includes("onrender.com")
    ) {
      window.location.replace(RENDER_URL);
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
      <p className="text-sm">Redirecting to admin…</p>
    </div>
  );
}
