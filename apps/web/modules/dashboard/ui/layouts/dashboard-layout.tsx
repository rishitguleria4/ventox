import { cookies } from "next/headers"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar"

import { AuthGuard } from "@/modules/auth/ui/components/auth-guard"
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard"

import { DashboardSidebar } from "../components/dashboard-sidebar"

const ORG_SELECTION_COOKIE = "ventox_org_selected"

export const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  const orgSelectionCookieValue = cookieStore.get(ORG_SELECTION_COOKIE)?.value
  const { userId, sessionId } = await auth()
  const orgSelectionSessionKey = sessionId ?? userId ?? null

  if (userId && orgSelectionCookieValue !== orgSelectionSessionKey) {
    try {
      const client = await clerkClient()
      const memberships = await client.users.getOrganizationMembershipList({
        userId,
        limit: 2,
      })

      if (memberships.totalCount > 1) {
        redirect("/org-selection")
      }
    } catch (error) {
      // Log error and allow user to continue to dashboard
      // They can manually switch orgs if needed
      console.error("Failed to fetch organization memberships:", error)
    }
  }

  return (
    <AuthGuard>
      <OrganizationGuard>
        <SidebarProvider defaultOpen={defaultOpen}>
          <DashboardSidebar />
          <main className="relative flex min-h-screen flex-1 flex-col overflow-hidden">
            <div className="sticky top-0 z-30 flex items-center px-4 pt-4 md:hidden">
              <SidebarTrigger className="size-10 rounded-xl border border-sidebar-border/70 bg-sidebar/90 shadow-lg backdrop-blur-xl" />
            </div>
            <div className="ambient-orb -top-24 -left-20 size-80 bg-sky-300/25 dark:bg-sky-400/20" />
            <div className="ambient-orb right-0 bottom-10 size-96 bg-indigo-300/20 [animation-delay:1s] dark:bg-indigo-400/20" />
            {children}
          </main>
        </SidebarProvider>
      </OrganizationGuard>
    </AuthGuard>
  )
}
