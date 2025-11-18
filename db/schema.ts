import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const fileTable = pgTable("files",{
    id:text("id").primaryKey().notNull(),
    clerkId:text("clerkId").notNull(),
    fileName:text("fileName").notNull(),
    fileUrl:text("fileUrl").notNull(),
    createdAt:timestamp("createdAt").defaultNow()
})