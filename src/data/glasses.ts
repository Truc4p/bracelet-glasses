// shadeMap data is now fetched directly from the database or API.
export interface FrameEntry {
  id: string;
  name: string;
  icon: string;
  dimensions: string;
  image: string;
  clearImage?: string;
  shades: Record<string, string | null>;
}

const STATIC_FRAMES = [
  { id: "black-out", name: "Black Out", icon: "👓", dimensions: "52□23-149", image: "/glasses/frames/BLACK_OUT.jpg" },
  { id: "blonde-clear", name: "Blonde Clear", icon: "🕶️", dimensions: "53□23-150", image: "/glasses/frames/Blonde_Clear.jpg" },
  { id: "light-grey", name: "Light Grey", icon: "😎", dimensions: "51□24-149", image: "/glasses/frames/Light_Grey.jpg" },
  { id: "tortoise-out", name: "Tortoise Out", icon: "⭕", dimensions: "53□24-149", image: "/glasses/frames/TORTOISE_OUT.jpg" },
];

export const DEFAULT_FRAMES: FrameEntry[] = STATIC_FRAMES.map((f) => ({
  ...f,
  shades: {} // Intentionally empty, will be populated dynamically from MongoDB via API
}));
