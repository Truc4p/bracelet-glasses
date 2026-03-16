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
  const [wristSizeA, setWristSizeA] = useState(16);
  const [wristSizeB, setWristSizeB] = useState(16);
  const [placedBeadsA, setPlacedBeadsA] = useState<PlacedBead[]>([]);
  const [placedBeadsB, setPlacedBeadsB] = useState<PlacedBead[]>([]);
  const [twinning, setTwinning] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [selectedCrystal, setSelectedCrystal] = useState<CrystalBead | null>(null);

  const beadCountA = Math.max(
    ...placedBeadsA.map((b) => b.position + 1),
    Math.round((wristSizeA * 10) / 8)
  );
  const beadCountB = Math.max(
    ...placedBeadsB.map((b) => b.position + 1),
    Math.round((wristSizeB * 10) / 8)
  );

  const updatePrice = useCallback(
    (beadsA: PlacedBead[], beadsB: PlacedBead[], twin: boolean) => {
      const p =
        beadsA.reduce((s, b) => s + b.crystal.price, 0) +
        (twin ? beadsB.reduce((s, b) => s + b.crystal.price, 0) : 0);
      onPriceChange(p);
    },
    [onPriceChange]
  );

  const handleSlotClick = (bracelet: "A" | "B", position: number, beadSize: BeadSize) => {
    const placedBeads = bracelet === "A" ? placedBeadsA : placedBeadsB;
    const setPlacedBeads = bracelet === "A" ? setPlacedBeadsA : setPlacedBeadsB;

    const existing = placedBeads.find((b) => b.position === position);
    let updated: PlacedBead[];

    if (existing) {
      updated = placedBeads.filter((b) => b.position !== position);
    } else if (selectedCrystal) {
      updated = [...placedBeads, { position, crystal: selectedCrystal, beadSize }];
    } else {
      setLibraryOpen(true);
      return;
    }

    setPlacedBeads(updated);

    if (bracelet === "A") {
      updatePrice(updated, placedBeadsB, twinning);
    } else {
      updatePrice(placedBeadsA, updated, twinning);
    }
  };

  const handleSelectBead = (bead: CrystalBead) => {
    setSelectedCrystal(bead);
  };

  const handleReset = () => {
    setPlacedBeadsA([]);
    setPlacedBeadsB([]);
    setSelectedCrystal(null);
    updatePrice([], [], twinning);
  };

  const handleToggleTwinning = () => {
    const next = !twinning;
    setTwinning(next);
    if (!next) {
      setPlacedBeadsB([]);
      updatePrice(placedBeadsA, [], next);
    } else {
      updatePrice(placedBeadsA, placedBeadsB, next);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col animate-fade-in">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-b border-border">
        {/* Wrist size A */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
            {twinning ? "Wrist A" : "Wrist"}
          </label>
          <input
            type="number"
            value={wristSizeA}
            onChange={(e) => setWristSizeA(Number(e.target.value))}
            className="w-16 px-2 py-1.5 text-sm border border-border rounded-md bg-background font-body focus:outline-none focus:ring-1 focus:ring-primary"
            min={10}
            max={30}
            step={0.5}
          />
          <span className="text-xs text-muted-foreground">cm</span>
        </div>

        {/* Wrist size B - only show when twinning */}
        {twinning && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground font-body uppercase tracking-wider">Wrist B</label>
            <input
              type="number"
              value={wristSizeB}
              onChange={(e) => setWristSizeB(Number(e.target.value))}
              className="w-16 px-2 py-1.5 text-sm border border-border rounded-md bg-background font-body focus:outline-none focus:ring-1 focus:ring-primary"
              min={10}
              max={30}
              step={0.5}
            />
            <span className="text-xs text-muted-foreground">cm</span>
          </div>
        )}

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
          beadCount={beadCountA}
          placedBeads={placedBeadsA}
          onSlotClick={(pos, size) => handleSlotClick("A", pos, size)}
          label={twinning ? "Bracelet A" : undefined}
          wristSize={wristSizeA}
        />

        {twinning && (
          <CircularStrand
            beadCount={beadCountB}
            placedBeads={placedBeadsB}
            onSlotClick={(pos, size) => handleSlotClick("B", pos, size)}
            label="Bracelet B"
            wristSize={wristSizeB}
          />
        )}
      </div>

      {/* Info bar */}
      <div className="px-6 py-3 border-t border-border flex items-center gap-6 text-xs text-muted-foreground font-body">
        {!twinning ? (
          <>
            <span>A: {placedBeadsA.length} beads placed</span>
            <span>Mixed sizes: {[...new Set(placedBeadsA.map(b => b.beadSize))].sort().join(', ') || 'none'}mm</span>
          </>
        ) : (
          <>
            <span>A: {placedBeadsA.length} beads</span>
            <span>B: {placedBeadsB.length} beads</span>
            <span>Total: {placedBeadsA.length + placedBeadsB.length} beads</span>
          </>
        )}
      </div>
    </div>
  );
};

export default BraceletBuilder;
