import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import TodoResolver from "./resolvers/todo";

async function main() {
  const prisma = new PrismaClient();

  const schema = await buildSchema({
    resolvers: [TodoResolver],
    validate: false,
  });

  const server = new ApolloServer({
    schema,
    context: {
      prisma,
    },
  });

  server.listen({ port: 4000 }, () => {
    console.log("server is live");
  });
}

main();
