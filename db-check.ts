import { db } from "./db";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  try {
    console.log("Checking database connection...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    const result = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    console.log("Tables in the database:");
    console.log(result);
  } catch (error) {
    console.error("Database check failed:", error);
  } finally {
    process.exit();
  }
}

main();
