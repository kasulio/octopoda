import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import humanId from "human-id";

import { sqliteDb } from "~/db/client";
import { users } from "~/db/schema";
import { env } from "~/env";
import { hashPassword } from "~/serverHandlers/userSession";

export const APIRoute = createAPIFileRoute("/api/seed")({
  GET: async () => {
    const existingUsers = await sqliteDb
      .select()
      .from(users)
      .limit(1)
      .execute();
    if (env.PUBLIC_NODE_ENV === "production" && existingUsers.length > 0) {
      return json({
        error: "User already exists",
      });
    }

    const uniqueId = humanId({ separator: "-", capitalize: false });
    const password = humanId({ separator: "-", capitalize: false });

    const email = `${uniqueId}@test.com`;

    await sqliteDb.insert(users).values({
      passwordHash: await hashPassword(password),
      email,
      firstName: "Test",
      lastName: "User",
      isAdmin: true,
    });

    return json({
      email,
      password,
    });
  },
});
