# ExeOS-AI 🚀

### _Autonomous AI Executive Assistant & Workflow Automation Engine_

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-1.0-C5F74F?style=flat-square&logo=drizzle)](https://orm.drizzle.team/)
[![Neon Postgres](https://img.shields.io/badge/Neon_Postgres-Database-00E599?style=flat-square&logo=postgresql)](https://neon.tech/)
[![Clerk Auth](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk)](https://clerk.com/)
[![OpenRouter AI](https://img.shields.io/badge/OpenRouter-AI_SDK-FF6464?style=flat-square)](https://openrouter.ai/)
[![Bun](https://img.shields.io/badge/Bun-Runtime-fbf0df?style=flat-square&logo=bun)](https://bun.sh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 💡 What is ExeOS-AI?

**ExeOS-AI** (Executive Operating System AI) is a production-ready, full-stack
autonomous AI assistant engineered to reclaim hours of manual executive
management. Inspired by n8n workflow automation and modern agentic
architectures, ExeOS-AI seamlessly connects your **Gmail** and **Google
Calendar** with state-of-the-art LLMs (Gemini 2.5, Claude 3.5, GPT-4o via
OpenRouter) to automatically triage incoming emails, draft contextual replies,
extract actionable task items, and schedule calendar events in real time.

---

## ✨ Core Features

### 📬 1. Autonomous Inbox Intelligence

- **Intelligent Email Processing**: Scans unread messages and analyzes context,
  sentiment, and urgency using Vercel AI SDK and OpenRouter.
- **Smart Categorization**: Categorizes emails into _High Priority_, _Standard_,
  or _Low Priority_.
- **Auto-Draft Replies**: Generates high-quality, professional response drafts
  directly inside Gmail without auto-sending without your final review.
- **Concise Summaries**: Provides TL;DR executive summaries for rapid scanning.

### 📅 2. Automated Google Calendar Scheduling

- **Event Detection**: Identifies meeting requests, time slots, and agenda items
  buried inside emails.
- **Instant Booking**: Automatically constructs and schedules events on Google
  Calendar with proper start/end timestamps and attendee detail parsing.

### ✅ 3. Actionable Task Extraction

- **Task Parsing**: Converts email action items into structured tasks.
- **Priority & Due Dates**: Assigns priority levels (`low`, `medium`, `high`)
  and target completion dates automatically.
- **Task Tracker Dashboard**: Provides complete management to review, filter,
  and complete tasks.

### 📊 4. Monitoring & Telemetry Dashboard

- **Live Run Metrics**: Tracks total emails scanned, tasks created, response
  drafts created, duration, and success rates.
- **Execution History Logs**: Detailed step-by-step action logs per agent run
  with diagnostic error handling and execution timestamps.
- **System Health Monitoring**: Built-in inspection endpoints
  (`/api/inspect-db`, `/monitoring`) for production reliability.

### 🔐 5. Enterprise Security & Privacy

- **AES-256-GCM Encryption**: Secure zero-leak storage for user OAuth tokens
  (`access_token`, `refresh_token`).
- **Clerk Authentication**: Full identity management with Clerk Next.js SDK,
  protected routes, and middleware auth enforcement.
- **CRON / API Auth**: Secured background execution trigger with secret
  verification.

---

## 📖 How to Use ExeOS-AI (User Guide)

ExeOS-AI transforms email management into an effortless **3-step executive
workflow**:

### 1️⃣ Step 1: One-Time Onboarding

1. Sign in to your **ExeOS-AI** account.
2. Navigate to **Settings** (`/settings`).
3. Click **Connect Gmail** and **Connect Google Calendar** to authorize Google
   OAuth integration.

### 2️⃣ Step 2: Triggering the AI Agent

1. Go to your **Dashboard** (`/dashboard`) or **Monitoring Hub**
   (`/monitoring`).
2. Click the **"Run Agent Now"** (or **"Trigger AI Scan"**) button.
3. The AI agent scans your unread inbox, categorizes emails, drafts reply
   responses in Gmail, extracts task action items, and schedules calendar
   events.

### 3️⃣ Step 3: Executive Daily Review

1. **Read AI Summaries**: View the **Monitoring Hub** for instant TL;DR
   summaries and priority tags (`High Priority`, `Newsletter`, etc.).
2. **Send Gmail Drafts**: Open your Gmail **Drafts** folder. Review pre-written
   response drafts prepared by ExeOS-AI and click **Send**.
3. **Track Action Items**: View extracted tasks on your **Dashboard** task list
   and check newly scheduled events on **Google Calendar**.

| Task                           | Without ExeOS-AI ❌ | With ExeOS-AI ⚡                                  |
| :----------------------------- | :------------------ | :------------------------------------------------ |
| **Reading Emails**             | 45+ minutes         | **1 minute** _(Read AI summaries)_                |
| **Writing Replies**            | 60+ minutes         | **1 minute** _(Review & send pre-written drafts)_ |
| **Task Creation & Scheduling** | 25+ minutes         | **0 minutes** _(100% automated)_                  |

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph User Interface & Auth
        Client[Next.js App Router Client]
        Clerk[Clerk Auth Provider]
        Client <--> Clerk
    end

    subgraph Core Application Server
        API["/api/agents/run Endpoint"]
        Dashboard["Executive Dashboard & Monitoring"]
        AgentEngine["Agent Orchestration Engine (lib/agent.ts)"]
    end

    subgraph External Services & AI Models
        OpenRouter["Vercel AI SDK + OpenRouter (Gemini / Claude / GPT)"]
        Gmail["Google Gmail API"]
        GCal["Google Calendar API"]
    end

    subgraph Storage Layer
        DB[("Neon Serverless PostgreSQL")]
        Drizzle["Drizzle ORM + AES-256 Encryption"]
    end

    Client -->|Trigger Run / View Stats| Dashboard
    Dashboard --> API
    API --> AgentEngine
    AgentEngine -->|Read OAuth Tokens| Drizzle
    Drizzle --> DB
    AgentEngine -->|Scan Inbox / Write Drafts| Gmail
    AgentEngine -->|Analyze & Extract Actions| OpenRouter
    AgentEngine -->|Create Calendar Events| GCal
    AgentEngine -->|Save Run Metrics & Tasks| Drizzle
```

---

## 🛠️ Tech Stack

| Category               | Technology                                                                       | Description                                                |
| :--------------------- | :------------------------------------------------------------------------------- | :--------------------------------------------------------- |
| **Framework**          | [Next.js 16 (App Router)](https://nextjs.org/)                                   | Server Actions, Streaming UI, React Server Components      |
| **Language**           | [TypeScript 5](https://www.typescriptlang.org/)                                  | Full-stack strict type safety                              |
| **UI & Styling**       | [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/) | Dark mode, animations, accessible Radix components         |
| **Runtime**            | [Bun](https://bun.sh/) / Node.js                                                 | Ultra-fast package management and execution                |
| **Authentication**     | [@clerk/nextjs](https://clerk.com/)                                              | Secure authentication, sign-in/up flows & route protection |
| **Database**           | [Neon PostgreSQL](https://neon.tech/)                                            | Serverless cloud PostgreSQL database                       |
| **ORM**                | [Drizzle ORM](https://orm.drizzle.team/)                                         | Type-safe SQL query builder and schema management          |
| **AI Integration**     | Vercel AI SDK (`ai`), `@openrouter/ai-sdk-provider`                              | OpenRouter multi-model LLM integration                     |
| **Google APIs**        | [googleapis](https://github.com/googleapis/google-api-nodejs-client)             | OAuth2, Gmail API & Google Calendar API integration        |
| **Logging & Security** | [Winston](https://github.com/winstonjs/winston), `crypto` AES-256-GCM            | Token encryption, rotating file logger                     |

---

## 📂 Project Structure

```text
exeos-ai/
├── app/
│   ├── (auth)/                 # Clerk Sign-in & Sign-up pages
│   ├── (main)/
│   │   ├── dashboard/          # Main Executive Control Dashboard
│   │   ├── monitoring/         # Live Telemetry & Agent Execution Logs
│   │   ├── settings/           # OAuth Integrations & User Preferences
│   │   └── layout.tsx          # Authenticated App Shell & Sidebar Navigation
│   ├── api/
│   │   ├── agents/run/         # Core Agent Runner Endpoint
│   │   ├── auth/google/        # Google OAuth Integration & Callback
│   │   ├── calendar/events/    # Google Calendar Data Sync Endpoint
│   │   ├── inspect-db/         # Database Health Diagnostics
│   │   ├── setup-db/           # DB Schema Push / Seeding Endpoint
│   │   └── test-ai/            # AI Model Diagnostic Tool
│   ├── layout.tsx              # Root Layout & Theme/Clerk Providers
│   └── page.tsx                # Public Landing Page & Feature Showcase
├── components/
│   ├── animated-theme-toggler.tsx # Smooth Dark/Light Mode Switcher
│   ├── calendar-popup.tsx      # Interactive Calendar Modal Component
│   ├── email-detail.tsx        # Email Processed Card & Action View
│   ├── run-agent-button.tsx    # Manual Trigger Button with Status Feedback
│   ├── sidebar-nav.tsx         # Main Dashboard Navigation Sidebar
│   └── ui/                     # Shadcn UI Design System Primitives
├── db/
│   ├── index.ts                # Neon Database Connection Pool
│   ├── queries.ts              # Database Helper Queries & Mutators
│   └── schema.ts               # Drizzle Schema (Users, Tasks, Integrations, AgentRuns)
├── lib/
│   ├── agent.ts                # Main Execution Workflow Pipeline
│   ├── agents/                 # Gmail, Calendar, & AI Processing Modules
│   ├── encryption.ts           # AES-256-GCM Encryption / Decryption Utilities
│   ├── google-client.ts        # Google OAuth Client Initializer
│   ├── logger/                 # Winston Logger Configuration
│   └── utils.ts                # Class Variance & Formatting Helpers
├── providers/                  # Application Context & Theme Providers
├── proxy.ts                    # Middleware Proxy Helper
├── drizzle.config.ts           # Drizzle ORM Configuration
├── next.config.ts              # Next.js Server & Build Configuration
└── package.json                # Project Dependencies & CLI Scripts
```

---

## ⚡ Getting Started

### Prerequisites

Ensure you have installed:

- [Bun](https://bun.sh/) (Recommended) or [Node.js v20+](https://nodejs.org/)
- A [Neon PostgreSQL](https://neon.tech/) database instance
- A [Clerk](https://clerk.com/) account for authentication
- A [Google Cloud Console](https://console.cloud.google.com/) Project with Gmail
  & Google Calendar APIs enabled
- An [OpenRouter](https://openrouter.ai/) API key for AI generation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/exeos-ai.git
cd exeos-ai
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and populate it with your keys:

```env
# Clerk Auth Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Neon Database Connection
NEXT_PUBLIC_DATABASE_URL=postgres://neondb_owner:...@ep-...neon.tech/neondb?sslmode=require
DATABASE_URL=postgres://neondb_owner:...@ep-...neon.tech/neondb?sslmode=require

# Google Cloud OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
NEXT_PUBLIC_APP_URL=http://localhost:4040

# Security Encryption Key (Minimum 32 Characters)
ENCRYPTION_KEY=your-32-character-secret-encryption-key

# OpenRouter AI Key
OPENROUTER_API_KEY=sk-or-v1-...

# Background Job / CRON Authentication
CRON_SECRET=your-random-cron-secret-hash
```

### 4. Setup Database Schema

Push the Drizzle schema to your Neon PostgreSQL instance:

```bash
bun drizzle-kit push
```

_(Alternatively, hit the `/api/setup-db` route after starting the server to
verify tables)._

### 5. Run Development Server

```bash
bun dev
```

Open [http://localhost:4040](http://localhost:4040) in your browser to launch
**ExeOS-AI**.

---

## ⚙️ Available Scripts

| Script               | Command             | Description                                     |
| :------------------- | :------------------ | :---------------------------------------------- |
| **Development**      | `bun run dev`       | Launches Next.js dev server on port `4040`      |
| **Build**            | `bun run build`     | Builds optimized production bundle              |
| **Production Start** | `bun run start`     | Runs the compiled production application        |
| **Type Check**       | `bun run typecheck` | Runs TypeScript compiler check without emitting |
| **Lint**             | `bun run lint`      | Runs ESLint analysis                            |
| **Format**           | `bun run format`    | Formats codebase using Prettier                 |
| **Clean**            | `bun run clean`     | Deletes `.next` build cache                     |
| **Full Check**       | `bun run check`     | Runs linting and typechecking sequentially      |

---

## 🗄️ Database Schema Overview

ExeOS-AI relies on 4 core tables managed via Drizzle ORM:

```text
┌───────────────────────┐       ┌───────────────────────┐
│        users          │       │     integrations      │
├───────────────────────┤       ├───────────────────────┤
│ id (UUID, PK)         │──┐    │ id (UUID, PK)         │
│ clerk_id (TEXT)       │  │    │ user_id (UUID, FK)    │◄───┐
│ email (TEXT)          │  ├───►│ provider (ENUM)       │    │
│ subscription_status   │  │    │ access_token (AES)    │    │
│ agent_enabled (BOOL)  │  │    │ refresh_token (AES)   │    │
└───────────────────────┘  │    │ expires_at (TIMESTAMP)│    │
                           │    └───────────────────────┘    │
                           │                                 │
                           │    ┌───────────────────────┐    │
                           │    │         tasks         │    │
                           │    ├───────────────────────┤    │
                           ├───►│ id (UUID, PK)         │    │
                           │    │ user_id (UUID, FK)    │────┤
                           │    │ title (TEXT)          │    │
                           │    │ status (ENUM)         │    │
                           │    │ priority (ENUM)       │    │
                           │    │ created_by_agent      │    │
                           │    └───────────────────────┘    │
                           │                                 │
                           │    ┌───────────────────────┐    │
                           │    │      agent_runs       │    │
                           │    ├───────────────────────┤    │
                           └───►│ id (UUID, PK)         │    │
                                │ user_id (UUID, FK)    │────┘
                                │ status (ENUM)         │
                                │ actions_log (JSONB)   │
                                │ emails_processed (INT)│
                                │ tasks_created (INT)   │
                                │ drafts_created (INT)  │
                                └───────────────────────┘
```

---

## 🔒 Security & OAuth Best Practices

1. **Token Cryptography**: All OAuth tokens exchanged during Google
   authorization are encrypted at rest using `AES-256-GCM` with initialization
   vectors (`iv`) before being saved to PostgreSQL.
2. **Clerk Protected Routes**: API endpoints and executive views verify session
   headers before granting data access.
3. **Draft Safety**: ExeOS-AI builds draft responses in Gmail and creates
   calendar invitations, but never sends outward emails directly without
   explicit user intervention.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository.
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`).
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`).
4. **Push** to the branch (`git push origin feature/amazing-feature`).
5. **Open** a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

## 👤 Author

**Rajarshi Chakraborty (Arghya)**

- GitHub: [@therajarshichakraborty](https://github.com/therajarshichakraborty)

<p align="center">
  Crafted with ❤️ for modern professionals, powered by <b>Next.js</b>, <b>Clerk</b>, <b>Drizzle ORM</b>, and <b>OpenRouter AI</b>.
</p>
