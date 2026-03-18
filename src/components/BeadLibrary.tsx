import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { CRYSTAL_LIBRARY, type CrystalBead } from "@/lib/luxe-data";

interface BeadLibraryProps {
  onSelectBead: (bead: CrystalBead) => void;
  open: boolean;
  onClose: () => void;
}

const BeadLibrary = ({ onSelectBead, open, onClose }: BeadLibraryProps) => {
  const [search, setSearch] = useState("");

  const filteredCrystals = useMemo(
    () => CRYSTAL_LIBRARY.filter((b) => b.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  if (!open) return null;

  return (
    <div className="absolute left-0 top-0 bottom-0 w-72 glass-panel rounded-lg z-20 flex flex-col animate-slide-in">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-display text-sm font-semibold">Crystal Library</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search crystals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredCrystals.map((bead) => (
          <button
            key={bead.id}
            onClick={() => onSelectBead(bead)}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = "copy";
              e.dataTransfer.setData("application/json", JSON.stringify({ type: 'crystal', item: bead }));
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted/60 transition-colors text-left group cursor-grab active:cursor-grabbing"
          >
            <div
              className="w-7 h-7 rounded-full border border-border/50 flex-shrink-0 shadow-sm"
              style={{ background: bead.gradient || bead.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{bead.name}</p>
              <p className="text-xs text-muted-foreground">${bead.price.toFixed(2)} / bead</p>
            </div>
            <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Drag or Click
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BeadLibrary;
