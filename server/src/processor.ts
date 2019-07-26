import { createQueryBuilder } from "typeorm";
import requests from './requests';
import { Tweet } from "./database/entity/Tweet";

const processTweet = async (tweet: Tweet) => {
  const response = await requests({
    method: 'POST',
    data: { text: tweet.text }
  });
  return response.data;
}

const processUserTweets = async (handle: string) => {
  const tweets = await createQueryBuilder(Tweet, "tweet")
    .where("tweet.handle = :handle", { handle })
    .getMany();
  const entities = await Promise.all(tweets.map(processTweet));
  entities.map(console.log); // TODO: do something more interesting here
}

export default processUserTweets;
