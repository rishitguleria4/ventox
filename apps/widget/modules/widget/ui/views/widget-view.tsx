"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { AlertCircleIcon, HeadphonesIcon } from "lucide-react";
import { useEffect } from "react";

import {
  contactSessionIdAtomFamily,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { WidgetAuthScreen } from "../screens/widget-auth-screen";
import { WidgetChatScreen } from "../screens/widget-chat-screen";
import { WidgetErrorScreen } from "../screens/widget-error-screen";
import { WidgetInboxScreen } from "../screens/widget-inbox-screen";
import { WidgetLoadingScreen } from "../screens/widget-loading-screen";
import { WidgetSelectionScreen } from "../screens/widget-selection-screen";

interface Props {
  organizationId: string | null;
}

export const WidgetView = ({ organizationId }: Props) => {
  const validateContactSession = useMutation(
    api.public.contactSessions.validate,
  );
  const organizationIdValue = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationIdValue || ""),
  );
  const setContactSessionId = useSetAtom(
    contactSessionIdAtomFamily(organizationIdValue || ""),
  );
  const setScreen = useSetAtom(screenAtom);
  const screen = useAtomValue(screenAtom);

  useEffect(() => {
    setScreen("loading");
  }, [organizationId, setScreen]);

  useEffect(() => {
    const protectedScreens = new Set([
      "selection",
      "voice",
      "chat",
      "contact",
      "inbox",
    ]);
    if (!protectedScreens.has(screen)) {
      return;
    }

    if (!organizationIdValue || !contactSessionId) {
      setScreen("auth");
      return;
    }

    let cancelled = false;
    let inFlight = false;

    const verifySession = async () => {
      if (cancelled || inFlight) {
        return;
      }
      inFlight = true;

      try {
        const result = await validateContactSession({
          contactSessionId: contactSessionId as Id<"contactSessions">,
        });

        if (cancelled) {
          return;
        }

        if (!result.valid) {
          setContactSessionId(null);
          setScreen("auth");
        }
      } catch {
        if (!cancelled) {
          setContactSessionId(null);
          setScreen("auth");
        }
      } finally {
        inFlight = false;
      }
    };

    void verifySession();
    const timer = window.setInterval(() => {
      void verifySession();
    }, 30_000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [
    contactSessionId,
    organizationIdValue,
    screen,
    setContactSessionId,
    setScreen,
    validateContactSession,
  ]);

  const screenComponents = {
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    error: <WidgetErrorScreen />,
    auth: <WidgetAuthScreen />,
    inbox: <WidgetInboxScreen />,
    voice: (
      <div className="widget-main items-center justify-center p-4">
        <div className="widget-card w-full text-center">
          <HeadphonesIcon className="mx-auto size-9 text-primary" />
          <h2 className="mt-4 text-lg font-semibold">
            Voice Subsystem Inactive
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Voice capabilities are currently in development for enterprise deployments.
          </p>
        </div>
      </div>
    ),
    selection: <WidgetSelectionScreen />,
    chat: <WidgetChatScreen />,
    contact: (
      <div className="widget-main items-center justify-center p-4">
        <div className="widget-card w-full text-center">
          <AlertCircleIcon className="mx-auto size-9 text-primary" />
          <h2 className="mt-4 text-lg font-semibold">
            Direct Contact Disabled
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Direct contact actions are temporarily disabled while we upgrade our infrastructure.
          </p>
        </div>
      </div>
    ),
  } as const satisfies Record<string, React.ReactNode>;

  return (
    <main className="relative block h-[100dvh] w-full overflow-hidden bg-slate-50 dark:bg-slate-950 m-0 p-0">
      <div className="ambient-orb glow-orb -top-16 left-[-4rem] size-72 bg-sky-400/20 dark:bg-sky-500/15" />
      <div className="ambient-orb right-[-3rem] top-[18%] size-80 bg-cyan-300/20 [animation-delay:1.2s] dark:bg-cyan-500/15" />
      <div className="ambient-orb bottom-[-4rem] left-[22%] size-64 bg-emerald-400/15 [animation-delay:2.3s] dark:bg-emerald-500/10" />
      <div className="relative z-10 flex h-full w-full flex-col bg-transparent">
        {screenComponents[screen] ?? <div className="widget-main" />}
      </div>
    </main>
  );
};
