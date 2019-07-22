import { GraphQLServer } from 'graphql-yoga'
import { stringArg } from 'nexus'
import { makePrismaSchema, prismaObjectType } from 'nexus-prisma'
import { join } from 'path'
import datamodelInfo from '../generated/nexus-prisma'
import { prisma } from '../generated/prisma-client'
import * as twitter from './twitter';
import queue from './queue';

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

    t.field('updateTweets', {
      type: 'Tweet',
      args: {
        handle: stringArg({
          required: true
        })
      },
      resolve: async (_, { handle }, ctx) => {
        const tweets = await twitter.buildUserTweets(handle);
        console.log(tweets);

        // return ctx.prisma.updateManyTweets({
        //   create: tweets
        // });
      }
    })

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
        const user = {
          name,
          statuses_count,
          handle,
        };

        if (statuses_count > 0) {
          queue.push({
            handle
          });
        }

        return ctx.prisma.upsertTwitterUser({
          where: { handle },
          create: user,
          update: user
        });
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
