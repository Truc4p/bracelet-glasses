import { useState, useRef } from "react";
import { Eye, EyeOff, User, Rotate3d, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FRAME_OPTIONS, FRAME_BASE_PRICE } from "@/lib/luxe-data";
import { Slider } from "@/components/ui/slider";
import { CustomizableFrame } from "./CustomizableFrame";

interface AdvancedSunglassesBuilderProps {
  onPriceChange: (price: number) => void;
}

type LensColor =
  | "PK-Y-001" | "PK-Y-002" | "PK-Y-003" | "PK-Y-004"
  | "PK-Y-005" | "PK-Y-006" | "PK-Y-007" | "PK-Y-008"
  | "PK-Y-009" | "PK-Y-010" | "PK-Y-011" | "PK-Y-012";

const LENS_COLORS = [
  { id: "PK-Y-001" as LensColor, name: "PK-Y-001", color: "#3A3A3A", gradient: "linear-gradient(180deg, #3A3A3A, #3A3A3A)" },
  { id: "PK-Y-002" as LensColor, name: "PK-Y-002", color: "#6B6B6B", gradient: "linear-gradient(180deg, #6B6B6B, #B8B8B8)" },
  { id: "PK-Y-003" as LensColor, name: "PK-Y-003", color: "#4A1515", gradient: "linear-gradient(180deg, #4A1515, #4A1515)" },
  { id: "PK-Y-004" as LensColor, name: "PK-Y-004", color: "#5C2E1A", gradient: "linear-gradient(180deg, #5C2E1A, #D4A574)" },
  { id: "PK-Y-005" as LensColor, name: "PK-Y-005", color: "#8B2942", gradient: "linear-gradient(180deg, #8B2942, #8B2942)" },
  { id: "PK-Y-006" as LensColor, name: "PK-Y-006", color: "#7A3B5D", gradient: "linear-gradient(180deg, #7A3B5D, #D4A5C4)" },
  { id: "PK-Y-007" as LensColor, name: "PK-Y-007", color: "#1E3A5F", gradient: "linear-gradient(180deg, #1E3A5F, #1E3A5F)" },
  { id: "PK-Y-008" as LensColor, name: "PK-Y-008", color: "#2E3A6B", gradient: "linear-gradient(180deg, #2E3A6B, #B8B8D4)" },
  { id: "PK-Y-009" as LensColor, name: "PK-Y-009", color: "#90C878", gradient: "linear-gradient(180deg, #90C878, #90C878)" },
  { id: "PK-Y-010" as LensColor, name: "PK-Y-010", color: "#E8B88B", gradient: "linear-gradient(180deg, #E8B88B, #E8B88B)" },
  { id: "PK-Y-011" as LensColor, name: "PK-Y-011", color: "#E8D639", gradient: "linear-gradient(180deg, #E8D639, #E8D639)" },
  { id: "PK-Y-012" as LensColor, name: "PK-Y-012", color: "#7BB8D4", gradient: "linear-gradient(180deg, #7BB8D4, #7BB8D4)" },
];

