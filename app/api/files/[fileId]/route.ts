import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db } from "@/db/db";
import { fileTable } from "@/db/schema";
import { errorResponse, successResponse } from "@/lib/httpHelper";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  try {
    const { userId } = await auth();
    const fileId = (await params).fileId;

    if (!userId) {
      return errorResponse(401, null, "User not authenticated");
    }

    const file = (
      await db
        .select()
        .from(fileTable)
        .where(and(eq(fileTable.id, fileId), eq(fileTable.clerkId, userId)))
        .limit(1)
        .execute()
    )[0];

    if (!file) {
      return errorResponse(404, null, "File not found");
    }

    // Delete file from Supabase Storage and database concurrently
    const [supabaseResult, _dbResult] = await Promise.all([
      supabase.storage.from("files").remove([file.fileName]),
      db
        .delete(fileTable)
        .where(and(eq(fileTable.clerkId, userId), eq(fileTable.id, fileId)))
        .execute(),
    ]);

    // Check if Supabase deletion was successful
    if (supabaseResult.error) {
      return errorResponse(
        500,
        supabaseResult.error,
        `Failed to delete file from storage: ${file.fileName}`,
      );
    }

    // Note: dbResult typically doesn't return an error in this pattern,
    // but you could add additional checks if needed

    return successResponse(
      200,
      `File with name ${file.fileName} deleted successfully`,
    );
  } catch (error) {
    return errorResponse(500, error, "Internal server error");
  }
}
