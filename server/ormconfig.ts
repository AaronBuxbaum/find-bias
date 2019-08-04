// tslint:disable object-literal-sort-keys
const prefix = "src/database";

export = {
  type: "postgres",
  host: "localhost",
  port: 5432,

  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

  synchronize: true,
  logging: false,

  entities: [`${prefix}/entity/**/*.ts`],
  migrations: [`${prefix}/migration/**/*.ts`],
  subscribers: [`${prefix}/subscriber/**/*.ts`],

  cli: {
    entitiesDir: `${prefix}/entity`,
    migrationsDir: `${prefix}/migration`,
    subscribersDir: `${prefix}/subscriber`
  }
};
