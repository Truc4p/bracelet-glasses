import { useState, useCallback, useRef, useEffect } from "react";
import { Glasses, Sparkles, RotateCcw, Waves, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import FrameLibrary from "@/components/FrameLibrary";
import SunglassesAccessoriesLibrary from "@/components/SunglassesAccessoriesLibrary";
import { FRAME_BASE_PRICE, type FrameOption, type PlacedAccessory, type SunglassesAccessory } from "@/lib/luxe-data";
import { useCatalogue } from "@/data/index";

interface AdvancedSunglassesBuilderProps {
  onPriceChange: (price: number) => void;
}

type LensColor = {
  id: string;
  name: string;
  image: string;
};

const LENS_COLORS: LensColor[] = [
  { id: "amber", name: "Amber", image: "" },
  { id: "american-grey-fade", name: "American Grey Fade", image: "" },
  { id: "aqua-sunrise", name: "Aqua Sunrise", image: "" },
  { id: "bel-air-blue", name: "Bel Air Blue", image: "" },
  { id: "big-apple-fade", name: "Big Apple Fade", image: "" },
  { id: "broadway-blue-fade", name: "Broadway Blue Fade", image: "" },
  { id: "cabernet", name: "Cabernet", image: "" },
  { id: "candy-corn", name: "Candy Corn", image: "" },
  { id: "celebrity-blue", name: "Celebrity Blue", image: "" },
  { id: "chestnut-fade", name: "Chestnut Fade", image: "" },
  { id: "city-lights", name: "City Lights", image: "" },
  { id: "denim-blue", name: "Denim Blue", image: "" },
  { id: "forest-wood", name: "Forest Wood", image: "" },
  { id: "g-15-fade", name: "G-15 Fade", image: "" },
  { id: "garnet-green", name: "Garnet Green", image: "" },
  { id: "lavender", name: "Lavender", image: "" },
  { id: "limelight", name: "Limelight", image: "" },
  { id: "mellow-yellow", name: "Mellow Yellow", image: "" },
  { id: "new-york-rose", name: "New York Rose", image: "" },
  { id: "pastel-yellow", name: "Pastel Yellow", image: "" },
  { id: "purple-nurple", name: "Purple Nurple", image: "" },
  { id: "root-beer-fade", name: "Root Beer Fade", image: "" },
  { id: "turquoise", name: "Turquoise", image: "" },
  { id: "woodstock-orange", name: "Woodstock Orange", image: "" },
];

const AdvancedSunglassesBuilder = ({ onPriceChange }: AdvancedSunglassesBuilderProps) => {
  const { frames } = useCatalogue();
  const fallbackFrame: FrameOption = {
    id: "fallback",
    name: "No Frames Available",
    dimensions: "-",
    description: "Fallback description",
    frameImages: [],
    price: 0,
    lensColors: []
  };
  const [selectedFrame, setSelectedFrame] = useState<FrameOption>(frames[0] || fallbackFrame);

  // Use the lens colors from the selected frame or a fallback if none exist
  const customLensColors: LensColor[] = (selectedFrame?.lensColors && selectedFrame.lensColors.length > 0)
    ? selectedFrame.lensColors.map((lc, idx) => ({
        id: lc.colorName.toLowerCase().replace(/\s+/g, '-'),
        name: lc.colorName,
        image: lc.image
      }))
    : LENS_COLORS;
    
  const availableLensColors: LensColor[] = [
    { id: "clear", name: "Clear / Original", image: "" },
    ...customLensColors
  ];

  const defaultLensColor: LensColor = availableLensColors[0] || { id: "default", name: "Default Base", image: "" };
  const [lensColor, setLensColor] = useState<LensColor>(defaultLensColor);
  const [vlt, setVlt] = useState(15);
  const [gradientMode, setGradientMode] = useState(false);
  const [gradientSecondary, setGradientSecondary] = useState<LensColor>(availableLensColors[1] || availableLensColors[0] || defaultLensColor);
  const [placedAccessories, setPlacedAccessories] = useState<PlacedAccessory[]>([]);

  // Update selected frame data if it gets updated in the catalogue
  useEffect(() => {
    if (frames.length > 0) {
      const updated = frames.find(f => f.id === selectedFrame?.id);
      if (updated) {
        // Only update if something changed (like new image/shade) to avoid loop
        if (JSON.stringify(updated) !== JSON.stringify(selectedFrame)) {
          setSelectedFrame(updated);
        }
      } else {
        setSelectedFrame(frames[0]);
      }
    } else {
      setSelectedFrame(fallbackFrame);
    }
  }, [frames, selectedFrame]);

  // Update selected lens color when available colors change
  useEffect(() => {
    if (availableLensColors.length > 0) {
      setLensColor(prev => availableLensColors.find(l => l.id === prev?.id) || availableLensColors[0]);
      setGradientSecondary(prev => availableLensColors.find(l => l.id === prev?.id) || availableLensColors[1] || availableLensColors[0]);
    } else {
      const fb = { id: "default", name: "Default Base", image: "" };
      setLensColor(fb);
      setGradientSecondary(fb);
    }
  }, [selectedFrame.lensColors]);
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
    setLensColor(availableLensColors[0] || { id: "default", name: "Default Base", image: "" });
    updatePrice([], 15, false);
  };

  return (
    <div className="relative flex-1 w-full h-full flex flex-col animate-fade-in overflow-hidden">
      <div className="flex-shrink-0 flex flex-wrap items-center gap-4 px-6 py-4 border-b border-border bg-white">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Frame</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm font-body">
            {selectedFrame.name}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Lens Tint</span>
          <button 
            onClick={() => {
              setAccessoriesOpen(true);
              setFrameLibraryOpen(false);
              // Small hack to switch to the Lens Colors tab if we had references, 
              // but we just let the user see the customize panel for now.
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-sm font-body cursor-pointer group"
          >
            <div 
              className="w-3.5 h-3.5 rounded-full border border-black/10 overflow-hidden flex-shrink-0"
              style={{ 
                backgroundImage: `url(${lensColor?.image || ''})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: lensColor?.id?.includes('amber') ? '#FFBF00' : (lensColor?.image ? 'transparent' : '#71717a') // Fallback color
              }} 
            />
            <span>
              {lensColor?.name} {gradientMode && <span className="opacity-60 text-xs">/ {gradientSecondary?.name}</span>}
            </span>
            <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-1">Change</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Lens Density</span>
          <div className="w-32">
            <Slider value={[vlt]} onValueChange={handleVltChange} min={0} max={100} step={5} />
          </div>
          <span className="text-sm font-body">{vlt}% VLT</span>
        </div>



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
        <div className={`min-h-full flex items-center justify-center p-6 transition-all duration-300 ${
          (accessoriesOpen || frameLibraryOpen) ? "lg:pl-[340px]" : ""
        }`}>
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
            currentLensColorId={lensColor?.id}
            currentSecondaryColorId={gradientSecondary?.id}
            gradientMode={gradientMode}
            availableLensColors={availableLensColors}
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
              {/* Show dynamic lens overlay */
              (
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply"
                  style={{
                    zIndex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    maskImage: `url(${selectedFrame.frameImages?.[0]?.replace('_-_CLEAR', '') || ''})`,
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskImage: `url(${selectedFrame.frameImages?.[0]?.replace('_-_CLEAR', '') || ''})`,
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    opacity: Math.max(0, Math.min(0.8, 1 - (vlt || 50) / 100))
                  }}
                />
              )}
              <img
                src={lensColor?.image || selectedFrame.frameImages?.[0]}
                alt={`${selectedFrame.name} - ${lensColor?.name || 'Default'}`}
                className="absolute w-full h-full object-contain pointer-events-none"
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
                backgroundColor: lensColor?.id?.includes('amber') ? '#d97706' : (lensColor?.image ? 'rgba(0,0,0,1)' : '#71717a'),
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

      <div className="flex-shrink-0 px-6 py-4 border-t border-border bg-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs text-muted-foreground font-body">
          <span className="font-bold text-foreground">Disclaimer:</span> The visuals shown are for illustration purposes only and represent the closest possible match.
        </div>

        <div className="text-sm font-body text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border border-border/50 text-center md:text-right">
          Want to get it customised to your prescription? <a href="mailto:contact@binofoundry.com" className="text-primary font-medium hover:underline underline-offset-2">Contact us</a> for your personalised quote.
        </div>
      </div>
    </div>
  );
};

export default AdvancedSunglassesBuilder;
