import { IResolvers } from "graphql-tools";

import {
  buildUserTweets,
  getUserInfo,
  getUserTweetCount,
  getUserTweets
} from "./tweets";

interface IHandleInput {
  handle: string;
}

interface IOptions {
  options: {
    skip?: number | undefined;
    take?: number | undefined;
  };
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
    profile: async (_, { handle }: IHandleInput) => {
      const response = await getUserInfo(handle);
      return response;
    },
    tweets: async (_, { handle, options = {} }: IHandleInput & IOptions) => {
      const response = await getUserTweets(handle, options);
      return response;
    }
  }
};

export default resolvers;
