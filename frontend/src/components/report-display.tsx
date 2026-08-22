"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Download, FileText, Code2, BookOpen } from "lucide-react";
import { ResearchMetadata } from "@/types/research";
import { formatDate } from "@/lib/utils";

interface ReportDisplayProps {
  report: string;
  topic: string;
  metadata?: ResearchMetadata;
}

export function ReportDisplay({ report, topic, metadata }: ReportDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"formatted" | "raw">("formatted");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy report:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 30);
    link.href = url;
    link.download = `research_report_${safeTopic || "export"}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden backdrop-blur-xl">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/50 gap-3">
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => setActiveTab("formatted")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                activeTab === "formatted"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Formatted</span>
            </button>
            <button
              onClick={() => setActiveTab("raw")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                activeTab === "raw"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Raw Markdown</span>
            </button>
          </div>
          {metadata?.timestamp && (
            <span className="text-[11px] text-slate-500 font-mono hidden md:inline-block">
              Generated: {formatDate(metadata.timestamp)}
            </span>
          )}
        </div>

        {/* Copy & Download buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/60 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 sm:p-8">
        {activeTab === "formatted" ? (
          <div className="prose-custom max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 break-all"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {report}
            </ReactMarkdown>
          </div>
        ) : (
          <pre className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-xl overflow-x-auto border border-slate-800 whitespace-pre-wrap leading-relaxed">
            {report}
          </pre>
        )}
      </div>
    </div>
  );
}
