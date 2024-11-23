import { relations, sql } from "drizzle-orm";
import { int, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

function createIdType(title = "id") {
  return text(title, { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());
}

const timestamps = {
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`,
  ),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
  deletedAt: int("deleted_at", { mode: "timestamp" }),
};

export const users = sqliteTable("user", {
  id: createIdType(),
  firstName: text("first_name", { length: 255 }),
  lastName: text("last_name", { length: 255 }),
  email: text("email", { length: 255 }).notNull(),
  passwordHash: text("password_hash", { length: 255 }),
  isAdmin: integer("is_admin", { mode: "boolean" }).default(false),
  ...timestamps,
});

export const userRelations = relations(users, ({ many, one }) => ({
  dashboard: one(dashboard, {
    fields: [users.id],
    references: [dashboard.userId],
  }),
}));

export const instances = sqliteTable("instance", {
  id: createIdType(),
  bucket: text("bucket", { length: 255 }),
  ...timestamps,
});

export const loadingSessions = sqliteTable("loading_session", {
  id: createIdType(),
  instanceId: createIdType("instance_id")
    .notNull()
    .references(() => instances.id),
  startTime: int("start_time", { mode: "timestamp" }),
  endTime: int("end_time", { mode: "timestamp" }),
  location: text("location", { length: 255 }),
  vehicle: text("vehicle", { length: 255 }),
  energy: real("energy"),
  duration: text("duration", { length: 255 }),
  sunPercentage: real("sun_percentage"),
  price: real("price"),
  pricePerKwh: real("price_per_kwh"),
  co2PerKwh: real("co2_per_kwh"),
  ...timestamps,
});

export const loadingSessionRelations = relations(
  loadingSessions,
  ({ one }) => ({
    instance: one(instances, {
      fields: [loadingSessions.instanceId],
      references: [instances.id],
    }),
  }),
);

export const dashboard = sqliteTable("dashboard", {
  id: createIdType(),
  userId: createIdType("user_id")
    .notNull()
    .references(() => users.id),
  ...timestamps,
});

export const dashboardRelations = relations(dashboard, ({ one }) => ({
  user: one(users, {
    fields: [dashboard.userId],
    references: [users.id],
  }),
}));
