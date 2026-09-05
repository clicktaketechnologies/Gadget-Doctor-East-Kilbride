import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { FirebaseAnalytics } from "@/components/firebase-analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gadget Doctor East Kilbride — Fast & Reliable Electronics Repair",
  description:
    "Expert phone, laptop, MacBook, console and GHD repairs in East Kilbride. 4.6★ rated, doorstep collection service available. Book your repair today.",
  keywords: [
    "phone repair East Kilbride",
    "iPhone repair Glasgow",
    "MacBook repair",
    "PS5 repair",
    "console repair",
    "GHD repair",
    "data recovery",
  ],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Gadget Doctor East Kilbride",
    description: "Fast & Reliable Electronics Repair in East Kilbride",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Firebase Analytics — initialises on the client */}
        <FirebaseAnalytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
