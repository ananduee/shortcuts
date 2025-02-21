import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const apps = sqliteTable("apps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  logo: text("logo"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const shortcuts = sqliteTable("shortcuts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  appId: integer("app_id").references(() => apps.id, { onDelete: "cascade" }).notNull(),
  keys: text("keys").notNull(),
  description: text("description").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const userProgress = sqliteTable("user_progress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  shortcutId: integer("shortcut_id").references(() => shortcuts.id, { onDelete: "cascade" }).notNull(),
  lastPracticed: integer("last_practiced", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  successCount: integer("success_count").notNull().default(0),
  failureCount: integer("failure_count").notNull().default(0),
});
