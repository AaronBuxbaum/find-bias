from spacy import explain

labels = ['CARDINAL', 'DATE', 'MONEY', 'ORDINAL', 'PERCENT', 'QUANTITY', 'TIME', 'ORG', 'PERSON', 'GPE', 'NORP', 'WORK_OF_ART', 'FAC', 'LOC', 'LAW', 'EVENT', 'PRODUCT']

explanations = map(lambda x: {
    x: explain(x)
}, labels)
