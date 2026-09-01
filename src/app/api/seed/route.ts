import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ADMIN_DEMO } from "@/lib/brand";

// Idempotent seed endpoint — safe to call repeatedly
export async function POST() {
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
        collectionBannerEnabled: true,
        announcementEnabled: true,
        announcementText: "Free doorstep collection service across East Kilbride — book online today!",
      },
    });
  }

  // 3. Services
  const serviceCount = await db.service.count();
  if (serviceCount === 0) {
    const services = [
      { slug: "iphone-screen", name: "iPhone Screen Repair", category: "phone", description: "OLED/LCD screen replacement for all iPhone models with genuine-grade parts.", icon: "Smartphone", priceFrom: 4900, priceTo: 18900, turnaround: "30-60 mins", popular: true },
      { slug: "samsung-screen", name: "Samsung Screen Repair", category: "phone", description: "Screen replacement for Galaxy S, A and Note series.", icon: "Smartphone", priceFrom: 6900, priceTo: 21900, turnaround: "45-90 mins", popular: false },
      { slug: "pixel-screen", name: "Google Pixel Repair", category: "phone", description: "Screen, battery and charging port fixes for Pixel 6-8.", icon: "Smartphone", priceFrom: 7900, priceTo: 19900, turnaround: "45-90 mins", popular: false },
      { slug: "phone-battery", name: "Phone Battery Replacement", category: "phone", description: "Restore all-day battery life with a fresh genuine battery.", icon: "BatteryCharging", priceFrom: 3900, priceTo: 8900, turnaround: "30-45 mins", popular: true },
      { slug: "phone-water", name: "Water Damage Diagnostic & Repair", category: "phone", description: "Ultrasonic board cleaning and component-level repair.", icon: "Droplets", priceFrom: 4900, priceTo: 12900, turnaround: "24-48 hrs", popular: false },
      { slug: "laptop-screen", name: "Laptop Screen Replacement", category: "laptop", description: "Cracked or flickering screen? We replace all laptop panels.", icon: "Laptop", priceFrom: 7900, priceTo: 21900, turnaround: "1-2 days", popular: false },
      { slug: "laptop-os", name: "Laptop OS / Software Fix", category: "laptop", description: "Windows reinstall, virus removal, slow performance tuning.", icon: "MonitorCog", priceFrom: 4900, priceTo: 9900, turnaround: "Same day", popular: false },
      { slug: "laptop-keyboard", name: "Laptop Keyboard / Hinge Repair", category: "laptop", description: "Stuck keys, broken hinges and chassis repair.", icon: "Keyboard", priceFrom: 5900, priceTo: 13900, turnaround: "1-2 days", popular: false },
      { slug: "macbook-screen", name: "MacBook Screen & Logic Board", category: "macbook", description: "Retina display and logic-board level repair for M1/M2/M3 MacBooks.", icon: "Laptop", priceFrom: 12900, priceTo: 44900, turnaround: "2-4 days", popular: true },
      { slug: "macbook-battery", name: "MacBook Battery Service", category: "macbook", description: "Genuine battery replacement for MacBook Air & Pro.", icon: "BatteryCharging", priceFrom: 9900, priceTo: 19900, turnaround: "1-2 days", popular: false },
      { slug: "macbook-liquid", name: "MacBook Liquid Damage Recovery", category: "macbook", description: "Ultrasonic clean, corrosion removal and board diagnostics.", icon: "Droplets", priceFrom: 9900, priceTo: 24900, turnaround: "2-5 days", popular: false },
      { slug: "ps5-hdmi", name: "PS5 HDMI Port Repair", category: "console", description: "Broken HDMI port reflow / replacement for PS5 & PS5 Slim.", icon: "Gamepad2", priceFrom: 8900, priceTo: 14900, turnaround: "1-3 days", popular: true },
      { slug: "ps5-clean", name: "PS5 Deep Clean & Thermal Paste", category: "console", description: "Fix overheating, fan noise and performance throttling.", icon: "Fan", priceFrom: 5900, priceTo: 8900, turnaround: "Same day", popular: false },
      { slug: "xbox-hdmi", name: "Xbox Series X/S HDMI Repair", category: "console", description: "HDMI port and power supply repair for Xbox Series consoles.", icon: "Gamepad2", priceFrom: 7900, priceTo: 13900, turnaround: "1-3 days", popular: false },
      { slug: "xbox-clean", name: "Xbox Overheating & Cleanup", category: "console", description: "Deep clean, thermal paste and fan replacement.", icon: "Fan", priceFrom: 5900, priceTo: 8900, turnaround: "Same day", popular: false },
      { slug: "switch-screen", name: "Nintendo Switch Screen / Joy-Con", category: "console", description: "Screen replacement and Joy-Con drift repair.", icon: "Gamepad2", priceFrom: 4900, priceTo: 9900, turnaround: "1-2 days", popular: false },
      { slug: "ghd-straightener", name: "GHD Straightener Repair", category: "ghd", description: "Cable, element and switch repair for all GHD straighteners.", icon: "Wind", priceFrom: 2900, priceTo: 5900, turnaround: "Same day", popular: true },
      { slug: "ghd-dryer", name: "GHD Helios Dryer Repair", category: "ghd", description: "Motor, element and switch fixes for GHD hair dryers.", icon: "Wind", priceFrom: 3900, priceTo: 7900, turnaround: "1-2 days", popular: false },
      { slug: "data-recovery", name: "Data Recovery Service", category: "data-recovery", description: "Recover photos, documents and files from failing drives and phones.", icon: "DatabaseBackup", priceFrom: 4900, priceTo: 19900, turnaround: "2-5 days", popular: true },
      { slug: "doorstep-collection", name: "Doorstep Collection Service", category: "data-recovery", description: "We collect, repair and return your device across East Kilbride - free.", icon: "Truck", priceFrom: 0, priceTo: 0, turnaround: "Flexible", popular: false },
    ];

    await db.service.createMany({
      data: services.map((s) => ({ ...s, active: true })),
    });
  }

  // 4. Reviews
  const reviewCount = await db.review.count();
  if (reviewCount === 0) {
    const reviews = [
      { author: "Sarah M.", rating: 5, comment: "Cracked iPhone 14 screen fixed in under an hour. Genuinely friendly service and a fair price. Highly recommend!", device: "iPhone 14", approved: true },
      { author: "James T.", rating: 5, comment: "PS5 HDMI port was wrecked by the kids. Gadget Doctor had it working like new in two days. Brilliant.", device: "PlayStation 5", approved: true },
      { author: "Aisha R.", rating: 4, comment: "MacBook Air wouldn't charge. Diagnosed a logic board issue and repaired it for way less than Apple quoted.", device: "MacBook Air M2", approved: true },
      { author: "Mark D.", rating: 5, comment: "Used the doorstep collection - so convenient. Picked up my laptop, fixed the SSD and dropped it back same week.", device: "Lenovo ThinkPad", approved: true },
      { author: "Chloe B.", rating: 5, comment: "GHD straighteners died after 5 years. They brought them back to life. Lifesavers!", device: "GHD Platinum+", approved: true },
      { author: "David K.", rating: 4, comment: "Recovered all my holiday photos from a dead USB drive. Thought they were gone forever. Thank you!", device: "USB Drive", approved: true },
      { author: "Nicole F.", rating: 5, comment: "Samsung S23 screen replacement looks perfect and works flawlessly. Quick turnaround and lovely staff.", device: "Samsung Galaxy S23", approved: true },
      { author: "Tony G.", rating: 4, comment: "Xbox Series X kept overheating and shutting down. Full clean and new thermal paste sorted it. Top blokes.", device: "Xbox Series X", approved: true },
      { author: "Helen W.", rating: 5, comment: "Dropped my Pixel 8 in water. They cleaned the board and saved it. Brilliant honest service.", device: "Google Pixel 8", approved: true },
      { author: "Ryan C.", rating: 5, comment: "Laptop keyboard was trashed after a coffee spill. New keyboard fitted, all working. Will use again.", device: "HP Pavilion", approved: true },
      { author: "Emma L.", rating: 4, comment: "Quick quote, quick repair, fair price. The online booking form made everything easy.", device: "iPhone 13", approved: true },
      { author: "Omar S.", rating: 5, comment: "Saved my dissertation from a failing hard drive. Data recovered 100%. Can't thank them enough.", device: "Hard Drive", approved: true },
    ];

    const now = Date.now();
    const data = reviews.map((r, i) => ({
      ...r,
      createdAt: new Date(now - (i + 1) * 1000 * 60 * 60 * 26).toISOString(),
    }));
    await db.review.createMany({ data });
  }

  // 5. Sample bookings
  const bookingCount = await db.booking.count();
  if (bookingCount === 0) {
    const now = Date.now();
    const sample = [
      { customerName: "Liam Burns", email: "liam.burns@example.com", phone: "07700 900123", deviceType: "phone", deviceModel: "iPhone 15 Pro Max", issue: "Cracked screen, touch not responding in top right.", needsCollection: false, status: "In Progress", quotedPrice: 18900, finalPrice: null },
      { customerName: "Priya Shah", email: "priya.shah@example.com", phone: "07700 900234", deviceType: "macbook", deviceModel: "MacBook Air M2", issue: "Won't charge, battery icon shows service warning.", needsCollection: true, collectionAddr: "22 Greenhills Road, East Kilbride, G75 8JN", status: "Pending", quotedPrice: null, finalPrice: null },
      { customerName: "Connor McLeod", email: "connor.mcleod@example.com", phone: "07700 900345", deviceType: "console", deviceModel: "PlayStation 5 / PS5 Slim", issue: "No signal on TV, HDMI port loose.", needsCollection: false, status: "Ready", quotedPrice: 12000, finalPrice: 12000 },
      { customerName: "Beth Wilson", email: "beth.wilson@example.com", phone: "07700 900456", deviceType: "ghd", deviceModel: "GHD Platinum+", issue: "Won't switch on, no light.", needsCollection: false, status: "Completed", quotedPrice: 3500, finalPrice: 3500 },
      { customerName: "Aiden Fraser", email: "aiden.fraser@example.com", phone: "07700 900567", deviceType: "laptop", deviceModel: "Dell Inspiron / XPS", issue: "Laptop extremely slow, suspect SSD failure.", needsCollection: true, collectionAddr: "7 Calderwood Rd, East Kilbride, G74 3BQ", status: "Pending", quotedPrice: null, finalPrice: null },
      { customerName: "Megan Doyle", email: "megan.doyle@example.com", phone: "07700 900678", deviceType: "phone", deviceModel: "Samsung Galaxy S23 / S22", issue: "Water damage, phone won't turn on after dropping in sink.", needsCollection: false, status: "In Progress", quotedPrice: 9000, finalPrice: null },
      { customerName: "Grant Walker", email: "grant.walker@example.com", phone: "07700 900789", deviceType: "data-recovery", deviceModel: "Hard Drive (HDD)", issue: "External drive clicking, not mounting. Need family photos.", needsCollection: true, collectionAddr: "15 Stewartfield Way, East Kilbride, G76 8TE", status: "Completed", quotedPrice: 12000, finalPrice: 14500 },
      { customerName: "Hannah Reid", email: "hannah.reid@example.com", phone: "07700 900890", deviceType: "console", deviceModel: "Xbox Series X / S", issue: "Overheating and shutting down mid game.", needsCollection: false, status: "Completed", quotedPrice: 7000, finalPrice: 7000 },
      { customerName: "Ross Kelly", email: "ross.kelly@example.com", phone: "07700 900901", deviceType: "phone", deviceModel: "iPhone 14 / 14 Plus", issue: "Battery draining fast, phone gets hot.", needsCollection: false, status: "Ready", quotedPrice: 6500, finalPrice: 6500 },
      { customerName: "Isla Paterson", email: "isla.paterson@example.com", phone: "07700 900012", deviceType: "macbook", deviceModel: 'MacBook Pro 14" / 16"', issue: "Spilled coffee, some keys not working.", needsCollection: false, status: "Pending", quotedPrice: null, finalPrice: null },
      { customerName: "Dean Harvey", email: "dean.harvey@example.com", phone: "07700 900112", deviceType: "phone", deviceModel: "Google Pixel 8 / 8 Pro", issue: "Charging port loose, have to wiggle cable.", needsCollection: true, collectionAddr: "4 Peel Park, East Kilbride, G74 5LA", status: "In Progress", quotedPrice: 5500, finalPrice: null },
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

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "POST to seed the database" });
}
