import {
  BlendIcon,
  MessageCircleMoreIcon,
  PaletteIcon,
  SparklesIcon,
  TypeIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

const controls = [
  {
    title: "Tone presets",
    description:
      "Set the assistant voice from crisp and product-led to warm and concierge-style.",
    icon: SparklesIcon,
  },
  {
    title: "Typography direction",
    description:
      "Refine hierarchy, density, and label treatment for the customer-facing widget.",
    icon: TypeIcon,
  },
  {
    title: "Color orchestration",
    description:
      "Tune gradients, accents, surfaces, and contrast so the experience feels branded.",
    icon: PaletteIcon,
  },
  {
    title: "Opening guidance",
    description:
      "Shape the first-response copy and how the conversation invites action.",
    icon: MessageCircleMoreIcon,
  },
] as const;

const Page = () => (
  <div className="dashboard-page">
    <div className="dashboard-inner">
      <section className="hero-panel">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[20rem] bg-gradient-to-l from-fuchsia-400/12 via-primary/10 to-transparent" />
        <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-end">
          <div>
            <p className="page-eyebrow">Configurations</p>
            <h1 className="page-title mt-3">Widget Customizations</h1>
            <p className="page-subtitle mt-4 max-w-3xl">
              Dial in tone, visual language, and conversation framing so the
              assistant feels designed with intention instead of bolted on.
            </p>
          </div>
          <div className="metric-card">
            <div className="flex items-center gap-3">
              <div className="rounded-[1rem] border border-white/65 bg-white/74 p-3 dark:border-white/10 dark:bg-white/6">
                <BlendIcon className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Brand fit score</p>
                <p className="text-sm text-muted-foreground">
                  Surfaces, motion, and copy aligned
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {controls.map((control) => (
          <Card key={control.title} className="feature-card py-0">
            <CardHeader className="px-5 pt-5 pb-3">
              <div className="rounded-[1rem] border border-white/65 bg-white/74 p-3 dark:border-white/10 dark:bg-white/6">
                <control.icon className="size-5 text-primary" />
              </div>
              <CardTitle className="text-lg">{control.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 text-sm leading-6 text-muted-foreground">
              {control.description}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <Card className="glass-panel py-0">
          <CardHeader className="px-5 py-5 md:px-6">
            <CardTitle>Design control areas</CardTitle>
            <CardDescription>
              These blocks are ready for real controls once your customization
              tooling is wired up.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 px-5 pb-5 md:grid-cols-2 md:px-6 md:pb-6">
            {[
              [
                "Theme Presets",
                "Light, dark, neutral, and brand-led variants for the widget shell.",
              ],
              [
                "Starter Prompt",
                "Control greeting, first suggested action, and handoff framing.",
              ],
              [
                "Spacing & Density",
                "Balance compact support workflows with customer readability.",
              ],
              [
                "Escalation Styling",
                "Differentiate AI, updates, and human replies with confidence.",
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
            <CardTitle>Preview notes</CardTitle>
            <CardDescription>
              Use this area to compare your chosen style system before
              publishing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-5 md:px-6 md:pb-6">
            {[
              "Stronger color rhythm between chrome and message surfaces.",
              "Cleaner headline hierarchy for quick scanning.",
              "Better contrast and spacing for support-heavy flows.",
            ].map((note) => (
              <div
                key={note}
                className="metric-card flex items-center gap-3 py-4"
              >
                <span className="inline-flex size-2.5 rounded-full bg-primary" />
                <span className="text-sm text-foreground/88">{note}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  </div>
);

export default Page;
