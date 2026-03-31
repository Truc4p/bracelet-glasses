// shadeMap data is now fetched directly from the database or API.
export interface FrameEntry {
  id: string;
  name: string;
  dimensions: string;
  description: string;
  images: string[];
}

const STATIC_FRAMES = [
  { id: "black-out", name: "Black Out", dimensions: "52□23-149", description: "", images: ["/glasses/frames/BLACK_OUT.jpg"] },
  { id: "blonde-clear", name: "Blonde Clear", dimensions: "53□23-150", description: "", images: ["/glasses/frames/Blonde_Clear.jpg"] },
  { id: "light-grey", name: "Light Grey", dimensions: "51□24-149", description: "", images: ["/glasses/frames/Light_Grey.jpg"] },
  { id: "tortoise-out", name: "Tortoise Out", dimensions: "53□24-149", description: "", images: ["/glasses/frames/TORTOISE_OUT.jpg"] },
];

export const DEFAULT_FRAMES: FrameEntry[] = STATIC_FRAMES;
