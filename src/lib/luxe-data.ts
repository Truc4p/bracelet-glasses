export interface CrystalBead {
  id: string;
  name: string;
  color: string;
  gradient?: string;
  price: number;
  emoji: string;
}

export function calculateBeadPrice(basePrice: number, beadSize: BeadSize): number {
  const sizeMultiplier = beadSize === 6 ? 0.8 : beadSize === 8 ? 1.0 : 1.3;
  return basePrice * sizeMultiplier;
}

export const CRYSTAL_LIBRARY: CrystalBead[] = [
  { id: "amethyst", name: "Amethyst", color: "#9B59B6", gradient: "linear-gradient(135deg, #9B59B6, #8E44AD)", price: 3.50, emoji: "💜" },
  { id: "rose-quartz", name: "Rose Quartz", color: "#F5B7C5", gradient: "linear-gradient(135deg, #F5B7C5, #E8A0B5)", price: 2.80, emoji: "🩷" },
  { id: "clear-quartz", name: "Clear Quartz", color: "#E8E8E8", gradient: "linear-gradient(135deg, #F0F0F0, #D8D8D8)", price: 2.00, emoji: "🤍" },
  { id: "tigers-eye", name: "Tiger's Eye", color: "#B8860B", gradient: "linear-gradient(135deg, #DAA520, #B8860B)", price: 4.00, emoji: "🧡" },
  { id: "lapis-lazuli", name: "Lapis Lazuli", color: "#1E3A5F", gradient: "linear-gradient(135deg, #26508E, #1E3A5F)", price: 5.00, emoji: "💙" },
  { id: "jade", name: "Jade", color: "#00A86B", gradient: "linear-gradient(135deg, #00C878, #00A86B)", price: 4.50, emoji: "💚" },
  { id: "citrine", name: "Citrine", color: "#F4C430", gradient: "linear-gradient(135deg, #FFD700, #F4C430)", price: 3.00, emoji: "💛" },
  { id: "obsidian", name: "Obsidian", color: "#2C2C2C", gradient: "linear-gradient(135deg, #3C3C3C, #1C1C1C)", price: 2.50, emoji: "🖤" },
  { id: "moonstone", name: "Moonstone", color: "#C4C4DE", gradient: "linear-gradient(135deg, #D4D4EE, #B4B4CE)", price: 4.20, emoji: "🩶" },
  { id: "carnelian", name: "Carnelian", color: "#CC5500", gradient: "linear-gradient(135deg, #E06020, #CC5500)", price: 3.20, emoji: "❤️‍🔥" },
];

export function calculateBeadCount(wristSizeCm: number, beadSizeMm: number): number {
  const wristCircumferenceMm = wristSizeCm * 10;
  const beadCount = Math.round(wristCircumferenceMm / beadSizeMm);
  return Math.max(beadCount, 8);
}

export type BeadSize = 6 | 8 | 10;

export interface PlacedBead {
  position: number;
  crystal: CrystalBead;
  beadSize: BeadSize;
}

export interface SunglassesConfig {
  frame: string;
  tintDensity: number;
  lensColor: string;
  lensGradient: string;
}

export const FRAME_OPTIONS = [
  { id: "PK002", name: "PK002", icon: "👓", dimensions: "52□23-149", image: "/PK002.png" },
  { id: "PK003", name: "PK003", icon: "🕶️", dimensions: "53□23-150", image: "/PK003.png" },
  { id: "PK005", name: "PK005", icon: "😎", dimensions: "51□24-149", image: "/PK005.png" },
  { id: "PK006", name: "PK006", icon: "⭕", dimensions: "53□24-149", image: "/PK006.png" },
  { id: "PK007", name: "PK007", icon: "🔲", dimensions: "53□21-150", image: "/PK007.png" },
  { id: "PK008", name: "PK008", icon: "👓", dimensions: "53□22-150", image: "/PK008.png" },
  { id: "PK009", name: "PK009", icon: "🕶️", dimensions: "53□23-149", image: "/PK009.png" },
  { id: "PK010", name: "PK010", icon: "😎", dimensions: "55□20-149", image: "/PK010.png" },
  { id: "PK011", name: "PK011", icon: "⭕", dimensions: "55□22-149", image: "/PK011.png" },
  { id: "PK8018", name: "PK8018-S", icon: "🔲", dimensions: "63□17-150", image: "/PK8018.png" },
];

export const LENS_COLORS = [
  { id: "blue-clear", name: "Blue to Clear", color: "#4A90D9", gradient: "linear-gradient(180deg, #4A90D9 0%, transparent 100%)" },
  { id: "solid-black", name: "Solid Black", color: "#1C1C1C", gradient: "linear-gradient(180deg, #1C1C1C, #1C1C1C)" },
  { id: "amber", name: "Amber", color: "#F4A460", gradient: "linear-gradient(180deg, #D4894A, #F4C490)" },
  { id: "rose", name: "Rose", color: "#E8A0B5", gradient: "linear-gradient(180deg, #E8A0B5 0%, transparent 100%)" },
  { id: "emerald", name: "Emerald", color: "#2E8B57", gradient: "linear-gradient(180deg, #2E8B57 0%, transparent 100%)" },
];

export const FRAME_BASE_PRICE = 45;
export const COATING_PRICE_PER_10 = 2;
