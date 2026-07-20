import { RunAgentButton } from "@/components/run-agent-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getLatestAgentRun,
  getOrCreateUser,
  getUnreadEmails,
  getUserIntegrations,
} from "@/db/queries";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  CheckCircle2Icon,
  CircleIcon,
  ZapIcon,
  Clock,
  Sparkles,
  Inbox,
  FileText,
  ListTodo,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect("/sign-in");
  }
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0].emailAddress ?? "";
  const name = clerkUser?.fullName ?? "";
  const user = await getOrCreateUser(clerkId, email, name);

  const latestRun = await getLatestAgentRun(user.id);

  const userIntegrations = await getUserIntegrations(user.id);
  const gmailConnected = userIntegrations.some(
    (integration) => integration.provider === "gmail",
  );
  const googleCalendarConnected = userIntegrations.some(
    (integration) => integration.provider === "google_calendar",
  );

  const { has } = await auth();
  const isPaidUser = has({ plan: "pro_plan" });

  const onboardingSteps = [
    {
      name: "Connect Gmail Account",
      completed: gmailConnected,
      href: "/settings",
    },
    {
      name: "Connect Google Calendar",
      completed: googleCalendarConnected,
      href: "/settings",
    },
    {
      name: "Subscribe to activate agent",
      completed: isPaidUser,
      href: "/settings",
    },
  ];

  const completedCount = onboardingSteps.filter(
    (step) => step.completed,
  ).length;
  const progressPercent = Math.round(
    (completedCount / onboardingSteps.length) * 100,
  );

  const { emailsProcessed, draftsCreated, tasksCreated } =
    await getUnreadEmails(user.id);

  return (
    <div className='page-wrapper space-y-8'>
      {/* Page Header */}
      <div>
        <h1 className='page-title text-3xl font-extrabold tracking-tight text-foreground'>
          Dashboard
        </h1>
        <p className='page-description text-sm text-muted-foreground mt-1.5'>
          Welcome back, {name || "User"}! Monitor operations and check status
          here.
        </p>
      </div>

      <div className='space-y-6'>
        {/* Onboarding Steps Card */}
        {!user.onboardingCompleted && (
          <Card className='border border-border/80 bg-card overflow-hidden'>
            <CardHeader className='border-b border-border/40 pb-4'>
              <div className='flex items-center gap-2 text-primary'>
                <Sparkles className='h-5 w-5' />
                <CardTitle className='text-lg font-bold text-foreground'>
                  Complete Onboarding Setup
                </CardTitle>
              </div>
              <CardDescription className='text-xs text-muted-foreground mt-1'>
                Configure your integrations to activate the background ExecOS
                agent loop
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-6 space-y-5'>
              <div className='grid sm:grid-cols-3 gap-4'>
                {onboardingSteps.map((step, index) => (
                  <Link key={step.name} href={step.href}>
                    <div className='group border border-border/60 hover:border-foreground/20 hover:bg-muted/30 rounded-xl p-4 flex items-start gap-3 transition-all duration-200 h-full'>
                      {step.completed ? (
                        <CheckCircle2Icon className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                      ) : (
                        <CircleIcon className='h-5 w-5 text-muted-foreground shrink-0 mt-0.5 group-hover:text-foreground' />
                      )}
                      <div className='space-y-1'>
                        <p className='text-xs text-muted-foreground font-semibold'>
                          Step {index + 1}
                        </p>
                        <p
                          className={`text-sm font-semibold text-foreground ${step.completed ? "line-through text-muted-foreground/80 font-normal" : ""}`}
                        >
                          {step.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className='space-y-2.5 pt-2'>
                <div className='flex items-center justify-between text-xs font-semibold text-muted-foreground'>
                  <span>Setup Progress</span>
                  <span>{progressPercent}% Complete</span>
                </div>
                <Progress
                  value={progressPercent}
                  className='h-2 rounded-full bg-muted border border-border'
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats Grid */}
        <div className='grid gap-4 sm:grid-cols-3'>
          {[
            {
              label: "Unread Emails",
              value: emailsProcessed,
              icon: Inbox,
              color: "text-blue-500",
              desc: "Awaiting execution",
            },
            {
              label: "Drafts Created",
              value: draftsCreated,
              icon: FileText,
              color: "text-emerald-500",
              desc: "Stored in Gmail",
            },
            {
              label: "Tasks Extracted",
              value: tasksCreated,
              icon: ListTodo,
              color: "text-purple-500",
              desc: "Saved to system",
            },
          ].map((item) => (
            <Card
              key={item.label}
              className='border border-border/80 bg-card hover:border-foreground/10 hover:shadow-sm transition-all duration-200'
            >
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-semibold text-muted-foreground'>
                  {item.label}
                </CardTitle>
                <item.icon className={`h-4.5 w-4.5 ${item.color}`} />
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-extrabold text-foreground tracking-tight'>
                  {item.value}
                </div>
                <p className='text-[11px] text-muted-foreground mt-1.5 leading-relaxed'>
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Agent Controls Grid */}
        <div className='grid gap-6 md:grid-cols-2'>
          {/* Status Panel */}
          <Card className='border border-border/80 bg-card flex flex-col justify-between'>
            <CardHeader className='border-b border-border/40 pb-4'>
              <div className='flex items-center gap-2'>
                <div className='h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary'>
                  <ZapIcon className='h-4.5 w-4.5 fill-primary/20' />
                </div>
                <div>
                  <CardTitle className='text-base font-bold text-foreground'>
                    Agent Configuration
                  </CardTitle>
                  <CardDescription className='text-xs text-muted-foreground mt-0.5'>
                    Control execution loops and credentials
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='pt-6 flex-1 flex flex-col justify-between gap-6'>
              <div className='space-y-3.5'>
                <div className='flex justify-between items-center py-1 border-b border-border/40'>
                  <span className='text-xs text-muted-foreground font-medium'>
                    Subscription status
                  </span>
                  <Badge
                    variant={isPaidUser ? "default" : "secondary"}
                    className={`text-[10px] font-bold ${isPaidUser ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none" : ""}`}
                  >
                    {isPaidUser ? "ACTIVE PRO" : "FREE TRIAL"}
                  </Badge>
                </div>
                <div className='flex justify-between items-center py-1 border-b border-border/40'>
                  <span className='text-xs text-muted-foreground font-medium'>
                    Gmail OAuth Connection
                  </span>
                  <Badge
                    variant='secondary'
                    className={`text-[10px] font-bold ${gmailConnected ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-none" : ""}`}
                  >
                    {gmailConnected ? "CONNECTED" : "DISCONNECTED"}
                  </Badge>
                </div>
                <div className='flex justify-between items-center py-1 border-b border-border/40'>
                  <span className='text-xs text-muted-foreground font-medium'>
                    Calendar Connection
                  </span>
                  <Badge
                    variant='secondary'
                    className={`text-[10px] font-bold ${googleCalendarConnected ? "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-none" : ""}`}
                  >
                    {googleCalendarConnected ? "CONNECTED" : "DISCONNECTED"}
                  </Badge>
                </div>
              </div>
              <div className='pt-2'>
                <RunAgentButton />
              </div>
            </CardContent>
          </Card>

          {/* Last Run Detail */}
          <Card className='border border-border/80 bg-card'>
            <CardHeader className='border-b border-border/40 pb-4'>
              <div className='flex items-center gap-2'>
                <div className='h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground'>
                  <Clock className='h-4.5 w-4.5' />
                </div>
                <div>
                  <CardTitle className='text-base font-bold text-foreground'>
                    Last Execution Logs
                  </CardTitle>
                  <CardDescription className='text-xs text-muted-foreground mt-0.5'>
                    Summary of the most recent worker task
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='pt-6 space-y-4'>
              <div className='space-y-3.5'>
                <div className='flex items-start gap-4'>
                  <span className='text-xs text-muted-foreground font-medium w-20 shrink-0'>
                    Started At
                  </span>
                  <span className='text-xs text-foreground font-semibold'>
                    {latestRun?.startedAt
                      ? new Date(latestRun.startedAt).toLocaleString()
                      : "No run history available"}
                  </span>
                </div>
                <div className='flex items-center gap-4'>
                  <span className='text-xs text-muted-foreground font-medium w-20 shrink-0'>
                    Run status
                  </span>
                  {latestRun ? (
                    <Badge
                      variant={
                        latestRun.status === "success"
                          ? "default"
                          : "destructive"
                      }
                      className={`text-[10px] font-bold uppercase ${latestRun.status === "success" ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none" : ""}`}
                    >
                      {latestRun.status}
                    </Badge>
                  ) : (
                    <span className='text-xs text-muted-foreground font-medium'>
                      N/A
                    </span>
                  )}
                </div>
                <div className='flex items-start gap-4 border-t border-border/40 pt-4 mt-2'>
                  <span className='text-xs text-muted-foreground font-medium w-20 shrink-0'>
                    Log Summary
                  </span>
                  <div className='text-xs text-muted-foreground leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap pr-2'>
                    {latestRun?.summary ||
                      "No run activities recorded yet. Complete onboarding and connect credentials to trigger the agent."}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
