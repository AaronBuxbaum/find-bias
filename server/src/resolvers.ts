import "reflect-metadata";
import { IResolvers } from "graphql-tools";
import { buildUserTweets, getUserTweets } from "./tweets";

const resolvers: IResolvers = {
  Query: {
    tweets: async (_, { handle }) => {
      const response = await getUserTweets(handle);
      return response;
    }
  },
  Mutation: {
    buildTweets: async (_, { handle }) => {
      await buildUserTweets(handle);
      return handle;
    }
  }
};

export default resolvers;
