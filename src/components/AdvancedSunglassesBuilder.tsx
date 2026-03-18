import { useState, useRef } from "react";
import { Eye, EyeOff, User, Rotate3d, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FRAME_OPTIONS, FRAME_BASE_PRICE } from "@/lib/luxe-data";
import { Slider } from "@/components/ui/slider";
import { CustomizableFrame } from "./CustomizableFrame";

interface AdvancedSunglassesBuilderProps {
  onPriceChange: (price: number) => void;
}

type BaseMaterial = "grey" | "brown" | "green" | "g15";
type FashionTint = "rose-gold" | "midnight-blue" | "amber" | "violet" | "clear";

const BASE_MATERIALS = [
  { id: "grey" as BaseMaterial, name: "Grey", color: "#808080" },
  { id: "brown" as BaseMaterial, name: "Brown", color: "#8B4513" },
  { id: "green" as BaseMaterial, name: "Green", color: "#2E8B57" },
  { id: "g15" as BaseMaterial, name: "G-15", color: "#3D5C43" },
];

const FASHION_TINTS = [
  { id: "clear" as FashionTint, name: "Clear", color: "transparent" },
  { id: "rose-gold" as FashionTint, name: "Rose Gold", color: "#B76E79" },
  { id: "midnight-blue" as FashionTint, name: "Midnight Blue", color: "#191970" },
  { id: "amber" as FashionTint, name: "Amber", color: "#FFBF00" },
  { id: "violet" as FashionTint, name: "Violet", color: "#8B00FF" },
];

const AdvancedSunglassesBuilder = ({ onPriceChange }: AdvancedSunglassesBuilderProps) => {
  const [frame, setFrame] = useState("PK002");
  const [baseMaterial, setBaseMaterial] = useState<BaseMaterial>("grey");
  const [fashionTint, setFashionTint] = useState<FashionTint>("clear");
  const [vlt, setVlt] = useState(15);
  const [gradientMode, setGradientMode] = useState(false);
  const [gradientSecondary, setGradientSecondary] = useState<FashionTint>("clear");
  const [view, setView] = useState<"front" | "side">("front");
  const [povPreview, setPovPreview] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [tryOnMode, setTryOnMode] = useState(false);
  const dragStartX = useRef(0);
  const lastRotation = useRef(0);

  const selectedFrame = FRAME_OPTIONS.find((f) => f.id === frame)!;
  const baseColor = BASE_MATERIALS.find((m) => m.id === baseMaterial)!.color;
  const tintColor = FASHION_TINTS.find((t) => t.id === fashionTint)!.color;
  const secondaryColor = FASHION_TINTS.find((t) => t.id === gradientSecondary)!.color;

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
    const filterColor = tintColor === "transparent" ? baseColor : tintColor;
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

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-3 block font-heading">Base Material</label>
              <div className="grid grid-cols-2 gap-2">
                {BASE_MATERIALS.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setBaseMaterial(mat.id)}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                      baseMaterial === mat.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: mat.color }} />
                    <span className="text-sm font-body">{mat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block font-heading">Fashion Tint</label>
              <div className="grid grid-cols-2 gap-2">
                {FASHION_TINTS.slice(0, 4).map((tint) => (
                  <button
                    key={tint.id}
                    onClick={() => setFashionTint(tint.id)}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                      fashionTint === tint.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border"
                      style={{ backgroundColor: tint.color === "transparent" ? "#fff" : tint.color }}
                    />
                    <span className="text-sm font-body">{tint.name}</span>
                  </button>
                ))}
              </div>
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
                onChange={(e) => setGradientSecondary(e.target.value as FashionTint)}
                className="px-3 py-1.5 rounded-md border bg-background text-sm font-body"
              >
                {FASHION_TINTS.map((tint) => (
                  <option key={tint.id} value={tint.id}>
                    {tint.name}
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
