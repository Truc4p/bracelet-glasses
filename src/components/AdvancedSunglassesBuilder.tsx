import { useState } from "react";
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
  { id: "PK-Y-011" as LensColor, name: "PK-Y-011", color: "#C8A030", gradient: "linear-gradient(180deg, #C8A030, #C8A030)" },
  { id: "PK-Y-012" as LensColor, name: "PK-Y-012", color: "#7BB8D4", gradient: "linear-gradient(180deg, #7BB8D4, #7BB8D4)" },
];

const AdvancedSunglassesBuilder = ({ onPriceChange }: AdvancedSunglassesBuilderProps) => {
  const [frame, setFrame] = useState("PK002");
  const [lensColor, setLensColor] = useState<LensColor>("PK-Y-001");
  const [vlt, setVlt] = useState(15);
  const [gradientMode, setGradientMode] = useState(false);
  const [gradientSecondary, setGradientSecondary] = useState<LensColor>("PK-Y-002");
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

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted/20">
        <div className="relative max-w-4xl w-full flex items-center justify-center">
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
        </div>
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
