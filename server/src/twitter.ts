const Twit = require('twit')
import { flatten } from 'lodash';

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


export const buildUserTweets = async (handle: string) => {
    // TODO: schedule async getUserTweets requests until we run out of available tweets
    return getUserTweets(handle);
}

// TODO: pagination
const getUserTweets = async (handle: string) => {
    const params = {
        screen_name: handle,
        trim_user: true,
        tweet_mode: 'extended',
        include_rts: true,
        count: 100
    };

    let { data } = await Twitter.get('statuses/user_timeline', params);
    // TODO: save more data than just the text
    data = data.map(d => ({
        text: d.full_text,
    }));

    // just for testing purposes
    const tweets = await Promise.all(data.map(processTweet));
    console.log(flatten(tweets.map(t => t.entities)))

    return data;
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
