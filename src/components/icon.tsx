"use client";

import {
  Smartphone, Laptop, Gamepad2, Wind, DatabaseBackup, BatteryCharging,
  Droplets, Keyboard, MonitorCog, Fan, Truck, Wrench, Settings, Zap,
  Tv, HardDrive, Wifi, Camera, Volume2, Power, Thermometer, Cpu, Plug,
  ShieldCheck, Clock, Star, Phone, Mail, MapPin, type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Smartphone, Laptop, Gamepad2, Wind, DatabaseBackup, BatteryCharging,
  Droplets, Keyboard, MonitorCog, Fan, Truck, Wrench, Settings, Zap,
  Tv, HardDrive, Wifi, Camera, Volume2, Power, Thermometer, Cpu, Plug,
  ShieldCheck, Clock, Star, Phone, Mail, MapPin,
};

export function Icon({
  name,
  className,
  size,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Cmp = MAP[name] ?? Wrench;
  return <Cmp className={className} size={size} />;
}

export const ICON_NAMES = Object.keys(MAP);
