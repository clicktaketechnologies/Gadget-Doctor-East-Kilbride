"use client";

import { Phone, CalendarCheck, MessageCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { useBranding } from "@/lib/api-hooks";
import { BRAND } from "@/lib/brand";

interface CtaBandProps {
  title?: string;
  subtitle?: string;
  /** When true, primary button label switches to "Book This Repair" (used on detail pages). */
  bookLabel?: string;
}

/**
 * Reusable conversion band rendered at the bottom of every public page.
 * Provides Book Repair (primary red), Call Now (outline), WhatsApp (outline).
 */
export function CtaBand({
  title = "Ready to get your gadget fixed?",
  subtitle = "Book a repair in under 60 seconds — we'll handle the rest. Same-day service, 12-month warranty, honest pricing.",
  bookLabel = "Book Your Repair",
}: CtaBandProps) {
  const openBooking = useAppStore((s) => s.openBooking);
  const { data: branding } = useBranding();
  const phone = branding?.phone ?? BRAND.phones[0];
  const whatsapp = branding?.whatsapp ?? BRAND.whatsapp;
  const phoneDigits = phone.replace(/\s+/g, "");
  const whatsappDigits = whatsapp.replace(/[^\d+]/g, "").replace(/^\+/, "");

  return (
    <section className="relative py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-8 sm:p-12"
        >
          <div className="pointer-events-none absolute -left-16 -top-16 size-72 rounded-full bg-primary/15 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 size-72 rounded-full bg-accent/10 blur-[100px]" />
          <div className="relative grid items-center gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {title}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {subtitle}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              <Button
                onClick={() => openBooking()}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/25"
              >
                <CalendarCheck className="size-5" />
                {bookLabel}
              </Button>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary/30 bg-background/40 text-foreground hover:border-primary/60 hover:bg-primary/10"
                >
                  <a href={`tel:${phoneDigits}`}>
                    <Phone className="size-4 text-primary" />
                    Call Now
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-accent/30 bg-background/40 text-foreground hover:border-accent/60 hover:bg-accent/10"
                >
                  <a
                    href={`https://wa.me/${whatsappDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="size-4 text-accent" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
          <div className="relative mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowRight className="size-3.5 text-primary" />
            <span>{phone}</span>
            <span className="mx-1">·</span>
            <span>East Kilbride workshop</span>
            <span className="mx-1">·</span>
            <span>12-month warranty on every repair</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CtaBand;
