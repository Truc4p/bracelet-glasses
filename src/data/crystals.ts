export interface CrystalEntry {
  id: string;
  name: string;
  color: string;
  gradient?: string;
  price: number;
  emoji: string;
  image?: string;
  /** Current stock quantity. Use 999 for "unlimited / untracked". */
  stock: number;
  /** Optional labels, e.g. "popular", "new", "bestseller" */
  tags?: string[];
  description?: string;
}

export const DEFAULT_CRYSTALS: CrystalEntry[] = [
  {
    id: "amethyst",
    name: "Amethyst",
    color: "#9B59B6",
    gradient: "linear-gradient(135deg, #9B59B6, #8E44AD)",
    price: 3.50,
    emoji: "💜",
    image: "/crystals/amethyst.svg?v=2",
    stock: 999,
    tags: ["popular"],
    description: "A violet variety of quartz. Known for calming energy.",
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    color: "#F5B7C5",
    gradient: "linear-gradient(135deg, #F5B7C5, #E8A0B5)",
    price: 2.80,
    emoji: "🩷",
    image: "/crystals/rose-quartz.svg?v=2",
    stock: 999,
    tags: ["popular", "bestseller"],
    description: "Stone of love and compassion. Soft pink tones.",
  },
  {
    id: "clear-quartz",
    name: "Clear Quartz",
    color: "#E8E8E8",
    gradient: "linear-gradient(135deg, #F0F0F0, #D8D8D8)",
    price: 2.00,
    emoji: "🤍",
    image: "/crystals/clear-quartz.svg?v=2",
    stock: 999,
    description: "Master healer. Amplifies energy of other crystals.",
  },
  {
    id: "tigers-eye",
    name: "Tiger's Eye",
    color: "#B8860B",
    gradient: "linear-gradient(135deg, #DAA520, #B8860B)",
    price: 4.00,
    emoji: "🧡",
    image: "/crystals/tigers-eye.svg?v=2",
    stock: 999,
    description: "Golden-brown chatoyant gemstone. Promotes courage.",
  },
  {
    id: "lapis-lazuli",
    name: "Lapis Lazuli",
    color: "#1E3A5F",
    gradient: "linear-gradient(135deg, #26508E, #1E3A5F)",
    price: 5.00,
    emoji: "💙",
    image: "/crystals/lapis-lazuli.svg?v=2",
    stock: 999,
    tags: ["popular"],
    description: "Deep celestial blue. Used for wisdom and truth.",
  },
  {
    id: "jade",
    name: "Jade",
    color: "#00A86B",
    gradient: "linear-gradient(135deg, #00C878, #00A86B)",
    price: 4.50,
    emoji: "💚",
    image: "/crystals/jade.svg?v=2",
    stock: 999,
    description: "Protective stone. Brings harmony and prosperity.",
  },
  {
    id: "citrine",
    name: "Citrine",
    color: "#F4C430",
    gradient: "linear-gradient(135deg, #FFD700, #F4C430)",
    price: 3.00,
    emoji: "💛",
    image: "/crystals/citrine.svg?v=2",
    stock: 999,
    tags: ["new"],
    description: "Sunny yellow quartz. Stone of abundance and joy.",
  },
  {
    id: "obsidian",
    name: "Obsidian",
    color: "#2C2C2C",
    gradient: "linear-gradient(135deg, #3C3C3C, #1C1C1C)",
    price: 2.50,
    emoji: "🖤",
    image: "/crystals/obsidian.svg?v=2",
    stock: 999,
    description: "Volcanic glass. Powerful protection and grounding.",
  },
  {
    id: "moonstone",
    name: "Moonstone",
    color: "#C4C4DE",
    gradient: "linear-gradient(135deg, #D4D4EE, #B4B4CE)",
    price: 4.20,
    emoji: "🩶",
    image: "/crystals/moonstone.svg?v=2",
    stock: 999,
    tags: ["popular"],
    description: "Shimmering adularescence. Stone of intuition.",
  },
  {
    id: "carnelian",
    name: "Carnelian",
    color: "#CC5500",
    gradient: "linear-gradient(135deg, #E06020, #CC5500)",
    price: 3.20,
    emoji: "❤️‍🔥",
    image: "/crystals/carnelian.svg?v=2",
    stock: 999,
    description: "Warm orange-red. Boosts motivation and creativity.",
  },
];
