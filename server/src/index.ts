import { GraphQLServer } from 'graphql-yoga'
import { stringArg } from 'nexus'
import { makePrismaSchema, prismaObjectType } from 'nexus-prisma'
import { join } from 'path'
import datamodelInfo from '../generated/nexus-prisma'
import { prisma } from '../generated/prisma-client'
import { getUserInfo } from './twitterUsers';
import { buildUserTweets } from './tweets';

const Query = prismaObjectType({
  name: 'Query',
  definition(t) {
    t.prismaFields(['twitterUser', 'twitterUsers', 'tweets', 'tweetsConnection', 'twitterUsersConnection'])
  }
})

const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    t.prismaFields(['deleteManyTweets', 'deleteManyTwitterUsers'])

    t.field('updateTweets', {
      type: 'Int',
      args: {
        handle: stringArg({
          required: true
        })
      },
      resolve: async (_, { handle }) => {
        const result = await buildUserTweets(handle.toLowerCase());
        return result.length;
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
        handle = handle.toLowerCase();
        const { data } = await getUserInfo(handle!);
        const { name, statuses_count } = data;
        const user = {
          name,
          statuses_count,
          handle,
        };

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
server.start({
  tracing: true,
}, () => console.log('Server is running on http://localhost:4000 🚀'))
