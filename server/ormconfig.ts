import { trimEnd } from "lodash";

const authentication = {
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  username: process.env.POSTGRES_USER
};

const database = {
  host: process.env.POSTGRES_SERVICE_HOST,
  port: process.env.POSTGRES_SERVICE_PORT,
  type: "postgres"
};

const prefix = "src/database";
const cli = {
  entitiesDir: `${prefix}/entity`,
  migrationsDir: `${prefix}/migration`,
  subscribersDir: `${prefix}/subscriber`
};

const stripDir = (str: string) => trimEnd(str, "Dir");
const folders: IDictionary<string[]> = {};
Object.entries(cli).forEach(([key, value]) => {
  folders[stripDir(key)] = [`${value}/**/*.ts`];
});

const options = {
  logging: false,
  synchronize: true
};

export = {
  cli,
  ...authentication,
  ...database,
  ...folders,
  ...options
};
