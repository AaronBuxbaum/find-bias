import { last } from "lodash";
import { BigInteger } from "jsbn";
import { Status as RawTweet } from "twitter-d";
import { createConnection, createQueryBuilder } from "typeorm";
import { pushTweet } from "./queue";
import { Twitter } from "./twitter";
import { Tweet } from "./database/entity/Tweet";

createConnection();

export const buildUserTweets = async (handle: string) => {
  const since_id = await getSinceId(handle);
  return pushUserTweets(handle, { since_id });
};

const getSinceId = async (handle: string) => {
  const lastTweet = await createQueryBuilder(Tweet, "tweet")
    .where("tweet.handle = :handle", { handle })
    .orderBy("tweet.twitterId", "DESC")
    .getOne();

  if (lastTweet) {
    const { twitterIdString } = lastTweet;
    return twitterIdString;
  }
};

const getTweets = async (screen_name: string, options: object) => {
  const params = {
    screen_name,
    trim_user: false,
    tweet_mode: "extended",
    include_rts: true,
    count: 200,
    ...options
  };

  const response = await Twitter.get("statuses/user_timeline", params);
  return response.data as [RawTweet];
};

// TODO: save more data
const formatTweet = (tweet: RawTweet) => ({
  twitterId: tweet.id,
  twitterIdString: tweet.id_str,
  text: tweet.full_text,
  handle: tweet.user.screen_name.toLowerCase()
});

const addTweets = async (tweets: Omit<Tweet, "id">[]) => {
  if (tweets.length > 0) {
    await createQueryBuilder()
      .insert()
      .into(Tweet)
      .values(tweets)
      .execute();
  }
};

const getMaxId = (tweet: RawTweet) => {
  const lastSeen = tweet.id_str;
  const ONE = new BigInteger("1");
  return new BigInteger(lastSeen).subtract(ONE).toString();
};

const pushToQueue = (tweet: RawTweet, options: object) => {
  if (tweet) {
    const handle = tweet.user.screen_name.toLowerCase();
    pushTweet({
      handle,
      options: {
        ...options,
        max_id: getMaxId(tweet)
      }
    });
  }
};

export const pushUserTweets = async (handle: string, options = {}) => {
  const tweets = await getTweets(handle.toLowerCase(), options);
  pushToQueue(last(tweets)!, options);
  return addTweets(tweets.map(formatTweet));
};

export const getUserTweets = async (handle: string) => {
  return createQueryBuilder(Tweet, "tweet")
    .where("tweet.handle = :handle", { handle })
    .limit(10)
    .getMany();
};
