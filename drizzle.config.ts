import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: `file:${env.DATABASE_PATH}`,
  },
  tablesFilter: ["octopoda_*"],
} satisfies Config;
