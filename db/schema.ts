import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const fileTable = pgTable("files", {
  id: text("id").primaryKey().notNull(),
  clerkId: text("clerkId").notNull(),
  fileName: text("fileName").notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileSize: text("fileSize").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const generationsTable = pgTable("generations", {
  id: text("id").primaryKey().notNull(),
  fileId: text("fileId")
    .notNull()
    .references(() => fileTable.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'summary', 'flashcard', 'qa'
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});
