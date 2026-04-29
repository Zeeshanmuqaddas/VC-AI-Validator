import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { VCReport } from "../services/geminiService";
import { RadialScore } from "./RadialScore";
import { RiskMeter } from "./RiskMeter";
import { AlertTriangle, Activity, Briefcase, Gavel, Scale, TrendingUp, CheckCircle, Lightbulb, Zap, Crosshair } from "lucide-react";
import { cn } from "../lib/utils";

export function Dashboard({ data }: { data: VCReport }) {
  const chartData = [
    { name: "Clarity", score: data.idea.clarity_score * 10 },
    { name: "Demand", score: data.market.demand_score * 10 },
    { name: "Competition", score: (10 - data.market.competition_score) * 10 }, // invert because less competition is better, assuming higher score = worse competition. Or maybe not, let's just plot it raw for now:
    { name: "Monetization", score: data.monetization.monetization_score * 10 }
  ].map(d => ({ ...d, rawScore: d.score / 10 })); // showing raw 1-10 for tooltip if needed

  // fix competition semantics: in prompt "competition_score 0-10". VC perspective: high competition score usually means tougher market. 

  let decisionColor = "text-green-500";
  let DecisionIcon = CheckCircle;
  const dec = data.investor.final_decision?.toUpperCase() || "";
  
  if (dec.includes("CAUTION")) {
    decisionColor = "text-yellow-500";
    DecisionIcon = AlertTriangle;
  } else if (dec.includes("DO NOT")) {
    decisionColor = "text-red-500";
    DecisionIcon = Activity;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER: BIG SCORE & DECISION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 bg-[#121212] border border-gray-800 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="text-sm uppercase tracking-[0.2em] text-gray-500 font-bold mb-2 flex items-center gap-2">
            <Scale className="w-4 h-4" /> Final VC Judgment
          </h2>
          <div className="flex flex-wrap items-end gap-4 mb-4 z-10">
            <h1 className={cn("text-4xl sm:text-6xl font-black tracking-tight font-sans uppercase", decisionColor)}>
              {data.investor.final_decision}
            </h1>
            <DecisionIcon className={cn("w-12 h-12 mb-1", decisionColor)} />
          </div>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl font-serif italic z-10">
            "{data.investor.reasoning}"
          </p>
        </div>

        <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center">
          <RadialScore score={data.investor.investment_score} size={160} strokeWidth={12} label="Investability" />
          <div className="mt-6 w-full px-2">
            <RiskMeter level={data.legal.risk_level} />
          </div>
        </div>
      </div>

      {/* THREE COLUMNS: IDEA, MARKET, MONETIZATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* IDEA */}
        <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
            <Lightbulb className="w-5 h-5 text-purple-400" />
            <h3 className="font-mono text-sm tracking-widest text-gray-300 uppercase">Core Idea</h3>
            <span className="ml-auto font-mono text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded">
              {data.idea.clarity_score}/10 Clarity
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Problem</span>
              <p className="text-gray-200 text-sm mt-1">{data.idea.problem}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Solution</span>
              <p className="text-gray-200 text-sm mt-1">{data.idea.solution}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Uniqueness</span>
              <p className="text-gray-200 text-sm mt-1">{data.idea.uniqueness}</p>
            </div>
          </div>
        </div>

        {/* MARKET */}
        <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="font-mono text-sm tracking-widest text-gray-300 uppercase">Market & Comp</h3>
            <span className="ml-auto font-mono text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
              Trend: {data.market.trend}
            </span>
          </div>
          <div className="h-40 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#333' }} 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', fontSize: '12px' }} 
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Gap Opportunity</span>
            <p className="text-gray-200 text-sm mt-1">{data.market.gap_opportunity}</p>
          </div>
        </div>

        {/* MONETIZATION */}
        <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <h3 className="font-mono text-sm tracking-widest text-gray-300 uppercase">Monetization</h3>
            <span className="ml-auto font-mono text-xs text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded">
              {data.monetization.monetization_score}/10 Score
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Business Model</span>
              <p className="text-gray-200 text-sm mt-1">{data.monetization.business_model}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Pricing Strategy</span>
              <p className="text-gray-200 text-sm mt-1">{data.monetization.pricing_strategy}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Est. Margin</span>
              <p className="text-gray-200 text-sm mt-1">{data.monetization.estimated_margin}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1 block">Revenue Streams</span>
              <div className="flex flex-wrap gap-2">
                {data.monetization.revenue_streams.map((s, i) => (
                  <span key={i} className="text-xs bg-gray-800 border border-gray-700 rounded-full px-2 py-1 text-gray-300">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* VC & LEGAL RISKS (THE BRUTAL PART) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* WEAKNESSES & RISKS */}
        <div className="bg-gradient-to-br from-[#1a0f0f] to-[#121212] border border-red-900/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-red-900/30 pb-4">
            <Zap className="w-5 h-5 text-red-500" />
            <h3 className="font-mono text-sm tracking-widest text-red-400 uppercase font-bold">Brutal Teardown</h3>
            <span className="ml-auto font-mono text-xs text-red-500 font-bold">
              {data.investor.success_probability}% Success Prob
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-red-500/70 uppercase tracking-widest font-bold mb-2 block">Killer Risks</span>
              <ul className="space-y-2">
                {data.investor.killer_risks.map((r, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-[10px] text-red-500/70 uppercase tracking-widest font-bold mb-2 block">Weaknesses</span>
              <ul className="space-y-2">
                {data.investor.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">•</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* STRENGTHS & IMPROVEMENTS */}
        <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
            <Crosshair className="w-5 h-5 text-blue-400" />
            <h3 className="font-mono text-sm tracking-widest text-gray-300 uppercase">Action Plan</h3>
          </div>
          <div className="space-y-6">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2 block">Strengths to Leverage</span>
              <ul className="space-y-2">
                {data.investor.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">+</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-[10px] text-blue-400/80 uppercase tracking-widest font-bold mb-2 block">Mandatory Improvements</span>
              <ul className="space-y-2">
                {data.investor.improvements.map((imp, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">→</span> {imp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* AUTO PITCH GENERATOR */}
      <div className="bg-[#1a1c23] border border-blue-900/30 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
        <h3 className="font-mono text-sm tracking-[0.3em] text-blue-400 uppercase font-bold mb-4">The Silicon Valley Pitch</h3>
        
        <p className="text-xl md:text-2xl font-serif text-white mb-6 italic leading-relaxed">
          "{data.pitch.one_liner}"
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Why Now?</span>
            <p className="text-sm text-gray-300 leading-relaxed">{data.pitch.why_now}</p>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Vision</span>
            <p className="text-sm text-gray-300 leading-relaxed">{data.pitch.vision}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
