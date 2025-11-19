import { db } from "@/db/db";
import { fileTable } from "@/db/schema";
import { errorResponse, successResponse } from "@/lib/httpHelper";
import { openRouter } from "@/lib/openRouter";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { PDFParse } from "pdf-parse"

export async function POST(req:NextRequest, {params}:{params:Promise<{fileName:string}>}){
    try{
        const { userId } = await auth()
        const fileName = (await params).fileName
        const file = (await db.select().from(fileTable).where(and(eq(fileTable.clerkId, userId as string), eq(fileTable.fileName, fileName))).limit(1).execute())[0]
        if(!file){
            errorResponse(
                401,
                null,
                "user not authenticated or invalid file name"
            )
        }

        const { data, error } = await supabase.storage.from("files").download(fileName)
        if(error){
            errorResponse(
                500,
                error,
                "failed to download the file"
            )
        }

        if(!data){
            errorResponse(
                500,
                null,
                "invalid file"
            )
        }

        const arrayBuffer = await data?.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer as ArrayBuffer)

        const pdfData = new PDFParse(buffer)
        const text = (await pdfData.getText()).text

        const completion = await openRouter.chat.send({
            model:"openai/gpt-oss-20b:free",
            messages:[
                {
                    role:"system",
                    content:`
                    Create a highly concise executive summary of the provided text. Follow these strict guidelines:
                    **REQUIREMENTS:**
                    - Maximum 150-200 words
                    - Focus ONLY on core concepts and main arguments
                    - Omit examples, anecdotes, and minor details
                    - Use clear, direct language
                    - Structure: Overview → Key Points → Conclusion
                    **TEXT TO SUMMARIZE:**
                    ${text}
                    `
                }
            ],
            stream:false,
            // maxTokens:2000
        })

        const aiResult = completion.choices[0].message.content  
        if(!aiResult){
            errorResponse(
                500,
                null,
                "failed to generate summary"
            )
        }

        successResponse(
            200,
            `summary of the pdf ${fileName}`,
            aiResult,
        )

    }catch(error){
        errorResponse(
            500,
            error,
            "internal server error"
        )
    }
}