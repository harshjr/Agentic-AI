"use client";

import React, { useEffect, useState } from "react";
import { Search, Globe, FileText, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { PipelineStage } from "@/types/research";

interface ActivityTimelineProps {
  stage: PipelineStage;
  isLoading: boolean;
}

const STAGES = [
  {
    key: "searching",
    label: "1. Search Agent",
    desc: "Querying Tavily for top real-time search results & snippets",
    icon: Search,
  },
  {
    key: "reading",
    label: "2. Reader Agent",
    desc: "Analyzing URLs & scraping deep textual content with BeautifulSoup",
    icon: Globe,
  },
  {
    key: "writing",
    label: "3. Writer Chain",
    desc: "Synthesizing structured findings, key takeaways & citations",
    icon: FileText,
  },
  {
    key: "critiquing",
    label: "4. Critic Chain",
    desc: "Performing rigorous scoring & objective quality evaluation",
    icon: ShieldCheck,
  },
];

export function ActivityTimeline({ stage, isLoading }: ActivityTimelineProps) {
  // Simulated progressive stage advancement for high-engagement UX while API executes
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      if (stage === "completed") {
        setActiveStepIndex(4);
      } else {
        setActiveStepIndex(0);
      }
      return;
    }

    // When loading, advance steps periodically to provide live feedback
    setActiveStepIndex(0);
    const t1 = setTimeout(() => setActiveStepIndex(1), 3500);
    const t2 = setTimeout(() => setActiveStepIndex(2), 8500);
    const t3 = setTimeout(() => setActiveStepIndex(3), 15000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isLoading, stage]);

  if (!isLoading && stage === "idle") {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
          <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
            Agent Execution Pipeline
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {isLoading
            ? `Step ${Math.min(activeStepIndex + 1, 4)} of 4`
            : "Pipeline Complete"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {STAGES.map((s, index) => {
          const Icon = s.icon;
          const isDone = activeStepIndex > index || stage === "completed";
          const isCurrent = activeStepIndex === index && isLoading;
          const isPending = activeStepIndex < index && !isDone;

          return (
            <div
              key={s.key}
              className={`relative p-3.5 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? "bg-indigo-950/40 border-indigo-500/60 ring-1 ring-indigo-500/30 shadow-lg shadow-indigo-500/10"
                  : isDone
                  ? "bg-slate-900/90 border-slate-800"
                  : "bg-slate-950/40 border-slate-900 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isCurrent
                      ? "bg-indigo-600 text-white animate-pulse"
                      : isDone
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>

                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isCurrent
                      ? "bg-indigo-500/20 text-indigo-300 font-bold"
                      : isDone
                      ? "bg-emerald-500/10 text-emerald-400 font-medium"
                      : "bg-slate-800/60 text-slate-500"
                  }`}
                >
                  {isCurrent ? "RUNNING" : isDone ? "DONE" : "QUEUED"}
                </span>
              </div>

              <h4 className="text-xs font-semibold text-slate-200 truncate">
                {s.label}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
