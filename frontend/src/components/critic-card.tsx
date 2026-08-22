"use client";

import React from "react";
import { ShieldCheck, CheckCircle, AlertTriangle, MessageSquare, Award } from "lucide-react";

interface CriticCardProps {
  critic: string;
}

export function CriticCard({ critic }: CriticCardProps) {
  // Parse score
  const scoreMatch = critic.match(/Score:\s*(\d+(?:\.\d+)?)\s*\/\s*10/i);
  const scoreNum = scoreMatch ? parseFloat(scoreMatch[1]) : null;

  // Extract sections if possible
  const strengthsSection = critic.match(/Strengths:([\s\S]*?)(?=Areas to Improve:|$)/i);
  const improveSection = critic.match(/Areas to Improve:([\s\S]*?)(?=One line verdict:|$)/i);
  const verdictSection = critic.match(/One line verdict:([\s\S]*)/i);

  const parseBulletPoints = (text?: string) => {
    if (!text) return [];
    return text
      .split("\n")
      .map((line) => line.replace(/^[\s*-]+/, "").trim())
      .filter((line) => line.length > 0);
  };

  const strengths = strengthsSection ? parseBulletPoints(strengthsSection[1]) : [];
  const areasToImprove = improveSection ? parseBulletPoints(improveSection[1]) : [];
  const verdict = verdictSection ? verdictSection[1].trim() : "";

  // Determine score color
  const getScoreBadge = () => {
    if (scoreNum === null) return { color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" };
    if (scoreNum >= 8) return { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    if (scoreNum >= 6) return { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    return { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" };
  };

  const badge = getScoreBadge();

  return (
    <div className="w-full rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Critic Evaluation
            </h3>
            <p className="text-[11px] text-slate-400">
              Automated adversarial quality audit
            </p>
          </div>
        </div>

        {/* Score gauge */}
        {scoreNum !== null && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border ${badge.bg} ${badge.border}`}
          >
            <Award className={`w-4 h-4 ${badge.color}`} />
            <span className={`text-base font-black ${badge.color}`}>
              {scoreNum}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 10</span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* If formatted parsing succeeds */}
        {strengths.length > 0 || areasToImprove.length > 0 || verdict ? (
          <>
            {/* Strengths */}
            {strengths.length > 0 && (
              <div>
                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                  <CheckCircle className="w-3.5 h-3.5" /> Key Strengths
                </h4>
                <ul className="space-y-1.5 pl-1">
                  {strengths.map((item, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas to Improve */}
            {areasToImprove.length > 0 && (
              <div>
                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-3.5 h-3.5" /> Areas to Improve
                </h4>
                <ul className="space-y-1.5 pl-1">
                  {areasToImprove.map((item, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Verdict */}
            {verdict && (
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                  <MessageSquare className="w-3.5 h-3.5" /> Verdict
                </h4>
                <p className="text-xs text-slate-200 italic font-medium leading-relaxed">
                  &ldquo;{verdict}&rdquo;
                </p>
              </div>
            )}
          </>
        ) : (
          /* Fallback raw display */
          <div className="font-mono text-xs text-slate-300 whitespace-pre-wrap bg-slate-950 p-4 rounded-xl border border-slate-800">
            {critic}
          </div>
        )}
      </div>
    </div>
  );
}
