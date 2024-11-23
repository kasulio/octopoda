/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { type NextConfig } from "next";
import "./src/env";

// test db connection
import { client, db } from "./src/server/db";
console.log(client.query("SELECT 1"));
console.log(db.query.users.findMany());

const config: NextConfig = {};

export default config;
