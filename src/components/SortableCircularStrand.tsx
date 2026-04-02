import { useState, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { type PlacedBead, type BeadSize } from "@/lib/luxe-data";

interface SortableCircularStrandProps {
  beadCount: number;
  placedBeads: PlacedBead[];
  onBeadsReorder: (beads: PlacedBead[]) => void;
  onSlotClick: (position: number, beadSize: BeadSize) => void;
  onBeadDrop?: (position: number, data: any) => void;
  label?: string;
  wristSize: number;
}

interface SortableBeadProps {
  bead: PlacedBead | null;
  position: number;
  x: number;
  y: number;
  beadPixelSize: number;
  onSlotClick: (position: number) => void;
  isDragActive: boolean; // is ANY bead currently being dnd-kit-dragged
}

function getBeadBackground(bead: PlacedBead | null): string {
  if (!bead) return "hsl(var(--muted))";
  if (bead.type === "crystal" && bead.crystal) {
    if (bead.crystal.image) return `url(${bead.crystal.image}?v=2) center / cover no-repeat`;
    return "hsl(var(--muted))"; // Fallback if no image
  }
  if (bead.type === "spacer" && bead.spacer) {
    if (bead.spacer.image) return `url(${bead.spacer.image}?v=2) center / cover no-repeat`;
    return bead.spacer.metallic;
  }
  if (bead.type === "charm") return "#F5F5DC";
  return "hsl(var(--muted))";
}

function SortableBead({
  bead,
  position,
  x,
  y,
  beadPixelSize,
  onSlotClick,
  isDragActive,
}: SortableBeadProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useSortable({
    id: `bead-${position}`,
  });

  const style: React.CSSProperties = {
    width: beadPixelSize,
    height: beadPixelSize,
    left: x - beadPixelSize / 2,
    top: y - beadPixelSize / 2,
    // No CSS.Transform — absolute position is driven by left/top only.
    // Applying dnd-kit's transform to abs-positioned items breaks layout.
    background: getBeadBackground(bead),
    borderColor: bead ? "transparent" : "hsl(var(--border))",
    boxShadow: bead ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
    opacity: isDragging ? 0 : 1, // hide original while overlay ghost is shown
    transition: isDragActive ? undefined : "opacity 0.15s, background 0.2s",
    // z-index 20 ensures bead buttons sit above the z-10 HTML5 drop zone overlay
    // so click-to-place works on empty slots even when the drop zone is active.
    zIndex: 20,
  };

  const title = bead
    ? bead.type === "crystal" && bead.crystal
      ? `${bead.crystal.name} (${bead.beadSize}mm) — Drag to reorder`
      : bead.type === "spacer" && bead.spacer
      ? `${bead.spacer.name} Spacer — Drag to reorder`
      : bead.type === "charm" && bead.charm
      ? `${bead.charm.animal} Charm (${bead.charm.design}) — Drag to reorder`
      : `Slot ${position + 1}`
    : `Empty slot ${position + 1} — Click to place`;

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(bead ? listeners : {})}
      onClick={() => !bead && onSlotClick(position)}
      className={`absolute border transition-all duration-200 hover:scale-110 active:scale-95 group ${
        bead ? "cursor-grab active:cursor-grabbing" : "cursor-pointer hover:border-primary/60"
      } ${bead?.type === "charm" ? "rounded" : "rounded-full"}`}
      title={title}
    >
      {bead && bead.type === "charm" && bead.charm && (
        <span className="text-xs flex items-center justify-center h-full">
          {bead.charm.emoji}
        </span>
      )}
      {bead && bead.type === "crystal" && (
        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {bead.beadSize}mm
        </span>
      )}
    </button>
  );
}

