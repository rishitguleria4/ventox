"use client"

import * as React from "react"
import { useAuth } from "@clerk/nextjs"
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react"

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL environment variable is not set")
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

const useConvexClerkAuth = () => {
  const { isLoaded, isSignedIn, getToken, orgId } = useAuth()

  const fetchAccessToken = React.useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      try {
        return await getToken({
          template: "convex",
          organizationId: orgId ?? undefined,
          skipCache: forceRefreshToken,
        })
      } catch (error) {
        console.error("Failed to fetch Clerk token for Convex", error)
        return null
      }
    },
    [getToken, orgId],
  )

  return React.useMemo(
    () => ({
      isLoading: !isLoaded,
      isAuthenticated: isSignedIn ?? false,
      fetchAccessToken,
    }),
    [fetchAccessToken, isLoaded, isSignedIn],
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useConvexClerkAuth}>
      {children}
    </ConvexProviderWithAuth>
  )
}
