// tslint:disable-next-line:no-var-requires
const Twit = require("twit");
import axios from "axios";

export const twitter = new Twit({
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET
});

export const nlp = axios.create({
  baseURL: "http://nlp:5000",
  headers: {
    "Content-Type": "application/json"
  }
});
