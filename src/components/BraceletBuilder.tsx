import { useState, useCallback } from "react";
import { Library, RotateCcw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import BeadLibrary from "@/components/BeadLibrary";
import CircularStrand from "@/components/CircularStrand";
import {
  calculateBeadCount,
  type BeadSize,
  type PlacedBead,
  type CrystalBead,
} from "@/lib/luxe-data";

interface BraceletBuilderProps {
  onPriceChange: (price: number) => void;
}

const BEAD_SIZES: BeadSize[] = [6, 8, 10];

const BraceletBuilder = ({ onPriceChange }: BraceletBuilderProps) => {
  const [wristSize, setWristSize] = useState(16);
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [beadSize, setBeadSize] = useState<BeadSize>(8);
  const [placedBeads, setPlacedBeads] = useState<PlacedBead[]>([]);
  const [twinning, setTwinning] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [selectedCrystal, setSelectedCrystal] = useState<CrystalBead | null>(null);

  const wristCm = unit === "in" ? wristSize * 2.54 : wristSize;
  const beadCount = calculateBeadCount(wristCm, beadSize);

  const totalPrice = placedBeads.reduce((sum, b) => sum + b.crystal.price, 0) * (twinning ? 2 : 1);

  // Update parent price
  const updatePrice = useCallback(
    (beads: PlacedBead[], twin: boolean) => {
      const p = beads.reduce((s, b) => s + b.crystal.price, 0) * (twin ? 2 : 1);
      onPriceChange(p);
    },
    [onPriceChange]
  );

  const handleSlotClick = (position: number) => {
    const existing = placedBeads.find((b) => b.position === position);
    let updated: PlacedBead[];
    if (existing) {
      updated = placedBeads.filter((b) => b.position !== position);
    } else if (selectedCrystal) {
      updated = [...placedBeads, { position, crystal: selectedCrystal }];
    } else {
      setLibraryOpen(true);
      return;
    }
    setPlacedBeads(updated);
    updatePrice(updated, twinning);
  };

  const handleSelectBead = (bead: CrystalBead) => {
    setSelectedCrystal(bead);
  };

  const handleReset = () => {
    setPlacedBeads([]);
    setSelectedCrystal(null);
    updatePrice([], twinning);
  };

  const handleToggleTwinning = () => {
    const next = !twinning;
    setTwinning(next);
    updatePrice(placedBeads, next);
  };

  return (
    <div className="relative flex-1 flex flex-col animate-fade-in">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-b border-border">
        {/* Wrist size */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground font-body uppercase tracking-wider">Wrist</label>
          <input
            type="number"
            value={wristSize}
            onChange={(e) => setWristSize(Number(e.target.value))}
            className="w-16 px-2 py-1.5 text-sm border border-border rounded-md bg-background font-body focus:outline-none focus:ring-1 focus:ring-primary"
            min={10}
            max={30}
            step={0.5}
          />
          <div className="flex rounded-md border border-border overflow-hidden">
            {(["cm", "in"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-2.5 py-1 text-xs font-body transition-colors ${
                  unit === u ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Bead size */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground font-body uppercase tracking-wider">Bead</label>
          <div className="flex rounded-md border border-border overflow-hidden">
            {BEAD_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setBeadSize(s)}
                className={`px-3 py-1 text-xs font-body transition-colors ${
                  beadSize === s ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {s}mm
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {selectedCrystal && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm font-body">
              <div className="w-4 h-4 rounded-full" style={{ background: selectedCrystal.gradient || selectedCrystal.color }} />
              {selectedCrystal.name}
            </div>
          )}
          <Button variant="luxe-outline" size="sm" onClick={() => setLibraryOpen(!libraryOpen)}>
            <Library className="w-3.5 h-3.5" />
            Crystals
          </Button>
          <Button variant="luxe-outline" size="sm" onClick={handleToggleTwinning}>
            <Copy className="w-3.5 h-3.5" />
            {twinning ? "Single" : "Twin"}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 relative flex items-center justify-center gap-8 p-6">
        <BeadLibrary open={libraryOpen} onSelectBead={handleSelectBead} onClose={() => setLibraryOpen(false)} />

        <CircularStrand
          beadCount={beadCount}
          placedBeads={placedBeads}
          beadSizeMm={beadSize}
          onSlotClick={handleSlotClick}
          label={twinning ? "Bracelet A" : undefined}
        />

        {twinning && (
          <CircularStrand
            beadCount={beadCount}
            placedBeads={placedBeads}
            beadSizeMm={beadSize}
            onSlotClick={handleSlotClick}
            label="Bracelet B (Twin)"
          />
        )}
      </div>

      {/* Info bar */}
      <div className="px-6 py-3 border-t border-border flex items-center gap-6 text-xs text-muted-foreground font-body">
        <span>{beadCount} beads needed</span>
        <span>{placedBeads.length} placed</span>
        <span>{beadCount - placedBeads.length} remaining</span>
        {twinning && <span className="text-primary">× 2 (Twin)</span>}
      </div>
    </div>
  );
};

export default BraceletBuilder;
