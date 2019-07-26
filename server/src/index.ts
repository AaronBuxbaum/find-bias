import { GraphQLServer } from "graphql-yoga";
import "reflect-metadata";
import { createConnection } from "typeorm";
import resolvers from "./resolvers";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});

// tslint:disable:no-floating-promises
createConnection();

server.start(
  {
    tracing: true
  },
  () => console.log("Server is running on localhost:4000 🚀")
);
