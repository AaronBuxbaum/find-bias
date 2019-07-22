import spacy

nlp = spacy.load("en_core_web_md")


def find_entities(text):
    doc = nlp(text)

    response = {"sentiment": doc.sentiment, "entities": []}

    for entity in doc.ents:
        response["entities"].append(
            {
                "text": entity.text,
                # 'sentiment': entity.sentiment,
                "label": entity.label_,
            }
        )

    return response
