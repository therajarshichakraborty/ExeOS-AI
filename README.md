<div align="center">

# ExeOS

**The calm inbox that runs itself.**

ExeOS reads your Gmail, ranks every unread email by priority, drafts the replies,
puts deadlines on your Google Calendar and notifies you only when something truly matters.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![OpenAI Agents SDK](https://img.shields.io/badge/OpenAI-Agents_SDK-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.github.io/openai-agents-js/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)](https://clerk.com/)
[![Bun](https://img.shields.io/badge/Runtime-Bun-000000?style=flat-square&logo=bun)](https://bun.sh/)

<br />

<img src="docs/screenshots/landing.png" alt="ExeOS landing page" width="100%" />

</div>

---

## Table of contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [How it works](#how-it-works)
- [AI agents](#ai-agents)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Routes and API](#routes-and-api)
- [Data model](#data-model)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Author](#author)

---

## Overview

Most inboxes are sorted by time. ExeOS sorts yours by importance.

ExeOS pairs the Gmail layout you already know with a small team of AI agents. On every run it:

1. Fetches unread mail from your Gmail inbox (last 7 days).
2. Classifies each email by priority (high, medium, low) and category, with a one line summary.
3. Drafts short, careful replies for the emails that need one and saves them as threaded Gmail drafts.
4. Extracts action items into tasks and puts dated events and deadlines on Google Calendar, skipping anything already scheduled.
5. Sends a push notification for the few emails that are actually urgent.

Every run is recorded, so you can always see what was processed, drafted and scheduled.

---

## Screenshots

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/features.png" alt="Features page with the inbox preview" /></td>
    <td width="50%"><img src="docs/screenshots/pricing.png" alt="Pricing page" /></td>
  </tr>
  <tr>
    <td align="center"><b>Features</b>: Gmail style priority inbox with agent status</td>
    <td align="center"><b>Pricing</b>: Free, Pro and Team plans</td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/security.png" alt="Security page" /></td>
    <td width="50%"><img src="docs/screenshots/signin.png" alt="Sign in page" /></td>
  </tr>
  <tr>
    <td align="center"><b>Security</b>: how ExeOS treats your data</td>
    <td align="center"><b>Sign in</b>: Clerk authentication with Google</td>
  </tr>
</table>

---

## Features

### Priority inbox

- Every unread email is ranked **high**, **medium** or **low**, with a one line summary.
- Smart views: high priority, needs reply, drafts, scheduled, plus filters by category and full text search.
- A reading pane with the original email, the AI summary, extracted tasks and calendar events side by side.

### Replies, already drafted

- Suggested replies are saved as **threaded Gmail drafts** (`In-Reply-To` and `References` headers set correctly).
- Edit and send from ExeOS or from Gmail. Both edit the same draft, so the text never diverges.
- Nothing is sent without you pressing send.

### Calendar on autopilot

- Deadlines, meetings and time sensitive requests become Google Calendar events.
- Relative dates such as "by Friday" are resolved to real dates.
- Events that already exist on your calendar are detected and not duplicated.

### Alerts that earn it

- The notifier agent writes short push notifications for the urgent few (at most 5 per run).
- Receipts, newsletters and promotions never interrupt you.
- In-app notification bell plus native browser notifications once permission is granted.

### Activity and run history

- Each agent run stores emails processed, tasks created, drafts created, duration, status and a per email action log.
- Failures are isolated per email, so one bad message never breaks a whole run.

### Works without an API key

- If `OPENAI_API_KEY` is missing or a model call fails, a zero token heuristic triage takes over, so the app keeps working.

---

## How it works

```mermaid
flowchart LR
    U[User or cron] -->|POST /api/agents/run| R[Run orchestrator<br/>lib/agent.ts]
    R -->|OAuth tokens, decrypted| DB[(PostgreSQL<br/>Drizzle ORM)]
    R -->|Unread inbox mail| G[Gmail API]
    R --> P[Agent pipeline<br/>agents/pipeline.ts]
    P --> C[Classifier]
    C --> S[Reply suggester]
    C --> N[Notifier]
    S -->|Threaded drafts| G
    R -->|New events| CAL[Google Calendar API]
    R -->|Tasks, run log, notifications| DB
    DB --> UI[Inbox, Activity, Notifications UI]
```

A run is triggered either by a signed in user from the app, or by a scheduler calling the same endpoint with `Authorization: Bearer $CRON_SECRET`, which runs the agent for every user who has it enabled.

---

## AI agents

The agents live in [`agents/`](agents) and are built on the [OpenAI Agents SDK](https://openai.github.io/openai-agents-js/). A run makes **at most three model calls**, no matter how many emails it processes.

| Agent           | File                                                     | Default model  | Input                                                   | Output                                                         |
| :-------------- | :------------------------------------------------------- | :------------- | :------------------------------------------------------ | :------------------------------------------------------------- |
| Classifier      | [`agents/classifier.ts`](agents/classifier.ts)           | `gpt-4.1-nano` | Up to 15 unread emails, 450 character excerpts, batched | Priority, category, summary, reply flag, action items, events  |
| Reply suggester | [`agents/reply-suggester.ts`](agents/reply-suggester.ts) | `gpt-4.1-mini` | Only emails flagged as needing a reply (up to 5)        | Short drafts (about 80 words) saved as Gmail drafts            |
| Notifier        | [`agents/notifier.ts`](agents/notifier.ts)               | `gpt-4.1-nano` | Only high and medium priority summaries                 | Short push notification title and body (up to 5)               |

[`agents/pipeline.ts`](agents/pipeline.ts) runs them in order and [`agents/fallback.ts`](agents/fallback.ts) provides the heuristic triage used when no model is available.

**Keeping token use low**

- Bulk mail (no-reply senders, newsletters, promotions) is triaged locally and never reaches the model.
- Input is clipped and whitespace collapsed; output is short keyed JSON with `maxTokens` caps.
- SDK tracing is disabled for production runs.

All limits are tunable in [`agents/config.ts`](agents/config.ts), and each model can be overridden with an environment variable.

---

## Tech stack

| Layer          | Technology                                                                                   |
| :------------- | :------------------------------------------------------------------------------------------- |
| Framework      | [Next.js 16](https://nextjs.org/) App Router, React Server Components, React 19              |
| Language       | [TypeScript 5](https://www.typescriptlang.org/) in strict mode                               |
| UI             | [Tailwind CSS 4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), Base UI, Lucide icons, Sonner |
| AI             | [OpenAI Agents SDK](https://openai.github.io/openai-agents-js/) with Zod structured output   |
| Auth           | [Clerk](https://clerk.com/) for sign in, sessions and plan gating                            |
| Database       | PostgreSQL ([Neon](https://neon.tech/) recommended) with [Drizzle ORM](https://orm.drizzle.team/) |
| Google APIs    | [`googleapis`](https://github.com/googleapis/google-api-nodejs-client) for OAuth 2.0, Gmail and Calendar |
| Security       | AES-256-GCM token encryption with Node `crypto`                                              |
| Tooling        | Bun, ESLint, Prettier, Husky, lint-staged, Commitlint (Conventional Commits)                 |

---

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) 1.1 or newer (Node.js 20 or newer also works)
- A PostgreSQL database, for example a free [Neon](https://neon.tech/) project
- A [Clerk](https://clerk.com/) application
- A [Google Cloud](https://console.cloud.google.com/) project with the **Gmail API** and **Google Calendar API** enabled
- An [OpenAI](https://platform.openai.com/) API key (optional, the heuristic fallback runs without it)

### 1. Clone and install

```bash
git clone https://github.com/therajarshichakraborty/ExeOS-AI.git
cd ExeOS-AI
bun install
```

### 2. Configure Google OAuth

In Google Cloud Console, create an **OAuth client ID** of type *Web application* and add this authorized redirect URI:

```
http://localhost:4040/api/auth/google/callback
```

Add your own Google account as a test user on the OAuth consent screen while the app is in testing mode.

### 3. Set environment variables

Create a `.env` file in the project root. See [Environment variables](#environment-variables) for the full list.

### 4. Create the database schema

```bash
bunx drizzle-kit push
```

### 5. Run the app

```bash
bun run dev
```

Open [http://localhost:4040](http://localhost:4040), sign in, then go to **Settings** and connect Gmail and Google Calendar. Press **Run** to trigger your first triage.

---

## Environment variables

| Variable                            | Required | Description                                                               |
| :---------------------------------- | :------: | :------------------------------------------------------------------------ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` |   Yes    | Clerk publishable key                                                     |
| `CLERK_SECRET_KEY`                  |   Yes    | Clerk secret key                                                          |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`     |   Yes    | Sign in route, usually `/sign-in`                                         |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`     |   Yes    | Sign up route, usually `/sign-up`                                         |
| `NEXT_PUBLIC_DATABASE_URL`          |   Yes    | PostgreSQL connection string (used by the app and by Drizzle Kit)         |
| `GOOGLE_CLIENT_ID`                  |   Yes    | Google OAuth client ID                                                    |
| `GOOGLE_CLIENT_SECRET`              |   Yes    | Google OAuth client secret                                                |
| `NEXT_PUBLIC_APP_URL`               |   Yes    | Public base URL, for example `http://localhost:4040`                      |
| `ENCRYPTION_KEY`                    |   Yes    | Secret used to derive the AES-256-GCM key for OAuth tokens (32+ characters) |
| `CRON_SECRET`                       |   Yes    | Bearer token that authorizes scheduled agent runs                         |
| `OPENAI_API_KEY`                    |    No    | Enables the AI agents; without it the heuristic triage is used            |
| `OPENAI_CLASSIFIER_MODEL`           |    No    | Overrides the classifier model (default `gpt-4.1-nano`)                   |
| `OPENAI_REPLY_MODEL`                |    No    | Overrides the reply model (default `gpt-4.1-mini`)                        |
| `OPENAI_NOTIFIER_MODEL`             |    No    | Overrides the notifier model (default `gpt-4.1-nano`)                     |

Example:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_DATABASE_URL=postgresql://user:password@host/db?sslmode=require

GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
NEXT_PUBLIC_APP_URL=http://localhost:4040

ENCRYPTION_KEY=replace-with-a-long-random-string
CRON_SECRET=replace-with-another-long-random-string

OPENAI_API_KEY=sk-xxx
```

Generate strong secrets with `openssl rand -hex 32`. Never commit `.env`.

---

## Scripts

| Command                 | Description                                     |
| :---------------------- | :---------------------------------------------- |
| `bun run dev`           | Start the development server on port 4040       |
| `bun run build`         | Create an optimized production build            |
| `bun run start`         | Serve the production build                      |
| `bun run lint`          | Run ESLint                                      |
| `bun run typecheck`     | Type check the project with `tsc --noEmit`      |
| `bun run check`         | Lint and type check in one step                 |
| `bun run format`        | Format the codebase with Prettier               |
| `bun run format:check`  | Verify formatting without writing changes       |
| `bun run clean`         | Remove the `.next` build cache                  |

---

## Project structure

```text
.
├── agents/                 AI agents: classifier, reply suggester, notifier, pipeline, fallback, config
├── app/
│   ├── (marketing)/        Public site: landing, features, pricing, about, security
│   ├── (auth)/             Clerk sign in and sign up
│   ├── (main)/             Signed in app: dashboard (inbox), monitoring (activity), settings
│   └── api/                Agent runs, Google OAuth, replies, notifications, calendar, setup
├── components/
│   ├── app/                App shell: sidebar, top bar, email reader, reply composer, notification bell
│   ├── marketing/          Landing page sections
│   ├── motion/             Scroll reveal, count up and ambient animations
│   └── ui/                 shadcn/ui primitives
├── db/                     Drizzle schema and queries
├── docs/screenshots/       Images used in this README
├── lib/
│   ├── agent.ts            Run orchestration: Gmail, agents, drafts, events, notifications
│   ├── google/             OAuth, authenticated clients, Gmail and Calendar helpers
│   ├── inbox.ts            Inbox queries and session helpers
│   └── encryption.ts       AES-256-GCM encrypt and decrypt
├── providers/              Theme provider
├── proxy.ts                Clerk middleware and public route matcher
└── drizzle.config.ts       Drizzle Kit configuration
```

---

## Routes and API

### Pages

| Route          | Access  | Description                                                                                   |
| :------------- | :------ | :-------------------------------------------------------------------------------------------- |
| `/`            | Public  | Landing page                                                                                  |
| `/features`    | Public  | Product features                                                                              |
| `/pricing`     | Public  | Plans                                                                                         |
| `/about`       | Public  | About ExeOS                                                                                   |
| `/security`    | Public  | Data handling and security                                                                    |
| `/dashboard`   | Signed in | Priority inbox. Supports `?p=high\|medium\|low`, `?view=high\|reply\|drafts\|scheduled`, `?cat=`, `?q=`, `?id=` |
| `/monitoring`  | Signed in | Activity and run history                                                                    |
| `/settings`    | Signed in | Google connections and agent settings                                                       |

### API

| Method     | Endpoint                          | Description                                                                 |
| :--------- | :-------------------------------- | :-------------------------------------------------------------------------- |
| `POST`     | `/api/agents/run`                 | Run the agent for the signed in user, or for all enabled users with `CRON_SECRET` |
| `GET`      | `/api/auth/google`                | Start the Google OAuth flow for Gmail or Calendar                           |
| `GET`      | `/api/auth/google/callback`       | OAuth callback; stores encrypted tokens                                     |
| `POST`     | `/api/emails/:emailId/reply`      | Save (`mode: "draft"`) or send (`mode: "send"`) the reply for an email      |
| `GET`      | `/api/calendar/events`            | Upcoming Google Calendar events                                             |
| `GET POST` | `/api/notifications`              | List notifications and mark them as read                                    |
| `GET`      | `/api/setup-db`                   | Create missing tables (for example `notifications`) on first use            |

### Scheduled runs

Point any scheduler (Vercel Cron, GitHub Actions, a server cron job) at the run endpoint:

```bash
curl -X POST "$NEXT_PUBLIC_APP_URL/api/agents/run" \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## Data model

Defined in [`db/schema.ts`](db/schema.ts) with Drizzle ORM.

| Table           | Purpose                                                                                       |
| :-------------- | :-------------------------------------------------------------------------------------------- |
| `users`         | Clerk linked users, subscription status and whether the agent is enabled                      |
| `integrations`  | Google connections per provider (`gmail`, `google_calendar`) with encrypted access and refresh tokens |
| `tasks`         | Action items with status, priority, due date and whether the agent created them               |
| `agent_runs`    | One row per run: status, counts, duration, summary, error and a JSONB per email action log    |
| `notifications` | Push notifications produced by the notifier agent                                             |

---

## Security

- **Encrypted tokens.** Google access and refresh tokens are encrypted with AES-256-GCM (random IV and auth tag per value) before they are written to the database.
- **Least privilege scopes.** Gmail `readonly`, `modify` and `compose`, plus Calendar `readonly` and `events`. ExeOS cannot delete your account data.
- **You stay in control.** Replies are saved as drafts and are only sent when you choose to send them.
- **Minimal model exposure.** Agents receive clipped excerpts, not full mailboxes, and bulk mail is handled locally.
- **Protected routes.** All app pages and APIs require a Clerk session, except the public marketing pages and the OAuth callback. Scheduled runs require the `CRON_SECRET` bearer token.
- **Auditable.** Every run is logged and visible on the Activity page.

If you discover a vulnerability, please open a private security advisory on GitHub instead of a public issue.

---

## Deployment

### Vercel

1. Import the repository in Vercel.
2. Add every variable from [Environment variables](#environment-variables), with `NEXT_PUBLIC_APP_URL` set to your production URL.
3. Add `https://your-domain/api/auth/google/callback` as an authorized redirect URI in Google Cloud.
4. Add a cron job that calls `POST /api/agents/run` with the `CRON_SECRET` bearer token.

### Docker

A multi stage [`DockerFile`](DockerFile) based on `oven/bun` is included:

```bash
docker build -f DockerFile -t exeos .
docker run --env-file .env -p 3000:3000 exeos
```

---

## Contributing

Contributions are welcome.

1. Fork the repository and create a branch: `git checkout -b feat/short-description`.
2. Make your changes and run `bun run check`.
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/), for example `feat(inbox): add snooze`. Commit messages are checked by Commitlint.
4. Push and open a pull request against `main`.

---

## Author

**Rajarshi Chakraborty (Arghya)**

GitHub: [@therajarshichakraborty](https://github.com/therajarshichakraborty)
