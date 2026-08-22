import { ResearchResponse } from "@/types/research";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export async function checkApiHealth(): Promise<{ status: string; version?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Health check failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("API health check error:", error);
    return { status: "offline" };
  }
}

export async function submitResearch(topic: string): Promise<ResearchResponse> {
  const res = await fetch(`${API_BASE_URL}/research`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic }),
  });

  if (!res.ok) {
    let errorMessage = `Server returned status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData.detail) {
        errorMessage = typeof errorData.detail === "string" ? errorData.detail : JSON.stringify(errorData.detail);
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMessage);
  }

  return await res.json();
}
