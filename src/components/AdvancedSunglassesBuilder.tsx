import { useState, useCallback } from "react";
import { RotateCw, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FRAME_OPTIONS, FRAME_BASE_PRICE } from "@/lib/luxe-data";
import { Slider } from "@/components/ui/slider";

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
  const [frame, setFrame] = useState("aviator");
  const [baseMaterial, setBaseMaterial] = useState<BaseMaterial>("grey");
  const [fashionTint, setFashionTint] = useState<FashionTint>("clear");
  const [vlt, setVlt] = useState(15);
  const [gradientMode, setGradientMode] = useState(false);
  const [gradientSecondary, setGradientSecondary] = useState<FashionTint>("clear");
  const [view, setView] = useState<"front" | "side">("front");
  const [povPreview, setPovPreview] = useState(false);

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

  const getLensGradient = () => {
    const opacity = 1 - vlt / 100;

    if (gradientMode) {
      const topColor = tintColor === "transparent" ? baseColor : tintColor;
      const bottomColor = secondaryColor === "transparent" ? "rgba(255,255,255,0.1)" : secondaryColor;
      return `linear-gradient(180deg,
        ${topColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%,
        ${bottomColor}${Math.round((opacity * 0.3) * 255).toString(16).padStart(2, '0')} 100%)`;
    }

    const finalColor = tintColor === "transparent" ? baseColor : tintColor;
    return `${finalColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  };

  const renderLens = (side: "left" | "right") => {
    const xOffset = side === "left" ? -70 : 70;
    const opacity = 1 - vlt / 100;

    const shapes: Record<string, JSX.Element> = {
      "cat-eye": (
        <g>
          <defs>
            <linearGradient id={`lens-grad-${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={baseColor} stopOpacity={opacity} />
              <stop offset="100%" stopColor={gradientMode ? secondaryColor : baseColor} stopOpacity={gradientMode ? opacity * 0.3 : opacity} />
            </linearGradient>
            <linearGradient id={`frame-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="50%" stopColor="#2a2a2a" />
              <stop offset="100%" stopColor="#1a1a1a" />
            </linearGradient>
            <radialGradient id={`specular-${side}`} cx="35%" cy="30%">
              <stop offset="0%" stopColor="white" stopOpacity="0.25" />
              <stop offset="60%" stopColor="white" stopOpacity="0.05" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d={`M${xOffset - 48},5 Q${xOffset - 50},-35 ${xOffset - 18},-40 Q${xOffset + 18},-35 ${xOffset + 45},-8 Q${xOffset + 46},28 ${xOffset + 5},38 Q${xOffset - 35},38 ${xOffset - 48},5 Z`}
            fill={`url(#frame-${side})`}
            stroke="#0a0a0a"
            strokeWidth="1"
          />
          <path
            d={`M${xOffset - 45},5 Q${xOffset - 47},-32 ${xOffset - 18},-37 Q${xOffset + 18},-32 ${xOffset + 42},-8 Q${xOffset + 43},26 ${xOffset + 5},35 Q${xOffset - 32},35 ${xOffset - 45},5 Z`}
            fill={`url(#lens-grad-${side})`}
            stroke="none"
          />
          <ellipse cx={xOffset - 8} cy={-10} rx={28} ry={20} fill={`url(#specular-${side})`} />
        </g>
      ),
      aviator: (
        <g>
          <defs>
            <linearGradient id={`lens-grad-${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={baseColor} stopOpacity={opacity} />
              <stop offset="100%" stopColor={gradientMode ? secondaryColor : baseColor} stopOpacity={gradientMode ? opacity * 0.3 : opacity} />
            </linearGradient>
            <linearGradient id={`frame-${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c9b037" />
              <stop offset="50%" stopColor="#f4e58c" />
              <stop offset="100%" stopColor="#c9b037" />
            </linearGradient>
            <radialGradient id={`specular-${side}`} cx="38%" cy="28%">
              <stop offset="0%" stopColor="white" stopOpacity="0.3" />
              <stop offset="55%" stopColor="white" stopOpacity="0.08" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d={`M${xOffset - 48},-12 Q${xOffset - 48},-42 ${xOffset},-42 Q${xOffset + 48},-42 ${xOffset + 48},-12 Q${xOffset + 48},28 ${xOffset + 12},40 Q${xOffset - 12},42 ${xOffset - 35},32 Q${xOffset - 48},22 ${xOffset - 48},-12 Z`}
            fill={`url(#frame-${side})`}
            stroke="#a58f2f"
            strokeWidth="1"
          />
          <path
            d={`M${xOffset - 45},-12 Q${xOffset - 45},-39 ${xOffset},-39 Q${xOffset + 45},-39 ${xOffset + 45},-12 Q${xOffset + 45},26 ${xOffset + 12},37 Q${xOffset - 12},39 ${xOffset - 32},30 Q${xOffset - 45},20 ${xOffset - 45},-12 Z`}
            fill={`url(#lens-grad-${side})`}
            stroke="none"
          />
          <ellipse cx={xOffset - 6} cy={-10} rx={26} ry={22} fill={`url(#specular-${side})`} />
        </g>
      ),
      wayfarer: (
        <g>
          <defs>
            <linearGradient id={`lens-grad-${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={baseColor} stopOpacity={opacity} />
              <stop offset="100%" stopColor={gradientMode ? secondaryColor : baseColor} stopOpacity={gradientMode ? opacity * 0.3 : opacity} />
            </linearGradient>
            <linearGradient id={`frame-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a0a0a" />
              <stop offset="50%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>
            <radialGradient id={`specular-${side}`} cx="35%" cy="32%">
              <stop offset="0%" stopColor="white" stopOpacity="0.28" />
              <stop offset="58%" stopColor="white" stopOpacity="0.06" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect
            x={xOffset - 46}
            y={-38}
            width={92}
            height={72}
            rx={6}
            fill={`url(#frame-${side})`}
            stroke="#000"
            strokeWidth="1"
          />
          <rect
            x={xOffset - 43}
            y={-35}
            width={86}
            height={66}
            rx={5}
            fill={`url(#lens-grad-${side})`}
            stroke="none"
          />
          <ellipse cx={xOffset - 8} cy={-6} rx={30} ry={24} fill={`url(#specular-${side})`} />
        </g>
      ),
      round: (
        <g>
          <defs>
            <linearGradient id={`lens-grad-${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={baseColor} stopOpacity={opacity} />
              <stop offset="100%" stopColor={gradientMode ? secondaryColor : baseColor} stopOpacity={gradientMode ? opacity * 0.3 : opacity} />
            </linearGradient>
            <linearGradient id={`frame-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3a2f2f" />
              <stop offset="50%" stopColor="#5a4a4a" />
              <stop offset="100%" stopColor="#3a2f2f" />
            </linearGradient>
            <radialGradient id={`specular-${side}`} cx="38%" cy="32%">
              <stop offset="0%" stopColor="white" stopOpacity="0.32" />
              <stop offset="50%" stopColor="white" stopOpacity="0.1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle
            cx={xOffset}
            cy={0}
            r={42}
            fill={`url(#frame-${side})`}
            stroke="#2a1f1f"
            strokeWidth="1"
          />
          <circle
            cx={xOffset}
            cy={0}
            r={39}
            fill={`url(#lens-grad-${side})`}
            stroke="none"
          />
          <circle cx={xOffset - 10} cy={-12} r={22} fill={`url(#specular-${side})`} />
        </g>
      ),
      oversized: (
        <g>
          <defs>
            <linearGradient id={`lens-grad-${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={baseColor} stopOpacity={opacity} />
              <stop offset="100%" stopColor={gradientMode ? secondaryColor : baseColor} stopOpacity={gradientMode ? opacity * 0.3 : opacity} />
            </linearGradient>
            <linearGradient id={`frame-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="50%" stopColor="#2a2a2a" />
              <stop offset="100%" stopColor="#1a1a1a" />
            </linearGradient>
            <radialGradient id={`specular-${side}`} cx="36%" cy="30%">
              <stop offset="0%" stopColor="white" stopOpacity="0.3" />
              <stop offset="50%" stopColor="white" stopOpacity="0.08" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse
            cx={xOffset}
            cy={0}
            rx={54}
            ry={44}
            fill={`url(#frame-${side})`}
            stroke="#0a0a0a"
            strokeWidth="1"
          />
          <ellipse
            cx={xOffset}
            cy={0}
            rx={51}
            ry={41}
            fill={`url(#lens-grad-${side})`}
            stroke="none"
          />
          <ellipse cx={xOffset - 12} cy={-10} rx={30} ry={24} fill={`url(#specular-${side})`} />
        </g>
      ),
    };
    return shapes[frame] || shapes.aviator;
  };

  const renderSideView = () => {
    const opacity = 1 - vlt / 100;
    return (
      <svg viewBox="-120 -80 240 160" className="w-full max-w-md drop-shadow-2xl">
        <defs>
          <linearGradient id="lens-grad-side" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={baseColor} stopOpacity={opacity} />
            <stop offset="100%" stopColor={gradientMode ? secondaryColor : baseColor} stopOpacity={gradientMode ? opacity * 0.3 : opacity} />
          </linearGradient>
          <linearGradient id="frame-side" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="50%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#2a2a2a" />
          </linearGradient>
          <radialGradient id="specular-side" cx="45%" cy="35%">
            <stop offset="0%" stopColor="white" stopOpacity="0.25" />
            <stop offset="50%" stopColor="white" stopOpacity="0.08" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Temple arm extending back */}
        <path
          d="M42,-22 Q80,-26 110,-28 Q120,-26 124,-18"
          stroke="url(#frame-side)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Frame front edge */}
        <ellipse cx={0} cy={0} rx={18} ry={40} fill="url(#frame-side)" stroke="#0a0a0a" strokeWidth="1" />

        {/* Lens side profile */}
        <ellipse cx={0} cy={0} rx={14} ry={37} fill="url(#lens-grad-side)" stroke="none" />
        <ellipse cx={-2} cy={-10} rx={9} ry={18} fill="url(#specular-side)" />

        {/* Front frame extension */}
        <line x1="-18" y1="-38" x2="-65" y2="-38" stroke="url(#frame-side)" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="-18" y1="38" x2="-65" y2="38" stroke="url(#frame-side)" strokeWidth="3.5" strokeLinecap="round" />

        {/* Nose pad */}
        <path
          d="M-16,8 Q-20,18 -22,28"
          stroke="#d0d0d0"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    );
  };

  const getPovFilter = () => {
    const opacity = 1 - vlt / 100;
    const filterColor = tintColor === "transparent" ? baseColor : tintColor;
    return `${filterColor}${Math.round(opacity * 180).toString(16).padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col animate-fade-in relative">
      {/* POV Preview Overlay */}
      {povPreview && (
        <div
          className="absolute inset-0 z-10 pointer-events-none transition-all duration-500"
          style={{
            backgroundColor: getPovFilter(),
            backdropFilter: `blur(${vlt < 30 ? '0.5px' : '0px'})`,
          }}
        >
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-body px-4 py-2 bg-black/40 rounded-full backdrop-blur">
            POV Preview: {vlt}% VLT
          </div>
        </div>
      )}

      {/* 3D Viewport */}
      <div className="flex-1 flex items-center justify-center p-8 relative bg-gradient-to-br from-background to-muted/20">
        {view === "front" ? (
          <svg viewBox="-180 -80 360 160" className="w-full max-w-2xl drop-shadow-2xl">
            <defs>
              <linearGradient id="bridge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2a2a2a" />
                <stop offset="50%" stopColor="#1a1a1a" />
                <stop offset="100%" stopColor="#2a2a2a" />
              </linearGradient>
              <linearGradient id="temple-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3a3a3a" />
                <stop offset="50%" stopColor="#2a2a2a" />
                <stop offset="100%" stopColor="#1a1a1a" />
              </linearGradient>
            </defs>

            {/* Bridge */}
            <path
              d="M-24,-15 Q-12,-22 0,-24 Q12,-22 24,-15"
              fill="none"
              stroke="url(#bridge-grad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Lenses */}
            {renderLens("left")}
            {renderLens("right")}

            {/* Temple arms */}
            <path
              d="M-118,-18 L-145,-22"
              stroke="url(#temple-grad)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M118,-18 L145,-22"
              stroke="url(#temple-grad)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Nose pads */}
            <ellipse cx="-16" cy="-8" rx="3" ry="6" fill="#d0d0d0" opacity="0.6" />
            <ellipse cx="16" cy="-8" rx="3" ry="6" fill="#d0d0d0" opacity="0.6" />
          </svg>
        ) : (
          renderSideView()
        )}

        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant={povPreview ? "default" : "luxe-outline"}
            size="sm"
            onClick={() => setPovPreview(!povPreview)}
          >
            {povPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            POV
          </Button>
          <Button variant="luxe-outline" size="sm" onClick={() => setView(view === "front" ? "side" : "front")}>
            <RotateCw className="w-3.5 h-3.5" />
            {view === "front" ? "Side" : "Front"}
          </Button>
        </div>
      </div>

      {/* Configuration bar */}
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

        {/* Base Material & Fashion Tint */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-2 block">Base Material</label>
            <div className="flex gap-2">
              {BASE_MATERIALS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setBaseMaterial(m.id)}
                  className={`flex-1 py-2 px-3 rounded-md border text-xs font-body transition-all ${
                    baseMaterial === m.id
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{ backgroundColor: m.color }} />
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-2 block">Fashion Tint</label>
            <div className="flex gap-2">
              {FASHION_TINTS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFashionTint(t.id)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    fashionTint === t.id ? "border-primary scale-110 ring-2 ring-primary/20" : "border-border hover:scale-105"
                  }`}
                  style={{ backgroundColor: t.color === "transparent" ? "#fff" : t.color, border: t.color === "transparent" ? "2px dashed #ccc" : undefined }}
                  title={t.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Lens Density (VLT) */}
        <div>
          <label className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-2 block">
            Lens Density — {vlt}% VLT (Visible Light Transmission)
          </label>
          <Slider
            value={[vlt]}
            onValueChange={handleVltChange}
            min={5}
            max={95}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>Dark (5%)</span>
            <span>Light (95%)</span>
          </div>
        </div>

        {/* Gradient Mode */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs text-muted-foreground font-body uppercase tracking-wider block">Shade Profile</label>
            <p className="text-[10px] text-muted-foreground mt-0.5">Gradient transition effect</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={gradientMode ? "default" : "luxe-outline"}
              size="sm"
              onClick={() => setGradientMode(!gradientMode)}
            >
              {gradientMode ? "Gradient Active" : "Solid Tint"}
            </Button>
            {gradientMode && (
              <div className="flex gap-1.5">
                {FASHION_TINTS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setGradientSecondary(t.id)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      gradientSecondary === t.id ? "border-primary scale-110" : "border-border/50 hover:scale-105"
                    }`}
                    style={{ backgroundColor: t.color === "transparent" ? "#fff" : t.color, border: t.color === "transparent" ? "2px dashed #ccc" : undefined }}
                    title={`Bottom: ${t.name}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSunglassesBuilder;
