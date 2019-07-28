import { BigInteger } from "jsbn";
import { last } from "lodash";
import { Status as RawTweet } from "twitter-d";
// tslint:disable-next-line:no-submodule-imports
import { FullUser } from "twitter-d/types/user";
import { getRepository } from "typeorm";

import { Tweet } from "./database/entity/Tweet.entity";
import { TwitterUser } from "./database/entity/TwitterUser.entity";
import { pushTweet } from "./queue";
import { twitter } from "./requests";
import { IInputOptions } from "./resolvers";

export interface ITweetPageOptions extends IInputOptions {
  max_id?: string;
  since_id?: string;
}

const MAX_TWEETS = 100;

export const buildUserTweets = async (handle: string) => {
  const sinceId = await getSinceId(handle);
  return pushUserTweets(handle, { since_id: sinceId });
};

const getSinceId = async (handle: string) => {
  const lastTweet = await getRepository(Tweet).findOne({
    order: { twitterId: "DESC" },
    where: { twitterUser: handle.toLowerCase() }
  });

  if (lastTweet) {
    const { twitterIdString } = lastTweet;
    return twitterIdString;
  }
};

const getTweets = async (handle: string, options: ITweetPageOptions) => {
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

const addTweets = async (tweets: RawTweet[], handle: string) => {
  if (tweets.length > 0) {
    let twitterUser = await getRepository(TwitterUser).findOne(
      handle.toLowerCase()
    );

    if (!twitterUser) {
      twitterUser = await getRepository(TwitterUser).save({
        handle: handle.toLowerCase()
      });
    }

    await getRepository(Tweet).save(
      tweets.map(tweet => ({
        text: tweet.full_text,
        twitterId: tweet.id,
        twitterIdString: tweet.id_str,
        twitterUser
      }))
    );
  }
};

const getMaxId = (tweet: RawTweet) => {
  const lastSeen = tweet.id_str;
  const ONE = new BigInteger("1");
  return new BigInteger(lastSeen).subtract(ONE).toString();
};

const pushToQueue = (tweet: RawTweet, options: ITweetPageOptions) => {
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

export const pushUserTweets = async (
  handle: string,
  options: ITweetPageOptions
) => {
  const tweets = await getTweets(handle.toLowerCase(), options);
  pushToQueue(last(tweets)!, options);
  return addTweets(tweets, handle);
};

export const getUserTweets = async (
  handle: string,
  options: IInputOptions = {}
) =>
  getRepository(Tweet).find({
    order: { twitterId: "DESC" },
    skip: options.skip,
    take: Math.min(options.take || MAX_TWEETS, MAX_TWEETS),
    where: { twitterUser: handle.toLowerCase() }
  });

export const getUserTweetCount = async (handle: string) =>
  getRepository(Tweet).count({
    where: { twitterUser: handle.toLowerCase() }
  });

export const getUserInfo = async (handle: string) => {
  const params = { screen_name: handle.toLowerCase() };
  const user = await twitter.get("users/show", params);
  return user.data;
};
