import {
  ActivitySquareIcon,
  BlocksIcon,
  PlugZapIcon,
  ShieldCheckIcon,
  SlackIcon,
  WorkflowIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

const integrations = [
  {
    name: "Slack",
    state: "Ready to connect",
    detail:
      "Route escalations and internal handoff updates into team channels.",
    icon: SlackIcon,
  },
  {
    name: "HubSpot",
    state: "Ready to connect",
    detail: "Sync account context, lifecycle stage, and customer ownership.",
    icon: BlocksIcon,
  },
  {
    name: "Zendesk",
    state: "Ready to connect",
    detail:
      "Unify ticketing context with live conversations and follow-up actions.",
    icon: PlugZapIcon,
  },
] as const;

const Page = () => (
  <div className="dashboard-page">
    <div className="dashboard-inner">
      <section className="hero-panel">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[20rem] bg-gradient-to-l from-emerald-300/14 via-primary/10 to-transparent" />
        <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-end">
          <div>
            <p className="page-eyebrow">Configurations</p>
            <h1 className="page-title mt-3">Integrations</h1>
            <p className="page-subtitle mt-4 max-w-3xl">
              Connect the systems your support operation depends on so every
              response carries the right context, routing, and follow-through.
            </p>
          </div>
          <div className="metric-card">
            <div className="flex items-center gap-3">
              <div className="rounded-[1rem] border border-white/65 bg-white/74 p-3 dark:border-white/10 dark:bg-white/6">
                <WorkflowIcon className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Connection strategy</p>
                <p className="text-sm text-muted-foreground">
                  Product, CRM, and support channels in one layer
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.name} className="feature-card py-0">
            <CardHeader className="px-5 pt-5 pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="rounded-[1rem] border border-white/65 bg-white/74 p-3 dark:border-white/10 dark:bg-white/6">
                  <integration.icon className="size-5 text-primary" />
                </div>
                <span className="status-pill">{integration.state}</span>
              </div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 text-sm leading-6 text-muted-foreground">
              {integration.detail}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <Card className="glass-panel py-0">
          <CardHeader className="px-5 py-5 md:px-6">
            <CardTitle>Connected services canvas</CardTitle>
            <CardDescription>
              Build the operational layer that keeps support fast and
              context-aware.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 px-5 pb-5 md:grid-cols-2 md:px-6 md:pb-6">
            {[
              [
                "Real-time events",
                "Pull product signals in as conversations happen.",
              ],
              [
                "Customer records",
                "Match conversations to account and CRM history.",
              ],
              [
                "Escalation hooks",
                "Notify internal teams the moment a human handoff begins.",
              ],
              [
                "Action automation",
                "Push summaries, tags, and outcomes back into your stack.",
              ],
            ].map(([title, description]) => (
              <div key={title} className="metric-card">
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel py-0">
          <CardHeader className="px-5 py-5 md:px-6">
            <CardTitle>Guardrails</CardTitle>
            <CardDescription>
              Keep integrations resilient, observable, and safe before they go
              live.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-5 md:px-6 md:pb-6">
            {[
              {
                Icon: ShieldCheckIcon,
                title: "Permission boundaries",
                description: "Ensure customer data only reaches the systems meant to receive it.",
              },
              {
                Icon: ActivitySquareIcon,
                title: "Sync health",
                description: "Track connection health and delivery confidence over time.",
              },
              {
                Icon: PlugZapIcon,
                title: "Fallback paths",
                description: "Preserve support continuity even when a connector is unavailable.",
              },
            ].map(({ Icon, title, description }) => (
              <div key={title} className="metric-card">
                <div className="flex items-center gap-3">
                  <Icon className="size-4 text-primary" />
                  <p className="text-sm font-semibold">{title}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  </div>
);

export default Page;
