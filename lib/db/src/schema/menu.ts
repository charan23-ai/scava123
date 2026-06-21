import { pgTable, serial, text, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const menuItemsTable = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: real("price").notNull(),
  description: text("description").notNull(),
  tag: text("tag"),
  isSpicy: boolean("is_spicy").notNull().default(false),
});

export const insertMenuItemSchema = createInsertSchema(menuItemsTable).omit({ id: true });
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItemsTable.$inferSelect;
