import { type PlacedBead, type BeadSize, type CrystalBead } from "@/lib/luxe-data";

interface CircularStrandProps {
  beadCount: number;
  placedBeads: PlacedBead[];
  onSlotClick: (position: number, beadSize: BeadSize) => void;
  onBeadDrop?: (position: number, bead: CrystalBead) => void;
  label?: string;
  wristSize: number;
}

function getBeadBackground(bead: PlacedBead | null | undefined): string {
  if (!bead) return "hsl(var(--muted))";
  if (bead.type === "crystal" && bead.crystal?.image) {
    const isDataUrl = bead.crystal.image.startsWith("data:");
    return `url("${bead.crystal.image}${isDataUrl ? "" : "?v=2"}") center / cover no-repeat`;
  }

  return "hsl(var(--muted))";
}

const CircularStrand = ({ beadCount, placedBeads, onSlotClick, onBeadDrop, label, wristSize }: CircularStrandProps) => {
  const canvasSize = 320;
  const center = canvasSize / 2;
  const radius = canvasSize / 2 - 36;

  const slots = Array.from({ length: beadCount }, (_, i) => {
    const angle = (2 * Math.PI * i) / beadCount - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    const placed = placedBeads.find((b) => b.position === i);
    const beadPixelSize = placed ? (placed.beadSize === 6 ? 18 : placed.beadSize === 8 ? 22 : 26) : 20;
    return { index: i, x, y, placed, beadPixelSize };
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
        {slots.map((slot) => {
          return (
            <button
              key={slot.index}
              onClick={() => onSlotClick(slot.index, slot.placed?.beadSize || 8)}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "copy";
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (onBeadDrop) {
                  try {
                    const beadData = JSON.parse(e.dataTransfer.getData("application/json"));
                    onBeadDrop(slot.index, beadData);
                  } catch (err) {
                    console.error("Failed to parse bead data:", err);
                  }
                }
              }}
              className="absolute rounded-full border transition-all duration-200 hover:scale-110 active:scale-95 group"
              style={{
                width: slot.beadPixelSize,
                height: slot.beadPixelSize,
                left: slot.x - slot.beadPixelSize / 2,
                top: slot.y - slot.beadPixelSize / 2,
                background: getBeadBackground(slot.placed),
                borderColor: slot.placed ? "transparent" : "hsl(var(--border))",
                boxShadow: slot.placed ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
              }}
              title={
                slot.placed
                  ? slot.placed.type === "crystal" && slot.placed.crystal
                    ? `${slot.placed.crystal.name} (${slot.placed.beadSize}mm)`
                    : `Slot ${slot.index + 1}`
                  : `Slot ${slot.index + 1}`
              }
            >
              {slot.placed && slot.placed.type === "crystal" && (
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {slot.placed.beadSize}mm
                </span>
              )}
            </button>
          );
        })}
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
