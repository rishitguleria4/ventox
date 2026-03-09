"use client"

import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react"
import { OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs"

import { api } from "@workspace/backend/convex/_generated/api"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

export default function Page() {
  const users = useQuery(api.users.getmany)
  const addUser = useMutation(api.users.add)

  return (
    <>
      <Authenticated>
        <div className="dashboard-page">
          <div className="dashboard-inner">
            <section className="glass-panel p-6 md:p-8">
              <p className="page-eyebrow">Overview</p>
              <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="page-title">Support workspace</h1>
                  <p className="page-subtitle mt-3">
                    Manage conversations, iterate on your widget, and ship voice flows with a polished operation center.
                  </p>
                </div>
                <div className="flex w-full h-full">
                  <OrganizationSwitcher hidePersonal skipInvitationScreen />
                  <UserButton />
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <Card className="glass-panel py-0">
                <CardHeader className="gap-2 w-full p-5">
                  <CardDescription>Total Users</CardDescription>
                  <CardTitle className="text-4xl">{users?.length ?? 0}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="glass-panel py-0">
                <CardHeader className="gap-2 w-full p-5">
                  <CardDescription>Workspace Status</CardDescription>
                  <CardTitle>Operational</CardTitle>
                </CardHeader>
              </Card>
              <Card className="bg-blend-color-burn glass-panel py-0">
                <CardHeader className="gap-2 w-full p-5">
                  <CardDescription>Quick Action</CardDescription>
                  <Button className="h-full w-fit" onClick={() => addUser()}>
                    Add Demo User
                  </Button>
                </CardHeader>
              </Card>
            </section>

            <Card className="glass-panel py-0">
              <CardHeader className="gap-2 w-full p-5">
                <CardTitle>Live Data</CardTitle>
                <CardDescription>Convex users payload from your current environment.</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="max-h-72 overflow-auto rounded-xl border border-border/70 bg-background/60 p-4 text-xs">
                  {JSON.stringify(users, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </Authenticated>

      <Unauthenticated>
        <div className="dashboard-page flex items-center justify-center">
          <Card className="glass-panel w-full max-w-xl py-0">
            <CardHeader>
              <CardTitle>Sign in required</CardTitle>
              <CardDescription>Access your Ventox dashboard to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <SignInButton>
                <Button>Sign in</Button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </Unauthenticated>
    </>
  )
}
