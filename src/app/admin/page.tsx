"use client";

import { useEffect } from "react";
import AdminPanel from "@/components/admin/admin-panel";

const RENDER_URL = "https://gadget-doctor-east-kilbride.onrender.com/admin";

export default function AdminPage() {
  useEffect(() => {
    // If the admin page is loaded on Firebase (static hosting) instead of
    // Render, auto-redirect to Render. The admin dashboard needs server-side
    // API access which only Render provides.
    const host = window.location.hostname;
    if (
      host.includes("web.app") ||
      host.includes("firebaseapp.com") ||
      host.includes("gadgetdoctorls.co.uk")
    ) {
      window.location.replace(RENDER_URL);
    }
  }, []);

  return <AdminPanel />;
}
