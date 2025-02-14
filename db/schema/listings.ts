// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { array } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `tennisaddicts_${name}`);

export const listings = createTable(
  "listings",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    userId: varchar("userId", { length: 256 }).notNull(),
    title: varchar("title", { length: 256 }).notNull(),
    description: varchar("description", { length: 1024 }).notNull(),
    price: integer("price"),
    location: varchar("location", { length: 256 }).array(),
    tags: varchar("tags", { length: 256 }).array(),
    imageUrl: varchar("imageUrl", { length: 1024 }).array().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    titleIndex: index("title_idx").on(example.title),
  })
);
