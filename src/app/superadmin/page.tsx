"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuperAdminPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin");
  }, [router]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
      <p className="text-sm">Redirecting to admin…</p>
    </div>
  );
}
