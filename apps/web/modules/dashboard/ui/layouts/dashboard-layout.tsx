import { cookies } from "next/headers";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";

import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard";

import { DashboardSidebar } from "../components/dashboard-sidebar";

const ORG_SELECTION_COOKIE = "ventox_org_selected";

export const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const orgSelectionCookieValue = cookieStore.get(ORG_SELECTION_COOKIE)?.value;
  const { userId, sessionId } = await auth();
  const orgSelectionSessionKey = sessionId ?? userId ?? null;

  if (userId && orgSelectionCookieValue !== orgSelectionSessionKey) {
    let membershipCount: number | null = null;

    try {
      const client = await clerkClient();
      const memberships = await client.users.getOrganizationMembershipList({
        userId,
        limit: 2,
      });
      membershipCount = memberships.totalCount;
    } catch (error) {
      console.error("Failed to fetch organization memberships:", error);
    }

    if (membershipCount !== null && membershipCount > 1) {
      redirect("/org-selection");
    }
  }

  return (
    <AuthGuard>
      <OrganizationGuard>
        <SidebarProvider defaultOpen={defaultOpen}>
          <DashboardSidebar />
          <main className="relative flex min-h-screen flex-1 flex-col overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),transparent_28%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_28%)]" />
            <div className="ambient-orb glow-orb -top-24 left-[-4rem] size-[26rem] bg-sky-300/22 dark:bg-sky-500/18" />
            <div className="ambient-orb right-[-7rem] top-[22%] size-[30rem] bg-cyan-200/26 [animation-delay:1.1s] dark:bg-cyan-500/16" />
            <div className="ambient-orb bottom-[-8rem] left-[18%] size-[24rem] bg-emerald-200/18 [animation-delay:2.2s] dark:bg-emerald-500/14" />
            <div className="sticky top-0 z-30 flex items-center px-4 pt-4 md:hidden">
              <SidebarTrigger className="size-10 rounded-xl border border-sidebar-border/70 bg-sidebar/90 shadow-lg backdrop-blur-xl" />
            </div>
            <div className="relative flex flex-1 flex-col">{children}</div>
          </main>
        </SidebarProvider>
      </OrganizationGuard>
    </AuthGuard>
  );
};
