import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FrameEntry } from "@/data/glasses";

interface FrameFormProps {
  initial?: FrameEntry;
  onSave: (entry: FrameEntry) => void;
  onCancel: () => void;
}

export const FrameForm = ({ initial, onSave, onCancel }: FrameFormProps) => {
  const blank: FrameEntry = {
    id: "", name: "", icon: "👓", dimensions: "", image: "", clearImage: "", shades: {}
  };
  const [form, setForm] = useState<FrameEntry>(initial ?? blank);
  const [shades, setShades] = useState<Array<{ lensId: string; image: string }>>(
    Object.entries(initial?.shades || {}).map(([lensId, image]) => ({ lensId, image: image || "" }))
  );

  const set = (k: keyof FrameEntry, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const addShade = () => setShades((prev) => [...prev, { lensId: "", image: "" }]);
  
  const updateShade = (index: number, key: "lensId" | "image", value: string) => {
    const updated = [...shades];
    updated[index][key] = value;
    setShades(updated);
  };
  
  const removeShade = (index: number) => {
    setShades((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const id = form.id || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    const shadesRecord: Record<string, string> = {};
    for (const shade of shades) {
      if (shade.lensId.trim() && shade.image.trim()) {
        shadesRecord[shade.lensId.trim()] = shade.image.trim();
      }
    }
    
    onSave({ ...form, id, shades: shadesRecord });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Frame Name *</label>
          <input
            autoFocus
            required
            className="w-full text-sm border border-border rounded p-2 bg-background focus:ring-1 focus:ring-primary outline-none"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Black Out"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Icon</label>
          <input
            className="w-full text-sm border border-border rounded p-2 bg-background focus:ring-1 focus:ring-primary outline-none"
            value={form.icon}
            onChange={(e) => set("icon", e.target.value)}
            placeholder="e.g. 👓"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Dimensions</label>
          <input
            className="w-full text-sm border border-border rounded p-2 bg-background focus:ring-1 focus:ring-primary outline-none"
            value={form.dimensions}
            onChange={(e) => set("dimensions", e.target.value)}
            placeholder="e.g. 52□23-149"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Base Image URL *</label>
          <input
            required
            className="w-full text-sm border border-border rounded p-2 bg-background focus:ring-1 focus:ring-primary outline-none"
            value={form.image}
            onChange={(e) => set("image", e.target.value)}
            placeholder="/glasses/frames/BLACK_OUT.jpg"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Clear Image URL (Optional)</label>
          <input
            className="w-full text-sm border border-border rounded p-2 bg-background focus:ring-1 focus:ring-primary outline-none"
            value={form.clearImage || ""}
            onChange={(e) => set("clearImage", e.target.value)}
            placeholder="/glasses/frames/BLACK_OUT_CLEAR.jpg"
          />
        </div>
      </div>
      
      <div className="border-t border-border pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-foreground">Shade Profiles</label>
          <Button type="button" variant="outline" size="sm" onClick={addShade} className="h-7 text-xs gap-1">
            <Plus className="w-3 h-3" /> Add Profile
          </Button>
        </div>
        <div className="space-y-3 pr-1 pb-1">
          {shades.length === 0 && (
            <div className="text-xs text-muted-foreground italic text-center py-2">No shade profiles added.</div>
          )}
          {shades.map((shade, i) => (
            <div key={i} className="flex gap-2 items-start bg-muted/30 p-2 rounded border border-border">
              <div className="flex-1 flex flex-col sm:flex-row gap-2">
                <input
                  required
                  placeholder="Lens ID (e.g. amber)"
                  className="sm:w-1/3 w-full text-sm font-mono border border-border rounded p-2 focus:ring-1 focus:ring-primary outline-none bg-background"
                  value={shade.lensId}
                  onChange={(e) => updateShade(i, "lensId", e.target.value)}
                />
                <input
                  required
                  placeholder="Image URL"
                  className="flex-1 w-full text-sm border border-border rounded p-2 focus:ring-1 focus:ring-primary outline-none bg-background"
                  value={shade.image}
                  onChange={(e) => updateShade(i, "image", e.target.value)}
                />
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeShade(i)} className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Frame</Button>
      </div>
    </form>
  );
};