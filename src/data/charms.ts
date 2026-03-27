export interface CharmEntry {
  id: string;
  name: string;
  animal: string;
  design: 'classic' | 'modern';
  price: number;
  emoji: string;
  image?: string;
  stock: number;
  tags?: string[];
  description?: string;
}

const makeCharms = (
  animal: string,
  emoji: string,
  price = 8.00,
): CharmEntry[] => [
  {
    id: `${animal.toLowerCase()}-classic`,
    name: animal,
    animal,
    design: 'classic',
    price,
    emoji,
    stock: 999,
  },
  {
    id: `${animal.toLowerCase()}-modern`,
    name: animal,
    animal,
    design: 'modern',
    price,
    emoji,
    stock: 999,
  },
];

export const DEFAULT_CHARMS: CharmEntry[] = [
  ...makeCharms("Rat", "🐀"),
  ...makeCharms("Ox", "🐂"),
  ...makeCharms("Tiger", "🐅"),
  ...makeCharms("Rabbit", "🐇"),
  ...makeCharms("Dragon", "🐉"),
  ...makeCharms("Snake", "🐍"),
  ...makeCharms("Horse", "🐴"),
  ...makeCharms("Goat", "🐐"),
  ...makeCharms("Monkey", "🐵"),
  ...makeCharms("Rooster", "🐓"),
  ...makeCharms("Dog", "🐕"),
  ...makeCharms("Pig", "🐖"),
];
