from flask import Flask, jsonify, make_response, request
import nlp

# from redis import Redis

app = Flask(__name__)
# redis = Redis(host='redis', port=6379)

# text = ("When Sebastian Thrun started working on self-driving cars at "
#         "Google in 2007, few people outside of the company took him "
#         "seriously. “I can tell you very senior CEOs of major American "
#         "car companies would shake my hand and turn away because I wasn’t "
#         "worth talking to,” said Thrun, in an interview with Recode earlier "
#         "this week.")


@app.route("/", methods=["POST"])
def hello():
    text = request.get_json()
    entities = nlp.find_entities(text)
    return entities


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
