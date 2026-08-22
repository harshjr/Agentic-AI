"use client";

import React, { useState } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ResearchInput } from "@/components/research-input";
import { ActivityTimeline } from "@/components/activity-timeline";
import { ReportDisplay } from "@/components/report-display";
import { CriticCard } from "@/components/critic-card";
import { SourcesList } from "@/components/sources-list";
import { submitResearch } from "@/lib/api";
import { ResearchResponse, PipelineStage } from "@/types/research";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [activeTopic, setActiveTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<PipelineStage>("idle");
  const [result, setResult] = useState<ResearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartResearch = async (searchTopic?: string) => {
    const targetTopic = (searchTopic || topic).trim();
    if (!targetTopic || isLoading) return;

    if (searchTopic) {
      setTopic(searchTopic);
    }
    setActiveTopic(targetTopic);
    setIsLoading(true);
    setStage("searching");
    setError(null);
    setResult(null);

    try {
      const data = await submitResearch(targetTopic);
      setResult(data);
      setStage("completed");
    } catch (err: any) {
      console.error("Research failed:", err);
      setError(err.message || "Failed to complete research. Please verify your backend server and API keys.");
      setStage("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTopic("");
    setActiveTopic("");
    setResult(null);
    setError(null);
    setStage("idle");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
        {/* Hero Section */}
        {!result && (
          <HeroSection
            onSelectTopic={(selected) => {
              setTopic(selected);
              handleStartResearch(selected);
            }}
          />
        )}

        {/* Research Input Bar */}
        <ResearchInput
          topic={topic}
          setTopic={setTopic}
          onSubmit={() => handleStartResearch()}
          isLoading={isLoading}
        />

        {/* Error Alert */}
        {error && (
          <div className="w-full max-w-3xl my-4 p-4 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 backdrop-blur-md">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-rose-200">Execution Error</h4>
              <p className="text-xs text-rose-300/90 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-rose-400 hover:text-rose-200 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Agent Activity Timeline */}
        <ActivityTimeline stage={stage} isLoading={isLoading} />

        {/* Results Section */}
        {result && (
          <div className="w-full max-w-6xl mt-6 space-y-6">
            {/* Header with Title and Reset */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase tracking-wider text-indigo-400 font-mono font-semibold">
                  Research Dossier
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {activeTopic}
                </h2>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-semibold transition cursor-pointer self-start sm:self-auto shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>New Research</span>
              </button>
            </div>

            {/* Split Grid: Left = Report, Right = Critic & Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Main Report Column */}
              <div className="lg:col-span-8 space-y-6">
                <ReportDisplay
                  report={result.report}
                  topic={activeTopic}
                  metadata={result.metadata}
                />
              </div>

              {/* Sidebar Column: Critic + Sources */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                <CriticCard critic={result.critic} />
                {result.metadata?.sources?.length > 0 && (
                  <SourcesList sources={result.metadata.sources} />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>
          DeepResearch AI &bull; Autonomous Multi-Agent Research System &bull; Powered by LangChain, FastAPI & Next.js 15
        </p>
      </footer>
    </div>
  );
}
