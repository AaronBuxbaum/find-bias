import { getRepository } from "typeorm";

import { Tweet } from "./database/entity/Tweet.entity";
import { nlp } from "./requests";

const processTweet = async (tweet: Tweet) => {
  const response = await nlp({
    data: { text: tweet.text },
    method: "POST"
  });
  return response.data;
};

const processUserTweets = async (handle: string) => {
  const tweets = await getRepository(Tweet).find({
    where: { twitterUser: handle.toLowerCase() }
  });
  const entities = await Promise.all(tweets.map(processTweet));
  // tslint:disable-next-line:no-console
  entities.map(console.log); // TODO: do something more interesting here
};

export default processUserTweets;
