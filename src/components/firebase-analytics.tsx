"use client";

import { useEffect } from "react";
import { getFirebaseAnalytics } from "@/lib/firebase";

/**
 * Mounts once on the client and initialises Firebase Analytics.
 * Renders nothing — it's a side-effect-only component placed in <head>.
 */
export function FirebaseAnalytics() {
  useEffect(() => {
    // Initialise analytics in the browser. Errors are swallowed so a
    // failed analytics init never breaks the actual website.
    getFirebaseAnalytics().catch(() => {});
  }, []);

  return null;
}
