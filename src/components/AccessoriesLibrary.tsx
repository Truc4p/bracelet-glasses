import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { SPACERS, ZODIAC_CHARMS, ZODIAC_ANIMALS, type Spacer, type ZodiacCharm } from "@/lib/luxe-data";

type TabType = 'spacers' | 'charms';

interface AccessoriesLibraryProps {
  onSelectSpacer: (spacer: Spacer) => void;
  onSelectCharm: (charm: ZodiacCharm) => void;
  open: boolean;
  onClose: () => void;
}

const AccessoriesLibrary = ({ onSelectSpacer, onSelectCharm, open, onClose }: AccessoriesLibraryProps) => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>('spacers');
  const [selectedAnimal, setSelectedAnimal] = useState("Rat");
  const [charmDesign, setCharmDesign] = useState<'classic' | 'modern'>('classic');

  const filteredSpacers = useMemo(
    () => SPACERS.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const filteredCharms = useMemo(
    () => ZODIAC_CHARMS.filter((c) =>
      c.animal === selectedAnimal && c.design === charmDesign
    ),
    [selectedAnimal, charmDesign]
  );

  if (!open) return null;

  return (
    <div className="absolute left-0 top-0 bottom-0 w-72 glass-panel rounded-lg z-20 flex flex-col animate-slide-in">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-display text-sm font-semibold">Accessories</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-1 p-3 border-b border-border">
        <button
          onClick={() => setActiveTab('spacers')}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'spacers'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          Spacers
        </button>
        <button
          onClick={() => setActiveTab('charms')}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'charms'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          Charms
        </button>
      </div>

      {activeTab === 'spacers' && (
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search spacers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body"
            />
          </div>
        </div>
      )}

      {activeTab === 'charms' && (
        <div className="p-3 space-y-2 border-b border-border">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Zodiac Animal</label>
            <select
              value={selectedAnimal}
              onChange={(e) => setSelectedAnimal(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body"
            >
              {ZODIAC_ANIMALS.map((animal) => (
                <option key={animal} value={animal}>{animal}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Design Style</label>
            <select
              value={charmDesign}
              onChange={(e) => setCharmDesign(e.target.value as 'classic' | 'modern')}
              className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-body"
            >
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {activeTab === 'spacers' && filteredSpacers.map((spacer) => (
          <button
            key={spacer.id}
            onClick={() => onSelectSpacer(spacer)}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = "copy";
              e.dataTransfer.setData("application/json", JSON.stringify({ type: 'spacer', item: spacer }));
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted/60 transition-colors text-left group cursor-grab active:cursor-grabbing"
          >
            <div
              className="w-7 h-7 rounded-full border border-border/50 flex-shrink-0 shadow-sm"
              style={{ background: spacer.metallic }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{spacer.name}</p>
              <p className="text-xs text-muted-foreground">${spacer.price.toFixed(2)} / spacer</p>
            </div>
            <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Drag or Click
            </span>
          </button>
        ))}

        {activeTab === 'charms' && filteredCharms.map((charm) => (
          <button
            key={charm.id}
            onClick={() => onSelectCharm(charm)}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = "copy";
              e.dataTransfer.setData("application/json", JSON.stringify({ type: 'charm', item: charm }));
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted/60 transition-colors text-left group cursor-grab active:cursor-grabbing"
          >
            <div className="w-7 h-7 flex items-center justify-center text-lg">
              {charm.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{charm.animal} - {charm.design}</p>
              <p className="text-xs text-muted-foreground">${charm.price.toFixed(2)}</p>
            </div>
            <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Drag or Click
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccessoriesLibrary;
