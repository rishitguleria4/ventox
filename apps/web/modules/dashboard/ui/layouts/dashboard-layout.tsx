import { ReactNode } from "react"
import { cookies } from "next/headers"

import { SidebarProvider } from "@workspace/ui/components/sidebar"

import { AuthGuard } from "@/modules/auth/ui/components/auth-guard"
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard"

import { DashboardSidebar } from "../components/dashboard-sidebar"

export const DashboardLayout = async ({ children }: {children: React.ReactNode} ) => {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <AuthGuard>
      <OrganizationGuard>
        <SidebarProvider defaultOpen={defaultOpen}>
          <DashboardSidebar />
          <main className="relative flex min-h-screen flex-1 flex-col overflow-hidden">
            <div className="ambient-orb -top-24 -left-20 size-80 bg-sky-300/25 dark:bg-sky-400/20" />
            <div className="ambient-orb right-0 bottom-10 size-96 bg-indigo-300/20 [animation-delay:1s] dark:bg-indigo-400/20" />
            {children}
          </main>
        </SidebarProvider>
      </OrganizationGuard>
    </AuthGuard>
  )
}
