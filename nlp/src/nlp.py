import spacy
from collections import Counter

model = spacy.load("en_core_web_sm")
label_blacklist = ['']


def find_entities(tweets):
    response = Counter()

    for tweet in tweets:
        doc = model(tweet["text"])
        entities = filter(lambda x: x._label not in label_blacklist, doc.ents)
        entities = map(lambda x: x.text, entities)
        response += Counter(entities)

    return dict(response.most_common(25))
