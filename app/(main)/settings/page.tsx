import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOrCreateUser, getUserIntegrations } from "@/db/queries";
import { auth, currentUser } from "@clerk/nextjs/server";
import { CalendarIcon, MailIcon, CheckCircle2, ChevronRight, Settings } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect("/sign-in");
  }
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0].emailAddress ?? "";
  const name = clerkUser?.fullName ?? "";
  const user = await getOrCreateUser(clerkId, email, name);

  const userIntegrations = await getUserIntegrations(user.id);
  const gmailIntegration = userIntegrations.find(
    (integration) => integration.provider === "gmail",
  );
  const googleCalendarIntegration = userIntegrations.find(
    (integration) => integration.provider === "google_calendar",
  );

  const providers = [
    {
      key: "gmail",
      name: "Gmail Connector",
      description: "Allows the background ExecOS agent to fetch unread emails and create template drafts.",
      icon: MailIcon,
      integration: gmailIntegration,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      key: "google_calendar",
      name: "Google Calendar",
      description: "Allows ExecOS to inspect busy slots and insert confirmed meeting events.",
      icon: CalendarIcon,
      integration: googleCalendarIntegration,
      color: "text-purple-500 bg-purple-500/10",
    },
  ];

  return (
    <div className="page-wrapper space-y-8">
      {/* Header Container */}
      <div className="border-b border-border/40 pb-5">
        <h1 className="page-title text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary" /> Settings
        </h1>
        <p className="page-description text-sm text-muted-foreground mt-1.5">
          Configure API integrations, Google authentication, and agent properties.
        </p>
      </div>

      {/* Integration Connections Panel */}
      <Card className="border border-border/80 bg-card overflow-hidden">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle className="text-base font-bold text-foreground">Google Workspace Connectors</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Connect your accounts securely via Google OAuth to enable executive automation capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {providers.map((provider) => (
              <div
                key={provider.key}
                className="border border-border/60 rounded-2xl p-5 flex flex-col justify-between gap-5 bg-muted/10 hover:border-foreground/10 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${provider.color}`}>
                      <provider.icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="font-bold text-sm text-foreground">{provider.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{provider.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-border/40 pt-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground font-medium">Status</span>
                  </div>
                  
                  {provider.integration ? (
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none font-bold text-[10px] uppercase py-0.5 px-2 gap-1 select-none">
                      <CheckCircle2 className="h-3 w-3" />
                      Connected
                    </Badge>
                  ) : (
                    <Link href={`/api/auth/google?provider=${provider.key}`}>
                      <Button size="sm" className="text-xs font-semibold gap-1 select-none">
                        Connect <ChevronRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
