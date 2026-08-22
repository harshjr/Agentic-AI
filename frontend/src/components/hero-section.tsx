"use client";

import React from "react";
import { Search, Compass, BookOpen, CheckCircle, ShieldAlert } from "lucide-react";

interface HeroSectionProps {
  onSelectTopic: (topic: string) => void;
}

const SAMPLE_TOPICS = [
  "Latest breakthroughs in Quantum Computing 2026",
  "Autonomous AI Agent Architectures in Production",
  "Solid-State Battery Commercialization Milestones",
  "CRISPR Gene Editing Clinical Trials Progress",
];

export function HeroSection({ onSelectTopic }: HeroSectionProps) {
  return (
    <div className="text-center max-w-3xl mx-auto pt-6 pb-4">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
        4-Agent Pipeline: Search • Deep Reader • Synthesizer • Strict Critic
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight">
        Deep Research with{" "}
        <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
          Autonomous Agents
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
        Input any topic. Our multi-agent swarm searches the live web, scrapes in-depth articles, synthesizes a structured report, and subjects it to an automated critic review.
      </p>

      {/* Quick Prompts */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
          <Compass className="w-3.5 h-3.5" /> Try asking:
        </span>
        {SAMPLE_TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => onSelectTopic(topic)}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500/40 transition-all duration-150 cursor-pointer shadow-sm hover:shadow-indigo-500/10"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
