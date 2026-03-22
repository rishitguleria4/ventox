"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import {
  CreditCardIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
  Mic,
  PaletteIcon,
  SparklesIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
} from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";

const navigationGroups = [
  {
    label: "Workspace",
    items: [
      {
        title: "Overview",
        url: "/",
        icon: LayoutDashboardIcon,
      },
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
    ],
  },
  {
    label: "Build",
    items: [
      {
        title: "Widget Customizations",
        url: "/customizations",
        icon: PaletteIcon,
      },
      {
        title: "Integrations",
        url: "/integrations",
        icon: SparklesIcon,
      },
      {
        title: "Voice Assistant",
        url: "/plugins/vapi",
        icon: Mic,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Plans & Billing",
        url: "/billing",
        icon: CreditCardIcon,
      },
    ],
  },
] as const;

export const DashboardSidebar = () => {
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(url);
  };

  return (
    <Sidebar
      className="group border-r border-sidebar-border/60 bg-sidebar/84 backdrop-blur-2xl"
      collapsible="icon"
    >
      <SidebarHeader className="gap-4 border-b border-sidebar-border/60 pb-4">
        <Link
          href="/"
          aria-label="Ventox home"
          className="flex items-center justify-between rounded-[1.35rem] border border-sidebar-border/70 bg-white/68 px-4 py-3 shadow-[0_24px_54px_-42px_rgba(15,23,42,0.4)] backdrop-blur-xl transition-colors hover:bg-white/88 group-data-[collapsible=icon]:size-11 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 dark:bg-white/6 dark:hover:bg-white/10"
        >
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-[10px] font-semibold tracking-[0.24em] text-sidebar-foreground/50 uppercase">
              Ventox OS
            </p>
            <Image
              src="/VENTOX-logo.png"
              alt="Ventox"
              width={2026}
              height={380}
              className="mt-2 h-7 w-auto max-w-[8.7rem] object-contain"
              priority
            />
          </div>
          <Image
            src="/VENTOX-mark.png"
            alt="Ventox"
            width={380}
            height={380}
            className="hidden size-6 object-contain group-data-[collapsible=icon]:block"
            priority
          />
          <div className="status-pill hidden gap-1.5 group-data-[collapsible=icon]:hidden md:inline-flex">
            Live Ops
          </div>
        </Link>

        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            size="lg"
            className="h-auto rounded-[1.3rem] p-0"
          >
            <OrganizationSwitcher
              hidePersonal
              skipInvitationScreen
              appearance={{
                elements: {
                  rootBox: "w-full! h-11!",
                  avatarBox: "size-6! rounded-lg!",
                  organizationSwitcherTrigger:
                    "w-full! justify-start! rounded-[1.25rem]! border border-sidebar-border/70! bg-white/66! px-3.5! py-2.5! shadow-[0_22px_48px_-42px_rgba(15,23,42,0.35)]! backdrop-blur-xl! group-data-[collapsible=icon]:size-11! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:px-0! dark:bg-white/6!",
                  organizationPreview:
                    "group-data-[collapsible=icon]:justify-center! gap-3!",
                  organizationPreviewTextContainer:
                    "group-data-[collapsible=icon]:hidden! text-sidebar-foreground!",
                  organizationSwitcherTriggerIcon:
                    "group-data-[collapsible=icon]:hidden! ml-auto! text-sidebar-foreground/60!",
                },
              }}
            />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>

      <SidebarContent className="gap-5 px-1 py-4">
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      className={cn(
                        "rounded-[1.15rem] border border-transparent px-3 text-sidebar-foreground/86 transition-all duration-200 hover:border-white/70 hover:bg-white/72 hover:text-sidebar-foreground dark:hover:border-white/10 dark:hover:bg-white/7",
                        isActive(item.url) &&
                          "border-primary/18 bg-gradient-to-r from-sidebar-primary via-blue-500 to-cyan-400 text-sidebar-primary-foreground shadow-[0_28px_54px_-32px_rgba(59,130,246,0.55)] hover:border-transparent hover:bg-gradient-to-r",
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
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <UserButton
              showName
              appearance={{
                elements: {
                  rootBox: "!w-full !h-11",
                  userButtonTrigger:
                    "w-full rounded-[1.2rem] border border-sidebar-border/70 bg-white/66 px-3 py-2 hover:bg-white/86 group-data-[collapsible=icon]:p-2 dark:bg-white/6 dark:hover:bg-white/10",
                  userButtonBox:
                    "w-full flex-row-reverse justify-end gap-2.5 group-data-[collapsible=icon]:justify-center text-sidebar-foreground",
                  userButtonOuterIdentifier:
                    "pl-0 group-data-[collapsible=icon]:hidden",
                  avatarBox: "size-6",
                },
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
