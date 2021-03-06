import spacy
import html
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

spacy.prefer_gpu()
analyzer = SentimentIntensityAnalyzer()
model = spacy.load("en_core_web_sm", disable=["parser"])
label_blacklist = set(['CARDINAL', 'DATE', 'MONEY', 'ORDINAL', 'PERCENT', 'QUANTITY', 'TIME'])


def format_tweet(tweet):
    return html.unescape(str(tweet.encode('utf-8').decode('ascii', 'ignore')))


def find_entities(tweets):
    response = {}

    for tweet in tweets:
        doc = model(format_tweet(tweet["text"]))
        entities = doc.ents
        entities = filter(lambda x: x.label_ not in label_blacklist, entities)
        entities = filter(lambda x: not x.text.startswith('RT '), entities)
        entities = map(lambda x: x.text, entities)
        sentiment = analyzer.polarity_scores(tweet["text"])["compound"]

        for entity in entities:
            if entity not in response:
                response[entity] = {
                    "count": 0,
                    "sentiment": 0
                }
            v = response[entity]
            v["count"] = v["count"] + 1
            v["sentiment"] = v["sentiment"] + sentiment

    for key in response:
        v = response[key]
        v["sentiment"] = v["sentiment"] / v["count"]

    return response
