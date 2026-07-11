import { db } from "@/db";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("Database Setup starting...");

    // 1. Create Enums
    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
          CREATE TYPE "subscription_status" AS ENUM ('none', 'active', 'canceled', 'past_due');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'integration_provider') THEN
          CREATE TYPE "integration_provider" AS ENUM ('gmail', 'google_calendar');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
          CREATE TYPE "task_status" AS ENUM ('pending', 'completed', 'cancelled');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
          CREATE TYPE "task_priority" AS ENUM ('low', 'medium', 'high');
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'agent_run_status') THEN
          CREATE TYPE "agent_run_status" AS ENUM ('running', 'success', 'failed');
        END IF;
      END$$;
    `);
    console.log("Enums created/verified successfully.");

    // 2. Create Users Table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "clerk_id" text NOT NULL UNIQUE,
        "email" text NOT NULL,
        "name" text,
        "subscription_status" "subscription_status" NOT NULL DEFAULT 'none',
        "subscription_id" text,
        "agent_enabled" boolean NOT NULL DEFAULT true,
        "onboarding_completed" boolean NOT NULL DEFAULT false,
        "preferences" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now()
      );
    `);
    console.log("Users table created/verified successfully.");

    // 3. Create Integrations Table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "integrations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "provider" "integration_provider" NOT NULL,
        "access_token" text NOT NULL,
        "refresh_token" text NOT NULL,
        "expires_at" timestamp NOT NULL,
        "scope" text[] NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now()
      );
    `);
    console.log("Integrations table created/verified successfully.");

    // 4. Create Tasks Table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "tasks" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "title" text NOT NULL,
        "description" text,
        "status" "task_status" NOT NULL DEFAULT 'pending',
        "priority" "task_priority" NOT NULL DEFAULT 'medium',
        "due_date" timestamp,
        "created_by_agent" boolean NOT NULL DEFAULT false,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "completed_at" timestamp
      );
    `);
    console.log("Tasks table created/verified successfully.");

    // 5. Create Agent Runs Table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "agent_runs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "status" "agent_run_status" NOT NULL DEFAULT 'running',
        "summary" text,
        "actions_log" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "emails_processed" integer NOT NULL DEFAULT 0,
        "tasks_created" integer NOT NULL DEFAULT 0,
        "drafts_created" integer NOT NULL DEFAULT 0,
        "error_message" text,
        "started_at" timestamp NOT NULL DEFAULT now(),
        "completed_at" timestamp,
        "duration_ms" integer
      );
    `);
    console.log("Agent runs table created/verified successfully.");

    return NextResponse.json({
      success: true,
      message: "Database tables created successfully!",
    });
  } catch (error: any) {
    console.error("Database Setup error:", error);
    return NextResponse.json(
      { success: false, error: error.message || String(error) },
      { status: 500 },
    );
  }
}
