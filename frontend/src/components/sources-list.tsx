"use client";

import React from "react";
import { ExternalLink, Link2 } from "lucide-react";

interface SourcesListProps {
  sources: string[];
}

export function SourcesList({ sources }: SourcesListProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="w-full rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden backdrop-blur-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Link2 className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-bold text-white tracking-wide">
          Verified Citations & Sources ({sources.length})
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {sources.map((url, i) => {
          let domain = url;
          try {
            domain = new URL(url).hostname.replace("www.", "");
          } catch {
            domain = url;
          }

          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/70 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-indigo-200 transition duration-150 group"
            >
              <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-mono flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white">
                {i + 1}
              </span>
              <span className="truncate max-w-[200px] sm:max-w-[280px] font-medium">
                {domain}
              </span>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 shrink-0" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
