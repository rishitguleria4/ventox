"use client";

import { SignInButton } from "@clerk/nextjs";
import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import {
  ActivityIcon,
  ArrowRightIcon,
  BotIcon,
  MessageSquareTextIcon,
  PaletteIcon,
  PlugZapIcon,
  Users2Icon,
  WavesIcon,
} from "lucide-react";
import Link from "next/link";

import { api } from "@workspace/backend/convex/_generated/api";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

const quickLinks = [
  {
    title: "Conversations",
    href: "/conversations",
    description: "Jump into the shared transcript workspace and support queue.",
    icon: MessageSquareTextIcon,
  },
  {
    title: "Widget Studio",
    href: "/customizations",
    description:
      "Tune tone, layout, and brand behavior for your widget experience.",
    icon: PaletteIcon,
  },
  {
    title: "Integrations",
    href: "/integrations",
    description:
      "Connect channels, tooling, and customer context in one place.",
    icon: PlugZapIcon,
  },
  {
    title: "Voice Assistant",
    href: "/plugins/vapi",
    description:
      "Design voice journeys with the same support playbook and polish.",
    icon: WavesIcon,
  },
] as const;

export default function Page() {
  const users = useQuery(api.users.getmany);
  const addUser = useMutation(api.users.add);

  const metricCards = [
    {
      label: "Workspace Members",
      value: String(users?.length ?? 0),
      detail: "Live Convex demo count",
      icon: Users2Icon,
    },
    {
      label: "Support Readiness",
      value: "Operational",
      detail: "Dashboard, widget, and inbox ready",
      icon: ActivityIcon,
    },
    {
      label: "Assistant Posture",
      value: "Brand-led",
      detail: "Consistent UI language across flows",
      icon: BotIcon,
    },
  ] as const;

  return (
    <>
      <Authenticated>
        <div className="dashboard-page">
          <div className="dashboard-inner">
            <section className="hero-panel">
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[22rem] bg-gradient-to-l from-primary/14 via-sky-400/10 to-transparent" />
              <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-end">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Badge className="rounded-full px-3 py-1">
                      Support workspace
                    </Badge>
                    <span className="status-pill">
                      Freshly polished frontend
                    </span>
                  </div>
                  <p className="page-eyebrow mt-5">Overview</p>
                  <h1 className="page-title mt-3">
                    Operate support from a calmer, sharper control center.
                  </h1>
                  <p className="page-subtitle mt-4 max-w-3xl">
                    Conversations, widget experiences, and launch surfaces now
                    share the same premium visual system so the product feels
                    cohesive from the first login to the last reply.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild className="rounded-full px-4" size="lg">
                      <Link href="/conversations">
                        Open Conversations
                        <ArrowRightIcon className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      className="rounded-full px-4"
                      onClick={() => addUser()}
                      size="lg"
                      variant="outline"
                    >
                      Add Demo User
                    </Button>
                  </div>
                </div>

                <div className="metric-card space-y-4">
                  <p className="page-eyebrow">Today&apos;s Focus</p>
                  <div className="space-y-3">
                    {[
                      "Review live customer threads",
                      "Ship branded widget updates",
                      "Connect channels and voice flows",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-[1.2rem] border border-white/60 bg-white/75 px-4 py-3 dark:border-white/10 dark:bg-white/6"
                      >
                        <span className="inline-flex size-2.5 rounded-full bg-emerald-400" />
                        <span className="text-sm text-foreground/88">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              {metricCards.map((card) => (
                <Card key={card.label} className="metric-card py-0">
                  <CardHeader className="gap-3 px-5 py-5">
                    <div className="flex items-center justify-between gap-3">
                      <CardDescription>{card.label}</CardDescription>
                      <div className="rounded-full border border-white/65 bg-white/72 p-2 dark:border-white/10 dark:bg-white/6">
                        <card.icon className="size-4 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-3xl md:text-4xl">
                      {card.value}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {card.detail}
                    </p>
                  </CardHeader>
                </Card>
              ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <Card className="glass-panel py-0">
                <CardHeader className="px-5 py-5 md:px-6">
                  <CardTitle>Launch Surfaces</CardTitle>
                  <CardDescription>
                    Jump into the areas that shape how your support product
                    looks and feels.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 px-5 pb-5 md:grid-cols-2 md:px-6 md:pb-6">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="feature-card block"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="rounded-[1rem] border border-white/65 bg-white/74 p-3 dark:border-white/10 dark:bg-white/6">
                          <link.icon className="size-5 text-primary" />
                        </div>
                        <ArrowRightIcon className="mt-1 size-4 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-base font-semibold">
                        {link.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {link.description}
                      </p>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-panel py-0">
                <CardHeader className="px-5 py-5 md:px-6">
                  <CardTitle>Live Data Snapshot</CardTitle>
                  <CardDescription>
                    Current Convex user payload from your environment.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5 md:px-6 md:pb-6">
                  <div className="rounded-[1.35rem] border border-border/70 bg-background/60 p-4">
                    <pre className="max-h-[27rem] overflow-auto text-xs leading-6 text-muted-foreground">
                      {JSON.stringify(users, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </Authenticated>

      <AuthLoading>
        <div className="dashboard-page flex items-center justify-center">
          <Card className="glass-panel w-full max-w-xl py-0">
            <CardHeader>
              <CardTitle>Connecting workspace</CardTitle>
              <CardDescription>
                Verifying your Clerk session with Convex.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </AuthLoading>

      <Unauthenticated>
        <div className="dashboard-page flex items-center justify-center">
          <Card className="glass-panel w-full max-w-xl py-0">
            <CardHeader>
              <CardTitle>Sign in required</CardTitle>
              <CardDescription>
                Access your Ventox dashboard to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignInButton>
                <Button className="rounded-full px-4">Sign in</Button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </Unauthenticated>
    </>
  );
}
