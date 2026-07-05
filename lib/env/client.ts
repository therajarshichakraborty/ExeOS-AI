import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_APP_URL: z.url(),
});

const parsed = schema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsed.success) {
  console.error(parsed.error.flatten().fieldErrors);

  throw new Error("Invalid client environment variables.");
}

export const clientEnv = parsed.data;
