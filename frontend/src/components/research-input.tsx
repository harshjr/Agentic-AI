"use client";

import React, { useState } from "react";
import { Search, Loader2, ArrowRight, CornerDownLeft, Sparkles, X } from "lucide-react";

interface ResearchInputProps {
  topic: string;
  setTopic: (val: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
}

export function ResearchInput({
  topic,
  setTopic,
  onSubmit,
  isLoading,
}: ResearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    onSubmit(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-4">
      <form
        onSubmit={handleSubmit}
        className={`relative rounded-2xl transition-all duration-300 ${
          isFocused
            ? "ring-2 ring-indigo-500/60 shadow-xl shadow-indigo-500/10 bg-slate-900/90 border-indigo-500/40"
            : "bg-slate-900/60 hover:bg-slate-900/80 border-slate-800"
        } border backdrop-blur-xl p-3 sm:p-4`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-1 text-slate-400">
            <Search className="w-5 h-5 text-indigo-400" />
          </div>

          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={2}
            placeholder="Enter any research query, topic, or emerging technology..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 resize-none focus:outline-none leading-relaxed disabled:opacity-50"
          />

          {topic && !isLoading && (
            <button
              type="button"
              onClick={() => setTopic("")}
              className="p-1 rounded-full text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom bar inside input */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
                Enter
              </kbd>
              to research
            </span>
            <span className="hidden sm:inline-block text-slate-600">•</span>
            <span className="text-[11px] text-slate-400">
              Live web grounding enabled
            </span>
          </div>

          <button
            type="submit"
            disabled={!topic.trim() || isLoading}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              !topic.trim() || isLoading
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-md shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Agents Working...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Begin Research</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
