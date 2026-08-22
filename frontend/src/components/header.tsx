"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Cpu, Radio, Github } from "lucide-react";
import { checkApiHealth } from "@/lib/api";

export function Header() {
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    async function verifyHealth() {
      try {
        const res = await checkApiHealth();
        if (res.status === "healthy") {
          setApiStatus("online");
        } else {
          setApiStatus("offline");
        }
      } catch {
        setApiStatus("offline");
      }
    }
    verifyHealth();
    const interval = setInterval(verifyHealth, 25000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">DeepResearch</span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                Multi-Agent
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal hidden sm:block">
              LangChain & Groq Powered Intelligence
            </p>
          </div>
        </div>

        {/* Status and Links */}
        <div className="flex items-center gap-4">
          {/* API Health Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              {apiStatus === "online" && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  apiStatus === "online"
                    ? "bg-emerald-500"
                    : apiStatus === "checking"
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
              />
            </span>
            <span className="text-slate-300 font-medium capitalize">
              {apiStatus === "online" ? "API Live" : apiStatus === "checking" ? "Connecting..." : "API Offline"}
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          {/* Model info */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/50 px-2.5 py-1.5 rounded-md border border-slate-800/60">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>GPT-OSS 120B / Groq</span>
          </div>
        </div>
      </div>
    </header>
  );
}
