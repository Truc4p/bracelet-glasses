import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
import { CSS } from "@dnd-kit/utilities";
import { type PlacedBead, type BeadSize, type CrystalBead } from "@/lib/luxe-data";

interface SortableCircularStrandProps {
  beadCount: number;
  placedBeads: PlacedBead[];
  onBeadsReorder: (beads: PlacedBead[]) => void;
  onSlotClick: (position: number, beadSize: BeadSize) => void;
  onBeadDrop?: (position: number, bead: CrystalBead) => void;
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
  onBeadDrop?: (position: number, bead: CrystalBead) => void;
}

function SortableBead({ bead, position, x, y, beadPixelSize, onSlotClick, onBeadDrop }: SortableBeadProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `bead-${position}`,
    disabled: !bead,
  });

  const style = {
    width: beadPixelSize,
    height: beadPixelSize,
    left: x - beadPixelSize / 2,
    top: y - beadPixelSize / 2,
    transform: CSS.Transform.toString(transform),
    transition,
    background: bead
      ? bead.crystal.gradient || bead.crystal.color
      : "hsl(var(--muted))",
    borderColor: bead ? "transparent" : "hsl(var(--border))",
    boxShadow: bead ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(bead ? listeners : {})}
      onClick={() => !bead && onSlotClick(position)}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }}
      onDrop={(e) => {
        e.preventDefault();
        if (onBeadDrop) {
          try {
            const beadData = JSON.parse(e.dataTransfer.getData("application/json"));
            onBeadDrop(position, beadData);
          } catch (err) {
            console.error("Failed to parse bead data:", err);
          }
        }
      }}
      className={`absolute rounded-full border transition-all duration-200 hover:scale-110 active:scale-95 group ${
        bead ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
      }`}
      title={bead ? `${bead.crystal.name} (${bead.beadSize}mm) - Drag to reorder` : `Slot ${position + 1}`}
    >
      {bead && (
        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
  const canvasSize = 320;
  const center = canvasSize / 2;
  const radius = canvasSize / 2 - 36;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
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
    const beadPixelSize = placed ? (placed.beadSize === 6 ? 18 : placed.beadSize === 8 ? 22 : 26) : 20;
    return { index: i, x, y, placed, beadPixelSize };
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = placedBeads.findIndex((b) => `bead-${b.position}` === active.id);
      const newIndex = placedBeads.findIndex((b) => `bead-${b.position}` === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(placedBeads, oldIndex, newIndex);
        const updatedBeads = reordered.map((bead, idx) => ({
          ...bead,
          position: placedBeads[idx].position,
        }));
        onBeadsReorder(updatedBeads);
      }
    }

    setActiveId(null);
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
        {label && <span className="text-xs font-body text-muted-foreground uppercase tracking-widest">{label}</span>}
        <div className="relative" style={{ width: canvasSize, height: canvasSize }}>
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

          <SortableContext items={placedBeads.map((b) => `bead-${b.position}`)}>
            {slots.map((slot) => (
              <SortableBead
                key={slot.index}
                bead={slot.placed || null}
                position={slot.index}
                x={slot.x}
                y={slot.y}
                beadPixelSize={slot.beadPixelSize}
                onSlotClick={() => onSlotClick(slot.index, slot.placed?.beadSize || 8)}
                onBeadDrop={onBeadDrop}
              />
            ))}
          </SortableContext>

          <DragOverlay>
            {activeBead ? (
              <div
                className="rounded-full border-2 border-primary shadow-xl"
                style={{
                  width: activeBead.beadSize === 6 ? 18 : activeBead.beadSize === 8 ? 22 : 26,
                  height: activeBead.beadSize === 6 ? 18 : activeBead.beadSize === 8 ? 22 : 26,
                  background: activeBead.crystal.gradient || activeBead.crystal.color,
                }}
              />
            ) : null}
          </DragOverlay>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-display font-semibold text-foreground">{placedBeads.length}</p>
              <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">of {beadCount}</p>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default SortableCircularStrand;
