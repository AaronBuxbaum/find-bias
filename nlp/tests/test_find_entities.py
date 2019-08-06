from src.nlp import find_entities


tweets = [{
    "text": "Loading spacy models slows down running my unit tests. Is there a way to mock spacy models or Doc objects to speed up unit tests?",
}]


def test_find_entities():
    assert find_entities(tweets) == {}
