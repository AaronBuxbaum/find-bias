import spacy
import html
from collections import Counter
from vaderSentiment import sentiment

spacy.prefer_gpu()
model = spacy.load("en_core_web_sm", disable=["parser"])
label_blacklist = set(['CARDINAL', 'DATE', 'MONEY', 'ORDINAL', 'PERCENT', 'QUANTITY', 'TIME'])


def format_tweet(tweet):
    return html.unescape(str(tweet.encode('utf-8').decode('ascii', 'ignore')))


def find_entities(tweets):
    response = Counter()

    for tweet in tweets:
        doc = model(format_tweet(tweet["text"]))
        entities = doc.ents
        entities = filter(lambda x: x.label_ not in label_blacklist, entities)
        entities = filter(lambda x: not x.text.startswith('RT '), entities)

        # for e in entities:
        #     print(e.ents, e.lemma_, e.label_)

        entities = map(lambda x: x.text, entities)
        response += Counter(entities)
        print(sentiment(tweet["text"]))

    return dict(response.most_common(25))
