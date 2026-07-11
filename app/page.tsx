import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PricingTable,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { AnimatedThemeToggler } from "@/components/animated-theme-toggler";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Inbox,
  ListTodo,
  Lock,
  Mail,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="landing-wrapper min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden pt-6">
      {/* Premium Floating Capsule Navbar */}
      <div className="fixed top-4 left-0 right-0 z-20 flex justify-center w-full px-4">
        <header className="w-full max-w-5xl border border-border/40 bg-background/60 backdrop-blur-md rounded-2xl shadow-lg px-6 py-1.5 transition-all duration-200 hover:border-foreground/10">
          <div className="flex h-12 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-sm transition-transform group-hover:scale-105">
                  E
                </div>
                <span className="logo-text text-sm font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  ExecOS
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
                <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
              </nav>
            </div>
            
            <div className="nav-actions flex items-center gap-3">
              <Show when="signed-in">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-1 h-9 px-3.5 text-xs font-bold uppercase">
                    Dashboard <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <div className="h-8 w-8 flex items-center justify-center">
                  {/* @ts-ignore */}
                  <UserButton afterSignOutUrl="/" />
                </div>
              </Show>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="text-xs font-bold uppercase h-9 px-3.5">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm" className="text-xs font-bold uppercase h-9 px-3.5 shadow-sm">
                    Get Started
                  </Button>
                </SignUpButton>
              </Show>
              <div className="border-l border-border h-5 mx-0.5 hidden sm:block" />
              <AnimatedThemeToggler className="p-2 rounded-full border border-border hover:bg-muted text-foreground transition-all duration-200 shrink-0 [&_svg]:size-3.5 h-8.5 w-8.5 flex items-center justify-center" />
            </div>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/60 text-[10px] font-bold uppercase tracking-wider text-foreground mb-5 shadow-sm">
            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
            <span>ExecOS v1.0 is live</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05] mb-5">
            Your Autonomous <br />
            <span className="bg-gradient-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
              Executive Assistant
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed mb-6">
            ExecOS runs in the background to analyze your inbox, categorize key priority items, auto-draft replies, and dynamically block your Google Calendar.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto mb-10">
            <Show when="signed-in">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto text-sm font-semibold uppercase tracking-wider gap-2 h-11 px-6 shadow-md shadow-primary/10">
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Show>
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <Button size="lg" className="w-full sm:w-auto text-sm font-semibold uppercase tracking-wider gap-2 h-11 px-6 shadow-md shadow-primary/10">
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Button>
              </SignUpButton>
            </Show>
            <a href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm font-semibold uppercase tracking-wider h-11 px-6">
                See How It Works
              </Button>
            </a>
          </div>
        </div>

        {/* Interactive Product Preview Mockup */}
        <div className="max-w-4xl mx-auto border border-border/80 rounded-2xl bg-card/50 shadow-2xl p-1.5 backdrop-blur-sm relative overflow-hidden group">
          <div className="flex items-center justify-between border-b border-border/60 pb-2 px-3 mb-2 text-[10px] text-muted-foreground font-mono">
            <div className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            </div>
            <span>execos-monitoring-tab.tsx</span>
            <div className="w-10" />
          </div>

          <div className="grid md:grid-cols-[200px_1fr] border border-border/40 rounded-lg overflow-hidden bg-background">
            {/* Sidebar Mockup */}
            <div className="border-r border-border/40 bg-muted/20 p-3 space-y-3 hidden md:block">
              <div className="space-y-1.5">
                <div className="h-2.5 w-16 rounded bg-muted-foreground/20" />
                <div className="h-7 rounded bg-primary/10 border border-primary/20 flex items-center px-2.5 gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <div className="h-2 w-12 rounded bg-primary/20" />
                </div>
                <div className="h-7 rounded flex items-center px-2.5 gap-2 opacity-50">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  <div className="h-2 w-16 rounded bg-muted-foreground/30" />
                </div>
              </div>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-3 w-24 rounded bg-foreground/10" />
                  <div className="h-2.5 w-36 rounded bg-muted-foreground/10" />
                </div>
                <div className="h-6 w-20 rounded-full bg-destructive/10 border border-destructive/20" />
              </div>

              {/* Email details card */}
              <div className="border border-border/80 rounded-xl p-3.5 space-y-3.5 bg-muted/10">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="h-3.5 w-36 rounded bg-foreground/15 font-semibold" />
                      <div className="h-4.5 w-14 rounded-full bg-destructive/10 text-destructive text-[9px] flex items-center justify-center font-bold">Blocked</div>
                    </div>
                    <div className="h-2.5 w-24 rounded bg-muted-foreground/20" />
                  </div>
                  <div className="h-3.5 w-16 rounded bg-muted-foreground/20" />
                </div>
                
                <div className="border-t border-border/60 pt-3 grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <div className="h-3 w-20 rounded bg-foreground/15" />
                    <div className="p-2 rounded-lg bg-muted/30 border border-border/40 space-y-1">
                      <div className="h-2 w-full rounded bg-muted-foreground/20" />
                      <div className="h-2 w-5/6 rounded bg-muted-foreground/20" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3 w-20 rounded bg-foreground/15" />
                    <div className="p-2 rounded-lg bg-primary/5 border border-primary/10 space-y-1">
                      <div className="h-2 w-full rounded bg-primary/20" />
                      <div className="h-2 w-4/5 rounded bg-primary/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-8 border-y border-border/40 bg-muted/10 relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-4">
            Designed for secure executive workflows
          </p>
          <div className="flex justify-center items-center gap-12 opacity-50 max-w-4xl mx-auto flex-wrap">
            <span className="text-sm font-black tracking-widest text-foreground font-mono">STRIPE</span>
            <span className="text-sm font-black tracking-widest text-foreground font-mono">VERCEL</span>
            <span className="text-sm font-black tracking-widest text-foreground font-mono">LINEAR</span>
            <span className="text-sm font-black tracking-widest text-foreground font-mono">NOTION</span>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            Handcrafted for Inbox Efficiency
          </h2>
          <p className="text-muted-foreground text-sm">
            Stop managing your assistant and let ExecOS handle email classification and scheduling background tasks seamlessly.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Inbox,
              title: "Autonomous Email Loop",
              description:
                "ExecOS fetches and processes unread messages sequentially. It marks them read and caches snippet logs automatically.",
            },
            {
              icon: ListTodo,
              title: "Smart Action Extraction",
              description:
                "Reads context, extracts actionable items, and generates task entries complete with due dates directly inside the system.",
            },
            {
              icon: Calendar,
              title: "Dynamic Calendar Blocks",
              description:
                "Detects schedules and meetings mentioned in text, highlights conflict slots in red, and creates Google Calendar events.",
            },
          ].map((feature, idx) => (
            <Card key={idx} className="p-5 border border-border/80 bg-card hover:border-foreground/20 hover:-translate-y-0.5 transition-all duration-300">
              <CardHeader className="p-0 mb-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <feature.icon className="h-4.5 w-4.5" />
                </div>
                <CardTitle className="text-lg font-bold">{feature.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed text-muted-foreground mt-1">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="py-12 border-t border-border/40 bg-muted/10 relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2">Integrates with your tools</h2>
            <p className="text-muted-foreground text-xs">Secure Google OAuth connectors provide quick read-write bindings for calendar and mail APIs.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 max-w-md mx-auto">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-border bg-card shadow-sm">
              <Mail className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Gmail Connect</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-border bg-card shadow-sm">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Google Calendar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full border-t border-border/40">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-sm">
            Choose the plan that suits your executive workflow. Toggle configurations inside your user account settings anytime.
          </p>
        </div>
        <div className="max-w-4xl mx-auto rounded-2xl border border-zinc-800 bg-zinc-950/90 p-5 md:p-8 shadow-2xl backdrop-blur-sm">
          <PricingTable />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-14 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full border-t border-border/40">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-sm font-medium">Answers to common operational and privacy questions.</p>
        </div>
        {/* @ts-ignore */}
        <Accordion type="single" collapsible className="w-full">
          {[
            {
              q: "How does ExecOS access my email?",
              a: "ExecOS uses secure Google OAuth protocol to obtain temporary permission tokens specifically limited to reading and drafting emails. We never store your Google password.",
            },
            {
              q: "Does it process emails automatically?",
              a: "Yes! Once you subscribe, the autonomous worker runs automatically in the background to fetch unread emails, check tasks, and update schedules.",
            },
            {
              q: "Is there a limit on how many emails are processed?",
              a: "Yes, to prevent API rate limits, the agent fetches the latest 20 unread emails, processes the top 5 with AI analysis, and marks the remaining 15 read as simple informational logs.",
            },
          ].map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-border">
              <AccordionTrigger className="text-left font-semibold text-sm py-4">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-xs leading-relaxed pb-4">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="footer-wrapper relative border-t border-border bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3 md:col-span-2">
              <span className="logo-text text-base font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                ExecOS
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                ExecOS is an enterprise-grade AI operations platform built to automate scheduling, categorizing, and drafting workflows securely.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Product</h3>
              <ul className="space-y-2 text-xs text-muted-foreground font-medium">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Pricing Table</a></li>
                <li><a href="#faq" className="hover:text-foreground">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Security</h3>
              <ul className="space-y-2 text-xs text-muted-foreground font-mono">
                <li className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /> WCAG AA</li>
                <li className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-primary" /> OAuth 2.0</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} ExecOS-AI. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition-colors">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
