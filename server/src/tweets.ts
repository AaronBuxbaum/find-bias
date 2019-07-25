import { last } from 'lodash';
import { BigInteger } from 'jsbn';
import { Status as RawTweet } from 'twitter-d';
import { prisma, TweetCreateInput } from '../generated/prisma-client';
import { pushTweet } from './queue';
import { Twitter } from './twitter';

export const buildUserTweets = async (handle: string) => {
  // TODO: don't get tweets we've already seen
  // const since_id = await getSinceId(handle);
  return await getUserTweets(handle);
}

const getSinceId = async (handle: string) => {
  const lastTweet = await prisma.twitterUser({
    handle,
  }).tweets({
    first: 1, // TODO: probably wrong
  });

  if (lastTweet && lastTweet.length > 0) {
    const [{ twitterId }] = lastTweet;
    return twitterId;
  }
}

const getTweets = async (screen_name: string, options: object) => {
  const params = {
    screen_name,
    trim_user: false,
    tweet_mode: 'extended',
    include_rts: true,
    count: 200,
    ...options,
  };

  const response = await Twitter.get('statuses/user_timeline', params);
  return response.data as [RawTweet];
}

// TODO: save more data
const formatTweet = (tweet: RawTweet) => ({
  twitterId: tweet.id_str,
  text: tweet.full_text,
  handle: {
    connect: {
      handle: tweet.user.screen_name.toLowerCase(),
    }
  },
});

const addTweets = (tweet: TweetCreateInput) => prisma.upsertTweet({
  where: { twitterId: tweet.twitterId },
  create: tweet,
  update: tweet,
});

const getMaxId = (tweet: RawTweet) => {
  const lastSeen = tweet.id_str;
  const ONE = new BigInteger('1');
  return new BigInteger(lastSeen).subtract(ONE).toString();
}

const pushToQueue = (tweet: RawTweet, options: object) => {
  if (tweet) {
    const handle = tweet.user.screen_name.toLowerCase();
    pushTweet({
      handle,
      options: {
        ...options,
        max_id: getMaxId(tweet),
      }
    });
  }
}

export const getUserTweets = async (handle: string, options = {}) => {
  const tweets = await getTweets(handle.toLowerCase(), options);
  pushToQueue(last(tweets)!, options);
  return Promise.all(tweets.map(formatTweet).map(addTweets));
}
