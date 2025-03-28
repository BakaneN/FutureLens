import requests
from bs4 import BeautifulSoup
import json
import re

def get_career_info(career):
    search_query = career.strip().replace(' ', '_')
    url = f'https://en.wikipedia.org/wiki/{search_query}'

    response = requests.get(url, allow_redirects=True)
    if response.status_code != 200:
        return {"career": career.title(), "intro": "No information found."}

    soup = BeautifulSoup(response.text, 'html.parser')
    paragraphs = soup.select('p')
    intro = ''

    # Find the first real paragraph (not navigation or boilerplate)
    for para in paragraphs:
        text = para.get_text().strip()
        if text and not text.startswith("This is an accepted version"):
            intro = re.sub(r'\[.*?\]', '', text)  # Clean [1], [citation needed]
            break

    if not intro:
        intro = "No meaningful introduction found for this career."

    return {
        "career": career.title(),
        "intro": intro
    }

if __name__ == "__main__":
    career = input()
    info = get_career_info(career)
    print(json.dumps(info))
