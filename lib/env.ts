import z from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:z.string({ error:"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required"}),
    CLERK_SECRET_KEY:z.string({ error:"CLERK_SECRET_KEY is required"}),
    SUPABASE_URL:z.string({ error: "SUPABASE_URL is required"}),
    SUPABASE_ROLE_KEY:z.string({ error: "SUPABASE_ROLE_KEY is required"}),
    NODE_ENV:z.string({ error: "NODE_ENV is required"}),
    DATABASE_URL:z.string({ error:"DATABASE_URL is required"})
})

export const env = envSchema.parse({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY:process.env.CLERK_SECRET_KEY,
    SUPABASE_URL:process.env.SUPABASE_URL,
    SUPABASE_ROLE_KEY:process.env.SUPABASE_ROLE_KEY,
    NODE_ENV:process.env.NODE_ENV,
    DATABASE_URL:process.env.DATABASE_URL
})