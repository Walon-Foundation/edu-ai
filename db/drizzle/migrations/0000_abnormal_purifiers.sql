CREATE TABLE "files" (
	"id" text PRIMARY KEY NOT NULL,
	"clerkId" text NOT NULL,
	"fileName" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
