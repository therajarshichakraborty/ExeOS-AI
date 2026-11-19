import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";

// Next.js loads .env automatically; drizzle-kit loads it via drizzle.config.ts.
export const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_URL!);
