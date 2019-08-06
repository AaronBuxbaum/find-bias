import spacy
from collections import Counter

spacy.prefer_gpu()
model = spacy.load("en_core_web_sm")
label_blacklist = ['']


def find_entities(tweets):
    response = Counter()

    for tweet in tweets:
        doc = model(tweet["text"])
        # entities = filter(lambda x: x.label_ not in label_blacklist, doc.ents)
        entities = doc.ents
        entities = map(lambda x: x.label_, entities)
        response += Counter(entities)
        print(response)

    return dict(response.most_common(25))
