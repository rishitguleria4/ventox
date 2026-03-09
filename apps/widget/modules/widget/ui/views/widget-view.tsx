"use client"
import { WidgetAuthScreen } from "../screens/widget-auth-screen"

interface Props {
  organizationId: string
}

export const WidgetView = ({ organizationId }: Props) => {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-3 py-4">
      <WidgetAuthScreen/>
    </main>
  )
}
