FROM python:3.7
WORKDIR /app
ADD requirements.txt /app
RUN pip install -r requirements.txt
RUN python -m spacy download en_core_web_md
ADD . /app
# CMD python server.py
ENTRYPOINT [ "python", "server.py" ]
