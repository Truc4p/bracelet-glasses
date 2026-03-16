import { useState, useCallback } from "react";
import { Library, RotateCcw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import BeadLibrary from "@/components/BeadLibrary";
import SortableCircularStrand from "@/components/SortableCircularStrand";
import {
  calculateBeadCount,
  calculateBeadPrice,
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
  const [defaultBeadSize, setDefaultBeadSize] = useState<BeadSize>(8);
  const [placedBeadsA, setPlacedBeadsA] = useState<PlacedBead[]>([]);
  const [placedBeadsB, setPlacedBeadsB] = useState<PlacedBead[]>([]);
  const [twinning, setTwinning] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [selectedCrystal, setSelectedCrystal] = useState<CrystalBead | null>(null);

  const beadCountA = calculateBeadCount(wristSizeA, defaultBeadSize);
  const beadCountB = calculateBeadCount(wristSizeB, defaultBeadSize);

  const updatePrice = useCallback(
    (beadsA: PlacedBead[], beadsB: PlacedBead[], twin: boolean) => {
      const priceA = beadsA.reduce((s, b) => s + calculateBeadPrice(b.crystal.price, b.beadSize), 0);
      const priceB = twin ? beadsB.reduce((s, b) => s + calculateBeadPrice(b.crystal.price, b.beadSize), 0) : 0;
      onPriceChange(priceA + priceB);
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
      updated = [...placedBeads, { position, crystal: selectedCrystal, beadSize: defaultBeadSize }];
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

  const handleBeadDrop = (bracelet: "A" | "B", position: number, bead: CrystalBead) => {
    const placedBeads = bracelet === "A" ? placedBeadsA : placedBeadsB;
    const setPlacedBeads = bracelet === "A" ? setPlacedBeadsA : setPlacedBeadsB;

    const existing = placedBeads.find((b) => b.position === position);
    const updated = existing
      ? placedBeads.filter((b) => b.position !== position)
      : [...placedBeads, { position, crystal: bead, beadSize: defaultBeadSize }];

    setPlacedBeads(updated);

    if (bracelet === "A") {
      updatePrice(updated, placedBeadsB, twinning);
    } else {
      updatePrice(placedBeadsA, updated, twinning);
    }
  };

  const handleBeadsReorder = (bracelet: "A" | "B", reorderedBeads: PlacedBead[]) => {
    const setPlacedBeads = bracelet === "A" ? setPlacedBeadsA : setPlacedBeadsB;
    setPlacedBeads(reorderedBeads);

    if (bracelet === "A") {
      updatePrice(reorderedBeads, placedBeadsB, twinning);
    } else {
      updatePrice(placedBeadsA, reorderedBeads, twinning);
    }
  };

  const handleBeadSizeChange = (newSize: BeadSize) => {
    setDefaultBeadSize(newSize);
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
        {/* Wrist size I */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
            {twinning ? "Wrist I" : "Wrist"}
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

        {/* Wrist size II - only show when twinning */}
        {twinning && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground font-body uppercase tracking-wider">Wrist II</label>
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

        {/* Bead size selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground font-body uppercase tracking-wider">Bead Size</label>
          <div className="flex rounded-md border border-border overflow-hidden">
            {BEAD_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => handleBeadSizeChange(s)}
                className={`px-3 py-1 text-xs font-body transition-colors ${
                  defaultBeadSize === s ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"
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

        <SortableCircularStrand
          beadCount={beadCountA}
          placedBeads={placedBeadsA}
          onBeadsReorder={(beads) => handleBeadsReorder("A", beads)}
          onSlotClick={(pos, size) => handleSlotClick("A", pos, size)}
          onBeadDrop={(pos, bead) => handleBeadDrop("A", pos, bead)}
          label={twinning ? "Bracelet I" : undefined}
          wristSize={wristSizeA}
        />

        {twinning && (
          <SortableCircularStrand
            beadCount={beadCountB}
            placedBeads={placedBeadsB}
            onBeadsReorder={(beads) => handleBeadsReorder("B", beads)}
            onSlotClick={(pos, size) => handleSlotClick("B", pos, size)}
            onBeadDrop={(pos, bead) => handleBeadDrop("B", pos, bead)}
            label="Bracelet II"
            wristSize={wristSizeB}
          />
        )}
      </div>

      {/* Info bar */}
      <div className="px-6 py-3 border-t border-border flex items-center gap-6 text-xs text-muted-foreground font-body">
        {!twinning ? (
          <>
            <span>{placedBeadsA.length} of {beadCountA} beads placed</span>
            <span>Base size: {defaultBeadSize}mm</span>
            {placedBeadsA.length > 0 && (
              <span>Sizes used: {[...new Set(placedBeadsA.map(b => b.beadSize))].sort().join(', ')}mm</span>
            )}
          </>
        ) : (
          <>
            <span>I: {placedBeadsA.length}/{beadCountA}</span>
            <span>II: {placedBeadsB.length}/{beadCountB}</span>
            <span>Total: {placedBeadsA.length + placedBeadsB.length} beads</span>
          </>
        )}
      </div>
    </div>
  );
};

export default BraceletBuilder;
