import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/httpHelper";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/db";
import { fileTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ fileName: string }> },
) {
  try {
    const { userId } = await auth();
    const fileName = (await params).fileName;

    const file = (
      await db
        .select()
        .from(fileTable)
        .where(
          and(
            eq(fileTable.fileName, fileName),
            eq(fileTable.clerkId, userId as string),
          ),
        )
        .limit(1)
        .execute()
    )[0];
    if (!file || !fileName || userId) {
      errorResponse(400, null, "user not authenticated or invalid file name");
    }

    // Delete file from Supabase Storage
    const { error } = await supabase.storage.from("files").remove([fileName]);

    if (error) {
      errorResponse(500, error, `failed to delete file name ${fileName}`);
    }

    successResponse(200, `file with name ${fileName} deleted`);
  } catch (error) {
    errorResponse(500, error, "internal server error");
  }
}
