import { BigInteger } from "jsbn";
import { last } from "lodash";
import { Status as RawTweet } from "twitter-d";
// tslint:disable-next-line:no-submodule-imports
import { FullUser } from "twitter-d/types/user";
import { createQueryBuilder } from "typeorm";

import { Tweet } from "./database/entity/Tweet.entity";
import { pushTweet } from "./queue";
import { twitter } from "./requests";

export const buildUserTweets = async (handle: string) => {
  const sinceId = await getSinceId(handle);
  return pushUserTweets(handle, { since_id: sinceId });
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

const getTweets = async (handle: string, options: object) => {
  const params = {
    count: 200,
    include_rts: true,
    screen_name: handle,
    trim_user: false,
    tweet_mode: "extended",
    ...options
  };

  const response = await twitter.get("statuses/user_timeline", params);
  return response.data as [RawTweet];
};

const getScreenName = (tweet: RawTweet) => {
  const user = tweet.user as FullUser;
  return user.screen_name.toLowerCase();
};

// TODO: save more data
const formatTweet = (tweet: RawTweet) => ({
  handle: getScreenName(tweet),
  text: tweet.full_text,
  twitterId: tweet.id,
  twitterIdString: tweet.id_str
});

const addTweets = async (tweets: Array<Omit<Tweet, "id">>) => {
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
    pushTweet({
      handle: getScreenName(tweet),
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

const MAX_TWEETS = 10;

export const getUserTweets = async (handle: string) =>
  createQueryBuilder(Tweet, "tweet")
    .where("tweet.handle = :handle", { handle: handle.toLowerCase() })
    .limit(MAX_TWEETS)
    .getMany();

export const getUserTweetCount = async (handle: string) =>
  createQueryBuilder(Tweet, "tweet")
    .where("tweet.handle = :handle", { handle: handle.toLowerCase() })
    .getCount();

export const getUserInfo = async (handle: string) => {
  const params = {
    screen_name: handle.toLowerCase()
  };
  const user = await twitter.get("users/show", params);
  return user.data;
};
