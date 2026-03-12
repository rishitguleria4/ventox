import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const ORG_SELECTION_COOKIE = "ventox_org_selected"

const getSafeRedirectUrl = (redirectUrl: string | null) => {
  if (!redirectUrl || !redirectUrl.startsWith("/") || redirectUrl.startsWith("//")) {
    return "/"
  }

  return redirectUrl
}

export async function GET(request: Request) {
  const { userId, sessionId } = await auth()
  const url = new URL(request.url)
  const redirectUrl = getSafeRedirectUrl(url.searchParams.get("redirectUrl"))
  const response = NextResponse.redirect(new URL(redirectUrl, url))

  if (userId) {
    response.cookies.set(ORG_SELECTION_COOKIE, sessionId ?? userId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    })
  }

  return response
}
