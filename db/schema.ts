import { sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { ListingImage, Location } from "@/types/listings";

export const listings = pgTable(
  "tennisaddicts_listings",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    title: varchar("title", { length: 256 }).notNull(),
    description: varchar("description", { length: 1024 }).notNull(),
    price: integer("price").notNull().default(0),
    location: jsonb("location").$type<Location>().notNull(),
    tags: varchar("tags", { length: 256 }).array(),
    images: jsonb("images").$type<ListingImage[]>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => ({
    titleIdx: index("title_idx").on(table.title),
    userIdIdx: index("user_id_idx").on(table.userId),
    locationIdx: index("location_idx").on(table.location),
  })
);

// Types generated from the schema
export type ListingSchema = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
