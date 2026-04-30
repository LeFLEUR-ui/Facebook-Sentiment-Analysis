from app.services.sentiment_model_service import SentimentModelService
import asyncio

async def test():
    service = SentimentModelService()
    
    test_text = """Sy Luis Antonio
Congratulations Mga Nag Basketball Hiro and Vince
22h
Reply
Ging Hualde Jaro
Congratulations 👏👏
20h
Reply
Redmond Felix Catambay
tambak ah
19h
Reply
Mhariz Isang Torres
Congrats STIers!
Test User
congratulations to your team
1h
Reply
"""
    
    print("--- Testing Comment Extraction ---")
    comments = service.extract_comments(test_text)
    for name, text in comments:
        print(f"Name: {name} | Comment: {text}")
        sentiment, score = service.analyze_sentiment(text)
        print(f"  -> Sentiment: {sentiment} ({score})")

if __name__ == "__main__":
    asyncio.run(test())
