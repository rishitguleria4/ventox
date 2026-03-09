import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

const Page = () => (
  <div className="dashboard-page">
    <div className="dashboard-inner">
      <section className="glass-panel p-6 md:p-8">
      <p className="page-eyebrow">Account</p>
        <h1 className="page-title mt-3">Plans & Billing</h1>
        <p className="page-subtitle mt-3">Monitor usage, manage payment methods, and control workspace billing health.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-panel py-0">
          <CardHeader>
            <CardDescription>Current Plan</CardDescription>
            <CardTitle>Starter</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass-panel py-0">
          <CardHeader>
            <CardDescription>Monthly Usage</CardDescription>
            <CardTitle>0 credits</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass-panel py-0">
          <CardHeader>
            <CardDescription>Renewal Date</CardDescription>
            <CardTitle>Not configured</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="glass-panel py-0">
        <CardHeader>
          <CardTitle>Payment details</CardTitle>
          <CardDescription>Secure payment form placeholder ready for Stripe integration.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-dashed border-border/80 bg-background/40 p-8 text-sm text-muted-foreground">
            Billing controls not connected yet.
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
)

export default Page
