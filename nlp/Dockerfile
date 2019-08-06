FROM python:3.7
WORKDIR /app
ADD requirements.txt /app
RUN pip install -r requirements.txt
RUN python -m spacy download en_core_web_sm
ADD . /app
ENTRYPOINT [ "python", "server.py" ]
