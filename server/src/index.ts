import { GraphQLServer } from "graphql-yoga";
import "reflect-metadata";
import { createConnection } from "typeorm";
import resolvers from "./resolvers";

const server = new GraphQLServer({
  resolvers,
  typeDefs: "./src/schema.graphql"
});

// tslint:disable:no-floating-promises, no-console
createConnection();

server.start(
  {
    tracing: true
  },
  () => console.log("Server is running on localhost:4000 🚀")
);
