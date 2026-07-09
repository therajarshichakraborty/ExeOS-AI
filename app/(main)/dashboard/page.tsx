//import { RunAgentButton } from "@/components/agents/run-agent-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
// import {
//   getLatestAgentRun,
//   getOrCreateUser,
//   getUnreadEmails,
//   getUserIntegrations,
// } from "@/db/queries";
import { auth, currentUser } from "@clerk/nextjs/server";
import { BadgeIcon, CheckCircle2Icon, CircleIcon, ZapIcon } from "lucide-react";
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
  //const user = await getOrCreateUser(clerkId, email, name);

  //const latestRun = await getLatestAgentRun(user.id);

  // const userIntegrations = await getUserIntegrations(user.id);
  // const gmailConnected = userIntegrations.some(
  //   (integration) => integration.provider === "gmail",
  // );
  // const googleCalendarConnected = userIntegrations.some(
  //   (integration) => integration.provider === "google_calendar",
  // );

  const { has } = await auth();
  const isPaidUser = has({ plan: "pro_plan" });

  const onboardingSteps = [
    {
      name: "Connect Gmail",
      //completed: gmailConnected,
      href: "/settings",
    },
    {
      name: "Connect Google Calendar",
      //completed: googleCalendarConnected,
      href: "/settings",
    },
    {
      name: "Subscribe to activate agent",
      //completed: isPaidUser,
      href: "/settings",
    },
  ];

  // const completedCount = onboardingSteps.filter(
  //   (step) => step.completed,
  // ).length;
  // const progressPercent = Math.round(
  //   (completedCount / onboardingSteps.length) * 100,
  // );

  // const { emailsProcessed, draftsCreated, tasksCreated } =
  //   await getUnreadEmails(user.id);
  // const pendingTasks = await getPendingTasks(user.id);
  // const emailDrafts = await getEmailDrafts(user.id);

  return (
    <div className='page-wrapper'>
      <div>
        <h1 className='page-title'>Dashboard</h1>
        <p className='page-description'>
          Welcome back! Here's what's happening with your AI Agents.
        </p>
      </div>

      <div className='space-y-4'>
       
        <div className='stats-grid-2'>
          <Card>
            <CardHeader>
              <CardTitle className='card-title-with-icon'>
                <ZapIcon className='sidebar-icon' />
                Agent Status
              </CardTitle>

              <CardDescription>
                Subscribe to activate the autonomous agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='card-content-stack'>
                <div className='status-row'>
                  <span className='status-label'>Status</span>
                  <Badge variant='default' className='bg-primary'>
                    Ready
                  </Badge>
                </div>
                <div className='status-row'>
                  <span className='status-label'>Gmail</span>
                  <span className='status-value'>Connected</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Last Agent Run</CardTitle>
              <CardDescription>
                
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className='card-content-stack-sm'>
                {[
                  {
                    label: "Time",
                   
                  },
                  {
                    label: "Status",
                   
                  },
                  {
                    label: "Summary",
                   
                  },
                ]?.map((item) => (
                  <div key={item.label} className='status-row gap-4 flex'>
                    <span className='status-label'>{item.label}</span>
                    <span className='status-value'></span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Quick Stats */}
        <div className='stats-grid-3'>
          {[
            { label: "Unread Emails" },
            { label: "Drafts Created"},
            { label: "Tasks Created"},
          ].map((item) => (
            <Card key={item.label}>
              <CardHeader className='stat-card-header'>
                <CardTitle className='stat-card-title'>{item.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='stat-value'></div>
                <p className='stat-card-subtitle'>
                  
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
