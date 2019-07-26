import 'reflect-metadata';
import { GraphQLServer } from 'graphql-yoga';
import { buildUserTweets, getUserTweets } from './tweets';

const typeDefs = `
  type Tweet {
    twitterId: Int
    twitterIdString: String
    text: String
    handle: String
  }

  type Query {
    tweets(handle: String!): [Tweet!]!
  }

  type Mutation {
    buildTweets(handle: String!): String
  }
`

const resolvers = {
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

const server = new GraphQLServer({ typeDefs, resolvers });

server.start({
  tracing: true,
}, () => console.log('Server is running on localhost:4000 🚀'))
