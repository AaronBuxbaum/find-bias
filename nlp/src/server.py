from flask import Flask, request
import nlp

app = Flask(__name__)


@app.route("/processTweets", methods=["POST"])
def processTweets():
    body = request.get_json()
    return nlp.find_entities(body["tweets"])


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
