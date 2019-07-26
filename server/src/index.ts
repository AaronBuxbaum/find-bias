import "reflect-metadata";
import { IResolversParameter } from "graphql-tools";
import { GraphQLServer } from "graphql-yoga";
import { createConnection } from "typeorm";
import { buildUserTweets, getUserTweets } from "./tweets";

createConnection();

const resolvers: IResolversParameter = {
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

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
});

server.start(
  {
    tracing: true
  },
  () => console.log("Server is running on localhost:4000 🚀")
);
