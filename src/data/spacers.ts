export interface SpacerEntry {
  id: string;
  name: string;
  color: string;
  metallic: string;
  price: number;
  emoji: string;
  stock: number;
  tags?: string[];
  description?: string;
}

export const DEFAULT_SPACERS: SpacerEntry[] = [
  {
    id: "silver",
    name: "Silver",
    color: "#C0C0C0",
    metallic: "linear-gradient(135deg, #E8E8E8, #A0A0A0)",
    price: 1.50,
    emoji: "⚪",
    stock: 999,
    description: "Classic silver metal spacer bead.",
  },
  {
    id: "gold",
    name: "Gold",
    color: "#FFD700",
    metallic: "linear-gradient(135deg, #FFED4E, #D4AF37)",
    price: 2.00,
    emoji: "🟡",
    stock: 999,
    tags: ["popular"],
    description: "Luxurious gold-tone metal spacer bead.",
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    color: "#E0BFB8",
    metallic: "linear-gradient(135deg, #F5D5CB, #C9A99E)",
    price: 2.50,
    emoji: "🌸",
    stock: 999,
    tags: ["popular", "bestseller"],
    description: "Trendy rose gold tone spacer bead.",
  },
];
