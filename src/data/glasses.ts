// shadeMap data is now fetched directly from the database or API.
export interface FrameEntry {
  id: string;
  name: string;
  dimensions: string;
  description: string;
  images: string[];
}

const STATIC_FRAMES: FrameEntry[] = [];

export const DEFAULT_FRAMES: FrameEntry[] = STATIC_FRAMES;