const SortableCircularStrand = ({
  beadCount,
  placedBeads,
  onBeadsReorder,
  onSlotClick,
  onBeadDrop,
  label,
  wristSize,
}: SortableCircularStrandProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasSize = 320;
  const center = canvasSize / 2;
  const radius = canvasSize / 2 - 36;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const slots = Array.from({ length: beadCount }, (_, i) => {
    const angle = (2 * Math.PI * i) / beadCount - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    const placed = placedBeads.find((b) => b.position === i);
    const beadPixelSize = placed
      ? placed.beadSize === 6 ? 18 : placed.beadSize === 8 ? 22 : 26
      : 20;
    return { index: i, x, y, placed, beadPixelSize };
  });

  // ── dnd-kit handlers ─────────────────────────────────────────────────────

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const draggedBead = placedBeads.find((b) => `bead-${b.position}` === active.id);
      const targetBead = placedBeads.find((b) => `bead-${b.position}` === over.id);

      if (draggedBead && targetBead) {
        // Sort by position so arrayMove shifts beads in spatial order
        const sorted = [...placedBeads].sort((a, b) => a.position - b.position);
        const sortedPositions = sorted.map((b) => b.position);

        const oldIndex = sorted.findIndex((b) => b.position === draggedBead.position);
        const newIndex = sorted.findIndex((b) => b.position === targetBead.position);

        // arrayMove inserts the dragged bead at target's position and shifts
        // all beads in between one slot over to fill the gap.
        const reordered = arrayMove(sorted, oldIndex, newIndex);
        const updatedBeads = reordered.map((bead, idx) => ({
          ...bead,
          position: sortedPositions[idx],
        }));
        onBeadsReorder(updatedBeads);
      } else if (draggedBead && !targetBead) {
        // Moving to an empty slot
        const match = String(over.id).match(/^bead-(\d+)$/);
        if (match) {
          const targetPosition = parseInt(match[1], 10);
          const updatedBeads = placedBeads.map((b) =>
            b.position === draggedBead.position ? { ...b, position: targetPosition } : b
          );
          onBeadsReorder(updatedBeads);
        }
      }
    }
    setActiveId(null);
  };

  // ── HTML5 drop-zone (from library panels) ────────────────────────────────
  // A single transparent overlay handles drops so we avoid conflicts with
  // dnd-kit's pointer capture on individual bead buttons.

  const findNearestSlot = (clientX: number, clientY: number): number => {
    if (!canvasRef.current) return 0;
    const rect = canvasRef.current.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    let nearestIndex = 0;
    let minDist = Infinity;
    slots.forEach((slot) => {
      const dist = Math.hypot(slot.x - localX, slot.y - localY);
      if (dist < minDist) {
        minDist = dist;
        nearestIndex = slot.index;
      }
    });
    return nearestIndex;
  };

  const handleDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // Only accept drops from the library panels (not dnd-kit drags)
    if (e.dataTransfer.types.includes("application/json")) {
      e.dataTransfer.dropEffect = "copy";
      setIsDragOver(true);
    }
  };

  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!onBeadDrop) return;
    const raw = e.dataTransfer.getData("application/json");
    if (!raw) return; // not a library drop – ignore silently
    try {
      const data = JSON.parse(raw);
      const slotIndex = findNearestSlot(e.clientX, e.clientY);
      onBeadDrop(slotIndex, data);
    } catch (err) {
      console.error("Failed to parse dropped bead data:", err);
    }
  };

  const activeBead = activeId
    ? placedBeads.find((b) => `bead-${b.position}` === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col items-center gap-3">
        {label && (
          <span className="text-xs font-body text-muted-foreground uppercase tracking-widest">
            {label}
          </span>
        )}

        <div
          ref={canvasRef}
          className="relative"
          style={{ width: canvasSize, height: canvasSize }}
        >
          {/* Guide circle */}
          <svg className="absolute inset-0" width={canvasSize} height={canvasSize}>
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={isDragOver ? "hsl(var(--primary))" : "hsl(var(--border))"}
              strokeWidth={isDragOver ? 2 : 1.5}
              strokeDasharray="4 3"
              style={{ transition: "stroke 0.2s" }}
            />
          </svg>

          {/* Bead slots (dnd-kit sortable) */}
          <SortableContext items={slots.map((slot) => `bead-${slot.index}`)}>
            {slots.map((slot) => (
              <SortableBead
                key={slot.index}
                bead={slot.placed || null}
                position={slot.index}
                x={slot.x}
                y={slot.y}
                beadPixelSize={slot.beadPixelSize}
                onSlotClick={() => onSlotClick(slot.index, slot.placed?.beadSize || 8)}
                isDragActive={activeId !== null}
              />
            ))}
          </SortableContext>

          {/* Single HTML5 drop zone covering the canvas (below beads in z-order) */}
          <div
            className="absolute inset-0 z-10"
            style={{ pointerEvents: activeId ? "none" : "auto" }}
            onDragOver={handleDropZoneDragOver}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDropZoneDrop}
          />

          {/* dnd-kit drag overlay ghost */}
          <DragOverlay dropAnimation={null}>
            {activeBead ? (
              <div
                className={`border-2 border-primary shadow-xl flex items-center justify-center ${
                  activeBead.type === "charm" ? "rounded" : "rounded-full"
                }`}
                style={{
                  width: activeBead.beadSize === 6 ? 18 : activeBead.beadSize === 8 ? 22 : 26,
                  height: activeBead.beadSize === 6 ? 18 : activeBead.beadSize === 8 ? 22 : 26,
                  background: getBeadBackground(activeBead),
                  opacity: 0.9,
                }}
              >
                {activeBead.type === "charm" && activeBead.charm && (
                  <span className="text-xs">{activeBead.charm.emoji}</span>
                )}
              </div>
            ) : null}
          </DragOverlay>

          {/* Center counter */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-display font-semibold text-foreground">
                {placedBeads.length}
              </p>
              <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">
                of {beadCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default SortableCircularStrand;
