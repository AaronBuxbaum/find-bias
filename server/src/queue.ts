import { getUserTweets } from './tweets';
import * as Celery from 'celery-ts';

const queue: Array<{ handle: string, options: object }> = [];

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

// TODO: manage API limits

const client = Celery.createClient({
  brokerUrl: 'amqp://admin:mypass@rabbit:5672//',
  resultBackend: 'amqp://'
});

const task: Celery.Task<number> = client.createTask<number>("tasks.tweet");

// setInterval(async () => {
//   if (queue.length > 0) {
//     const { handle, options } = queue.pop()!;
//     console.log('popping', options);
//     await getUserTweets(handle, options);
//   }
// }, 10000);

export default queue;
