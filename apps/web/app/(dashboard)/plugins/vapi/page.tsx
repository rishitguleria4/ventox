import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

const Page = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-inner">
        <section className="glass-panel p-6 md:p-8">
          <p className="page-eyebrow opacity-60">Voice Assistant</p>
          <h1 className="page-title mt-3">Vapi Plugin</h1>
          <p className="page-subtitle mt-3">Build real-time voice experiences with consistent handoff and response quality.</p>
        </section>

        <Card className="glass-panel">
          <CardHeader className="w-full h-full mx-3 mask-y-to-background">
            <CardTitle>Call flow builder</CardTitle>
            <CardDescription>Routing, fallback, and speech settings can be configured in this workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border/70 bg-background/45 p-6 text-sm text-muted-foreground my-5 mx-3">
              Plugin setup UI placeholder.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Page
