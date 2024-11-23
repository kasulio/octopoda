/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { type NextConfig } from "next";
import "./src/env";

console.log("test db connection");
// test db connection
try {
  const { client, db } = await import("./src/server/db");
  console.log(client.query("SELECT 1"));
  console.log(db.query.users.findMany());
} catch (error) {
  console.error(error);
}

const config: NextConfig = {};

export default config;
