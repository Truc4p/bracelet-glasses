export interface CrystalBead {
  id: string;
  name: string;
  color: string;
  gradient?: string;
  price: number;
  emoji: string;
  image?: string;
}

export interface Spacer {
  id: string;
  name: string;
  color: string;
  metallic: string;
  price: number;
  emoji: string;
}

export interface ZodiacCharm {
  id: string;
  name: string;
  animal: string;
  design: 'classic' | 'modern';
  price: number;
  emoji: string;
}

export function calculateBeadPrice(basePrice: number, beadSize: BeadSize): number {
  const sizeMultiplier = beadSize === 6 ? 0.8 : beadSize === 8 ? 1.0 : 1.3;
  return basePrice * sizeMultiplier;
}

export const CRYSTAL_LIBRARY: CrystalBead[] = [
  { id: "amethyst", name: "Amethyst", color: "#9B59B6", gradient: "linear-gradient(135deg, #9B59B6, #8E44AD)", price: 3.50, emoji: "💜", image: "/crystals/amethyst.jpg" },
  { id: "rose-quartz", name: "Rose Quartz", color: "#F5B7C5", gradient: "linear-gradient(135deg, #F5B7C5, #E8A0B5)", price: 2.80, emoji: "🩷", image: "/crystals/rose-quartz.jpg" },
  { id: "clear-quartz", name: "Clear Quartz", color: "#E8E8E8", gradient: "linear-gradient(135deg, #F0F0F0, #D8D8D8)", price: 2.00, emoji: "🤍", image: "/crystals/clear-quartz.jpg" },
  { id: "tigers-eye", name: "Tiger's Eye", color: "#B8860B", gradient: "linear-gradient(135deg, #DAA520, #B8860B)", price: 4.00, emoji: "🧡", image: "/crystals/tigers-eye.jpg" },
  { id: "lapis-lazuli", name: "Lapis Lazuli", color: "#1E3A5F", gradient: "linear-gradient(135deg, #26508E, #1E3A5F)", price: 5.00, emoji: "💙", image: "/crystals/lapis-lazuli.jpg" },
  { id: "jade", name: "Jade", color: "#00A86B", gradient: "linear-gradient(135deg, #00C878, #00A86B)", price: 4.50, emoji: "💚", image: "/crystals/jade.jpg" },
  { id: "citrine", name: "Citrine", color: "#F4C430", gradient: "linear-gradient(135deg, #FFD700, #F4C430)", price: 3.00, emoji: "💛", image: "/crystals/citrine.jpg" },
  { id: "obsidian", name: "Obsidian", color: "#2C2C2C", gradient: "linear-gradient(135deg, #3C3C3C, #1C1C1C)", price: 2.50, emoji: "🖤", image: "/crystals/obsidian.jpg" },
  { id: "moonstone", name: "Moonstone", color: "#C4C4DE", gradient: "linear-gradient(135deg, #D4D4EE, #B4B4CE)", price: 4.20, emoji: "🩶", image: "/crystals/moonstone.jpg" },
  { id: "carnelian", name: "Carnelian", color: "#CC5500", gradient: "linear-gradient(135deg, #E06020, #CC5500)", price: 3.20, emoji: "❤️‍🔥", image: "/crystals/carnelian.jpg" },
];

export const SPACERS: Spacer[] = [
  { id: "silver", name: "Silver", color: "#C0C0C0", metallic: "linear-gradient(135deg, #E8E8E8, #A0A0A0)", price: 1.50, emoji: "⚪" },
  { id: "gold", name: "Gold", color: "#FFD700", metallic: "linear-gradient(135deg, #FFED4E, #D4AF37)", price: 2.00, emoji: "🟡" },
  { id: "rose-gold", name: "Rose Gold", color: "#E0BFB8", metallic: "linear-gradient(135deg, #F5D5CB, #C9A99E)", price: 2.50, emoji: "🌸" },
];

export const ZODIAC_ANIMALS = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"
];

