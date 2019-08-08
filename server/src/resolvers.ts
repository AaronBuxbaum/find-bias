import { IResolvers } from "graphql-tools";
import { sortBy, takeRight } from "lodash";

import processUserTweets from "./processor";
import {
  buildUserTweets,
  getUserInfo,
  getUserTweetCount,
  getUserTweets
} from "./tweets";

interface IHandleInput {
  handle: string;
}

export interface IInputOptions {
  skip?: number;
  take?: number;
}

export interface IUserTweets extends IHandleInput {
  options: IInputOptions;
}

const resolvers: IResolvers = {
  Mutation: {
    buildTweets: async (_, { handle }: IHandleInput) => {
      await buildUserTweets(handle);
      return handle;
    }
  },
  Query: {
    count: async (_, { handle }: IHandleInput) => {
      const response = await getUserTweetCount(handle);
      return response;
    },
    processedTweets: async (_, { handle }: IHandleInput) => {
      const response = (await processUserTweets(handle)) as object;
      return takeRight(
        sortBy(
          Object.entries(response).map(([text, { count, sentiment }]) => ({
            count,
            sentiment,
            text
          })),
          ["count"]
        ),
        25
      );
    },
    profile: async (_, { handle }: IHandleInput) => {
      const response = await getUserInfo(handle);
      return response;
    },
    tweets: async (_, { handle, options }: IUserTweets) => {
      const response = await getUserTweets(handle, options);
      return response;
    }
  }
};

export default resolvers;
