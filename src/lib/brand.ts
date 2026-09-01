// Central brand & business data for Gadget Doctor East Kilbride
// (DB Branding row overrides these defaults when present)

export const BRAND = {
  name: "Gadget Doctor",
  fullName: "Gadget Doctor East Kilbride",
  tagline: "Fast & Reliable Electronics Repair in East Kilbride",
  address: "14 Stroud Rd, East Kilbride, G75 0YA, Scotland",
  addressShort: "14 Stroud Rd, East Kilbride, G75 0YA",
  phones: ["+44 1355 458135"],
  whatsapp: "+44 1355 458135",
  email: "info@gadgetdoctorscotland.co.uk",
  website: "https://www.gadgetdoctoreastkilbride.co.uk",
  gmbProfile: "https://g.co/kgs/bRysLQB",
  rating: 4.6,
  reviewCount: 92,
  yearsExperience: 12,
  logoUrl: "/gadget-doctor-logo.jpg",
  primaryColor: "#E31E24",
  secondaryColor: "#4A90E2",
  hours: [
    { day: "Monday – Thursday", time: "09:30 AM – 03:00 PM" },
    { day: "Friday", time: "09:30 AM – 02:30 PM" },
    { day: "Saturday", time: "10:00 AM – 02:00 PM" },
    { day: "Sunday", time: "Closed" },
  ],
  mapEmbed:
    "https://www.google.com/maps?q=14+Stroud+Rd+East+Kilbride+G75+0YA&output=embed",
  mapLink: "https://maps.app.goo.gl/vsvyX7oc9MFpnEDS6",
  socials: {
    facebook: "https://www.facebook.com/GadgetDoctorEastKilbride/",
    instagram: "https://www.instagram.com/gadgetdoctoreastkilbride",
    tiktok: "https://www.tiktok.com/@gadgetdoctoreastkilbride",
    youtube: "https://www.youtube.com/@gadgetdoctoreastkilbride",
    pinterest: "https://uk.pinterest.com/gadgetdoctoreastkilbride/",
    linkedin: "https://www.linkedin.com/company/gadget-doctor-east-kilbride",
    blog: "https://gadgetdoctoreastkilbride.blogspot.com/",
  },
  targetAreas: [
    "East Kilbride",
    "Busby",
    "Eaglesham",
    "Cambuslang",
    "Rutherglen",
    "Carmunnock",
    "Giffnock",
  ],
} as const;

export const SOCIAL_LINKS: {
  key: keyof typeof BRAND.socials;
  label: string;
  icon: string; // lucide icon name
}[] = [
  { key: "facebook", label: "Facebook", icon: "Facebook" },
  { key: "instagram", label: "Instagram", icon: "Instagram" },
  { key: "tiktok", label: "TikTok", icon: "Music2" },
  { key: "youtube", label: "YouTube", icon: "Youtube" },
  { key: "pinterest", label: "Pinterest", icon: "Image" },
  { key: "linkedin", label: "LinkedIn", icon: "Linkedin" },
  { key: "blog", label: "Blog", icon: "Rss" },
];

export const SERVICE_CATEGORIES: {
  value: string;
  label: string;
  shortLabel: string;
  icon: string;
  tagline: string;
  description: string;
}[] = [
  {
    value: "mobile",
    label: "Mobile Phone Repair",
    shortLabel: "Mobile",
    icon: "Smartphone",
    tagline: "All brands, fixed fast",
    description:
      "Cracked screens, dead batteries, charging ports, water damage and more — repaired for every iPhone, Samsung, Google Pixel and brand.",
  },
  {
    value: "tablet",
    label: "Tablet & iPad Repair",
    shortLabel: "Tablets",
    icon: "Tablet",
    tagline: "iPads & Android tablets",
    description:
      "Screen and battery repairs for iPad Pro, Air, mini and Samsung Galaxy Tab — plus charging ports and water damage recovery.",
  },
  {
    value: "laptop",
    label: "Laptop Repair",
    shortLabel: "Laptops",
    icon: "Laptop",
    tagline: "All Windows brands",
    description:
      "Screen replacements, keyboard & hinge repair, SSD upgrades, OS reinstalls and virus removal for HP, Dell, Lenovo, ASUS and Acer.",
  },
  {
    value: "macbook",
    label: "MacBook Repair",
    shortLabel: "MacBooks",
    icon: "Laptop",
    tagline: "Logic-board level repairs",
    description:
      "Retina display, logic-board, battery and liquid-damage repair for MacBook Air & Pro (M1/M2/M3 and Intel) — for less than Apple quotes.",
  },
  {
    value: "computer",
    label: "Computer Repair",
    shortLabel: "Computers",
    icon: "Monitor",
    tagline: "Desktops & all-in-ones",
    description:
      "Diagnostics, hardware upgrades, virus removal, OS reinstalls and performance tuning for desktop PCs and all-in-one computers.",
  },
  {
    value: "custom-computer",
    label: "Custom Computer Builds",
    shortLabel: "Custom PCs",
    icon: "Cpu",
    tagline: "Built to your spec",
    description:
      "Bespoke gaming PCs, workstations and compact builds — designed, assembled, tested and delivered with a warranty.",
  },
  {
    value: "console",
    label: "Game Console Repair",
    shortLabel: "Consoles",
    icon: "Gamepad2",
    tagline: "PS5, Xbox & Switch",
    description:
      "HDMI port repair, overheating fixes, drive faults and stick drift for PlayStation, Xbox and Nintendo Switch consoles.",
  },
  {
    value: "apple-watch",
    label: "Apple Watch Repairs",
    shortLabel: "Apple Watch",
    icon: "Watch",
    tagline: "Screen & battery",
    description:
      "Screen and glass replacements, battery service and charging repair for Apple Watch Series, SE and Ultra.",
  },
];

