from flask import Flask, request
import nlp

# from redis import Redis

app = Flask(__name__)
# redis = Redis(host='redis', port=6379)


@app.route("/", methods=["POST"])
def hello():
    body = request.get_json()
    entities = nlp.find_entities(body["text"])
    return entities


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
