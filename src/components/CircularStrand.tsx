import { type PlacedBead } from "@/lib/luxe-data";

interface CircularStrandProps {
  beadCount: number;
  placedBeads: PlacedBead[];
  beadSizeMm: number;
  onSlotClick: (position: number) => void;
  label?: string;
}

const CircularStrand = ({ beadCount, placedBeads, beadSizeMm, onSlotClick, label }: CircularStrandProps) => {
  const canvasSize = 320;
  const center = canvasSize / 2;
  const radius = canvasSize / 2 - 36;
  const beadPixelSize = beadSizeMm === 6 ? 18 : beadSizeMm === 8 ? 22 : 26;

  const slots = Array.from({ length: beadCount }, (_, i) => {
    const angle = (2 * Math.PI * i) / beadCount - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    const placed = placedBeads.find((b) => b.position === i);
    return { index: i, x, y, placed };
  });

  return (
    <div className="flex flex-col items-center gap-3">
      {label && <span className="text-xs font-body text-muted-foreground uppercase tracking-widest">{label}</span>}
      <div className="relative" style={{ width: canvasSize, height: canvasSize }}>
        {/* Strand line */}
        <svg className="absolute inset-0" width={canvasSize} height={canvasSize}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        </svg>
        {/* Bead slots */}
        {slots.map((slot) => (
          <button
            key={slot.index}
            onClick={() => onSlotClick(slot.index)}
            className="absolute rounded-full border transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              width: beadPixelSize,
              height: beadPixelSize,
              left: slot.x - beadPixelSize / 2,
              top: slot.y - beadPixelSize / 2,
              background: slot.placed
                ? slot.placed.crystal.gradient || slot.placed.crystal.color
                : "hsl(var(--muted))",
              borderColor: slot.placed ? "transparent" : "hsl(var(--border))",
              boxShadow: slot.placed ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
            }}
            title={slot.placed ? slot.placed.crystal.name : `Slot ${slot.index + 1} — click to fill`}
          />
        ))}
        {/* Center info */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-display font-semibold text-foreground">{placedBeads.length}</p>
            <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">of {beadCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularStrand;
