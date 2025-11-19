import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/httpHelper";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid";
import { db } from "@/db/db";
import { fileTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const MAX_SIZE = 50 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return errorResponse(401, null, "user not authenticated");
    }

    const userFiles = await db
      .select()
      .from(fileTable)
      .where(eq(fileTable.clerkId, userId!))
      .execute();

    if (userFiles.length === 3) {
      return successResponse(200, "user has reached the file limit");
    }

    const data = await req.formData();
    const files = data.getAll("files") as File[];

    if (!files || files.length === 0) {
      return errorResponse(400, null, "invalid form data");
    }

    for (const file of files) {
      if (file.size > MAX_SIZE) {
        return errorResponse(400, null, "file is larger than 50mb");
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { error: uploadError } = await supabase.storage
        .from("files")
        .upload(file.name, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        return errorResponse(
          500,
          uploadError,
          `failed to upload file ${file.name}`,
        );
      }

      const { data: signedUrlData } = await supabase.storage
        .from("files")
        .createSignedUrl(file.name, 60 * 60 * 24 * 365 * 2);

      await db
        .insert(fileTable)
        .values({
          id: nanoid(20),
          clerkId: userId as string,
          fileName: file.name,
          fileSize: `${file.size / (1024 * 1024)}mb`,
          fileUrl: signedUrlData?.signedUrl as string,
        })
        .execute();
    }

    return successResponse(200, "all files uploaded");
  } catch (error) {
    return errorResponse(500, error, "internal sever error");
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return errorResponse(401, null, "User not authenticated");
    }

    // Get all files for the authenticated user
    const userFiles = await db
      .select()
      .from(fileTable)
      .where(eq(fileTable.clerkId, userId))
      .execute();

    if (userFiles.length === 0) {
      return successResponse(200, "no files at yet", []);
    }

    return successResponse(200, "User files retrieved successfully", userFiles);
  } catch (error) {
    return errorResponse(500, error, "Internal server error");
  }
}
