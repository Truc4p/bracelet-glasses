import { DollarSign } from "lucide-react";

interface LivePriceProps {
  price: number;
}

const LivePrice = ({ price }: LivePriceProps) => {
  return (
    <div className="glass-panel rounded-full px-5 py-2 flex items-center gap-2 animate-fade-in">
      <DollarSign className="w-4 h-4 text-primary" />
      <span className="font-display text-lg font-semibold text-foreground tracking-tight">
        {price.toFixed(2)}
      </span>
    </div>
  );
};

export default LivePrice;
