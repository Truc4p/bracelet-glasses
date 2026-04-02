import { useState, useMemo } from "react";
import { Search, X, Info } from "lucide-react";
import { useCatalogue } from "@/data/index";
import type { CrystalEntry } from "@/data/crystals";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ── Types that the rest of the app still uses via the legacy name ──────────
// BeadLibrary is passed a CrystalEntry (same shape as the old CrystalBead)
type CrystalBead = CrystalEntry;

interface BeadLibraryProps {
  onSelectBead: (bead: CrystalBead) => void;
  open: boolean;
  onClose: () => void;
}

const BeadLibrary = ({ onSelectBead, open, onClose }: BeadLibraryProps) => {
  const { crystals, types } = useCatalogue();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const availableTypes = useMemo(() => {
    const typeIds = new Set<string>();
    crystals.forEach((c) => {
      if (c.type) typeIds.add(c.type);
    });
    // Map IDs to names if type exists in Catalogue
    return Array.from(typeIds).map(id => {
      const typeObj = types?.find(t => t.id === id);
      return { id, name: typeObj?.name || id };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [crystals, types]);

  const filteredCrystals = useMemo(
    () =>
      crystals.filter((b) => {
        const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
        const matchesType = selectedType === "all" || b.type === selectedType;
        return matchesSearch && matchesType;
      }),
    [crystals, search, selectedType]
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

      {/* Search & Filter */}
      <div className="p-3 space-y-2">
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
        
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full h-8 text-xs font-body">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs font-body">All Types</SelectItem>
            {availableTypes.map(({ id, name }) => (
              <SelectItem key={id} value={id} className="text-xs font-body">
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Crystal list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredCrystals.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-6">No crystals match your search.</p>
        )}

        {filteredCrystals.map((bead) => {
          const outOfStock = false;
          return (
            <button
              key={bead.id}
              onClick={() => !outOfStock && onSelectBead(bead)}
              disabled={outOfStock}
              draggable={!outOfStock}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "copy";
                e.dataTransfer.setData(
                  "application/json",
                  JSON.stringify({ type: "crystal", item: bead })
                );
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-left group ${
                outOfStock
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-muted/60 cursor-grab active:cursor-grabbing"
              }`}
            >
              {/* Swatch / image */}
              {bead.image ? (
                <img
                  src={bead.image}
                  alt={bead.name}
                  className="w-7 h-7 rounded-full border border-border/50 flex-shrink-0 shadow-sm object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = "none";
                    const next = img.nextElementSibling as HTMLElement | null;
                    if (next) next.style.display = "block";
                  }}
                />
              ) : null}
              <div
                className={`w-7 h-7 rounded-full border border-border/50 flex-shrink-0 shadow-sm ${bead.image ? "hidden" : ""}`}
                style={{ background: "hsl(var(--muted))" }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-foreground truncate">{bead.name}</p>
                  {bead.description && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div onClick={(e) => e.stopPropagation()} className="cursor-help flex items-center justify-center">
                          <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[200px] whitespace-normal z-[60]">
                        <p className="text-xs">{bead.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-xs text-muted-foreground">${bead.price.toFixed(2)} / bead</p>
                </div>
              </div>

              {!outOfStock && (
                <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  Drag or Click
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BeadLibrary;
