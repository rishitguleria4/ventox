import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

const Page = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-inner">
        <section className="glass-panel p-6 md:p-8">
          <p className="page-eyebrow">Voice Assistant</p>
          <h1 className="page-title mt-3">Vapi Plugin</h1>
          <p className="page-subtitle mt-3">Build real-time voice experiences with consistent handoff and response quality.</p>
        </section>

        <Card className="glass-panel py-0">
          <CardHeader>
            <CardTitle>Call flow builder</CardTitle>
            <CardDescription>Routing, fallback, and speech settings can be configured in this workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border/70 bg-background/45 p-6 text-sm text-muted-foreground">
              Plugin setup UI placeholder.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Page
