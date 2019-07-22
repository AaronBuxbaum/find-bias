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
    t.prismaFields(['page', 'pages', 'twitterUser', 'twitterUsers', 'twitterUsersConnection'])
  }
})

const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    t.prismaFields(['createUser', 'updateManyTweets', 'deleteManyTweets', 'deleteManyTwitterUsers', 'upsertTwitterUser'])

    t.field('createTwitterUser', {
      type: 'TwitterUser',
      args: {
        handle: stringArg({
          required: true,
        })
      },
      resolve: async (_, { handle }, ctx) => {
        const { data } = await twitter.getUserInfo(handle!);
        const { name, statuses_count } = data;
        const params = {
          name,
          statuses_count,
          handle,
        };
        ctx.prisma.updateTweets(handle);
        return ctx.prisma.upsertTwitterUser({
          where: { handle },
          create: params,
          update: params
        });
      }
    })

    t.field('updateTweets', {
      type: 'Tweet',
      args: {
        handle: stringArg({
          required: true
        })
      },
      resolve: async (_, { handle }, ctx) => {
        // TODO: here
        const tweets = await twitter.buildUserTweets(handle);

        return ctx.prisma.updateManyTweets({
          create: tweets
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
