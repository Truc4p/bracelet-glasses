import { useState } from "react";
import { Gem, Glasses } from "lucide-react";
import LivePrice from "@/components/LivePrice";
import BraceletBuilder from "@/components/BraceletBuilder";
import SunglassesBuilder from "@/components/SunglassesBuilder";

type Module = "bracelet" | "sunglasses";

const Index = () => {
  const [activeModule, setActiveModule] = useState<Module>("bracelet");
  const [price, setPrice] = useState(0);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <LivePrice price={price} />

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-border">
        <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
          Bino Foundry
        </h1>
        <nav className="flex gap-1 rounded-lg border border-border p-1">
          {([
            { id: "bracelet" as Module, label: "Crystal Bracelet", icon: Gem },
            { id: "sunglasses" as Module, label: "Sunglasses", icon: Glasses },
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
      </header>

      {/* Module content */}
      <main className="flex-1 flex overflow-hidden">
        {activeModule === "bracelet" ? (
          <BraceletBuilder onPriceChange={setPrice} />
        ) : (
          <SunglassesBuilder onPriceChange={setPrice} />
        )}
      </main>
    </div>
  );
};

export default Index;
