import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { FRAME_OPTIONS, type FrameOption } from "@/lib/luxe-data";

interface FrameLibraryProps {
  onSelectFrame: (frame: FrameOption) => void;
  open: boolean;
  onClose: () => void;
}

const FrameLibrary = ({ onSelectFrame, open, onClose }: FrameLibraryProps) => {
  const [search, setSearch] = useState("");

  const filteredFrames = useMemo(
    () => FRAME_OPTIONS.filter((f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.dimensions.includes(search)
    ),
    [search]
  );

  if (!open) return null;

  return (
    <div className="absolute left-0 top-0 bottom-0 w-80 glass-panel rounded-lg z-20 flex flex-col animate-slide-in">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-display text-sm font-semibold">Select Frame</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search frames..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-3">
        {filteredFrames.map((frame) => (
          <button
            key={frame.id}
            onClick={() => {
              onSelectFrame(frame);
            }}
            className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-border hover:border-primary transition-all group bg-background"
          >
            <div className="w-full aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded flex items-center justify-center overflow-hidden">
              <img
                src={frame.image}
                alt={frame.name}
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{frame.name}</p>
              <p className="text-xs text-muted-foreground">{frame.dimensions}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FrameLibrary;
