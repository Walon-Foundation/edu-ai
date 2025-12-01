CREATE TABLE "generations" (
	"id" text PRIMARY KEY NOT NULL,
	"fileId" text NOT NULL,
	"type" text NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "generations" ADD CONSTRAINT "generations_fileId_files_id_fk" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;