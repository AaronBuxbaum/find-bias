import spacy
from collections import Counter

nlp = spacy.load("en_core_web_md")


def find_entities(tweets):
    response = Counter()

    for tweet in tweets:
        doc = nlp(tweet["text"])
        entities = map(lambda x: x.text, doc.ents)
        response += Counter(entities)

    return dict(response.most_common(25))
