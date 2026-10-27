import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Terms & Conditions — Gadget Doctor East Kilbride",
  description:
    "Terms and conditions for repair services provided by Gadget Doctor East Kilbride. Read our repair terms, warranty policy, collection terms and data retention rules before booking.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

/**
 * /terms — Terms & Conditions page.
 *
 * Static server-rendered page (not part of the SPA) so it gets its own
 * pre-rendered HTML with proper SEO metadata. Linked from the footer.
 */
export default function TermsPage() {
  const sections: { heading: string; body: string[] }[] = [
    {
      heading: "Repair Estimates",
      body: [
        "A free repair estimate is only applicable if you choose to have the phone or device repaired or serviced, or if you do not wish to have the device back or leave for recycling.",
        "If you do not want to have the phone or device repaired a £25 fee will be levied.",
        "Repairing or attempting a repair can cause the device not to power on under certain conditions, all repair works attempts and parts are non refundable.",
      ],
    },
    {
      heading: "Repair Ticket & Collection",
      body: [
        "A repair ticket will be provided which must be retained for collection.",
        "Your device may be sent to our level 2 repair lab for further diagnostics and also repair, in this case the work will not be carried out until you the customer have been provided with an estimate and acceptance of new cost.",
        "Un-repairable devices will be returned in same condition as received.",
      ],
    },
    {
      heading: "Device Inspection",
      body: [
        "All devices will be inspected before accepting the repair work and any marks faults cosmetic damage discs left game cards memory cards or SIM will be noted and where possible given back to yourself, as responsibility for items left inside device cannot be taken if not noted or informed of beforehand.",
      ],
    },
    {
      heading: "Liquid / Water Damage",
      body: [
        "Liquid, water, moisture damaged devices are unpredictable and deterioration of performance and functions can happen over time.",
        "All devices that have been exposed to these elements can be irreversible; we will endeavour to repair to as best of our ability but cannot provide the standard warranty upon return due to these factors.",
        "These devices may require additional parts or repairs which will be quoted to customer at time of diagnoses.",
      ],
    },
    {
      heading: "Collection & Retention",
      body: [
        "Once device is repaired you will be informed by text message that it is ready for collection.",
        "We will retain the device for maximum 30 Days and if not collected will be placed into storage off site.",
        "Unclaimed items and any devices left for longer than 90 days will be dismantled to recover costs or recycled responsibly.",
        "HDD/SSD handed in for data retrieval will be retained for maximum 90 days and then formatted or disposed of as per GDPR Regulations.",
      ],
    },
    {
      heading: "Repair Timescales",
      body: [
        "Timescales for repairs are estimates, and therefore subject to change due to outside factors.",
        "You will be given applicable updates via text message or phone call.",
      ],
    },
    {
      heading: "Liability",
      body: [
        "No liability can be taken for items not functioning when handed in, we will endeavour to repair and return working but cannot accept responsibility for these items suffering from known issues or motherboard/logic board or component failures.",
        "Gadget Doctor East Kilbride is not responsible for any data loss and for any further damage incurred through diagnoses or repair attempt.",
        "Gadget Doctor East Kilbride is not responsible for any physical damage or liquid damage that occurs after item is collected.",
      ],
    },
    {
      heading: "Warranty",
      body: [
        "30 Days warranty will be given on day of collection and expires 30 days from then.",
        "The warranty will apply to the repair carried out and any parts replaced, it does not apply to any other issues arising after, unless the replaced parts have become faulty and or fail to function as expected.",
        "Within the one-month warranty period, if your phone is repaired by a third party following our service, your warranty with us will be voided.",
      ],
    },
    {
      heading: "High-Cost Parts",
      body: [
        "High cost parts i.e. Apple MacBook LCD, newer devices etc, will require upfront payment before proceeding with agreed repair.",
        "Costs and terms will be discussed before commencing with repair.",
      ],
    },
    {
      heading: "Refunds & Exchanges",
      body: [
        "Gadget repairs will only be regarded as exchange goods if they are found to be faulty within the one month warranty period.",
        "Gadget Doctor is not obligated to refund or exchange items that have not been deemed defective.",
        "For both brand new and used phones, there is no policy allowing for a change of mind.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header band */}
      <header className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Legal
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Terms and conditions for repair services provided by{" "}
            {BRAND.fullName}. By handing in your device for repair or estimate
            you certify that you are the rightful owner and that you agree and
            understand the following terms.
          </p>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold text-foreground">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-sm leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-xl border border-border bg-card/50 p-8 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            Ready to book your repair?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse our services or get in touch with the workshop.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/services">Browse Services</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/">
                <Home className="size-4" />
                Home
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {BRAND.fullName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
