import { pushUserTweets } from "./tweets";
import * as amqp from "amqp-ts";

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

const user = process.env.RABBITMQ_DEFAULT_USER;
const password = process.env.RABBITMQ_DEFAULT_PASS;
const connection = new amqp.Connection(
  `amqp://${user}:${password}@rabbit:5672`
);

// TODO: manage API limits
const queue = connection.declareQueue("get-tweets");
queue.activateConsumer(async message => {
  try {
    const { handle, options } = message.getContent();
    console.log(" [x] received message: " + handle);
    setTimeout(async () => {
      await pushUserTweets(handle, options);
      message.ack();
    }, 10000);
  } catch (e) {
    message.nack();
  }
});

interface TweetQueue {
  handle: string;
  options: object;
}

export const pushTweet = (tweet: TweetQueue) => {
  const message = new amqp.Message(tweet, { persistent: true });
  queue.send(message);
};

export default queue;
