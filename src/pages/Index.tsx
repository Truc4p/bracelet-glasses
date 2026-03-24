import { useState } from "react";
import { Gem, Glasses, Settings } from "lucide-react";
import LivePrice from "@/components/LivePrice";
import BraceletBuilder from "@/components/BraceletBuilder";
import AdvancedSunglassesBuilder from "@/components/AdvancedSunglassesBuilder";
import CatalogueAdmin from "@/components/admin/CatalogueAdmin";

type Module = "bracelet" | "sunglasses" | "admin";

const Index = () => {
  const [activeModule, setActiveModule] = useState<Module>("bracelet");
  const [price, setPrice] = useState(0);

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
          <LivePrice price={price} />
        </div>
      </header>

      {/* Module content */}
      <main className="flex-1 flex overflow-hidden">
        {activeModule === "bracelet" ? (
          <BraceletBuilder onPriceChange={setPrice} />
        ) : activeModule === "sunglasses" ? (
          <AdvancedSunglassesBuilder onPriceChange={setPrice} />
        ) : (
          <CatalogueAdmin />
        )}
      </main>
    </div>
  );
};

export default Index;
