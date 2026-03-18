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
  { id: "PK008", name: "PK008", icon: "👓", dimensions: "53□22-150", image: "/PK008_-_CLEAR.png" },
  { id: "PK009", name: "PK009", icon: "🕶️", dimensions: "53□23-149", image: "/PK009_-_CLEAR.png" },
  { id: "PK010", name: "PK010", icon: "😎", dimensions: "55□20-149", image: "/PK010_-_CLEAR.png" },
  { id: "PK011", name: "PK011", icon: "⭕", dimensions: "55□22-149", image: "/PK011_-_CLEAR.png" },
  { id: "PK8018", name: "PK8018-S", icon: "🔲", dimensions: "63□17-150", image: "/PK8018_-_CLEAR.png" },
];

export const LENS_COLORS = [
  { id: "classic-grey", name: "Classic Grey", color: "#4A4A4A", gradient: "linear-gradient(180deg, #4A4A4A, #4A4A4A)" },
  { id: "warm-brown", name: "Warm Brown", color: "#6B4423", gradient: "linear-gradient(180deg, #6B4423, #6B4423)" },
  { id: "forest-green", name: "Forest Green", color: "#2D5016", gradient: "linear-gradient(180deg, #2D5016, #2D5016)" },
  { id: "rose-gold", name: "Rose Gold", color: "#E8A0B5", gradient: "linear-gradient(180deg, #D4A5C4, #E8A0B5)" },
  { id: "midnight-blue", name: "Midnight Blue", color: "#1E3A5F", gradient: "linear-gradient(180deg, #1E3A5F, #2E5A8F)" },
  { id: "amber-honey", name: "Amber Honey", color: "#D4894A", gradient: "linear-gradient(180deg, #D4894A, #F4C490)" },
  { id: "gradient-smoke", name: "Gradient Smoke", color: "#3A3A3A", gradient: "linear-gradient(180deg, #3A3A3A 0%, rgba(58,58,58,0.2) 100%)" },
  { id: "gradient-ocean", name: "Gradient Ocean", color: "#1E3A5F", gradient: "linear-gradient(180deg, #1E3A5F 0%, rgba(30,58,95,0.2) 100%)" },
  { id: "gradient-sunset", name: "Gradient Sunset", color: "#D4894A", gradient: "linear-gradient(180deg, #D4894A 0%, rgba(212,137,74,0.2) 100%)" },
  { id: "gradient-lavender", name: "Gradient Lavender", color: "#9B7BB8", gradient: "linear-gradient(180deg, #9B7BB8 0%, rgba(155,123,184,0.2) 100%)" },
  { id: "solid-black", name: "Solid Black", color: "#1C1C1C", gradient: "linear-gradient(180deg, #1C1C1C, #1C1C1C)" },
  { id: "crystal-clear", name: "Crystal Clear", color: "#FFFFFF", gradient: "linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1))" },
];

export const FRAME_BASE_PRICE = 45;
export const COATING_PRICE_PER_10 = 2;

export interface SunglassesAccessory {
  id: string;
  name: string;
  type: 'chain' | 'nosePad' | 'decal' | 'charm';
  emoji: string;
  price: number;
  color?: string;
  metallic?: string;
}

export interface PlacedAccessory {
  id: string;
  accessory: SunglassesAccessory;
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
}

export const SUNGLASSES_ACCESSORIES: SunglassesAccessory[] = [
  { id: "chain-gold", name: "Gold Chain", type: "chain", emoji: "🔗", price: 12.00, metallic: "linear-gradient(135deg, #FFED4E, #D4AF37)" },
  { id: "chain-silver", name: "Silver Chain", type: "chain", emoji: "⛓️", price: 10.00, metallic: "linear-gradient(135deg, #E8E8E8, #A0A0A0)" },
  { id: "chain-pearls", name: "Pearl Chain", type: "chain", emoji: "📿", price: 18.00, color: "#F5F5DC" },
  { id: "nosepads-silicone", name: "Comfort Nose Pads", type: "nosePad", emoji: "⬜", price: 3.00, color: "#E0E0E0" },
  { id: "nosepads-gold", name: "Gold Nose Pads", type: "nosePad", emoji: "🟨", price: 5.00, metallic: "linear-gradient(135deg, #FFED4E, #D4AF37)" },
  { id: "decal-star", name: "Star Decal", type: "decal", emoji: "⭐", price: 2.50, color: "#FFD700" },
  { id: "decal-heart", name: "Heart Decal", type: "decal", emoji: "❤️", price: 2.50, color: "#E63946" },
  { id: "decal-lightning", name: "Lightning Decal", type: "decal", emoji: "⚡", price: 2.50, color: "#FFEA00" },
  { id: "charm-moon", name: "Moon Charm", type: "charm", emoji: "🌙", price: 6.00, metallic: "linear-gradient(135deg, #E8E8E8, #A0A0A0)" },
  { id: "charm-sun", name: "Sun Charm", type: "charm", emoji: "☀️", price: 6.00, metallic: "linear-gradient(135deg, #FFED4E, #D4AF37)" },
];
