from langchain.agents import create_agent
from app.agents.llm import get_llm
from app.tools.search import web_search

def build_search_agent():
    """Build and return the search agent armed with Tavily web search tool."""
    llm = get_llm()
    return create_agent(
        model=llm,
        tools=[web_search]
    )
