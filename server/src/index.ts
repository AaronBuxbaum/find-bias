import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { createConnection } from "typeorm";
import resolvers from "./resolvers";

createConnection();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});

server.start(
  {
    tracing: true
  },
  () => console.log("Server is running on localhost:4000 🚀")
);
