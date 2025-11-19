import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const fileTable = pgTable("files", {
  id: text("id").primaryKey().notNull(),
  clerkId: text("clerkId").notNull(),
  fileName: text("fileName").notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileSize: text("fileSize").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});
