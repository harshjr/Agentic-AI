import re
import datetime
from typing import Dict, Any, List
import logging
from app.agents.search_agent import build_search_agent
from app.agents.reader_agent import build_reader_agent
from app.agents.writer_chain import get_writer_chain
from app.agents.critic_chain import get_critic_chain

logger = logging.getLogger("research_service")
logging.basicConfig(level=logging.INFO)

class ResearchService:
    @staticmethod
    def extract_urls(text: str) -> List[str]:
        """Extract unique URLs from text."""
        url_pattern = re.compile(r'https?://[^\s)\]"\'>]+')
        found = url_pattern.findall(text or "")
        # Clean trailing punctuation
        cleaned = [u.rstrip('.,;:') for u in found]
        # Preserve order while removing duplicates
        seen = set()
        unique_urls = []
        for u in cleaned:
            if u not in seen:
                seen.add(u)
                unique_urls.append(u)
        return unique_urls

    @classmethod
    def run_pipeline(cls, topic: str) -> Dict[str, Any]:
        """
        Execute the 4-step research workflow:
        1. Search Agent: Gather top sources & snippets
        2. Reader Agent: Scrape and read deeper content
        3. Writer Chain: Synthesize full structured report
        4. Critic Chain: Evaluate report strictly
        """
        logger.info(f"Starting research pipeline for topic: {topic}")
        state: Dict[str, Any] = {}

        # Step 1 - Search Agent
        logger.info("Step 1: Search Agent executing...")
        search_agent = build_search_agent()
        search_result = search_agent.invoke({
            "messages": [("user", f"Find recent, reliable and detailed information about: {topic}")]
        })
        state["search_results"] = search_result["messages"][-1].content
        logger.info("Step 1 completed.")

        # Step 2 - Reader Agent
        logger.info("Step 2: Reader Agent scraping top resources...")
        reader_agent = build_reader_agent()
        reader_result = reader_agent.invoke({
            "messages": [("user",
                f"Based on the following search results about '{topic}', "
                f"pick the most relevant URL and scrape it for deeper content.\n\n"
                f"Search Results:\n{state['search_results'][:800]}"
            )]
        })
        state["scraped_content"] = reader_result["messages"][-1].content
        logger.info("Step 2 completed.")

        # Step 3 - Writer Chain
        logger.info("Step 3: Writer drafting report...")
        research_combined = (
            f"SEARCH RESULTS:\n{state['search_results']}\n\n"
            f"DETAILED SCRAPED CONTENT:\n{state['scraped_content']}"
        )
        writer_chain = get_writer_chain()
        state["report"] = writer_chain.invoke({
            "topic": topic,
            "research": research_combined
        })
        logger.info("Step 3 completed.")

        # Step 4 - Critic Chain
        logger.info("Step 4: Critic reviewing report...")
        critic_chain = get_critic_chain()
        state["feedback"] = critic_chain.invoke({
            "report": state["report"]
        })
        logger.info("Step 4 completed.")

        # Extract sources from search results, scraped content, and report
        combined_text = f"{state.get('search_results', '')}\n{state.get('scraped_content', '')}\n{state.get('report', '')}"
        sources = cls.extract_urls(combined_text)

        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()

        return {
            "report": state["report"],
            "critic": state["feedback"],
            "metadata": {
                "sources": sources,
                "timestamp": timestamp
            }
        }