const AdvancedSunglassesBuilder = ({ onPriceChange }: AdvancedSunglassesBuilderProps) => {
  const [frame, setFrame] = useState("PK002");
  const [lensColor, setLensColor] = useState<LensColor>("PK-Y-001");
  const [vlt, setVlt] = useState(15);
  const [gradientMode, setGradientMode] = useState(false);
  const [gradientSecondary, setGradientSecondary] = useState<LensColor>("PK-Y-002");
  const [view, setView] = useState<"front" | "side">("front");
  const [povPreview, setPovPreview] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [tryOnMode, setTryOnMode] = useState(false);
  const dragStartX = useRef(0);
  const lastRotation = useRef(0);

  const selectedFrame = FRAME_OPTIONS.find((f) => f.id === frame)!;
  const selectedLensColor = LENS_COLORS.find((c) => c.id === lensColor)!;
  const baseColor = selectedLensColor.color;
  const tintColor = selectedLensColor.color;
  const secondaryColor = LENS_COLORS.find((c) => c.id === gradientSecondary)!.color;

  const price = FRAME_BASE_PRICE + (vlt < 20 ? 25 : vlt < 50 ? 15 : 10) + (gradientMode ? 20 : 0);

  useState(() => {
    onPriceChange(price);
  });

  const handleFrameChange = (id: string) => {
    setFrame(id);
    onPriceChange(price);
  };

  const handleVltChange = (val: number[]) => {
    setVlt(val[0]);
    const newPrice = FRAME_BASE_PRICE + (val[0] < 20 ? 25 : val[0] < 50 ? 15 : 10) + (gradientMode ? 20 : 0);
    onPriceChange(newPrice);
  };

  const getPovFilter = () => {
    const opacity = 1 - vlt / 100;
    const filterColor = tintColor;
    return `${filterColor}${Math.round(opacity * 180).toString(16).padStart(2, '0')}`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    lastRotation.current = rotation;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX.current;
    const newRotation = lastRotation.current + delta * 0.5;
    setRotation(newRotation % 360);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getRotationView = (): "front" | "side" => {
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    if (normalizedRotation < 90 || normalizedRotation >= 270) return "front";
    return "side";
  };

  const getLensTintStyle = () => {
    const opacity = Math.max(0, Math.min(1, 1 - vlt / 100));
    const finalColor = tintColor === "transparent" ? baseColor : tintColor;

    if (gradientMode) {
      const topColor = tintColor === "transparent" ? baseColor : tintColor;
      const bottomColor = secondaryColor === "transparent" ? baseColor : secondaryColor;
      return {
        background: `linear-gradient(180deg, ${topColor} 0%, ${bottomColor} 100%)`,
        opacity: opacity,
      };
    }

    return {
      backgroundColor: finalColor,
      opacity: opacity,
    };
  };

  const currentView = getRotationView();
  const showFront = (view === "front" && currentView === "front") || tryOnMode;
  const showSide = view === "side" || (view === "front" && currentView === "side");

  return (
    <div className="flex flex-col h-screen">
      <div
        className="flex-1 flex items-center justify-center p-8 relative bg-gradient-to-br from-background to-muted/20 overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {tryOnMode && (
          <div className="absolute inset-0 flex items-start justify-center pt-12">
            <div className="relative">
              <div className="w-64 h-80 bg-gradient-to-b from-amber-50 to-amber-100 rounded-t-full rounded-b-3xl border-4 border-amber-200/50 relative overflow-hidden">
                <div className="absolute top-16 left-1/2 -translate-x-1/2 w-full flex justify-center gap-12">
                  <div className="w-8 h-12 bg-gradient-to-b from-amber-800/40 to-amber-900/60 rounded-full" />
                  <div className="w-8 h-12 bg-gradient-to-b from-amber-800/40 to-amber-900/60 rounded-full" />
                </div>
                <div className="absolute top-36 left-1/2 -translate-x-1/2 w-12 h-16 bg-gradient-to-b from-amber-200 to-amber-300 rounded-b-xl" />
                <div className="absolute top-48 left-1/2 -translate-x-1/2 w-20 h-1 bg-amber-300/50 rounded-full" />
              </div>
              <div className="absolute top-28 left-1/2 -translate-x-1/2 z-10">
                <div className="w-96">
                  <CustomizableFrame
                    imageSrc={selectedFrame.image}
                    alt={selectedFrame.name}
                    vlt={vlt}
                    baseColor={baseColor}
                    tintColor={tintColor}
                    gradientMode={gradientMode}
                    secondaryColor={secondaryColor}
                    maxWidth="400px"
                    transform="scale(0.85)"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {!tryOnMode && (
          <div className="relative max-w-4xl w-full flex items-center justify-center">
            {showFront && (
              <CustomizableFrame
                imageSrc={selectedFrame.image}
                alt={selectedFrame.name}
                vlt={vlt}
                baseColor={baseColor}
                tintColor={tintColor}
                gradientMode={gradientMode}
                secondaryColor={secondaryColor}
                maxWidth="800px"
              />
            )}

            {showSide && (
              <CustomizableFrame
                imageSrc={selectedFrame.image}
                alt={`${selectedFrame.name} - Side View`}
                vlt={vlt}
                baseColor={baseColor}
                tintColor={tintColor}
                gradientMode={gradientMode}
                secondaryColor={secondaryColor}
                maxWidth="800px"
                transform="perspective(1200px) rotateY(45deg) scale(0.95)"
              />
            )}
          </div>
        )}

        {povPreview && !tryOnMode && (
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: getPovFilter() }} />
        )}

        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant={tryOnMode ? "default" : "luxe-outline"}
            size="sm"
            onClick={() => {
              setTryOnMode(!tryOnMode);
              if (!tryOnMode) {
                setRotation(0);
                setView("front");
              }
            }}
          >
            <User className="w-3.5 h-3.5" />
            Try On
          </Button>
          <Button
            variant={povPreview ? "default" : "luxe-outline"}
            size="sm"
            onClick={() => setPovPreview(!povPreview)}
            disabled={tryOnMode}
          >
            {povPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            POV
          </Button>
        </div>

        {!tryOnMode && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-background/80 backdrop-blur px-4 py-2 rounded-full border border-border shadow-lg">
            <Rotate3d className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-body">Drag to rotate 360°</span>
            <MousePointer2 className="w-3.5 h-3.5 text-muted-foreground animate-pulse" />
          </div>
        )}

        {tryOnMode && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur px-4 py-2 rounded-full border border-border shadow-lg">
            <span className="text-xs text-muted-foreground font-body">Virtual Try-On Mode Active</span>
          </div>
        )}
      </div>

      <div className="h-80 border-t bg-card/50 backdrop-blur-sm p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <label className="text-sm font-medium mb-3 block font-heading">Select Frame</label>
            <div className="grid grid-cols-5 gap-2">
              {FRAME_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleFrameChange(f.id)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    frame === f.id
                      ? "border-primary bg-primary/5 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <div className="text-xs font-medium font-heading">{f.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{f.dimensions}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block font-heading">Lens Color</label>
            <div className="grid grid-cols-6 gap-2">
              {LENS_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setLensColor(color.id)}
                  className={`p-2 rounded-lg border-2 transition-all hover:scale-110 ${
                    lensColor === color.id
                      ? "border-primary bg-primary/5 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                  title={color.name}
                >
                  <div
                    className="w-8 h-8 rounded-full border mx-auto"
                    style={{
                      background: color.gradient,
                    }}
                  />
                  <div className="text-xs font-medium font-heading mt-1 text-center">{color.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block font-heading">
              VLT (Visible Light Transmission): {vlt}%
            </label>
            <Slider value={[vlt]} onValueChange={handleVltChange} min={5} max={95} step={5} className="mb-2" />
            <p className="text-xs text-muted-foreground font-body">
              Lower VLT = Darker lenses. 5-20% for bright sun, 50%+ for low light.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={gradientMode}
                onChange={(e) => {
                  setGradientMode(e.target.checked);
                  const newPrice = FRAME_BASE_PRICE + (vlt < 20 ? 25 : vlt < 50 ? 15 : 10) + (e.target.checked ? 20 : 0);
                  onPriceChange(newPrice);
                }}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium font-heading">Gradient Mode (+$20)</span>
            </label>

            {gradientMode && (
              <select
                value={gradientSecondary}
                onChange={(e) => setGradientSecondary(e.target.value as LensColor)}
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
        </div>
      </div>
    </div>
  );
};

export default AdvancedSunglassesBuilder;
