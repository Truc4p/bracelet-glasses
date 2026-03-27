import { useState, useCallback } from "react";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FRAME_OPTIONS,
  LENS_COLORS,
  FRAME_BASE_PRICE,
  COATING_PRICE_PER_10,
} from "@/lib/luxe-data";

interface SunglassesBuilderProps {
  onPriceChange: (price: number) => void;
}

const SunglassesBuilder = ({ onPriceChange }: SunglassesBuilderProps) => {
  const [frame, setFrame] = useState("aviator");
  const [tintDensity, setTintDensity] = useState(50);
  const [lensColorId, setLensColorId] = useState("blue-clear");
  const [view, setView] = useState<"front" | "side">("front");

  const lensColor = LENS_COLORS.find((l) => l.id === lensColorId)!;
  const selectedFrame = FRAME_OPTIONS.find((f) => f.id === frame)!;

  const price = FRAME_BASE_PRICE + Math.floor(tintDensity / 10) * COATING_PRICE_PER_10;

  const updatePrice = useCallback(() => {
    onPriceChange(price);
  }, [price, onPriceChange]);

  // Keep parent in sync
  useState(() => {
    onPriceChange(price);
  });

  const handleFrameChange = (id: string) => {
    setFrame(id);
    setTimeout(updatePrice, 0);
  };

  const handleTintChange = (val: number) => {
    setTintDensity(val);
    onPriceChange(FRAME_BASE_PRICE + Math.floor(val / 10) * COATING_PRICE_PER_10);
  };

  // Frame shapes as SVG paths
  const renderLens = (side: "left" | "right") => {
    const lensOpacity = tintDensity / 100;
    const xOffset = side === "left" ? -65 : 65;
    const fillValue = `url(#pattern-${lensColorId})`;
    const shapes: Record<string, JSX.Element> = {
      "cat-eye": (
        <path
          d={`M${xOffset - 40},0 Q${xOffset - 45},-35 ${xOffset - 15},-38 Q${xOffset + 15},-30 ${xOffset + 40},-5 Q${xOffset + 40},30 ${xOffset},35 Q${xOffset - 40},30 ${xOffset - 40},0 Z`}
          fill={fillValue}
          fillOpacity={lensOpacity}
          stroke="hsl(var(--foreground))"
          strokeWidth="2.5"
        />
      ),
      aviator: (
        <path
          d={`M${xOffset - 42},-15 Q${xOffset - 42},-38 ${xOffset},-38 Q${xOffset + 42},-38 ${xOffset + 42},-15 Q${xOffset + 42},25 ${xOffset + 10},35 Q${xOffset - 10},38 ${xOffset - 30},30 Q${xOffset - 42},20 ${xOffset - 42},-15 Z`}
          fill={fillValue}
          fillOpacity={lensOpacity}
          stroke="hsl(var(--foreground))"
          strokeWidth="2.5"
        />
      ),
      wayfarer: (
        <rect
          x={xOffset - 40}
          y={-35}
          width={80}
          height={65}
          rx={8}
          fill={fillValue}
          fillOpacity={lensOpacity}
          stroke="hsl(var(--foreground))"
          strokeWidth="2.5"
        />
      ),
      round: (
        <circle
          cx={xOffset}
          cy={0}
          r={36}
          fill={fillValue}
          fillOpacity={lensOpacity}
          stroke="hsl(var(--foreground))"
          strokeWidth="2.5"
        />
      ),
      oversized: (
        <ellipse
          cx={xOffset}
          cy={0}
          rx={48}
          ry={40}
          fill={fillValue}
          fillOpacity={lensOpacity}
          stroke="hsl(var(--foreground))"
          strokeWidth="2.5"
        />
      ),
    };
    return shapes[frame] || shapes.aviator;
  };

  const renderSideView = () => {
    const lensOpacity = tintDensity / 100;
    return (
      <svg viewBox="-120 -80 240 160" className="w-full max-w-md">
        <defs>
          <pattern id={`pattern-${lensColorId}`} patternUnits="userSpaceOnUse" width="240" height="160" x="-120" y="-80">
            <image href={lensColor.image} width="240" height="160" preserveAspectRatio="xMidYMid slice" />
          </pattern>
        </defs>
        {/* Temple arm */}
        <line x1="40" y1="-20" x2="110" y2="-30" stroke="hsl(var(--foreground))" strokeWidth="3" strokeLinecap="round" />
        <line x1="110" y1="-30" x2="115" y2="-10" stroke="hsl(var(--foreground))" strokeWidth="2.5" strokeLinecap="round" />
        {/* Lens side profile */}
        <ellipse cx={0} cy={0} rx={15} ry={35} fill={`url(#pattern-${lensColorId})`} fillOpacity={lensOpacity} stroke="hsl(var(--foreground))" strokeWidth="2.5" />
        {/* Front frame edge */}
        <line x1="-15" y1="-35" x2="-60" y2="-35" stroke="hsl(var(--foreground))" strokeWidth="2.5" strokeLinecap="round" />
        {/* Nose pad */}
        <line x1="-15" y1="10" x2="-25" y2="30" stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  };

  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      {/* 3D Viewport */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {view === "front" ? (
          <svg viewBox="-160 -80 320 160" className="w-full max-w-lg">
            <defs>
              <pattern id={`pattern-${lensColorId}`} patternUnits="userSpaceOnUse" width="320" height="160" x="-160" y="-80">
                <image href={lensColor.image} width="320" height="160" preserveAspectRatio="xMidYMid slice" />
              </pattern>
            </defs>
            {/* Bridge */}
            <path d="M-22,-15 Q0,-25 22,-15" fill="none" stroke="hsl(var(--foreground))" strokeWidth="2.5" />
            {/* Lenses */}
            {renderLens("left")}
            {renderLens("right")}
            {/* Temple hints */}
            <line x1="-105" y1="-20" x2="-130" y2="-25" stroke="hsl(var(--foreground))" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="105" y1="-20" x2="130" y2="-25" stroke="hsl(var(--foreground))" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : (
          renderSideView()
        )}
        {/* View toggle */}
        <div className="absolute top-4 right-4">
          <Button variant="luxe-outline" size="sm" onClick={() => setView(view === "front" ? "side" : "front")}>
            <RotateCw className="w-3.5 h-3.5" />
            {view === "front" ? "Side" : "Front"}
          </Button>
        </div>
      </div>

      {/* Configuration bar - bottom docked */}
      <div className="border-t border-border px-6 py-5 space-y-5">
        {/* Frames */}
        <div>
          <label className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-2 block">Frame Style</label>
          <div className="flex gap-2">
            {FRAME_OPTIONS.map((f) => (
              <button
                key={f.id}
                onClick={() => handleFrameChange(f.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-lg border transition-all text-sm font-body ${
                  frame === f.id
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                <span className="text-lg">{f.icon}</span>
                <span className="text-[11px]">{f.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Tint density */}
          <div className="flex-1">
            <label className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-2 block">
              Tint Density — {tintDensity}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={tintDensity}
              onChange={(e) => handleTintChange(Number(e.target.value))}
              className="w-full accent-[hsl(var(--primary))] h-1.5"
            />
          </div>

          {/* Lens color */}
          <div>
            <label className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-2 block">Lens Color</label>
            <div className="flex gap-2">
              {LENS_COLORS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setLensColorId(l.id);
                  }}
                  className={`relative w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden transition-all ${
                    lensColorId === l.id ? "ring-2 ring-primary scale-110" : "ring-1 ring-border hover:scale-105"
                  }`}
                  title={l.name}
                >
                  <img src={l.image} alt={l.name} className="w-full h-full object-cover scale-[1.35]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SunglassesBuilder;
