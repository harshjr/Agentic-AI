import requests
from bs4 import BeautifulSoup
from pydantic import BaseModel, Field
from langchain.tools import tool

class ScrapeUrlInput(BaseModel):
    url: str = Field(..., description="The HTTP or HTTPS URL of the website to scrape.")

def execute_scrape_url(url: str, max_chars: int = 3000) -> str:
    """Scrape clean textual content from any target webpage."""
    if not url or not url.startswith("http"):
        return "Invalid or empty URL provided for scraping."
    try:
        resp = requests.get(
            url,
            timeout=10,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        )
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header", "noscript", "aside"]):
            tag.decompose()
        clean_text = soup.get_text(separator=" ", strip=True)
        return clean_text[:max_chars] if clean_text else "No extractable text found on page."
    except Exception as e:
        return f"Could not scrape URL {url}: {str(e)}"

@tool(args_schema=ScrapeUrlInput)
def scrape_url(url: str) -> str:
    """Scrape and return clean text content from a given URL for deeper reading."""
    return execute_scrape_url(url=url)
