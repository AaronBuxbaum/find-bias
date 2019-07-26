// import { prisma, Tweet } from '../generated/prisma-client';
// import requests from './requests';

// const processTweet = async (tweet: Tweet) => {
//   const response = await requests({
//     method: 'POST',
//     data: { text: tweet.text }
//   });
//   return response.data;
// }

// const processUserTweets = async (handle: string) => {
//   const tweets = await prisma.twitterUser({ handle }).tweets();
//   const entities = await Promise.all(tweets.map(processTweet));
//   entities.map(console.log); // TODO: do something more interesting here
// }

// export default processUserTweets;
