import { GraphQLServer } from 'graphql-yoga'
import { stringArg } from 'nexus'
import { makePrismaSchema, prismaObjectType } from 'nexus-prisma'
import { join } from 'path'
import datamodelInfo from '../generated/nexus-prisma'
import { prisma } from '../generated/prisma-client'
import * as scraper from './scraper';
import * as twitter from './twitter';

const Query = prismaObjectType({
  name: 'Query',
  definition(t) {
    t.prismaFields(['page', 'pages', 'twitterUsers'])
  }
})

const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    t.prismaFields(['createUser'])

    t.field('createTwitterUser', {
      type: 'TwitterUser',
      args: {
        handle: stringArg()
      },
      resolve: async (_, { handle }, ctx) => {
        const tweets = await twitter.buildUserTweets(handle!);
        return ctx.prisma.createTwitterUser({
          handle,
          tweets
        });
      }
    })

    t.field('createPage', {
      type: 'Page',
      args: {
        url: stringArg()
      },
      resolve: async (_, { url }, ctx) => {
        const name = await scraper.getUrlName(url)
        const content = await scraper.getUrlContent(url)
        return ctx.prisma.createPage({
          content,
          name,
          url
        })
      }
    })
  }
})

const schema = makePrismaSchema({
  types: [Query, Mutation],

  prisma: {
    client: prisma,
    datamodelInfo
  },

  outputs: {
    schema: join(__dirname, '../generated/schema.graphql'),
    typegen: join(__dirname, '../generated/nexus.ts')
  }
})

const server = new GraphQLServer({
  context: { prisma },
  schema
})

// tslint:disable-next-line:no-console no-floating-promises
server.start(() => console.log('Server is running on http://localhost:4000 🚀'))
