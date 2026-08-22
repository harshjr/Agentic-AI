import os
from langchain.tools import tool
from tavily import TavilyClient
from app.core.config import settings

def get_tavily_client() -> TavilyClient:
    api_key = settings.TAVILY_API_KEY or os.getenv("TAVILY_API_KEY")
    if not api_key:
        raise ValueError("TAVILY_API_KEY is not set in environment or config.")
    return TavilyClient(api_key=api_key)

@tool
def web_search(query: str) -> str:
    """Search the web for recent and reliable information on a topic. Returns Titles, URLs and snippets."""
    try:
        tavily = get_tavily_client()
        results = tavily.search(query=query, max_results=5)
        out = []
        for r in results.get('results', []):
            out.append(
                f"Title: {r.get('title', 'No Title')}\nURL: {r.get('url', '')}\nSnippet: {r.get('content', '')[:300]}\n"
            )
        return "\n----\n".join(out)
    except Exception as e:
        return f"Error executing web search: {str(e)}"
