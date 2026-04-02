/**
 * luxe-data.ts
 *
 * This file re-exports everything that the rest of the app uses, but now
 * sources its data from the `src/data/` registry layer so that crystals,
 * spacers, and charms are managed in one place (with localStorage persistence
 * via `useCatalogue()`).
 *
 * The type names and all function signatures remain exactly the same so no
 * other component needs to change.
 */

// ── Types ────────────────────────────────────────────────────────────────────

import { DEFAULT_CRYSTALS } from "@/data/crystals";
import { DEFAULT_SPACERS } from "@/data/spacers";
import { DEFAULT_CHARMS } from "@/data/charms";
import { DEFAULT_FRAMES } from "@/data/glasses";
import { getCatalogueSnapshot } from "@/data/index";

// Re-export entry types under the legacy names used across the app
export type { CrystalEntry as CrystalBead } from "@/data/crystals";
export type { SpacerEntry as Spacer } from "@/data/spacers";
export type { CharmEntry as ZodiacCharm } from "@/data/charms";

// Provide CrystalBead / Spacer / ZodiacCharm as inline aliases too
// (some files import them individually)
import type { CrystalEntry } from "@/data/crystals";
import type { SpacerEntry } from "@/data/spacers";
import type { CharmEntry } from "@/data/charms";

export type CrystalBeadAlias = CrystalEntry;
export type SpacerAlias = SpacerEntry;
export type ZodiacCharmAlias = CharmEntry;

// ── Static catalogue snapshots (read at module load time) ────────────────────
// Used by components that don't use the hook (legacy consumers).
// After any admin edit they should re-render via the hook, but these keep
// backward-compat for any static/non-hook imports.

/**
 * Returns the current catalogue snapshot (defaults merged with localStorage).
 * Falls back to the compile-time defaults if localStorage is unavailable.
 */
function snapshot() {
  if (typeof window === "undefined") {
    return { crystals: DEFAULT_CRYSTALS, spacers: DEFAULT_SPACERS, charms: DEFAULT_CHARMS, frames: DEFAULT_FRAMES };
  }
  return getCatalogueSnapshot();
}

export const CRYSTAL_LIBRARY: CrystalEntry[] = snapshot().crystals;
export const SPACERS: SpacerEntry[] = snapshot().spacers;
export const ZODIAC_CHARMS: CharmEntry[] = snapshot().charms;

export const ZODIAC_ANIMALS: string[] = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig",
];

// ── Business-logic helpers (unchanged) ───────────────────────────────────────

export type BeadSize = 6 | 8 | 10;
export type ItemType = "crystal" | "spacer" | "charm";

export interface PlacedBead {
  position: number;
  type: ItemType;
  crystal?: CrystalEntry;
  spacer?: SpacerEntry;
  charm?: CharmEntry;
  beadSize: BeadSize;
}

export function calculateBeadPrice(basePrice: number, beadSize: BeadSize): number {
  const multiplier = beadSize === 6 ? 0.8 : beadSize === 8 ? 1.0 : 1.3;
  return basePrice * multiplier;
}

export function calculateBeadCount(wristSizeCm: number, beadSizeMm: number): number {
  const beadCount = Math.round((wristSizeCm * 10) / beadSizeMm);
  return Math.max(beadCount, 8);
}

// ── Sunglasses types & data (unchanged) ─────────────────────────────────────

export interface SunglassesConfig {
  frame: string;
  tintDensity: number;
  lensColor: string;
  lensGradient: string;
}

export type FrameOption = FrameEntry;

export const FRAME_OPTIONS: FrameOption[] = snapshot().frames;

export const LENS_COLORS = [
  { id: "amber", name: "Amber", image: "" },
  { id: "american-grey-fade", name: "American Grey Fade", image: "" },
  { id: "aqua-sunrise", name: "Aqua Sunrise", image: "" },
  { id: "bel-air-blue", name: "Bel Air Blue", image: "" },
  { id: "big-apple-fade", name: "Big Apple Fade", image: "" },
  { id: "broadway-blue-fade", name: "Broadway Blue Fade", image: "" },
  { id: "cabernet", name: "Cabernet", image: "" },
  { id: "candy-corn", name: "Candy Corn", image: "" },
  { id: "celebrity-blue", name: "Celebrity Blue", image: "" },
  { id: "chestnut-fade", name: "Chestnut Fade", image: "" },
  { id: "city-lights", name: "City Lights", image: "" },
  { id: "denim-blue", name: "Denim Blue", image: "" },
  { id: "forest-wood", name: "Forest Wood", image: "" },
  { id: "g-15-fade", name: "G-15 Fade", image: "" },
  { id: "garnet-green", name: "Garnet Green", image: "" },
  { id: "lavender", name: "Lavender", image: "" },
  { id: "limelight", name: "Limelight", image: "" },
  { id: "mellow-yellow", name: "Mellow Yellow", image: "" },
  { id: "new-york-rose", name: "New York Rose", image: "" },
  { id: "pastel-yellow", name: "Pastel Yellow", image: "" },
  { id: "purple-nurple", name: "Purple Nurple", image: "" },
  { id: "root-beer-fade", name: "Root Beer Fade", image: "" },
  { id: "turquoise", name: "Turquoise", image: "" },
  { id: "woodstock-orange", name: "Woodstock Orange", image: "" },
];

export const FRAME_BASE_PRICE = 45;
export const COATING_PRICE_PER_10 = 2;

export interface SunglassesAccessory {
  id: string;
  name: string;
  type: "chain" | "nosePad" | "decal" | "charm";
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