export const ZODIAC_CHARMS: ZodiacCharm[] = [
  { id: "rat-classic", name: "Rat", animal: "Rat", design: 'classic', price: 8.00, emoji: "🐀" },
  { id: "rat-modern", name: "Rat", animal: "Rat", design: 'modern', price: 8.00, emoji: "🐀" },
  { id: "ox-classic", name: "Ox", animal: "Ox", design: 'classic', price: 8.00, emoji: "🐂" },
  { id: "ox-modern", name: "Ox", animal: "Ox", design: 'modern', price: 8.00, emoji: "🐂" },
  { id: "tiger-classic", name: "Tiger", animal: "Tiger", design: 'classic', price: 8.00, emoji: "🐅" },
  { id: "tiger-modern", name: "Tiger", animal: "Tiger", design: 'modern', price: 8.00, emoji: "🐅" },
  { id: "rabbit-classic", name: "Rabbit", animal: "Rabbit", design: 'classic', price: 8.00, emoji: "🐇" },
  { id: "rabbit-modern", name: "Rabbit", animal: "Rabbit", design: 'modern', price: 8.00, emoji: "🐇" },
  { id: "dragon-classic", name: "Dragon", animal: "Dragon", design: 'classic', price: 8.00, emoji: "🐉" },
  { id: "dragon-modern", name: "Dragon", animal: "Dragon", design: 'modern', price: 8.00, emoji: "🐉" },
  { id: "snake-classic", name: "Snake", animal: "Snake", design: 'classic', price: 8.00, emoji: "🐍" },
  { id: "snake-modern", name: "Snake", animal: "Snake", design: 'modern', price: 8.00, emoji: "🐍" },
  { id: "horse-classic", name: "Horse", animal: "Horse", design: 'classic', price: 8.00, emoji: "🐴" },
  { id: "horse-modern", name: "Horse", animal: "Horse", design: 'modern', price: 8.00, emoji: "🐴" },
  { id: "goat-classic", name: "Goat", animal: "Goat", design: 'classic', price: 8.00, emoji: "🐐" },
  { id: "goat-modern", name: "Goat", animal: "Goat", design: 'modern', price: 8.00, emoji: "🐐" },
  { id: "monkey-classic", name: "Monkey", animal: "Monkey", design: 'classic', price: 8.00, emoji: "🐵" },
  { id: "monkey-modern", name: "Monkey", animal: "Monkey", design: 'modern', price: 8.00, emoji: "🐵" },
  { id: "rooster-classic", name: "Rooster", animal: "Rooster", design: 'classic', price: 8.00, emoji: "🐓" },
  { id: "rooster-modern", name: "Rooster", animal: "Rooster", design: 'modern', price: 8.00, emoji: "🐓" },
  { id: "dog-classic", name: "Dog", animal: "Dog", design: 'classic', price: 8.00, emoji: "🐕" },
  { id: "dog-modern", name: "Dog", animal: "Dog", design: 'modern', price: 8.00, emoji: "🐕" },
  { id: "pig-classic", name: "Pig", animal: "Pig", design: 'classic', price: 8.00, emoji: "🐖" },
  { id: "pig-modern", name: "Pig", animal: "Pig", design: 'modern', price: 8.00, emoji: "🐖" },
];

export function calculateBeadCount(wristSizeCm: number, beadSizeMm: number): number {
  const wristCircumferenceMm = wristSizeCm * 10;
  const beadCount = Math.round(wristCircumferenceMm / beadSizeMm);
  return Math.max(beadCount, 8);
}

export type BeadSize = 6 | 8 | 10;

export type ItemType = 'crystal' | 'spacer' | 'charm';

export interface PlacedBead {
  position: number;
  type: ItemType;
  crystal?: CrystalBead;
  spacer?: Spacer;
  charm?: ZodiacCharm;
  beadSize: BeadSize;
}

export interface SunglassesConfig {
  frame: string;
  tintDensity: number;
  lensColor: string;
  lensGradient: string;
}

export interface FrameOption {
  id: string;
  name: string;
  icon: string;
  dimensions: string;
  image: string;
  clearImage?: string;
}

export const FRAME_OPTIONS: FrameOption[] = [
  { id: "PK002", name: "PK002", icon: "👓", dimensions: "52□23-149", image: "/PK002.png" },
  { id: "PK003", name: "PK003", icon: "🕶️", dimensions: "53□23-150", image: "/PK003.png" },
  { id: "PK005", name: "PK005", icon: "😎", dimensions: "51□24-149", image: "/PK005.png" },
  { id: "PK006", name: "PK006", icon: "⭕", dimensions: "53□24-149", image: "/PK006.png" },
  { id: "PK007", name: "PK007", icon: "🔲", dimensions: "53□21-150", image: "/PK007.png" },
  { id: "PK008", name: "PK008", icon: "👓", dimensions: "53□22-150", image: "/PK008.png", clearImage: "/PK008_-_CLEAR.png" },
  { id: "PK009", name: "PK009", icon: "🕶️", dimensions: "53□23-149", image: "/PK009.png", clearImage: "/PK009_-_CLEAR.png" },
  { id: "PK010", name: "PK010", icon: "😎", dimensions: "55□20-149", image: "/PK010.png", clearImage: "/PK010_-_CLEAR.png" },
  { id: "PK011", name: "PK011", icon: "⭕", dimensions: "55□22-149", image: "/PK011.png", clearImage: "/PK011_-_CLEAR.png" },
  { id: "PK8018", name: "PK8018-S", icon: "🔲", dimensions: "63□17-150", image: "/PK8018.png", clearImage: "/PK8018_-_CLEAR.png" },
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
