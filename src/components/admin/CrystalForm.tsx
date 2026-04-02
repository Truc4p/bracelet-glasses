import { useState } from "react";
import { Upload } from "lucide-react";
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
    id: "", name: "", price: 1.00, image: "", description: "",
  };
  const [form, setForm] = useState<CrystalEntry>(initial ?? blank);
  const [showPreview, setShowPreview] = useState(false);

  const set = (k: keyof CrystalEntry, v: string | number) =>
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
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Turquoise"
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-colors font-body"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Price ($)</label>
          <input
            type="number" min={0} step={0.01}
            value={form.price}
            onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-colors font-body"
          />
        </div>

        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Product Image</label>
          <div className="flex items-center gap-4 p-3 border border-border rounded-md bg-muted/20">
            <div className="relative w-16 h-16 rounded-md border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/50 hover:bg-muted focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all group cursor-pointer">
              {form.image ? (
                <img src={form.image} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <Upload className="w-5 h-5 text-muted-foreground group-hover:scale-110 transition-transform" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      set("image", ev.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Upload image
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 mb-1.5">
                PNG, JPG or SVG.
              </p>
              {form.image && (
                <button
                  type="button"
                  onClick={() => set("image", "")}
                  className="text-xs text-destructive hover:underline"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
          <textarea
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            placeholder="Brief description of this crystal..."
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-colors font-body resize-none"
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
            placeholder="e.g. Platinum" className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-colors font-body" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Price ($)</label>
          <input type="number" min={0} step={0.01} value={form.price}
            onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-colors font-body" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Stock</label>
          <input type="number" min={0} value={form.stock}
            onChange={(e) => set("stock", parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-colors font-body" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Color</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={form.color} onChange={(e) => set("color", e.target.value)}
              className="w-9 h-9 rounded border border-border cursor-pointer bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
            <input value={form.color} onChange={(e) => set("color", e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-colors font-body font-mono" />
          </div>
        </div>
        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Product Image</label>
          <div className="flex items-center gap-4 p-3 border border-border rounded-md bg-muted/20">
            <div className="relative w-16 h-16 rounded-md border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/50 hover:bg-muted focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all group cursor-pointer">
              {form.image ? (
                <img src={form.image} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <Upload className="w-5 h-5 text-muted-foreground group-hover:scale-110 transition-transform" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      set("image", ev.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Upload image
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 mb-1.5">
                PNG, JPG or SVG. Falls back to color if missing.
              </p>
              {form.image && (
                <button
                  type="button"
                  onClick={() => set("image", "")}
                  className="text-xs text-destructive hover:underline"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>
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
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-colors font-body" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Animal</label>
          <input value={form.animal} onChange={(e) => set("animal", e.target.value)}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-colors font-body" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Design</label>
          <select value={form.design} onChange={(e) => set("design", e.target.value as "classic" | "modern")}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-colors font-body">
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Product Image</label>
          <div className="flex items-center gap-4 p-3 border border-border rounded-md bg-muted/20">
            <div className="relative w-16 h-16 rounded-md border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/50 hover:bg-muted focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all group cursor-pointer">
              {form.image ? (
                <img src={form.image} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <Upload className="w-5 h-5 text-muted-foreground group-hover:scale-110 transition-transform" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      set("image", ev.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Upload image
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 mb-1.5">
                PNG, JPG or SVG. Falls back to emoji if missing.
              </p>
              {form.image && (
                <button
                  type="button"
                  onClick={() => set("image", "")}
                  className="text-xs text-destructive hover:underline"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Price ($)</label>
          <input type="number" min={0} step={0.01} value={form.price}
            onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-colors font-body" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Stock</label>
          <input type="number" min={0} value={form.stock}
            onChange={(e) => set("stock", parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-background transition-colors font-body" />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" className="flex-1">{initial ? "Save Changes" : "Add Charm"}</Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};
