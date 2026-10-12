// Firebase client SDK initialization (client-side only).
// Config is public by design — Firebase config is NOT secret.
// (Security is enforced via Firebase Security Rules, not config secrecy.)
// Docs: https://firebase.google.com/docs/web/setup

import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDIN10b4rZnk1hKdO45fHBsuSuaVgBCDEI",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "gadgetdoctorls.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gadgetdoctorls",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gadgetdoctorls.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "100649969605",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:100649969605:web:d9606afdda50350f6e8dac",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-5EGH3VDTST",
};

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null; // server-side: skip
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (!app) getFirebaseApp();
  if (!app) return null;
  if (analytics) return analytics;
  const ok = await isSupported();
  if (!ok) return null;
  analytics = getAnalytics(app);
  return analytics;
}

export { firebaseConfig };
