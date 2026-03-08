import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

const Page = () => (
  <div className="dashboard-page">
    <div className="dashboard-inner">
      <section className="glass-panel p-6 md:p-8">
        <p className="page-eyebrow">Configurations</p>
        <h1 className="page-title mt-3">Widget Customizations</h1>
        <p className="page-subtitle mt-3">Tune voice, tone, and visual language so the assistant feels native to your brand.</p>
      </section>

      <Card className="glass-panel py-0">
        <CardHeader>
          <CardTitle>Design controls</CardTitle>
          <CardDescription>Use this panel for typography, colors, and behavior settings.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-background/50 p-4 text-sm">
            <p className="font-medium">Theme Presets</p>
            <p className="mt-1 text-muted-foreground">Light, dark, and brand accent options.</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/50 p-4 text-sm">
            <p className="font-medium">Starter Prompt</p>
            <p className="mt-1 text-muted-foreground">Control greeting and opening guidance.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
)

export default Page
