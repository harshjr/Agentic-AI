from langchain.agents import create_agent
from app.agents.llm import get_llm
from app.tools.scraper import scrape_url

def build_reader_agent():
    """Build and return the reader agent armed with scrape_url tool."""
    llm = get_llm()
    return create_agent(
        model=llm,
        tools=[scrape_url]
    )
