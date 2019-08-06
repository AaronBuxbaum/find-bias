from spacy import explain

labels = ['CARDINAL', 'DATE', 'MONEY', 'ORDINAL', 'PERCENT', 'QUANTITY', 'TIME', 'ORG', 'PERSON', 'GPE', 'NORP', 'WORK_OF_ART', 'FAC', 'LANGUAGE', 'LOC', 'LAW', 'EVENT', 'PRODUCT']

wikipedia_corpus_labels = ['PER', 'LOC', 'ORG', 'MISC']

explanations = map(lambda x: {
    x: explain(x)
}, labels)
