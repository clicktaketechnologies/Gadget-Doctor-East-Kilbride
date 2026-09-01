// Central brand & business data for Gadget Doctor East Kilbride

export const BRAND = {
  name: "Gadget Doctor",
  fullName: "Gadget Doctor East Kilbride",
  tagline: "Fast & Reliable Electronics Repair in East Kilbride",
  address: "EK Business Centre, 14 Stroud Rd, East Kilbride, Glasgow G75 0YA, UK",
  addressShort: "14 Stroud Rd, East Kilbride, G75 0YA",
  phones: ["+44 7777 200175", "+44 1355 458135"],
  email: "info@gadgetdoctorscotland.co.uk",
  rating: 4.6,
  reviewCount: 92,
  hours: [
    { day: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
    { day: "Saturday", time: "10:00 AM – 4:00 PM" },
    { day: "Sunday", time: "Closed" },
  ],
  mapEmbed:
    "https://www.google.com/maps?q=EK+Business+Centre,+14+Stroud+Rd,+East+Kilbride,+Glasgow+G75+0YA&output=embed",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=EK+Business+Centre+14+Stroud+Rd+East+Kilbride+Glasgow+G75+0YA",
} as const;

export const SERVICE_CATEGORIES: {
  value: string;
  label: string;
  icon: string;
}[] = [
  { value: "phone", label: "Phones", icon: "Smartphone" },
  { value: "laptop", label: "Laptops", icon: "Laptop" },
  { value: "macbook", label: "MacBooks", icon: "Laptop" },
  { value: "console", label: "Consoles", icon: "Gamepad2" },
  { value: "ghd", label: "GHDs", icon: "Wind" },
  { value: "data-recovery", label: "Data Recovery", icon: "DatabaseBackup" },
];

export const DEVICE_MODELS: Record<string, string[]> = {
  phone: [
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
  console: [
    "PlayStation 5 / PS5 Slim",
    "PlayStation 4 / PS4 Pro",
    "Xbox Series X / S",
    "Xbox One / One S / One X",
    "Nintendo Switch / Switch OLED",
    "Other Console",
  ],
  ghd: [
    "GHD Platinum+",
    "GHD Gold",
    "GHD Classic",
    "GHD Curve / Wands",
    "GHD Helios Hair Dryer",
    "Other GHD",
  ],
  "data-recovery": [
    "Hard Drive (HDD)",
    "Solid State Drive (SSD)",
    "USB / Flash Drive",
    "SD / Memory Card",
    "Phone Internal Storage",
    "RAID / NAS",
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

export const ADMIN_DEMO = {
  email: "admin@gadgetdoctor.co.uk",
  password: "admin123",
  name: "Shop Manager",
};
