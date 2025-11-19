import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db } from "@/db/db";
import { fileTable } from "@/db/schema";
import { env } from "@/lib/env";
import { errorResponse, successResponse } from "@/lib/httpHelper";
import { supabase } from "@/lib/supabase";

// Assuming you have an environment variable for your OpenRouter API Key
const OPENROUTER_API_KEY = env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> },
) {
  try {
    const { userId } = await auth();
    const fileId = (await params).fileId;

    const file = (
      await db
        .select()
        .from(fileTable)
        .where(
          and(
            eq(fileTable.clerkId, userId as string),
            eq(fileTable.id, fileId),
          ),
        )
        .limit(1)
        .execute()
    )[0];

    if (!file) {
      return errorResponse(
        401,
        null,
        "User not authenticated or invalid file name",
      );
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from("files")
      .download(file.fileName);
    if (downloadError) {
      return errorResponse(500, downloadError, "Failed to download the file");
    }

    if (!fileData) {
      return errorResponse(500, null, "Invalid file");
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Prepare the Data URI for the multimodal request
    const base64File = buffer.toString("base64");
    const pdfDataUrl = `data:application/pdf;base64,${base64File}`;

    // --- DIRECT FETCH IMPLEMENTATION ---

    const requestBody = {
      model: "nvidia/nemotron-nano-12b-v2-vl:free",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert at creating high-quality learning questions and answers. Analyze the provided text and generate a set of 20 thoughtful questions and their corresponding answers.
                **REQUIREMENTS FOR Q&A GENERATION:**

                1.  **Quantity:** Create exactly 20 Q&A pairs.
                2.  **Focus:** Concentrate on the **most important concepts, core principles, and relationships** detailed in the text.
                3.  **Depth:** Questions must require **meaningful understanding** (analysis, application, implication) rather than simple verbatim recall.
                4.  **Accuracy:** Answers must be **clear, accurate, and directly substantiated** by the source text.
                5.  **Coverage:** Ensure the questions cover different aspects of the material, including **concepts, applications, and organizational relationships**.
                6.  **Format:** Output the results using a clean, simple, and direct format:
                    ### [Q#]: [Question Text]?
                    > [Answer Text].
                    ---`
            },
            {
              // Correct structure for sending a PDF document via Base64 using 'file' type
              type: "file",
              file: {
                filename: file.fileName,
                file_data: pdfDataUrl,
              },
            },
          ],
        },
      ],
      stream: false,
    };

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        // Ensure API key is available
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const completion = await response.json();

    // Handle API errors (e.g., 400, 500 status codes)
    if (!response.ok) {
      console.error("OpenRouter API Error:", completion);
      return errorResponse(
        response.status,
        completion,
        "OpenRouter API request failed",
      );
    }

    // --- END DIRECT FETCH IMPLEMENTATION ---

    // Check if the expected output structure is present
    const aiResult = completion?.choices?.[0]?.message?.content;

    if (!aiResult) {
      console.error("Missing AI content:", completion);
      return errorResponse(
        500,
        null,
        "Failed to generate question and answers: AI result was empty",
      );
    }

    return successResponse(200, `Q&A of the PDF ${file.fileName}`, aiResult);
  } catch (error) {
    console.error("Error in question and answer generation:", error);
    return errorResponse(500, error, "Internal server error");
  }
}
