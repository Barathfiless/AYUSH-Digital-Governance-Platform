import sys
import json
from textblob import TextBlob

def analyze_sentiment(text):
    blob = TextBlob(text)
    # Polarity is between -1 and 1
    polarity = blob.sentiment.polarity
    
    # Determine sentiment category
    if polarity > 0.1:
        sentiment = "positive"
    elif polarity < -0.1:
        sentiment = "negative"
    else:
        sentiment = "neutral"
        
    return {
        "polarity": polarity,
        "sentiment": sentiment,
        "subjectivity": blob.sentiment.subjectivity
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        text = sys.argv[1]
        result = analyze_sentiment(text)
        print(json.dumps(result))
    else:
        print(json.dumps({"error": "No text provided"}))
