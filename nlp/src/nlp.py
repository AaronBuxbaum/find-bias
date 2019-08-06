import spacy
from collections import Counter

spacy.prefer_gpu()
model = spacy.load("en_core_web_sm", disable=["parser"])
label_blacklist = set(['CARDINAL', 'DATE', 'MONEY', 'ORDINAL', 'PERCENT', 'QUANTITY', 'TIME'])


def find_entities(tweets):
    response = Counter()

    for tweet in tweets:
        doc = model(tweet["text"])
        entities = doc.ents
        entities = filter(lambda x: x.label_ not in label_blacklist, entities)
        entities = filter(lambda x: not (x.text.startswith('RT ') or x.text.startswith('@')), entities)
        entities = map(lambda x: x.text, entities)
        response += Counter(entities)

    return dict(response.most_common(25))
