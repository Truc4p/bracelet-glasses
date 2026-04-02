import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { SUNGLASSES_ACCESSORIES, type SunglassesAccessory } from "@/lib/luxe-data";

type TabType = 'accessories' | 'lensColors';

interface SunglassesAccessoriesLibraryProps {
  onSelectAccessory: (accessory: SunglassesAccessory) => void;
  onSelectLensColor: (lensColor: { id: string; name: string; image: string }) => void;
  onSelectSecondaryColor: (lensColor: { id: string; name: string; image: string }) => void;
  currentLensColorId?: string;
  currentSecondaryColorId?: string;
  gradientMode: boolean;
  availableLensColors?: { id: string; name: string; image: string }[];
  open: boolean;
  onClose: () => void;
}

const SunglassesAccessoriesLibrary = ({
  onSelectAccessory,
  onSelectLensColor,
  onSelectSecondaryColor,
  currentLensColorId,
  currentSecondaryColorId,
  gradientMode,
  availableLensColors = [],
  open,
  onClose
}: SunglassesAccessoriesLibraryProps) => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>('lensColors');
  const [filterType, setFilterType] = useState<'all' | 'chain' | 'nosePad' | 'decal'>('all');

  const filteredAccessories = useMemo(
    () => SUNGLASSES_ACCESSORIES.filter((a) => {
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === 'all' || a.type === filterType;
      return matchesSearch && matchesType;
    }),
    [search, filterType]
  );

  if (!open) return null;

  return (
    <div className="absolute left-0 top-0 bottom-0 w-80 glass-panel rounded-lg z-20 flex flex-col animate-slide-in">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-display text-sm font-semibold">Customize</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-1 p-3 border-b border-border">
        <button
          onClick={() => setActiveTab('lensColors')}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'lensColors'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          Shade Profile
        </button>
        <button
          onClick={() => setActiveTab('accessories')}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'accessories'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          Accessories
        </button>
      </div>

      {activeTab === 'accessories' && (
        <>
          <div className="p-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search accessories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {(['all', 'chain', 'nosePad', 'decal'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    filterType === type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {type === 'all' ? 'All' : type === 'nosePad' ? 'Nose Pads' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {filteredAccessories.map((accessory) => (
              <button
                key={accessory.id}
                onClick={() => onSelectAccessory(accessory)}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "copy";
                  e.dataTransfer.setData("application/json", JSON.stringify(accessory));
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted/60 transition-colors text-left group cursor-grab active:cursor-grabbing"
              >
                <div className="w-8 h-8 flex items-center justify-center text-xl">
                  {accessory.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{accessory.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{accessory.type} • ${accessory.price.toFixed(2)}</p>
                </div>
                <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Drag
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {activeTab === 'lensColors' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {gradientMode ? 'Top Color' : 'Base Material'}
            </h4>
            <div className="space-y-1">
              {availableLensColors.length === 0 && (
                <p className="text-xs text-muted-foreground italic px-3 py-2">No custom colors configured for this frame.</p>
              )}
              {availableLensColors.map((lensColor) => (
                <button
                  key={lensColor.id}
                  onClick={() => onSelectLensColor(lensColor)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-left group ${currentLensColorId === lensColor.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/60'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full border flex-shrink-0 flex items-center justify-center overflow-hidden ${currentLensColorId === lensColor.id ? 'border-primary' : 'border-border/50'} ${!lensColor.image ? 'bg-gradient-to-br from-white to-gray-200' : ''}`}
                  >
                    {lensColor.image && (<img 
                      src={lensColor.image} 
                      alt={lensColor.name} 
                      className="w-full h-full object-cover scale-[1.35]" 
                       />
                      )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${currentLensColorId === lensColor.id ? 'text-primary' : 'text-foreground'}`}>{lensColor.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {gradientMode && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Bottom Color
              </h4>
              <div className="space-y-1">
                {availableLensColors.length === 0 && (
                  <p className="text-xs text-muted-foreground italic px-3 py-2">No custom colors configured for this frame.</p>
                )}
                {availableLensColors.map((lensColor) => (
                  <button
                    key={`secondary-${lensColor.id}`}
                    onClick={() => onSelectSecondaryColor(lensColor)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-left group ${currentSecondaryColorId === lensColor.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/60'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full border flex-shrink-0 flex items-center justify-center overflow-hidden ${currentSecondaryColorId === lensColor.id ? 'border-primary' : 'border-border/50'} ${!lensColor.image ? 'bg-gradient-to-br from-white to-gray-200' : ''}`}
                    >
                      {lensColor.image && (
                        <img 
                          src={lensColor.image} 
                          alt={lensColor.name} 
                          className="w-full h-full object-cover scale-[1.35]" 
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${currentSecondaryColorId === lensColor.id ? 'text-primary' : 'text-foreground'}`}>{lensColor.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SunglassesAccessoriesLibrary;
