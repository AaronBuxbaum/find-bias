import Axios from "axios";
import * as Twit from "twit";

export const twitter = new Twit({
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  consumer_key: process.env.TWITTER_CONSUMER_KEY!,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET!
});

export const nlp = Axios.create({
  baseURL: "http://nlp:5000",
  headers: {
    "Content-Type": "application/json"
  }
});
