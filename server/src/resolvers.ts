import { IResolvers } from "graphql-tools";
import "reflect-metadata";
import { buildUserTweets, getUserTweets } from "./tweets";

const resolvers: IResolvers = {
  Mutation: {
    buildTweets: async (_, { handle }) => {
      await buildUserTweets(handle);
      return handle;
    }
  },
  Query: {
    tweets: async (_, { handle }) => {
      const response = await getUserTweets(handle);
      return response;
    }
  }
};

export default resolvers;
