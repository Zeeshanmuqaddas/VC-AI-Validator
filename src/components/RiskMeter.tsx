import { cn } from "../lib/utils";

interface RiskMeterProps {
  level: string; // low | medium | high
}

export function RiskMeter({ level }: RiskMeterProps) {
  const normLevel = level.toLowerCase();
  
  let label = "LOW";
  let activeIndex = 0;
  
  if (normLevel === "medium") {
    label = "MED";
    activeIndex = 1;
  } else if (normLevel === "high") {
    label = "HIGH";
    activeIndex = 2;
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Legal & Compliance Risk</span>
      <div className="flex items-center gap-1">
        <div className={cn("h-3 flex-1 rounded-l-full transition-colors", activeIndex >= 0 ? "bg-green-500" : "bg-gray-800")} />
        <div className={cn("h-3 flex-1 transition-colors", activeIndex >= 1 ? "bg-yellow-500" : "bg-gray-800")} />
        <div className={cn("h-3 flex-1 rounded-r-full transition-colors", activeIndex >= 2 ? "bg-red-500" : "bg-gray-800")} />
      </div>
      <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase font-semibold">
        <span className={cn(activeIndex === 0 && "text-green-500")}>Low</span>
        <span className={cn(activeIndex === 1 && "text-yellow-500")}>Med</span>
        <span className={cn(activeIndex === 2 && "text-red-500")}>High</span>
      </div>
    </div>
  );
}
