const Twit = require('twit')
import { flatten, last } from 'lodash';
import { prisma, Tweet } from '../generated/prisma-client';

const Twitter = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

/*
    TODO: implement data queue.
        1. User request kicks off process for a given handle, and returns immediately
        2. Handle (+ its pagination status) goes into an async queue
        3. As an available worker becomes available, it takes the top item off and gets the next page
        4. When the worker is finished, if there are more pages available, it pushes the item back into the queue

    Worker availability is determined by avoiding Twitter API limits and by maintaining high availability.
    If the user has already been requested before, `since_id` should be provided as the last collected tweet ID.
    This helps to avoid re-collecting already existing data.
    Fast response is considered unimportant since we will eventually collect all relevant data.

    * Should the thread go back each time, or should I just have individual threads that complete one timeline at
    a time? Finishing a timeline faster might happen, plus simplifying the code.
*/


const queue = [];


export const buildUserTweets = async (handle: string) => {
    // TODO: schedule async getUserTweets requests until we run out of available tweets
    return getUserTweets(handle);
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

const getTweets = async (screen_name: string, ...rest) => {
    const params = {
        screen_name,
        trim_user: true,
        tweet_mode: 'extended',
        include_rts: true,
        count: 1,
        ...rest,
    };

    const { data } = await Twitter.get('statuses/user_timeline', params);
    return data;
}

export const getUserInfo = async (screen_name: string) => {
    const params = {
        screen_name,
    };
    const user = await Twitter.get('users/show', params);
    return user;
}

// TODO: pagination
const getUserTweets = async (handle: string) => {
    const since_id = await getSinceId(handle);
    let tweets = await getTweets(handle, { since_id });

    // there might be more items!
    if (tweets.length > 0) {
        const max_id = last(tweets).id_str;
        queue.push({
            handle,
            max_id
        });
    }

    // TODO: save more data than just the text
    tweets = tweets.map(d => ({
        twitterId: d.id_str,
        text: d.full_text,
        handle,
    }));

    // just for testing purposes
    const temp = await Promise.all(tweets.map(processTweet));
    console.log(flatten(temp.map(t => t.entities)))

    return tweets;
}

const processTweet = async (tweet: any) => {
    const rawResponse = await fetch('http://nlp:5000', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tweet.text),
    });
    const response = await rawResponse.json();
    return response;
}
