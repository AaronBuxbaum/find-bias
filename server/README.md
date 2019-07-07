# GraphQL Server

This is the GraphQL server which should serve as the single entrypoint to the backend. It communicates with Prisma for access to its backend.

You will need:
  - Prisma globally installed (`npm i -g prisma`)
  - Secret environment variables (`.env`) which lives on the project root

#### Prisma
##### Generate
`yarn generate`
Generates the Prisma Client (in TS) that we use to query into Prisma.

##### Deploy
`yarn deploy`
Whenever changes are made to a service configuration, you need to deploy it to sync the changes to Prisma.
This lets Prisma make any necessary changes to the database layer so we can manage data through the client.

#### Run the thing
`docker-compose build && docker-compose up`
