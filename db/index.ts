// "use server"

// import dotenv from "dotenv"
// dotenv.config();
// import { drizzle } from "drizzle-orm/neon-http";
// import { neon } from "@neondatabase/serverless";
// import * as schema from "./schema";

// let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

// function getDb() {
//   if (_db) return _db;

//   const url = process.env.NEXT_PUBLIC_DATABASE_URL;
//   if (!url) {
//     throw new Error("DATABASE_URL environment variable is not set");
//   }

//   const sql = neon(url);
//   _db = drizzle(sql, { schema });
//   return _db;
// }

// export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
//   get(_target, prop) {
//     const client = getDb();
//     // @ts-ignore
//     return client[prop];
//   },
// });


// Source - https://stackoverflow.com/a/79128356
// Posted by Niloy Chowdhury, modified by community. See post 'Timeline' for change history
// Retrieved 2026-07-11, License - CC BY-SA 4.0

import dotenv from 'dotenv';
dotenv.config();

import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_URL!);
