// tslint:disable object-literal-sort-keys
import { trimEnd } from "lodash";

const database = {
  type: "postgres",
  port: process.env.POSTGRES_SERVICE_PORT,
  host: process.env.POSTGRES_SERVICE_HOST
};

const authentication = {
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB
};

const options = {
  synchronize: true,
  logging: false
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

export = {
  cli,
  ...authentication,
  ...database,
  ...folders,
  ...options
};
