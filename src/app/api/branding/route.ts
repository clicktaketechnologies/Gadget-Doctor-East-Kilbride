import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/auth";
import { BRAND, SERVICE_CATEGORIES } from "@/lib/brand";
import type { Branding, UpdateBrandingInput, BusinessHours, SocialLinks } from "@/lib/types";

const DEFAULT_HOURS: BusinessHours[] = BRAND.hours.map((h) => ({ ...h }));
const DEFAULT_SOCIALS: SocialLinks = { ...BRAND.socials };
const DEFAULT_AREAS: string[] = [...BRAND.targetAreas];

function rowToBranding(r: {
  id: string;
  businessName: string;
  tagline: string;
  about: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  gmbProfile: string;
  mapLink: string;
  mapEmbed: string;
  address: string;
  hoursJson: string;
  socialsJson: string;
  targetAreasJson: string;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
}): Branding {
  let hours: BusinessHours[] = [];
  let socials: SocialLinks = {};
  let targetAreas: string[] = [];
  try {
    hours = r.hoursJson ? JSON.parse(r.hoursJson) : DEFAULT_HOURS;
  } catch {
    hours = DEFAULT_HOURS;
  }
  try {
    socials = r.socialsJson ? JSON.parse(r.socialsJson) : DEFAULT_SOCIALS;
  } catch {
    socials = DEFAULT_SOCIALS;
  }
  try {
    targetAreas = r.targetAreasJson ? JSON.parse(r.targetAreasJson) : DEFAULT_AREAS;
  } catch {
    targetAreas = DEFAULT_AREAS;
  }
  return {
    id: r.id,
    businessName: r.businessName,
    tagline: r.tagline,
    about: r.about,
    logoUrl: r.logoUrl,
    primaryColor: r.primaryColor,
    secondaryColor: r.secondaryColor,
    phone: r.phone,
    whatsapp: r.whatsapp,
    email: r.email,
    website: r.website,
    gmbProfile: r.gmbProfile,
    mapLink: r.mapLink,
    mapEmbed: r.mapEmbed,
    address: r.address,
    hours,
    socials,
    targetAreas,
    rating: r.rating,
    reviewCount: r.reviewCount,
    yearsExperience: r.yearsExperience,
  };
}

// GET is public — the public site reads branding for logo/colors/contact
export async function GET() {
  let r = await db.branding.findUnique({ where: { id: "singleton" } });
  if (!r) {
    r = await db.branding.create({
      data: {
        id: "singleton",
        businessName: BRAND.fullName,
        tagline: BRAND.tagline,
        about: "",
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
        hoursJson: JSON.stringify(DEFAULT_HOURS),
        socialsJson: JSON.stringify(DEFAULT_SOCIALS),
        targetAreasJson: JSON.stringify(DEFAULT_AREAS),
        rating: BRAND.rating,
        reviewCount: BRAND.reviewCount,
        yearsExperience: BRAND.yearsExperience,
      },
    });
  }
  return NextResponse.json(rowToBranding(r));
}

// PATCH admin only
export async function PATCH(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as UpdateBrandingInput;

  const data: Record<string, unknown> = {};
  if (body.businessName !== undefined) data.businessName = body.businessName;
  if (body.tagline !== undefined) data.tagline = body.tagline;
  if (body.about !== undefined) data.about = body.about;
  if (body.logoUrl !== undefined) data.logoUrl = body.logoUrl;
  if (body.primaryColor !== undefined) data.primaryColor = body.primaryColor;
  if (body.secondaryColor !== undefined) data.secondaryColor = body.secondaryColor;
  if (body.phone !== undefined) data.phone = body.phone;
  if (body.whatsapp !== undefined) data.whatsapp = body.whatsapp;
  if (body.email !== undefined) data.email = body.email;
  if (body.website !== undefined) data.website = body.website;
  if (body.gmbProfile !== undefined) data.gmbProfile = body.gmbProfile;
  if (body.mapLink !== undefined) data.mapLink = body.mapLink;
  if (body.mapEmbed !== undefined) data.mapEmbed = body.mapEmbed;
  if (body.address !== undefined) data.address = body.address;
  if (body.hours !== undefined) data.hoursJson = JSON.stringify(body.hours);
  if (body.socials !== undefined) data.socialsJson = JSON.stringify(body.socials);
  if (body.targetAreas !== undefined)
    data.targetAreasJson = JSON.stringify(body.targetAreas);
  if (body.rating !== undefined) data.rating = body.rating;
  if (body.reviewCount !== undefined) data.reviewCount = body.reviewCount;
  if (body.yearsExperience !== undefined) data.yearsExperience = body.yearsExperience;

  let r = await db.branding.findUnique({ where: { id: "singleton" } });
  if (!r) {
    r = await db.branding.create({
      data: {
        id: "singleton",
        businessName: BRAND.fullName,
        tagline: BRAND.tagline,
        about: "",
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
        hoursJson: JSON.stringify(DEFAULT_HOURS),
        socialsJson: JSON.stringify(DEFAULT_SOCIALS),
        targetAreasJson: JSON.stringify(DEFAULT_AREAS),
        rating: BRAND.rating,
        reviewCount: BRAND.reviewCount,
        yearsExperience: BRAND.yearsExperience,
        ...data,
      } as never,
    });
  } else {
    r = await db.branding.update({ where: { id: "singleton" }, data });
  }
  return NextResponse.json(rowToBranding(r));
}

// silence unused import
void SERVICE_CATEGORIES;
