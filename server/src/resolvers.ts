import { IResolvers } from "graphql-tools";

import { buildUserTweets, getUserTweets } from "./tweets";

const resolvers: IResolvers = {
  Mutation: {
    buildTweets: async (_, { handle }: { handle: string }) => {
      await buildUserTweets(handle);
      return handle;
    }
  },
  Query: {
    tweets: async (_, { handle }: { handle: string }) => {
      const response = await getUserTweets(handle);
      return response;
    }
  }
};

export default resolvers;
