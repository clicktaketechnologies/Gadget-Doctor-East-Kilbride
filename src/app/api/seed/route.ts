import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ADMIN_DEMO, BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";

// Idempotent seed endpoint — safe to call repeatedly
export async function POST() {
  try {
    // 0. Ensure tables exist (creates them if missing — useful on first deploy)
    await db.$executeRawUnsafe('SELECT 1');

    // 1. Admin user
    const existingAdmin = await db.adminUser.findFirst({
      where: { email: ADMIN_DEMO.email },
    });
    if (!existingAdmin) {
      await db.adminUser.create({
        data: { email: ADMIN_DEMO.email, password: ADMIN_DEMO.password, name: ADMIN_DEMO.name },
      });
    }

  // 2. Site settings singleton
  const settings = await db.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!settings) {
    await db.siteSettings.create({
      data: {
        id: "singleton",
        collectionEnabled: true,
        collectionBannerEnabled: true,
        announcementEnabled: true,
        announcementText: "Doorstep collection service available across East Kilbride & surrounding areas — book online today!",
      },
    });
  }

  // 3. Branding singleton
  const branding = await db.branding.findUnique({ where: { id: "singleton" } });
  if (!branding) {
    await db.branding.create({
      data: {
        id: "singleton",
        businessName: BRAND.fullName,
        tagline: BRAND.tagline,
        about:
          "Gadget Doctor East Kilbride is your local one-stop electronics repair shop. From cracked phone screens and dead MacBooks to PS5 HDMI ports, custom gaming PCs and Apple Watch batteries — our certified technicians fix it all with honest pricing, genuine-grade parts and a 12-month warranty on every repair. Pop into the workshop, call us, or use our free doorstep collection across East Kilbride, Busby, Eaglesham, Cambuslang, Rutherglen, Carmunnock and Giffnock.",
        logoUrl: BRAND.logoUrl,
        primaryColor: BRAND.primaryColor,
        secondaryColor: BRAND.secondaryColor,
        phone: BRAND.phones[0],
        whatsapp: BRAND.whatsapp,
        email: BRAND.email,
        website: BRAND.website,
        gmbProfile: BRAND.gmbProfile,
        mapLink: BRAND.mapLink,
        mapEmbed: BRAND.mapEmbed,
        address: BRAND.address,
        hoursJson: JSON.stringify(BRAND.hours),
        socialsJson: JSON.stringify(BRAND.socials),
        targetAreasJson: JSON.stringify(BRAND.targetAreas),
        rating: BRAND.rating,
        reviewCount: BRAND.reviewCount,
        yearsExperience: BRAND.yearsExperience,
      },
    });
  }

  // 4. Services (8 categories)
  const serviceCount = await db.service.count();
  if (serviceCount === 0) {
    const services = [
      // ---- Mobile ----
      { slug: "iphone-screen", name: "iPhone Screen Repair", category: "mobile", description: "OLED/LCD screen replacement for all iPhone models with genuine-grade parts.", icon: "Smartphone", priceFrom: 4900, priceTo: 18900, turnaround: "30-60 mins", popular: true },
      { slug: "samsung-screen", name: "Samsung Screen Repair", category: "mobile", description: "Screen replacement for Galaxy S, A and Note series.", icon: "Smartphone", priceFrom: 6900, priceTo: 21900, turnaround: "45-90 mins", popular: false },
      { slug: "pixel-screen", name: "Google Pixel Repair", category: "mobile", description: "Screen, battery and charging port fixes for Pixel 6-8.", icon: "Smartphone", priceFrom: 7900, priceTo: 19900, turnaround: "45-90 mins", popular: false },
      { slug: "phone-battery", name: "Battery Replacement", category: "mobile", description: "Restore all-day battery life with a fresh genuine battery.", icon: "BatteryCharging", priceFrom: 3900, priceTo: 8900, turnaround: "30-45 mins", popular: true },
      { slug: "phone-charging-port", name: "Charging Port Repair", category: "mobile", description: "Loose or faulty charging port? We reflow or replace it.", icon: "Plug", priceFrom: 3900, priceTo: 8900, turnaround: "45-60 mins", popular: false },
      { slug: "phone-camera", name: "Camera Repair", category: "mobile", description: "Cracked lens or blank camera? Front & rear camera replacement.", icon: "Camera", priceFrom: 4900, priceTo: 12900, turnaround: "45-60 mins", popular: false },
      { slug: "phone-speaker", name: "Speaker & Jack Repair", category: "mobile", description: "No sound, distorted audio or faulty headphone jack fixed.", icon: "Volume2", priceFrom: 3500, priceTo: 7900, turnaround: "45 mins", popular: false },
      { slug: "phone-water", name: "Water Damage Repair", category: "mobile", description: "Ultrasonic board cleaning and component-level repair.", icon: "Droplets", priceFrom: 4900, priceTo: 12900, turnaround: "24-48 hrs", popular: false },

      // ---- Tablet & iPad ----
      { slug: "ipad-screen", name: "iPad Screen Replacement", category: "tablet", description: "Cracked iPad screen replaced for Pro, Air, mini and standard iPad.", icon: "Tablet", priceFrom: 8900, priceTo: 24900, turnaround: "1-2 days", popular: true },
      { slug: "ipad-battery", name: "iPad Battery Service", category: "tablet", description: "Genuine battery replacement for all iPad models.", icon: "BatteryCharging", priceFrom: 7900, priceTo: 14900, turnaround: "1-2 days", popular: false },
      { slug: "tablet-charging", name: "Tablet Charging Port", category: "tablet", description: "Charging port repair for iPad and Android tablets.", icon: "Plug", priceFrom: 4900, priceTo: 9900, turnaround: "1 day", popular: false },
      { slug: "samsung-tab-screen", name: "Samsung Galaxy Tab Screen", category: "tablet", description: "Screen replacement for Galaxy Tab series.", icon: "Tablet", priceFrom: 7900, priceTo: 19900, turnaround: "1-2 days", popular: false },

      // ---- Laptop ----
      { slug: "laptop-screen", name: "Laptop Screen Replacement", category: "laptop", description: "Cracked or flickering screen? We replace all laptop panels.", icon: "Laptop", priceFrom: 7900, priceTo: 21900, turnaround: "1-2 days", popular: true },
      { slug: "laptop-keyboard", name: "Keyboard / Hinge Repair", category: "laptop", description: "Stuck keys, broken hinges and chassis repair.", icon: "Keyboard", priceFrom: 5900, priceTo: 13900, turnaround: "1-2 days", popular: false },
      { slug: "laptop-ssd", name: "SSD / RAM Upgrade", category: "laptop", description: "Speed up your laptop with an SSD upgrade and more RAM.", icon: "HardDrive", priceFrom: 5900, priceTo: 14900, turnaround: "Same day", popular: true },
      { slug: "laptop-os", name: "OS / Software Fix", category: "laptop", description: "Windows reinstall, virus removal, slow performance tuning.", icon: "MonitorCog", priceFrom: 4900, priceTo: 9900, turnaround: "Same day", popular: false },
      { slug: "laptop-water", name: "Liquid Damage Recovery", category: "laptop", description: "Ultrasonic clean, corrosion removal and diagnostics.", icon: "Droplets", priceFrom: 6900, priceTo: 16900, turnaround: "2-3 days", popular: false },

      // ---- MacBook ----
      { slug: "macbook-screen", name: "MacBook Screen & Logic Board", category: "macbook", description: "Retina display and logic-board level repair for M1/M2/M3 MacBooks.", icon: "Laptop", priceFrom: 12900, priceTo: 44900, turnaround: "2-4 days", popular: true },
      { slug: "macbook-battery", name: "MacBook Battery Service", category: "macbook", description: "Genuine battery replacement for MacBook Air & Pro.", icon: "BatteryCharging", priceFrom: 9900, priceTo: 19900, turnaround: "1-2 days", popular: false },
      { slug: "macbook-liquid", name: "Liquid Damage Recovery", category: "macbook", description: "Ultrasonic clean, corrosion removal and board diagnostics.", icon: "Droplets", priceFrom: 9900, priceTo: 24900, turnaround: "2-5 days", popular: false },
      { slug: "macbook-keyboard", name: "Keyboard / Trackpad", category: "macbook", description: "Butterfly & magic keyboard repair, trackpad replacement.", icon: "Keyboard", priceFrom: 9900, priceTo: 18900, turnaround: "2-3 days", popular: false },

      // ---- Computer ----
      { slug: "computer-diagnostic", name: "Computer Diagnostic & Tune-up", category: "computer", description: "Full hardware check, performance tune-up and dust clean.", icon: "Monitor", priceFrom: 3900, priceTo: 7900, turnaround: "Same day", popular: false },
      { slug: "computer-virus", name: "Virus & Malware Removal", category: "computer", description: "Remove viruses, malware and ransomware, reinstall OS cleanly.", icon: "ShieldCheck", priceFrom: 4900, priceTo: 9900, turnaround: "Same day", popular: true },
      { slug: "computer-upgrade", name: "Hardware Upgrade", category: "computer", description: "SSD, RAM, GPU and PSU upgrades to extend your PC's life.", icon: "Cpu", priceFrom: 5900, priceTo: 19900, turnaround: "1-2 days", popular: false },
      { slug: "computer-os", name: "Windows Reinstall & Setup", category: "computer", description: "Fresh Windows install, drivers and data migration.", icon: "MonitorCog", priceFrom: 5900, priceTo: 11900, turnaround: "1 day", popular: false },

      // ---- Custom Computer ----
      { slug: "custom-gaming-pc", name: "Custom Gaming PC Build", category: "custom-computer", description: "Bespoke gaming rig designed around your budget and titles.", icon: "Cpu", priceFrom: 89900, priceTo: 250000, turnaround: "3-5 days", popular: true },
      { slug: "custom-workstation", name: "Workstation Build", category: "custom-computer", description: "Video editing, 3D rendering and CAD workstations.", icon: "Cpu", priceFrom: 119900, priceTo: 300000, turnaround: "3-5 days", popular: false },
      { slug: "custom-budget-pc", name: "Budget / Office PC Build", category: "custom-computer", description: "Reliable everyday PC for home and office use.", icon: "Monitor", priceFrom: 49900, priceTo: 89900, turnaround: "2-4 days", popular: false },
      { slug: "custom-itx", name: "Compact / ITX Build", category: "custom-computer", description: "Small-form-factor builds for tight spaces and clean desks.", icon: "Cpu", priceFrom: 99900, priceTo: 220000, turnaround: "3-5 days", popular: false },

      // ---- Console ----
      { slug: "ps5-hdmi", name: "PS5 HDMI Port Repair", category: "console", description: "Broken HDMI port reflow / replacement for PS5 & PS5 Slim.", icon: "Gamepad2", priceFrom: 8900, priceTo: 14900, turnaround: "1-3 days", popular: true },
      { slug: "ps5-clean", name: "PS5 Deep Clean & Thermal Paste", category: "console", description: "Fix overheating, fan noise and performance throttling.", icon: "Fan", priceFrom: 5900, priceTo: 8900, turnaround: "Same day", popular: false },
      { slug: "xbox-hdmi", name: "Xbox Series X/S HDMI Repair", category: "console", description: "HDMI port and power supply repair for Xbox Series consoles.", icon: "Gamepad2", priceFrom: 7900, priceTo: 13900, turnaround: "1-3 days", popular: false },
      { slug: "xbox-clean", name: "Xbox Overheating & Cleanup", category: "console", description: "Deep clean, thermal paste and fan replacement.", icon: "Fan", priceFrom: 5900, priceTo: 8900, turnaround: "Same day", popular: false },
      { slug: "switch-screen", name: "Nintendo Switch Screen / Joy-Con", category: "console", description: "Screen replacement and Joy-Con drift repair.", icon: "Gamepad2", priceFrom: 4900, priceTo: 9900, turnaround: "1-2 days", popular: false },

      // ---- Apple Watch ----
      { slug: "watch-screen", name: "Apple Watch Screen Replacement", category: "apple-watch", description: "Cracked glass and screen replacement for Series & Ultra.", icon: "Watch", priceFrom: 8900, priceTo: 19900, turnaround: "1-2 days", popular: true },
      { slug: "watch-battery", name: "Apple Watch Battery Service", category: "apple-watch", description: "Battery replacement to restore all-day battery life.", icon: "BatteryCharging", priceFrom: 6900, priceTo: 11900, turnaround: "1-2 days", popular: false },
      { slug: "watch-charging", name: "Apple Watch Charging Repair", category: "apple-watch", description: "Charging coil and back-glass repair.", icon: "Plug", priceFrom: 7900, priceTo: 13900, turnaround: "1-2 days", popular: false },
      { slug: "watch-water", name: "Apple Watch Water Damage", category: "apple-watch", description: "Diagnostic and component-level water damage recovery.", icon: "Droplets", priceFrom: 7900, priceTo: 15900, turnaround: "2-3 days", popular: false },
    ];

    await db.service.createMany({
      data: services.map((s) => ({ ...s, active: true })),
    });
  }

  // 5. Reviews
  const reviewCount = await db.review.count();
  if (reviewCount === 0) {
    const reviews = [
      { author: "Sarah M.", rating: 5, comment: "Cracked iPhone 14 screen fixed in under an hour. Genuinely friendly service and a fair price. Highly recommend!", device: "iPhone 14", approved: true },
      { author: "James T.", rating: 5, comment: "PS5 HDMI port was wrecked by the kids. Gadget Doctor had it working like new in two days. Brilliant.", device: "PlayStation 5", approved: true },
      { author: "Aisha R.", rating: 4, comment: "MacBook Air wouldn't charge. Diagnosed a logic board issue and repaired it for way less than Apple quoted.", device: "MacBook Air M2", approved: true },
      { author: "Mark D.", rating: 5, comment: "Used the doorstep collection - so convenient. Picked up my laptop, fixed the SSD and dropped it back same week.", device: "Lenovo ThinkPad", approved: true },
      { author: "Chloe B.", rating: 5, comment: "Apple Watch screen was smashed. Replaced it same day and looks brand new. Lifesavers!", device: "Apple Watch Series 8", approved: true },
      { author: "David K.", rating: 4, comment: "Recovered all my holiday photos from a dead USB drive. Thought they were gone forever. Thank you!", device: "USB Drive", approved: true },
      { author: "Nicole F.", rating: 5, comment: "Samsung S23 screen replacement looks perfect and works flawlessly. Quick turnaround and lovely staff.", device: "Samsung Galaxy S23", approved: true },
      { author: "Tony G.", rating: 4, comment: "Xbox Series X kept overheating and shutting down. Full clean and new thermal paste sorted it. Top blokes.", device: "Xbox Series X", approved: true },
      { author: "Helen W.", rating: 5, comment: "Dropped my Pixel 8 in water. They cleaned the board and saved it. Brilliant honest service.", device: "Google Pixel 8", approved: true },
      { author: "Ryan C.", rating: 5, comment: "Laptop keyboard was trashed after a coffee spill. New keyboard fitted, all working. Will use again.", device: "HP Pavilion", approved: true },
      { author: "Emma L.", rating: 4, comment: "Quick quote, quick repair, fair price. The online booking form made everything easy.", device: "iPhone 13", approved: true },
      { author: "Omar S.", rating: 5, comment: "Built me a custom gaming PC that runs everything on max. Tidy cabling and great value. Cheers!", device: "Custom Gaming PC", approved: true },
      { author: "Laura H.", rating: 5, comment: "iPad screen was shattered. Replaced in a day and works perfectly. Friendly local shop.", device: "iPad Air", approved: true },
      { author: "Chris P.", rating: 5, comment: "Desktop PC was riddled with malware. Cleaned it up and installed an SSD - feels brand new again.", device: "Desktop PC", approved: true },
    ];

    const now = Date.now();
    const data = reviews.map((r, i) => ({
      ...r,
      createdAt: new Date(now - (i + 1) * 1000 * 60 * 60 * 22).toISOString(),
    }));
    await db.review.createMany({ data });
  }

  // 6. Sample bookings
  const bookingCount = await db.booking.count();
  if (bookingCount === 0) {
    const now = Date.now();
    const sample = [
      { customerName: "Liam Burns", email: "liam.burns@example.com", phone: "07700 900123", deviceType: "mobile", deviceModel: "iPhone 15 Pro Max", issue: "Cracked screen, touch not responding in top right.", needsCollection: false, status: "In Progress", quotedPrice: 18900, finalPrice: null },
      { customerName: "Priya Shah", email: "priya.shah@example.com", phone: "07700 900234", deviceType: "macbook", deviceModel: "MacBook Air M2", issue: "Won't charge, battery icon shows service warning.", needsCollection: true, collectionAddr: "22 Greenhills Road, East Kilbride, G75 8JN", status: "Pending", quotedPrice: null, finalPrice: null },
      { customerName: "Connor McLeod", email: "connor.mcleod@example.com", phone: "07700 900345", deviceType: "console", deviceModel: "PlayStation 5 / PS5 Slim", issue: "No signal on TV, HDMI port loose.", needsCollection: false, status: "Ready", quotedPrice: 12000, finalPrice: 12000 },
      { customerName: "Beth Wilson", email: "beth.wilson@example.com", phone: "07700 900456", deviceType: "apple-watch", deviceModel: "Apple Watch Series 9 / 8 / 7", issue: "Cracked screen, touch working.", needsCollection: false, status: "Completed", quotedPrice: 12000, finalPrice: 12000 },
      { customerName: "Aiden Fraser", email: "aiden.fraser@example.com", phone: "07700 900567", deviceType: "laptop", deviceModel: "Dell Inspiron / XPS", issue: "Laptop extremely slow, suspect SSD failure.", needsCollection: true, collectionAddr: "7 Calderwood Rd, East Kilbride, G74 3BQ", status: "Pending", quotedPrice: null, finalPrice: null },
      { customerName: "Megan Doyle", email: "megan.doyle@example.com", phone: "07700 900678", deviceType: "tablet", deviceModel: "iPad Pro 12.9\" / 11\"", issue: "Cracked iPad screen, needs full replacement.", needsCollection: false, status: "In Progress", quotedPrice: 18000, finalPrice: null },
      { customerName: "Grant Walker", email: "grant.walker@example.com", phone: "07700 900789", deviceType: "custom-computer", deviceModel: "Gaming PC Build", issue: "Looking for a £1500 gaming PC build for 1440p.", needsCollection: false, status: "Completed", quotedPrice: 150000, finalPrice: 152000 },
      { customerName: "Hannah Reid", email: "hannah.reid@example.com", phone: "07700 900890", deviceType: "console", deviceModel: "Xbox Series X / S", issue: "Overheating and shutting down mid game.", needsCollection: false, status: "Completed", quotedPrice: 7000, finalPrice: 7000 },
      { customerName: "Ross Kelly", email: "ross.kelly@example.com", phone: "07700 900901", deviceType: "mobile", deviceModel: "iPhone 14 / 14 Plus", issue: "Battery draining fast, phone gets hot.", needsCollection: false, status: "Ready", quotedPrice: 6500, finalPrice: 6500 },
      { customerName: "Isla Paterson", email: "isla.paterson@example.com", phone: "07700 900012", deviceType: "computer", deviceModel: "Custom Build", issue: "PC won't boot, suspect motherboard or PSU.", needsCollection: true, collectionAddr: "4 Peel Park, East Kilbride, G74 5LA", status: "In Progress", quotedPrice: 8000, finalPrice: null },
      { customerName: "Dean Harvey", email: "dean.harvey@example.com", phone: "07700 900112", deviceType: "mobile", deviceModel: "Google Pixel 8 / 8 Pro", issue: "Charging port loose, have to wiggle cable.", needsCollection: true, collectionAddr: "15 Stewartfield Way, East Kilbride, G76 8TE", status: "Pending", quotedPrice: null, finalPrice: null },
      { customerName: "Zara Ali", email: "zara.ali@example.com", phone: "07700 900223", deviceType: "laptop", deviceModel: "Lenovo ThinkPad / IdeaPad", issue: "Screen flickering, goes black sometimes.", needsCollection: false, status: "Completed", quotedPrice: 11000, finalPrice: 11500 },
    ];

    await db.booking.createMany({
      data: sample.map((b, i) => ({
        ...b,
        ticketId: `GD-${1000 + i}`,
        technicianNotes: b.status === "Completed" || b.status === "Ready" ? "Repaired and tested. Customer notified." : null,
        createdAt: new Date(now - (i + 1) * 1000 * 60 * 60 * 14).toISOString(),
        updatedAt: new Date(now - (i + 1) * 1000 * 60 * 60 * 6).toISOString(),
      })),
    });
  }

  // 7. Blog posts
  const blogCount = await db.blogPost.count();
  if (blogCount === 0) {
    const now2 = Date.now();
    const posts = [
      {
        slug: "cracked-iphone-screen-repair-guide",
        title: "Cracked iPhone Screen? Here's What You Need to Know",
        excerpt: "From repair options to costs and turnaround times — everything you need to know before getting your iPhone screen fixed in East Kilbride.",
        content: "A cracked iPhone screen is one of the most common repairs we see at Gadget Doctor East Kilbride. The good news? Most screens can be replaced in under an hour.\n\n## Should you repair or replace?\n\nUnless your phone is several generations old, repairing the screen is almost always cheaper than upgrading. A screen repair for an iPhone 13 or 14 typically costs between £69 and £149 — far less than a new handset.\n\n## What affects the price?\n\n- **Model**: newer Pro Max models use expensive OLED panels.\n- **Part quality**: we use genuine-grade parts backed by a 12-month warranty.\n- **Additional damage**: if the touch layer or frame is damaged, the cost may be slightly higher.\n\n## How long does it take?\n\nMost iPhone screen repairs are completed in 30–60 minutes. You can drop in, or use our doorstep collection service across East Kilbride.\n\nReady to book? Use the 'Book Repair' button on any page or call us on +44 1355 458135.",
        coverImage: "/images/services-grid.jpg",
        category: "Guides",
        tags: "iPhone,screen repair,guide",
        author: "Gadget Doctor",
        published: true,
        featured: true,
      },
      {
        slug: "ps5-hdmi-port-repair-explained",
        title: "PS5 HDMI Port Repair: Why It Happens and How We Fix It",
        excerpt: "No signal on your TV? A broken HDMI port is the most common PS5 fault. Here's how we repair it and what it costs.",
        content: "If your PlayStation 5 powers on but shows 'No Signal' on your TV, the HDMI port is the usual culprit. It's a fragile connector that takes a lot of strain from cable insertion and accidental knocks.\n\n## What causes HDMI port damage?\n\n- Forcing the cable in the wrong way\n- Knocking the console while a cable is plugged in\n- Wear and tear over time\n- Power surges\n\n## How we fix it\n\nWe completely remove the damaged HDMI port and solder a genuine replacement onto the motherboard using a hot-air rework station. The repair takes 1–3 days and comes with a warranty.\n\n## Cost\n\nPS5 HDMI port repair is typically £89–£149 depending on whether there's additional board damage.\n\nBook your PS5 repair online or call +44 1355 458135.",
        coverImage: "/images/why-choose-tech.jpg",
        category: "Repairs",
        tags: "PS5,console,HDMI,repair",
        author: "Gadget Doctor",
        published: true,
        featured: false,
      },
      {
        slug: "macbook-water-damage-what-to-do",
        title: "Spilled Water on Your MacBook? Do This Immediately",
        excerpt: "Liquid damage can kill a MacBook fast. Follow these steps to minimise damage and increase the chances of a successful repair.",
        content: "Liquid spills are one of the most common — and most damaging — MacBook faults we treat. Acting quickly can be the difference between a £99 clean and a £400 logic board repair.\n\n## Immediate steps\n\n1. **Power off immediately** — hold the power button until it shuts down.\n2. **Unplug everything** — charger, dongles, USB devices.\n3. **Flip it over** — keyboard-down on a towel to let liquid drain out.\n4. **Do NOT use a hairdryer** — heat can spread the liquid further.\n5. **Bring it in fast** — the longer corrosion sits, the worse it gets.\n\n## What we do\n\nOur MacBook liquid damage recovery includes an ultrasonic board clean, corrosion removal, component-level diagnostics and replacement of any shorted components. Most recoveries take 2–5 days.\n\n## Cost\n\nRecovery typically runs £99–£249 depending on the extent of the damage.\n\nDon't wait — call +44 1355 458135 or book online today.",
        coverImage: "/images/contact-shop.jpg",
        category: "Tips",
        tags: "MacBook,water damage,tips",
        author: "Gadget Doctor",
        published: true,
        featured: false,
      },
      {
        slug: "custom-gaming-pc-build-guide",
        title: "Building a Custom Gaming PC: Where to Start",
        excerpt: "Thinking about a custom gaming PC build? Here's how to plan your budget and what to expect from Gadget Doctor.",
        content: "A custom gaming PC is one of the most rewarding purchases you can make — but where do you start?\n\n## Set a budget\n\nGreat 1080p gaming PCs start around £899. For smooth 1440p gaming, budget £1,200–£1,600. For 4K and high-refresh-rate, expect £2,000+.\n\n## Pick your priorities\n\n- **FPS in your favourite games** — check benchmarks.\n- **Upgradability** — leave room for a better GPU later.\n- **Aesthetics** — RGB, cable management, case choice.\n- **Quiet / cool operation** — good fans and airflow.\n\n## Why have us build it?\n\nEvery Gadget Doctor custom build is:\n- Designed around your games and budget\n- Assembled and cable-managed by certified technicians\n- Stress-tested for 24 hours before delivery\n- Backed by a 2-year labour warranty\n\nGet a free quote — call +44 1355 458135 or book online.",
        coverImage: "/images/hero-workshop.jpg",
        category: "Guides",
        tags: "custom PC,gaming,build",
        author: "Gadget Doctor",
        published: true,
        featured: false,
      },
    ];

    await db.blogPost.createMany({
      data: posts.map((p, i) => ({
        ...p,
        createdAt: new Date(now2 - i * 1000 * 60 * 60 * 48).toISOString(),
        updatedAt: new Date(now2 - i * 1000 * 60 * 60 * 48).toISOString(),
      })),
    });
  }

  // 8. Email settings singleton
  const emailSettings = await db.emailSettings.findUnique({ where: { id: "singleton" } });
  if (!emailSettings) {
    await db.emailSettings.create({
      data: {
        id: "singleton",
        enabled: false,
        host: "",
        port: 587,
        secure: false,
        user: "",
        password: "",
        fromEmail: "",
        fromName: "Gadget Doctor East Kilbride",
      },
    });
  }

  return NextResponse.json({ ok: true });
  } catch (err) {
    // Return the actual error so we can debug database connection issues
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: message, stack: err instanceof Error ? err.stack : undefined },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "POST to seed the database" });
}
