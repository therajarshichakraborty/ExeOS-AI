import "server-only";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  API_URL: z.string(),
  DATABASE_URL: z.string(),
  ANTHROPIC_API_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  CLERK_FRONTEND_API: z.string().min(1),
  CLERK_OAUTH_CLIENT_SECRET: z.string().min(1),
  CLERK_OAUTH_CLIENT_ID: z.string().min(1),
  CLERK_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
  CLERK_SECRET_KEY: z.string().startsWith("sk_"),
  JWT_SECRET: z.string().min(32),
  POLAR_ACCESS_TOKEN: z.string().min(1),
  POLAR_PRODUCT_ID: z.string().min(1),
  POLAR_SERVER: z.enum(["sandbox", "production"]),
  POLAR_CREDITS_METER_ID: z.string().min(1),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(parsed.error.flatten().fieldErrors);

  throw new Error("Invalid environment variables.");
}

export const env = parsed.data;
