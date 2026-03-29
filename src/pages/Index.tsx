import { useState } from "react";
import { Gem, Glasses, Settings, Info } from "lucide-react";
import LivePrice from "@/components/LivePrice";
import BraceletBuilder from "@/components/BraceletBuilder";
import AdvancedSunglassesBuilder from "@/components/AdvancedSunglassesBuilder";
import CatalogueAdmin from "@/components/admin/CatalogueAdmin";

type Module = "bracelet" | "sunglasses" | "admin";

const Index = () => {
  const [activeModule, setActiveModule] = useState<Module>("bracelet");
  const [prices, setPrices] = useState({ bracelet: 0, sunglasses: 0 });

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-border">
        <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
          Bino Foundry
        </h1>
        <div className="flex items-center gap-6">
          <nav className="flex gap-1 rounded-lg border border-border p-1">
            {([
              { id: "bracelet" as Module, label: "Crystal Bracelet", icon: Gem },
              { id: "sunglasses" as Module, label: "Sunglasses", icon: Glasses },
              { id: "admin" as Module, label: "Admin", icon: Settings },
            ]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveModule(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-body transition-all duration-200 ${
                  activeModule === id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
          <LivePrice price={activeModule === "sunglasses" ? prices.sunglasses : prices.bracelet} />
        </div>
      </header>

      {/* Disclaimer Banner */}
      <div className="bg-primary/5 border-b border-primary/10 px-4 py-2 flex items-center justify-center gap-2 text-sm z-10 w-full relative">
        <Info className="w-4 h-4 text-primary flex-shrink-0" />
        <p className="text-foreground/80 font-medium">
          <span className="font-bold text-foreground">Disclaimer:</span> The visuals shown are for illustration purposes only and represent the closest possible match.
        </p>
      </div>

      {/* Module content */}
      <main className="flex-1 relative overflow-hidden">
        <div className={`absolute inset-0 ${activeModule === "bracelet" ? "flex flex-col" : "hidden"}`}>
          <BraceletBuilder onPriceChange={(p) => setPrices(prev => ({ ...prev, bracelet: p }))} />
        </div>
        <div className={`absolute inset-0 ${activeModule === "sunglasses" ? "flex flex-col" : "hidden"}`}>
          <AdvancedSunglassesBuilder onPriceChange={(p) => setPrices(prev => ({ ...prev, sunglasses: p }))} />
        </div>
        <div className={`absolute inset-0 ${activeModule === "admin" ? "flex flex-col" : "hidden"}`}>
          <CatalogueAdmin />
        </div>
      </main>
    </div>
  );
};

export default Index;
