import os
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from langchain.tools import tool
from tavily import TavilyClient
from app.core.config import settings

class WebSearchInput(BaseModel):
    query: str = Field(..., description="The search query text to look up on the web. Example: 'latest quantum computing breakthroughs'")

def get_tavily_client() -> TavilyClient:
    api_key = settings.TAVILY_API_KEY or os.getenv("TAVILY_API_KEY")
    if not api_key:
        raise ValueError("TAVILY_API_KEY is not set in environment or config.")
    return TavilyClient(api_key=api_key)

def execute_web_search(query: str, max_results: int = 5) -> Dict[str, Any]:
    """Execute direct search using Tavily client and return raw results + formatted text."""
    try:
        tavily = get_tavily_client()
        results = tavily.search(query=query, max_results=max_results)
        
        items = results.get('results', [])
        formatted_list = []
        urls = []
        
        for r in items:
            title = r.get('title', 'No Title')
            url = r.get('url', '')
            snippet = r.get('content', '')[:300]
            if url:
                urls.append(url)
            formatted_list.append(
                f"Title: {title}\nURL: {url}\nSnippet: {snippet}\n"
            )
            
        formatted_text = "\n----\n".join(formatted_list)
        return {
            "formatted": formatted_text,
            "urls": urls,
            "results": items
        }
    except Exception as e:
        return {
            "formatted": f"Error executing web search: {str(e)}",
            "urls": [],
            "results": []
        }

@tool(args_schema=WebSearchInput)
def web_search(query: str) -> str:
    """Search the web for recent and reliable information on a topic. Returns Titles, URLs and snippets."""
    res = execute_web_search(query=query)
    return res["formatted"]
