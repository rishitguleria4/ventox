"use client"

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import {
  CreditCardIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
  Mic,
  PaletteIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar"
import { cn } from "@workspace/ui/lib/utils"

const customerSupportItems = [
  {
    title: "Conversations",
    url: "/conversations",
    icon: InboxIcon,
  },
  {
    title: "Knowledge Base",
    url: "/files",
    icon: LibraryBigIcon,
  },
]

const configurationItems = [
  {
    title: "Widget Customizations",
    url: "/customizations",
    icon: PaletteIcon,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Voice Assistant",
    url: "/plugins/vapi",
    icon: Mic,
  },
]

const accountItems = [
  {
    title: "Plans & Billing",
    url: "/billing",
    icon: CreditCardIcon,
  },
]

export const DashboardSidebar = () => {
  const pathname = usePathname()

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/"
    }

    return pathname.startsWith(url)
  }

  return (
    <Sidebar className="group border-r border-sidebar-border/60 bg-sidebar/85 backdrop-blur-2xl" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/60">
        <SidebarMenuItem>
          <SidebarMenuButton asChild size="lg" className="h-12 rounded-xl">
            <OrganizationSwitcher
              hidePersonal
              skipInvitationScreen
              appearance={{
                elements: {
                  rootBox: "w-full! h-8!",
                  avatarBox: "size-5! rounded-md!",
                  organizationSwitcherTrigger:
                    "w-full! justify-start! rounded-xl! border border-sidebar-border/70! bg-white/65! p-2! backdrop-blur-xl! group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:p-2! dark:bg-white/5!",
                  organizationPreview: "group-data-[collapsible=icon]:justify-center! gap-2!",
                  organizationPreviewTextContainer:
                    "group-data-[collapsible=icon]:text-xs! font-medium! text-sidebar-foreground!",
                  organizationSwitcherTriggerIcon:
                    "group-data-[collapsible=icon]:hidden! ml-auto! text-sidebar-foreground/70!",
                },
              }}
            />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent className="gap-4 py-3">
        <SidebarGroup>
          <SidebarGroupLabel>Customer Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customerSupportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className={cn(
                      "rounded-xl text-sidebar-foreground/85 transition-all",
                      isActive(item.url) &&
                        "bg-linear-to-r from-sidebar-primary to-blue-500 text-sidebar-primary-foreground shadow-lg shadow-blue-500/25"
                    )}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Configurations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configurationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className={cn(
                      "rounded-xl text-sidebar-foreground/85 transition-all",
                      isActive(item.url) &&
                        "bg-linear-to-r from-sidebar-primary to-blue-500 text-sidebar-primary-foreground shadow-lg shadow-blue-500/25"
                    )}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className={cn(
                      "rounded-xl text-sidebar-foreground/85 transition-all",
                      isActive(item.url) &&
                        "bg-linear-to-r from-sidebar-primary to-blue-500 text-sidebar-primary-foreground shadow-lg shadow-blue-500/25"
                    )}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/60 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <UserButton
              showName
              appearance={{
                elements: {
                  rootBox: "!w-full !h-10",
                  userButtonTrigger:
                    "w-full rounded-xl border border-sidebar-border/70 bg-white/60 p-2 hover:bg-white/85 group-data-[collapsible=icon]:p-2 dark:bg-white/5 dark:hover:bg-white/10",
                  userButtonBox:
                    "w-full flex-row-reverse justify-end gap-2 group-data-[collapsible=icon]:justify-center text-sidebar-foreground",
                  userButtonOuterIdentifier: "pl-0 group-data-[collapsible=icon]:hidden",
                  avatarBox: "size-5",
                },
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
