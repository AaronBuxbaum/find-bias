import { GraphQLServer } from 'graphql-yoga'
import { makePrismaSchema, prismaObjectType } from 'nexus-prisma'
import { join } from 'path'
import datamodelInfo from '../generated/nexus-prisma'
import { prisma } from '../generated/prisma-client'

const Query = prismaObjectType({
  name: 'Query',
  definition(t) {
    t.prismaFields(['page'])
  }
})

const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    t.prismaFields(['createPage'])
  }
})

const schema = makePrismaSchema({
  types: [Query, Mutation],

  prisma: {
    client: prisma,
    datamodelInfo
  },

  outputs: {
    schema: join(__dirname, './generated/schema.graphql'),
    typegen: join(__dirname, './generated/nexus.ts')
  }
})

const server = new GraphQLServer({
  context: { prisma },
  schema
})

// tslint:disable-next-line:no-console no-floating-promises
server.start(() => console.log('Server is running on http://localhost:4000 🚀'))
