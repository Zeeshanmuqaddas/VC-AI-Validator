import { cn } from "../lib/utils";

interface RadialScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function RadialScore({ score, size = 120, strokeWidth = 10, label, className }: RadialScoreProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  let colorClass = "text-green-500";
  if (score < 50) colorClass = "text-red-500";
  else if (score < 75) colorClass = "text-yellow-500";

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          className="text-gray-800"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn("transition-all duration-1000 ease-out", colorClass)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold font-mono tracking-tighter text-white">{score}</span>
        {label && <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">{label}</span>}
      </div>
    </div>
  );
}
