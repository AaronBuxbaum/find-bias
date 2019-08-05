// tslint:disable:no-console
import * as amqp from "amqp-ts";

import { ITweetPageOptions, pushUserTweets } from "./tweets";

const user = process.env.RABBITMQ_DEFAULT_USER;
const password = process.env.RABBITMQ_DEFAULT_PASS;
const host = process.env.RABBIT_SERVICE_HOST;
const port = process.env.RABBIT_SERVICE_PORT;
// might be able to be an object of keys username and password (might also need hostname)
const connection = new amqp.Connection(
  `amqp://${user}:${password}@${host}:${port}`
);

const QUEUE_DELAY = 10000;

// TODO: manage API limits
const queue = connection.declareQueue("get-tweets");
queue.activateConsumer(message => {
  try {
    const { handle, options } = message.getContent() as ITweetQueue;
    console.log(`received message: ${handle}`);
    setTimeout(async () => {
      await pushUserTweets(handle, options);
      message.ack();
    }, QUEUE_DELAY);
  } catch (e) {
    message.nack();
  }
});

interface ITweetQueue {
  handle: string;
  options: ITweetPageOptions;
}

export const pushTweet = (tweet: ITweetQueue) => {
  const message = new amqp.Message(tweet, { persistent: true });
  queue.send(message);
};

export default queue;
