# IntelliCode-X

> **AI-native workflow management platform for modern engineering teams.**

IntelliCode-X is a production-ready workflow management system built with
Next.js that combines project management, AI-powered assistance, and
event-driven automation into a single platform. It helps teams plan,
collaborate, automate repetitive tasks, and leverage multiple state-of-the-art
AI models to accelerate software development and operational workflows.

Designed with scalability, performance, and developer experience in mind,
IntelliCode-X uses a modern full-stack architecture powered by Next.js,
TypeScript, Better Auth, Tailwind CSS, Inngest, and multiple AI providers.

---

## ✨ Features

### 🤖 AI-Native Workspace

- Multi-model AI support
- OpenAI integration
- Anthropic Claude integration
- Google Gemini integration
- Context-aware AI conversations
- Intelligent workflow generation
- AI-powered task breakdown
- Code generation & explanation
- Document summarization
- Meeting note generation

### 📋 Workflow Management

- Create and organize workflows
- Kanban boards
- Task management
- Project timelines
- Milestones
- Priority management
- Labels & categories
- Custom workflow statuses
- Team collaboration
- Activity history

### ⚡ Event-Driven Automation

Powered by **Inngest**.

- Background jobs
- Scheduled workflows
- Event processing
- Retry mechanisms
- Async AI pipelines
- Notification workflows
- Automation triggers
- Webhook support

### 👥 Team Collaboration

- Secure authentication
- Organization support
- Member invitations
- Role-based access
- Workspace management
- Comments
- Mentions
- Shared projects
- Audit logs

### 🔐 Authentication & Security

- Better Auth
- OAuth providers
- Session management
- Protected routes
- Secure API endpoints
- CSRF protection
- Environment validation
- Server-side authorization

### 🎨 Modern UI

- Next.js App Router
- Server Components
- Tailwind CSS
- Responsive design
- Dark mode
- Accessible components
- Optimized loading states
- Beautiful animations

### 🚀 Performance

- Streaming UI
- Server Actions
- Edge-ready architecture
- Optimized rendering
- Lazy loading
- Image optimization
- Route caching
- Incremental data fetching

---

# Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

## Backend

- Next.js Server Actions
- Route Handlers
- Better Auth

## AI

- OpenAI
- Anthropic Claude
- Google Gemini

## Background Jobs

- Inngest

## Database

- PostgreSQL

## ORM

- Drizzle ORM

## Validation

- Zod

## State Management

- TanStack Query

## Deployment

- Vercel
- Docker

---

# Project Structure

```text
app/
components/
features/
actions/
lib/
hooks/
providers/
db/
inngest/
types/
public/
styles/
```

---

# Getting Started

## Clone the repository

```bash
git clone https://github.com/yourusername/intellicode-x.git

cd intellicode-x
```

## Install dependencies

```bash
pnpm install
```

## Configure environment variables

Create a `.env` file.

```env
DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

OPENAI_API_KEY=

ANTHROPIC_API_KEY=

GEMINI_API_KEY=

INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

NEXT_PUBLIC_APP_URL=
```

---

## Run the development server

```bash
pnpm dev
```

---

## Start Inngest

```bash
pnpm inngest:dev
```

---

## Build

```bash
pnpm build
```

---

## Production

```bash
pnpm start
```

---

# Architecture

```text
                 Users
                    │
                    ▼
         Next.js App Router
                    │
    ┌───────────────┼────────────────┐
    │               │                │
    ▼               ▼                ▼
Better Auth     Server Actions    API Routes
    │               │                │
    └───────────────┼────────────────┘
                    ▼
             Business Logic
                    │
      ┌─────────────┼─────────────┐
      ▼             ▼             ▼
 Drizzle ORM     Inngest      AI Providers
      │             │             │
      ▼             ▼             ▼
 PostgreSQL   Background Jobs  OpenAI
                              Anthropic
                               Gemini
```

---

# Why IntelliCode-X?

Modern teams increasingly rely on AI to reduce repetitive work, accelerate
delivery, and improve decision-making. IntelliCode-X brings together workflow
management, intelligent assistants, and event-driven automation in one cohesive
platform.

Instead of switching between multiple tools, teams can manage projects, automate
processes, collaborate in real time, and interact with multiple leading AI
models from a unified workspace.

---

# Roadmap

- AI agents
- Multi-workspace support
- Knowledge base
- Vector search
- RAG integration
- Slack integration
- GitHub integration
- Jira synchronization
- Google Workspace integration
- AI workflow templates
- Voice interaction
- Mobile application
- Advanced analytics
- Enterprise SSO
- Fine-grained permissions

---

# Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

---

# License

This project is licensed under the MIT License.

---

# Author

**Rajarshi Chakraborty**

Building AI-powered developer tools, modern SaaS products, and intelligent
workflow automation platforms with Next.js, TypeScript, and Generative AI.

---

<p align="center">
Built with ❤️ using Next.js, TypeScript, Better Auth, Inngest, PostgreSQL, Drizzle ORM, OpenAI, Anthropic, Gemini, and Tailwind CSS.
</p>
