import { useState, useRef, useEffect } from "react";
import { Glasses, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import FrameLibrary from "@/components/FrameLibrary";
import SunglassesCustomizeLibrary from "@/components/SunglassesCustomizeLibrary";
import { FRAME_BASE_PRICE, type FrameOption } from "@/lib/luxe-data";
import { useCatalogue } from "@/data/index";

interface AdvancedSunglassesBuilderProps {
  onPriceChange: (price: number) => void;
}

type LensColor = {
  id: string;
  name: string;
  image: string;
};

const LENS_COLORS: LensColor[] = [];

const AdvancedSunglassesBuilder = ({ onPriceChange }: AdvancedSunglassesBuilderProps) => {
  const { frames } = useCatalogue();
  const fallbackFrame: FrameOption = {
    id: "fallback",
    name: "No Frames Available",
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
    { id: "clear", name: "Original", image: selectedFrame.frameImages?.[0] || "" },
    ...customLensColors
  ];

  const defaultLensColor: LensColor = availableLensColors[0] || { id: "default", name: "Default Base", image: "" };
  const [lensColor, setLensColor] = useState<LensColor>(defaultLensColor);

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
    } else {
      setLensColor({ id: "default", name: "Default Base", image: "" });
    }
  }, [selectedFrame.lensColors]);
  const [frameLibraryOpen, setFrameLibraryOpen] = useState(true);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onPriceChange(FRAME_BASE_PRICE);
  }, [onPriceChange]);

  const handleFrameSelect = (frame: FrameOption) => {
    setSelectedFrame(frame);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setLensColor(availableLensColors[0] || { id: "default", name: "Default Base", image: "" });
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
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm font-body">
            <div 
              className="w-3.5 h-3.5 rounded-full border border-black/10 overflow-hidden flex-shrink-0"
              style={{ 
                backgroundImage: `url(${lensColor?.image || ''})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: lensColor?.id?.includes('amber') ? '#FFBF00' : (lensColor?.image ? 'transparent' : '#71717a')
              }} 
            />
            <span>{lensColor?.name}</span>
          </div>
        </div>


        <div className="flex items-center gap-2 ml-auto">
          <Button variant="luxe-outline" size="sm" onClick={() => {
            setFrameLibraryOpen(!frameLibraryOpen);
            setCustomizeOpen(false);
          }}>
            <Glasses className="w-3.5 h-3.5" />
            Frames
          </Button>
          <Button variant="luxe-outline" size="sm" onClick={() => {
            setCustomizeOpen(!customizeOpen);
            setFrameLibraryOpen(false);
          }}>
            <Sparkles className="w-3.5 h-3.5" />
            Lens Tint
          </Button>
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 relative overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className={`min-h-full flex items-center justify-center p-6 transition-all duration-300 ${
          (customizeOpen || frameLibraryOpen) ? "lg:pl-[340px]" : ""
        }`}>
          <FrameLibrary
            open={frameLibraryOpen}
            onSelectFrame={handleFrameSelect}
            onClose={() => setFrameLibraryOpen(false)}
          />

          <SunglassesCustomizeLibrary
            open={customizeOpen}
            onSelectLensColor={(color) => setLensColor(color)}
            onSelectSecondaryColor={() => {}}
            currentLensColorId={lensColor?.id}
            gradientMode={false}
            availableLensColors={availableLensColors}
            onClose={() => setCustomizeOpen(false)}
          />

          <div className="flex items-center gap-6 max-w-5xl w-full">
            <div
              ref={canvasRef}
              className="relative flex-1 w-full"
              onDrop={handleCanvasDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
            >
              <div
                className="relative w-full rounded-lg overflow-hidden"
                style={{
                  paddingBottom: '56%',
                }}
              >
                <img
                  src={lensColor?.id !== 'clear' && lensColor?.image ? lensColor.image : selectedFrame.frameImages?.[0]}
                  alt={`${selectedFrame.name} - ${lensColor?.name || 'Default'}`}
                  className="absolute w-full h-full object-contain pointer-events-none"
                />
              </div>
            </div>


          </div>
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
