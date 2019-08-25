FROM python:3.7
WORKDIR /app
COPY requirements.txt /app
RUN pip install -r requirements.txt
RUN python -m spacy download en_core_web_sm
COPY . /app
ENTRYPOINT [ "python", "src/server.py" ]
