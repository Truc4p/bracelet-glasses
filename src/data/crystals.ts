export interface CrystalEntry {
  id: string;        // Client side identifier
  _id?: string;      // MongoDB identifier
  name: string;
  price: number;
  image: string;
  type?: string;
  description: string;
}

const STATIC_CRYSTALS: CrystalEntry[] = [];

export const DEFAULT_CRYSTALS: CrystalEntry[] = STATIC_CRYSTALS;
