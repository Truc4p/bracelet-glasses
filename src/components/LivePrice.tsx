import { DollarSign } from "lucide-react";

interface LivePriceProps {
  price: number;
}

const LivePrice = ({ price }: LivePriceProps) => {
  return (
    <div className="fixed top-6 right-6 z-50 glass-panel rounded-full px-5 py-2.5 flex items-center gap-2 animate-fade-in">
      <DollarSign className="w-4 h-4 text-primary" />
      <span className="font-display text-lg font-semibold text-foreground tracking-tight">
        {price.toFixed(2)}
      </span>
    </div>
  );
};

export default LivePrice;
