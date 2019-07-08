const Twit = require('twit')

const Twitter = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

export const getTweets = async (handle: string) => {
    console.log(handle);
    const data = await Twitter.get('search/user_timeline', { screen_name: 'TwitterEng', count: 10 });
    console.log(data);
    return data;
}
