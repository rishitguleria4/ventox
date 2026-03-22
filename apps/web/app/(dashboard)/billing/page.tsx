import {
  BadgeIndianRupeeIcon,
  CalendarClockIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  SparklesIcon,
  WalletCardsIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

const stats = [
  {
    label: "Current Plan",
    value: "Starter",
    detail: "A clean base for teams getting operational",
    icon: SparklesIcon,
  },
  {
    label: "Monthly Usage",
    value: "0 credits",
    detail: "Ready to track once billing is connected",
    icon: BadgeIndianRupeeIcon,
  },
  {
    label: "Renewal Date",
    value: "Not configured",
    detail: "Hook this to your billing provider next",
    icon: CalendarClockIcon,
  },
] as const;

const Page = () => (
  <div className="dashboard-page">
    <div className="dashboard-inner">
      <section className="hero-panel">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[20rem] bg-gradient-to-l from-amber-300/16 via-primary/10 to-transparent" />
        <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-end">
          <div>
            <p className="page-eyebrow">Account</p>
            <h1 className="page-title mt-3">Plans & Billing</h1>
            <p className="page-subtitle mt-4 max-w-3xl">
              Track usage, shape plan visibility, and present billing state with
              a dashboard that feels deliberate instead of placeholder.
            </p>
          </div>
          <div className="metric-card">
            <div className="flex items-center gap-3">
              <div className="rounded-[1rem] border border-white/65 bg-white/74 p-3 dark:border-white/10 dark:bg-white/6">
                <WalletCardsIcon className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Finance surface</p>
                <p className="text-sm text-muted-foreground">
                  Usage, plan, and payment state in one place
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="metric-card py-0">
            <CardHeader className="gap-3 px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <CardDescription>{stat.label}</CardDescription>
                <div className="rounded-full border border-white/65 bg-white/72 p-2 dark:border-white/10 dark:bg-white/6">
                  <stat.icon className="size-4 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
              <p className="text-sm text-muted-foreground">{stat.detail}</p>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
        <Card className="glass-panel py-0">
          <CardHeader className="px-5 py-5 md:px-6">
            <CardTitle>Payment details</CardTitle>
            <CardDescription>
              This polished surface is ready for Stripe or another billing
              provider once connected.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 md:px-6 md:pb-6">
            <div className="rounded-[1.45rem] border border-dashed border-border/80 bg-background/40 p-8 text-sm leading-7 text-muted-foreground">
              Billing controls are not connected yet, but the layout is ready
              for payment methods, invoices, usage charts, and seat management.
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel py-0">
          <CardHeader className="px-5 py-5 md:px-6">
            <CardTitle>Trust markers</CardTitle>
            <CardDescription>
              Add confidence-building details around payment health and platform
              security.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-5 md:px-6 md:pb-6">
            {[
              {
                Icon: CreditCardIcon,
                title: "Payment methods",
                description: "Display primary card, backup method, and retry state.",
              },
              {
                Icon: ShieldCheckIcon,
                title: "Security posture",
                description: "Surface secure billing handling and audit-friendly payment events.",
              },
              {
                Icon: SparklesIcon,
                title: "Upgrade guidance",
                description: "Highlight usage milestones and the next best plan when relevant.",
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