export const DEVICE_MODELS: Record<string, string[]> = {
  mobile: [
    "iPhone 15 Pro Max",
    "iPhone 15 / 15 Plus",
    "iPhone 14 / 14 Plus",
    "iPhone 13 / 13 mini",
    "iPhone 12 / 12 mini",
    "iPhone 11 / SE",
    "Samsung Galaxy S24",
    "Samsung Galaxy S23 / S22",
    "Samsung Galaxy A series",
    "Google Pixel 8 / 8 Pro",
    "Google Pixel 7 / 7a",
    "Other",
  ],
  tablet: [
    "iPad Pro 12.9\" / 11\"",
    "iPad Air",
    "iPad (10th / 9th gen)",
    "iPad mini",
    "Samsung Galaxy Tab",
    "Other Android Tablet",
  ],
  laptop: [
    "HP Pavilion / Envy",
    "Dell Inspiron / XPS",
    "Lenovo ThinkPad / IdeaPad",
    "ASUS VivoBook / ZenBook",
    "Acer Aspire / Swift",
    "Microsoft Surface Laptop",
    "Other Windows Laptop",
  ],
  macbook: [
    "MacBook Air M1 / M2 / M3",
    'MacBook Pro 13"',
    'MacBook Pro 14" / 16"',
    "MacBook (older Intel)",
    "iMac / Mac mini",
  ],
  computer: [
    "HP Desktop / All-in-One",
    "Dell Desktop / XPS",
    "Lenovo Desktop / IdeaCentre",
    "ASUS / Acer Desktop",
    "Custom Build",
    "Other Desktop PC",
  ],
  "custom-computer": [
    "Gaming PC Build",
    "High-End Workstation",
    "Mid-Range / Budget PC",
    "Compact / ITX Build",
    "Streaming / Content PC",
    "Upgrade Existing Build",
  ],
  console: [
    "PlayStation 5 / PS5 Slim",
    "PlayStation 4 / PS4 Pro",
    "Xbox Series X / S",
    "Xbox One / One S / One X",
    "Nintendo Switch / Switch OLED",
    "Other Console",
  ],
  "apple-watch": [
    "Apple Watch Series 9 / 8 / 7",
    "Apple Watch SE (2nd gen)",
    "Apple Watch Ultra",
    "Apple Watch Series 6 / 5 / 4",
    "Older Apple Watch",
  ],
};

export const COMMON_ISSUES = [
  "Cracked / shattered screen",
  "Battery not holding charge",
  "Charging port issue",
  "Water / liquid damage",
  "No power / won't turn on",
  "Overheating",
  "Software / OS issue",
  "Speaker / audio fault",
  "Camera fault",
  "Buttons not working",
  "No display / blank screen",
  "HDMI / port repair",
  "Data recovery needed",
  "Other (describe below)",
];

// Detailed sub-service offerings (matches the brief's services list)
export const SERVICE_OFFERINGS = [
  "Mobile Phone Repair (All Brands)",
  "Camera Repair / Battery Replacement",
  "Charging Port, Speaker & Jack Repair",
  "Tablet & iPad Repair",
  "Laptop & MacBook Repair",
  "Computer & Custom PC Repair",
  "Gaming Console Repair",
  "Apple Watch Repairs",
];

// Admin demo credentials (mock auth)
export const ADMIN_DEMO = {
  email: "admin@gadgetdoctor.co.uk",
  password: "admin123",
  name: "Shop Manager",
};
