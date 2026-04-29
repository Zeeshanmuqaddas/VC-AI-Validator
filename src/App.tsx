import { useState } from "react";
import { validateStartupIdea, VCReport } from "./services/geminiService";
import { Dashboard } from "./components/Dashboard";
import { Loader2, Flame, Scale, BrainCircuit } from "lucide-react";
import { cn } from "./lib/utils";

export default function App() {
  const [idea, setIdea] = useState("");
  const [brutallyHonest, setBrutallyHonest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<VCReport | null>(null);
  const [error, setError] = useState("");

  const handleEvaluate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError("");
    setReport(null);
    try {
      const data = await validateStartupIdea(idea, brutallyHonest);
      setReport(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-8 font-sans selection:bg-purple-900 selection:text-white">
      {/* HEADER */}
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center rounded-lg font-bold">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white leading-none">VC AI VALIDATOR</h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-[0.2em] uppercase mt-1">Institutional Grade</p>
          </div>
        </div>
        
        {report && (
          <button 
            onClick={() => setReport(null)}
            className="text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
          >
            ← New Evaluation
          </button>
        )}
      </header>

      <main className="max-w-6xl mx-auto">
        {!report ? (
          <div className="w-full max-w-3xl mx-auto mt-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 uppercase leading-[0.9]">
              Will your startup fail?
            </h2>
            <p className="text-gray-400 text-lg mb-10 font-serif italic border-l-2 border-gray-700 pl-4 py-1">
              "This is not just an AI tool. This is an AI investor. It doesn't just validate ideas — It tells you if your startup will fail before you waste years of your life."
            </p>

            <div className="space-y-6 bg-[#111] p-6 rounded-2xl border border-[#222] shadow-2xl relative">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-gray-500 font-bold block">
                  Pitch your idea
                </label>
                <textarea 
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="e.g. We are building an AI-powered SaaS that helps local bakeries automate their supply chain..."
                  className="w-full h-40 bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none text-lg"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <label className="flex items-center gap-3 cursor-pointer group hover:bg-[#1a1a1a] p-2 rounded-lg transition-colors border border-transparent hover:border-gray-800">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={brutallyHonest}
                      onChange={(e) => setBrutallyHonest(e.target.checked)}
                      disabled={loading}
                    />
                    <div className={cn("w-10 h-6 bg-gray-800 rounded-full transition-colors", brutallyHonest && "bg-red-500/20")}></div>
                    <div className={cn("absolute top-1 left-1 bg-gray-500 w-4 h-4 rounded-full transition-all", brutallyHonest && "translate-x-4 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]")}></div>
                  </div>
                  <span className="flex items-center gap-2 text-sm font-bold text-gray-400 group-hover:text-gray-200 transition-colors uppercase tracking-widest">
                    <Flame className={cn("w-4 h-4", brutallyHonest ? "text-red-500" : "text-gray-600")} />
                    Brutally Honest Mode
                  </span>
                </label>

                <button 
                  onClick={handleEvaluate}
                  disabled={loading || !idea.trim()}
                  className="w-full sm:w-auto bg-white hover:bg-gray-200 text-black px-8 py-3 rounded-xl font-bold tracking-widest uppercase text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Scale className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Evaluate Idea
                    </>
                  )}
                </button>
              </div>
              
              {error && (
                <div className="mt-4 p-4 border border-red-900 bg-red-900/10 rounded-xl text-red-500 text-sm flex items-center gap-2">
                  <Flame className="w-4 h-4" /> {error}
                </div>
              )}
            </div>
            
            <div className="mt-12 text-center text-xs text-gray-700 font-mono tracking-widest uppercase">
              Powered by Gemini • Venture Capital Grade Analysis
            </div>
          </div>
        ) : (
          <Dashboard data={report} />
        )}
      </main>
    </div>
  );
}
