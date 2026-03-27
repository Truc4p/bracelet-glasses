import { useState, useCallback, useRef, useEffect } from "react";
import { Glasses, Sparkles, RotateCcw, Waves, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import FrameLibrary from "@/components/FrameLibrary";
import SunglassesAccessoriesLibrary from "@/components/SunglassesAccessoriesLibrary";
import LensRenderer from "@/components/LensRenderer";
import { FRAME_OPTIONS, FRAME_BASE_PRICE, type FrameOption, type PlacedAccessory, type SunglassesAccessory } from "@/lib/luxe-data";

interface AdvancedSunglassesBuilderProps {
  onPriceChange: (price: number) => void;
}

type LensColor = {
  id: string;
  name: string;
  color: string;
  gradient: string;
};

const LENS_COLORS: LensColor[] = [
  { id: "PK-Y-001", name: "PK-Y-001", color: "#3A3A3A", gradient: "linear-gradient(180deg, #3A3A3A, #3A3A3A)" },
  { id: "PK-Y-002", name: "PK-Y-002", color: "#6B6B6B", gradient: "linear-gradient(180deg, #6B6B6B, #B8B8B8)" },
  { id: "PK-Y-003", name: "PK-Y-003", color: "#4A1515", gradient: "linear-gradient(180deg, #4A1515, #4A1515)" },
  { id: "PK-Y-004", name: "PK-Y-004", color: "#5C2E1A", gradient: "linear-gradient(180deg, #5C2E1A, #D4A574)" },
  { id: "PK-Y-005", name: "PK-Y-005", color: "#8B2942", gradient: "linear-gradient(180deg, #8B2942, #8B2942)" },
  { id: "PK-Y-006", name: "PK-Y-006", color: "#7A3B5D", gradient: "linear-gradient(180deg, #7A3B5D, #D4A5C4)" },
  { id: "PK-Y-007", name: "PK-Y-007", color: "#1E3A5F", gradient: "linear-gradient(180deg, #1E3A5F, #1E3A5F)" },
  { id: "PK-Y-008", name: "PK-Y-008", color: "#2E3A6B", gradient: "linear-gradient(180deg, #2E3A6B, #B8B8D4)" },
  { id: "PK-Y-009", name: "PK-Y-009", color: "#90C878", gradient: "linear-gradient(180deg, #90C878, #90C878)" },
  { id: "PK-Y-010", name: "PK-Y-010", color: "#E8B88B", gradient: "linear-gradient(180deg, #E8B88B, #E8B88B)" },
  { id: "PK-Y-011", name: "PK-Y-011", color: "#C8A030", gradient: "linear-gradient(180deg, #C8A030, #C8A030)" },
  { id: "PK-Y-012", name: "PK-Y-012", color: "#7BB8D4", gradient: "linear-gradient(180deg, #7BB8D4, #7BB8D4)" },
];

const AdvancedSunglassesBuilder = ({ onPriceChange }: AdvancedSunglassesBuilderProps) => {
  const [selectedFrame, setSelectedFrame] = useState<FrameOption>(FRAME_OPTIONS[0]);
  const [lensColor, setLensColor] = useState<LensColor>(LENS_COLORS[0]);
  const [vlt, setVlt] = useState(15);
  const [gradientMode, setGradientMode] = useState(false);
  const [gradientSecondary, setGradientSecondary] = useState<LensColor>(LENS_COLORS[1]);
  const [placedAccessories, setPlacedAccessories] = useState<PlacedAccessory[]>([]);
  const [frameLibraryOpen, setFrameLibraryOpen] = useState(true);
  const [accessoriesOpen, setAccessoriesOpen] = useState(false);
  const [draggedAccessory, setDraggedAccessory] = useState<SunglassesAccessory | null>(null);
  const [povMode, setPovMode] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const updatePrice = useCallback(
    (accessories: PlacedAccessory[], currentVlt: number, isGradient: boolean) => {
      const basePrice = FRAME_BASE_PRICE;
      const vltPrice = currentVlt < 20 ? 25 : currentVlt < 50 ? 15 : 10;
      const gradientPrice = isGradient ? 20 : 0;
      const accessoriesPrice = accessories.reduce((sum, a) => sum + a.accessory.price, 0);
      onPriceChange(basePrice + vltPrice + gradientPrice + accessoriesPrice);
    },
    [onPriceChange]
  );

  useEffect(() => {
    updatePrice(placedAccessories, vlt, gradientMode);
  }, [updatePrice, placedAccessories, vlt, gradientMode]);

  const handleFrameSelect = (frame: FrameOption) => {
    setSelectedFrame(frame);
    setPlacedAccessories([]);
    updatePrice([], vlt, gradientMode);
  };

  const handleVltChange = (val: number[]) => {
    setVlt(val[0]);
    updatePrice(placedAccessories, val[0], gradientMode);
  };

  const handleGradientToggle = (checked: boolean) => {
    setGradientMode(checked);
    updatePrice(placedAccessories, vlt, checked);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current || !draggedAccessory) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newAccessory: PlacedAccessory = {
      id: `${draggedAccessory.id}-${Date.now()}`,
      accessory: draggedAccessory,
      x,
      y,
      scale: 1,
      rotation: 0,
    };

    const updated = [...placedAccessories, newAccessory];
    setPlacedAccessories(updated);
    setDraggedAccessory(null);
    updatePrice(updated, vlt, gradientMode);
  };

  const handleAccessoryClick = (id: string) => {
    const updated = placedAccessories.filter((a) => a.id !== id);
    setPlacedAccessories(updated);
    updatePrice(updated, vlt, gradientMode);
  };

  const handleReset = () => {
    setPlacedAccessories([]);
    setVlt(15);
    setGradientMode(false);
    setLensColor(LENS_COLORS[0]);
    updatePrice([], 15, false);
  };

  return (
    <div className="relative flex-1 w-full h-full flex flex-col animate-fade-in overflow-hidden">
      <div className="flex-shrink-0 flex flex-wrap items-center gap-4 px-6 py-4 border-b border-border bg-white">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Frame</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm font-body">
            {selectedFrame.icon} {selectedFrame.name}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Lens Density</span>
          <div className="w-32">
            <Slider value={[vlt]} onValueChange={handleVltChange} min={0} max={100} step={5} />
          </div>
          <span className="text-sm font-body">{vlt}% VLT</span>
        </div>

        <Button
          variant={gradientMode ? "default" : "luxe-outline"}
          size="sm"
          onClick={() => setGradientMode(!gradientMode)}
        >
          <Waves className="w-3.5 h-3.5" />
          Gradient
        </Button>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant={povMode ? "default" : "luxe-outline"}
            size="sm"
            onClick={() => setPovMode(!povMode)}
          >
            <Eye className="w-3.5 h-3.5" />
            Visual Filter
          </Button>
          <Button variant="luxe-outline" size="sm" onClick={() => {
            setFrameLibraryOpen(!frameLibraryOpen);
            setAccessoriesOpen(false);
          }}>
            <Glasses className="w-3.5 h-3.5" />
            Frames
          </Button>
          <Button variant="luxe-outline" size="sm" onClick={() => {
            setAccessoriesOpen(!accessoriesOpen);
            setFrameLibraryOpen(false);
          }}>
            <Sparkles className="w-3.5 h-3.5" />
            Customize
          </Button>
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 relative overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="min-h-full flex items-center justify-center p-6">
          <FrameLibrary
            open={frameLibraryOpen}
            onSelectFrame={handleFrameSelect}
            onClose={() => setFrameLibraryOpen(false)}
          />

          <SunglassesAccessoriesLibrary
            open={accessoriesOpen}
            onSelectAccessory={(acc) => setDraggedAccessory(acc)}
            onSelectLensColor={(color) => setLensColor(color)}
            onSelectSecondaryColor={(color) => setGradientSecondary(color)}
            gradientMode={gradientMode}
            onClose={() => setAccessoriesOpen(false)}
          />

          <div
            ref={canvasRef}
            className="relative max-w-4xl w-full"
            onDrop={handleCanvasDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
          >
            <div
              className="relative w-full bg-white rounded-lg overflow-hidden"
              style={{
                paddingBottom: '56%',
              }}
            >
              <LensRenderer 
                primaryColor={lensColor.color}
                secondaryColor={gradientSecondary.color}
                vlt={vlt}
                gradientMode={gradientMode}
              />
              <img
                src={selectedFrame.image}
                alt={selectedFrame.name}
                className="absolute w-full h-full object-contain drop-shadow-2xl pointer-events-none"
                style={{ zIndex: 2 }}
              />

              {placedAccessories.map((placed) => (
                <button
                  key={placed.id}
                  onClick={() => handleAccessoryClick(placed.id)}
                  className="absolute text-3xl hover:scale-110 transition-transform cursor-pointer z-10"
                  style={{
                    left: `${placed.x}%`,
                    top: `${placed.y}%`,
                    transform: `translate(-50%, -50%) scale(${placed.scale}) rotate(${placed.rotation}deg)`,
                    zIndex: 3,
                  }}
                  title={`${placed.accessory.name} - Click to remove`}
                >
                  {placed.accessory.emoji}
                </button>
              ))}
            </div>
          </div>

          {povMode && (
            <div
              className="fixed inset-0 pointer-events-none transition-all duration-500"
              style={{
                background: gradientMode
                  ? `linear-gradient(180deg, ${lensColor.color} 0%, ${gradientSecondary.color} 100%)`
                  : lensColor.color,
                opacity: Math.max(0.15, Math.min(0.6, 1 - vlt / 100)),
                zIndex: 9999,
              }}
            >
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                POV Preview: {vlt}% VLT
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 px-6 py-4 border-t border-border bg-white space-y-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={gradientMode}
              onChange={(e) => handleGradientToggle(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium font-heading">Gradient Lens (+$20)</span>
          </label>

          {gradientMode && (
            <select
              value={gradientSecondary.id}
              onChange={(e) => setGradientSecondary(LENS_COLORS.find(c => c.id === e.target.value)!)}
              className="px-3 py-1.5 rounded-md border bg-background text-sm font-body"
            >
              {LENS_COLORS.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="text-xs text-muted-foreground font-body">
          {placedAccessories.length} accessories added • Drag items from the Customize panel to add them to your sunglasses
        </div>
      </div>
    </div>
  );
};

export default AdvancedSunglassesBuilder;
