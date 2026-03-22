import {
  MicIcon,
  PhoneCallIcon,
  SparklesIcon,
  WavesIcon,
  WorkflowIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

const flowSteps = [
  {
    title: "Greeting",
    description:
      "Design the first spoken impression with the same brand confidence as chat.",
    icon: SparklesIcon,
  },
  {
    title: "Routing",
    description:
      "Decide when to answer automatically, when to clarify, and when to escalate.",
    icon: WorkflowIcon,
  },
  {
    title: "Handoff",
    description:
      "Keep voice and dashboard support in sync when a human needs to step in.",
    icon: PhoneCallIcon,
  },
] as const;

const Page = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-inner">
        <section className="hero-panel">
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[20rem] bg-gradient-to-l from-sky-300/16 via-primary/10 to-transparent" />
          <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-end">
            <div>
              <p className="page-eyebrow">Voice Assistant</p>
              <h1 className="page-title mt-3">Vapi Plugin</h1>
              <p className="page-subtitle mt-4 max-w-3xl">
                Shape real-time voice experiences with the same design
                discipline, handoff clarity, and product polish as the rest of
                the workspace.
              </p>
            </div>
            <div className="metric-card">
              <div className="flex items-center gap-3">
                <div className="rounded-[1rem] border border-white/65 bg-white/74 p-3 dark:border-white/10 dark:bg-white/6">
                  <WavesIcon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Voice posture</p>
                  <p className="text-sm text-muted-foreground">
                    Real-time, on-brand, and ready for escalation paths
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {flowSteps.map((step) => (
            <Card key={step.title} className="feature-card py-0">
              <CardHeader className="px-5 pt-5 pb-3">
                <div className="rounded-[1rem] border border-white/65 bg-white/74 p-3 dark:border-white/10 dark:bg-white/6">
                  <step.icon className="size-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 text-sm leading-6 text-muted-foreground">
                {step.description}
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)]">
          <Card className="glass-panel py-0">
            <CardHeader className="px-5 py-5 md:px-6">
              <CardTitle>Call flow builder</CardTitle>
              <CardDescription>
                Routing, fallback, and speech settings can plug into this
                cleaner planning surface.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5 md:px-6 md:pb-6">
              <div className="rounded-[1.45rem] border border-border/70 bg-background/45 p-6 text-sm leading-7 text-muted-foreground">
                Plugin setup UI placeholder. This space is ideal for node-based
                flow editing, fallback prompts, and escalation tuning.
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel py-0">
            <CardHeader className="px-5 py-5 md:px-6">
              <CardTitle>Voice ingredients</CardTitle>
              <CardDescription>
                The essential layers for a support-ready voice deployment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-5 pb-5 md:px-6 md:pb-6">
              {[
                {
                  Icon: MicIcon,
                  title: "Prompt orchestration",
                  description: "Control greeting, clarification, and confirmation patterns.",
                },
                {
                  Icon: PhoneCallIcon,
                  title: "Escalation moments",
                  description: "Hand voice calls to humans without losing context or polish.",
                },
                {
                  Icon: WavesIcon,
                  title: "Audio personality",
                  description: "Balance warmth, clarity, and pace for premium customer interactions.",
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
};

export default Page;
