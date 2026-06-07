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
  if (bead.type === "crystal" && bead.crystal && bead.crystal.image) {
    return "transparent";
  }
  return "hsl(var(--muted))";
}

function getBeadImageSrc(bead: PlacedBead | null): string | null {
  if (bead?.type === "crystal" && bead.crystal?.image) {
    const isDataUrl = bead.crystal.image.startsWith("data:");
    return bead.crystal.image + (isDataUrl ? "" : "?v=2");
  }
  return null;
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

  const hasImage = !!(bead?.type === "crystal" && bead.crystal?.image);

  const style: React.CSSProperties = {
    width: beadPixelSize,
    height: beadPixelSize,
    left: x - beadPixelSize / 2,
    top: y - beadPixelSize / 2,
    // No CSS.Transform — absolute position is driven by left/top only.
    // Applying dnd-kit's transform to abs-positioned items breaks layout.
    background: hasImage ? "transparent" : getBeadBackground(bead),
    border: hasImage ? "none" : undefined,
    borderColor: !hasImage && bead ? "transparent" : !hasImage ? "hsl(var(--border))" : undefined,
    boxShadow: !hasImage && bead ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
    opacity: isDragging ? 0 : 1, // hide original while overlay ghost is shown
    transition: isDragActive ? undefined : "opacity 0.15s, background 0.2s",
    // z-index 20 ensures bead buttons sit above the z-10 HTML5 drop zone overlay
    // so click-to-place works on empty slots even when the drop zone is active.
    zIndex: 20,
  };

  const title = bead
    ? bead.type === "crystal" && bead.crystal
      ? `${bead.crystal.name} (${bead.beadSize}mm) — Drag to reorder`
      : `Slot ${position + 1}`
    : `Empty slot ${position + 1} — Click to place`;

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(bead ? listeners : {})}
      onClick={() => !bead && onSlotClick(position)}
      className={`absolute transition-all duration-200 hover:scale-110 active:scale-95 group ${
        hasImage
          ? "cursor-grab active:cursor-grabbing"
          : bead
          ? "border rounded-full cursor-grab active:cursor-grabbing"
          : "border rounded-full cursor-pointer hover:border-primary/60"
      }`}
      title={title}
    >
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
    const beadPixelSize = placed ? placed.beadSize * 2.5 : 20;
    return { index: i, x, y, placed, beadPixelSize };
  });

  // ── dnd-kit handlers ─────────────────────────────────────────────────────

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);

    // One-shot debug measurement: compare the actual rendered pixel size of
    // a placed bead image vs. the drag-overlay ghost image.
    requestAnimationFrame(() => {
      const allImgs = Array.from(document.querySelectorAll<HTMLImageElement>('img[alt=""]'));
      const placedImg = allImgs.find((img) => canvasRef.current?.contains(img));
      const overlayImg = allImgs.find((img) => !canvasRef.current?.contains(img));
      console.log("[size-check] candidate imgs outside canvas:", allImgs.filter((img) => !canvasRef.current?.contains(img)).map((img) => ({ src: img.src, w: img.style.width, h: img.style.height, parent: img.parentElement?.outerHTML?.slice(0, 200) })));
      const log = (label: string, img?: HTMLImageElement) => {
        if (!img) return console.log(label, "not found");
        const rect = img.getBoundingClientRect();
        console.log(label, {
          renderedWidth: rect.width,
          renderedHeight: rect.height,
          cssWidth: img.style.width,
          cssHeight: img.style.height,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          src: img.src,
        });
      };
      log("[size-check] placed bead:", placedImg);
      log("[size-check] overlay ghost:", overlayImg);
    });
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

          {/* Bead images — rendered directly on the canvas, precisely centered at the
              bracelet circle point. Kept separate from the button so the image is
              never clipped or offset by the small interaction hitbox. */}
          {slots.map((slot) => {
            if (!slot.placed || `bead-${slot.index}` === activeId) return null;
            const imgSrc = getBeadImageSrc(slot.placed);
            if (!imgSrc) return null;
            const displaySize = slot.beadPixelSize * 2;
            return (
              <img
                key={`bead-img-${slot.index}`}
                src={imgSrc}
                alt=""
                draggable={false}
                style={{
                  position: "absolute",
                  left: slot.x - displaySize / 2,
                  top: slot.y - displaySize / 2,
                  width: displaySize,
                  height: displaySize,
                  objectFit: "contain",
                  pointerEvents: "none",
                  userSelect: "none",
                  zIndex: 19,
                }}
              />
            );
          })}

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
            {activeBead ? (() => {
              // Mirror the exact sizing math used to render beads on the
              // bracelet (slots.beadPixelSize / displaySize), so the dragged
              // ghost is the same size as the bead it replaces.
              const beadPixelSize = activeBead.beadSize * 2.5;
              const displaySize = beadPixelSize * 2;
              const ghostImgSrc = getBeadImageSrc(activeBead);

              // Image-backed crystals: render the bare image, exactly like they
              // appear on the bracelet — no added border/background/shape.
              if (ghostImgSrc) {
                return (
                  <img
                    src={ghostImgSrc}
                    alt=""
                    draggable={false}
                    style={{
                      width: displaySize,
                      height: displaySize,
                      objectFit: "contain",
                      opacity: 0.9,
                      pointerEvents: "none",
                    }}
                  />
                );
              }

              return (
                <div
                  className="border-2 border-primary shadow-xl rounded-full"
                  style={{
                    width: beadPixelSize,
                    height: beadPixelSize,
                    background: getBeadBackground(activeBead),
                    opacity: 0.9,
                  }}
                />
              );
            })() : null}
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
