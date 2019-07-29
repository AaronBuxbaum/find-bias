import { getRepository } from "typeorm";

import { Tweet } from "./database/entity/Tweet.entity";
import { nlp } from "./requests";

const processTweets = async (tweets: Tweet[]) => {
  const response = await nlp({
    data: { tweets },
    method: "POST",
    url: "processTweets"
  });
  return response.data;
};

const processUserTweets = async (handle: string) => {
  const tweets = await getRepository(Tweet).find({
    where: { twitterUser: handle.toLowerCase() }
  });
  return processTweets(tweets);
};

export default processUserTweets;
