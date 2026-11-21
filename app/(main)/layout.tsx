import { Suspense } from "react";
import { AppShell } from "@/components/app/shell";
import { AppSidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { getInbox, getSessionUser } from "@/lib/inbox";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isPro, name, email } = await getSessionUser();
  const { counts, emails } = await getInbox(user.id);

  const byCategory = new Map<string, number>();
  for (const e of emails) {
    if (e.category) byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + 1);
  }
  const categories = [...byCategory.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({ key, count }));

  return (
    <Suspense>
      <AppShell
        sidebar={
          <AppSidebar
            counts={counts}
            categories={categories}
            name={name}
            email={email}
          />
        }
      >
        <Topbar isPro={isPro} />
        <main className='thin-scrollbar min-w-0 flex-1'>{children}</main>
      </AppShell>
    </Suspense>
  );
}
