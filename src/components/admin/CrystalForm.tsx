import { useState, useEffect } from "react";
import { X, Upload, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CrystalEntry } from "@/data/crystals";
import type { SpacerEntry } from "@/data/spacers";
import type { CharmEntry } from "@/data/charms";

// ── Crystal Form ─────────────────────────────────────────────────────────────

interface CrystalFormProps {
  initial?: CrystalEntry;
  onSave: (entry: CrystalEntry) => void;
  onCancel: () => void;
}

export const CrystalForm = ({ initial, onSave, onCancel }: CrystalFormProps) => {
  const blank: CrystalEntry = {
    id: "", name: "", color: "#9B59B6", gradient: "", price: 1.00,
    emoji: "💎", image: "", stock: 999, tags: [], description: "",
  };
  const [form, setForm] = useState<CrystalEntry>(initial ?? blank);
  const [showPreview, setShowPreview] = useState(false);

  const set = (k: keyof CrystalEntry, v: string | number | string[]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const id = form.id || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    onSave({ ...form, id });
  };

  const tagString = (form.tags ?? []).join(", ");

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Turquoise"
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Price ($)</label>
          <input
            type="number" min={0} step={0.01}
            value={form.price}
            onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Stock (999 = unlimited)</label>
          <input
            type="number" min={0}
            value={form.stock}
            onChange={(e) => set("stock", parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Fallback Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color" value={form.color}
              onChange={(e) => set("color", e.target.value)}
              className="w-9 h-9 rounded border border-border cursor-pointer bg-transparent"
            />
            <input
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Emoji</label>
          <input
            value={form.emoji}
            onChange={(e) => set("emoji", e.target.value)}
            maxLength={4}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body text-center text-lg"
          />
        </div>

        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Image Path</label>
          <div className="flex gap-2">
            <input
              value={form.image ?? ""}
              onChange={(e) => set("image", e.target.value)}
              placeholder="/crystals/your-image.jpg"
              className="flex-1 px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors"
              title="Preview image"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {showPreview && form.image && (
            <div className="mt-2 flex items-center gap-3">
              <img
                src={form.image}
                alt="preview"
                className="w-12 h-12 rounded-full object-cover border border-border shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-xs text-muted-foreground">Falls back to color if image not found</span>
            </div>
          )}
        </div>

        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Tags <span className="font-normal opacity-60">(comma-separated, e.g. popular, new)</span></label>
          <input
            value={tagString}
            onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
            placeholder="popular, new, bestseller"
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body"
          />
        </div>

        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
          <textarea
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            placeholder="Brief description of this crystal..."
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body resize-none"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" variant="default" className="flex-1">
          {initial ? "Save Changes" : "Add Crystal"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

// ── Spacer Form ───────────────────────────────────────────────────────────────

interface SpacerFormProps {
  initial?: SpacerEntry;
  onSave: (entry: SpacerEntry) => void;
  onCancel: () => void;
}

export const SpacerForm = ({ initial, onSave, onCancel }: SpacerFormProps) => {
  const blank: SpacerEntry = {
    id: "", name: "", color: "#C0C0C0",
    metallic: "linear-gradient(135deg, #E8E8E8, #A0A0A0)",
    price: 1.50, emoji: "⚪", image: "", stock: 999, tags: [], description: "",
  };
  const [form, setForm] = useState<SpacerEntry>(initial ?? blank);
  const set = (k: keyof SpacerEntry, v: string | number | string[]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const id = form.id || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    onSave({ ...form, id });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Name *</label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Platinum" className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Price ($)</label>
          <input type="number" min={0} step={0.01} value={form.price}
            onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Stock</label>
          <input type="number" min={0} value={form.stock}
            onChange={(e) => set("stock", parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Color</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={form.color} onChange={(e) => set("color", e.target.value)}
              className="w-9 h-9 rounded border border-border cursor-pointer bg-transparent" />
            <input value={form.color} onChange={(e) => set("color", e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body font-mono" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Emoji</label>
          <input value={form.emoji} onChange={(e) => set("emoji", e.target.value)} maxLength={4}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body text-center text-lg" />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Image Path</label>
          <input
            value={form.image ?? ""}
            onChange={(e) => set("image", e.target.value)}
            placeholder="/spacers/your-image.svg"
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body font-mono"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" className="flex-1">{initial ? "Save Changes" : "Add Spacer"}</Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

// ── Charm Form ────────────────────────────────────────────────────────────────

interface CharmFormProps {
  initial?: CharmEntry;
  onSave: (entry: CharmEntry) => void;
  onCancel: () => void;
}

export const CharmForm = ({ initial, onSave, onCancel }: CharmFormProps) => {
  const blank: CharmEntry = {
    id: "", name: "", animal: "", design: "classic",
    price: 8.00, emoji: "🔮", stock: 999,
  };
  const [form, setForm] = useState<CharmEntry>(initial ?? blank);
  const set = (k: keyof CharmEntry, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const id = form.id || `${form.animal.toLowerCase()}-${form.design}-custom`;
    onSave({ ...form, id });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Name *</label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Animal</label>
          <input value={form.animal} onChange={(e) => set("animal", e.target.value)}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Design</label>
          <select value={form.design} onChange={(e) => set("design", e.target.value as "classic" | "modern")}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body">
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Emoji</label>
          <input value={form.emoji} onChange={(e) => set("emoji", e.target.value)} maxLength={4}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body text-center text-lg" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Price ($)</label>
          <input type="number" min={0} step={0.01} value={form.price}
            onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Stock</label>
          <input type="number" min={0} value={form.stock}
            onChange={(e) => set("stock", parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body" />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" className="flex-1">{initial ? "Save Changes" : "Add Charm"}</Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};
