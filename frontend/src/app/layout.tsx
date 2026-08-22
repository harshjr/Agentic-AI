import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeepResearch AI - Autonomous Multi-Agent Research Platform",
  description: "High-accuracy autonomous AI research platform powered by LangChain, FastAPI, and Deep Web Retrieval.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] antialiased">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[130px]" />
          <div className="absolute top-[20%] -right-[15%] w-[45%] h-[45%] rounded-full bg-cyan-600/10 blur-[140px]" />
          <div className="absolute -bottom-[20%] left-[25%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[150px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
