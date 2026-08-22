import re
import datetime
from typing import Dict, Any, List
import logging
from app.tools.search import execute_web_search
from app.tools.scraper import execute_scrape_url
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
        cleaned = [u.rstrip('.,;:') for u in found]
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
        Execute the high-reliability research workflow:
        1. Search Step: Query live web via Tavily
        2. Reader Step: Scrape clean full text from top authoritative source
        3. Writer Step: Synthesize comprehensive markdown report
        4. Critic Step: Adversarial quality scoring and review
        """
        logger.info(f"Initiating research pipeline for topic: {topic}")
        state: Dict[str, Any] = {}

        # Step 1: Web Search Execution
        logger.info("Step 1: Executing live Tavily web search...")
        search_data = execute_web_search(query=topic, max_results=5)
        state["search_results"] = search_data["formatted"]
        discovered_urls = search_data.get("urls", [])
        logger.info(f"Step 1 Complete. Found {len(discovered_urls)} sources.")

        # Step 2: Deep Page Reader
        logger.info("Step 2: Scraping primary source for deep context...")
        primary_url = discovered_urls[0] if discovered_urls else ""
        if primary_url:
            state["scraped_content"] = execute_scrape_url(url=primary_url, max_chars=3000)
        else:
            state["scraped_content"] = "No external URLs available to scrape."
        logger.info("Step 2 Complete.")

        # Step 3: Synthesis & Report Writing
        logger.info("Step 3: Generating structured research report...")
        research_combined = (
            f"SEARCH RESULTS:\n{state['search_results']}\n\n"
            f"DETAILED SCRAPED CONTENT:\n{state['scraped_content']}"
        )
        writer_chain = get_writer_chain()
        state["report"] = writer_chain.invoke({
            "topic": topic,
            "research": research_combined
        })
        logger.info("Step 3 Complete.")

        # Step 4: Adversarial Critic Review
        logger.info("Step 4: Running automated critic review...")
        critic_chain = get_critic_chain()
        state["feedback"] = critic_chain.invoke({
            "report": state["report"]
        })
        logger.info("Step 4 Complete.")

        # Aggregate citations & sources
        combined_text = f"{state.get('search_results', '')}\n{state.get('scraped_content', '')}\n{state.get('report', '')}"
        all_sources = cls.extract_urls(combined_text)
        for u in discovered_urls:
            if u not in all_sources:
                all_sources.append(u)

        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()

        return {
            "report": state["report"],
            "critic": state["feedback"],
            "metadata": {
                "sources": all_sources,
                "timestamp": timestamp
            }
        }
