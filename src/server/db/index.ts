import { createClient, type Client } from "@libsql/client";

import { env } from "~/env";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  // client: Database | undefined;
  client: Client | undefined;
};

// export const client =
//   globalForDb.client ?? new Database(env.DATABASE_PATH, { create: true });

export const client =
  globalForDb.client ?? createClient({ url: `file:${env.DATABASE_PATH}` });
if (env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
