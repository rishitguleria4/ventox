"use client"
import { api } from "@workspace/backend/convex/_generated/api";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react";
import { contactSessionIdAtomFamily, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms"
import { WidgetAuthScreen } from "../screens/widget-auth-screen"
import { WidgetErrorScreen } from "../screens/widget-error-screen"
import { WidgetLoadingScreen } from "../screens/widget-loading-screen"
import { WidgetSelectioScreen } from "../screens/widget-selection-screen";
import { WidgetChatScreen } from "../screens/widget-chat-screen";
interface Props {
  organizationId: string | null
}


export const WidgetView = ({ organizationId }: Props) => {
  const validateContactSession = useMutation(api.public.contactSessions.validate);
  const organizationIdValue = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationIdValue || ""));
  const setContactSessionId = useSetAtom(contactSessionIdAtomFamily(organizationIdValue || ""));
  const setScreen = useSetAtom(screenAtom);
  const screen =useAtomValue(screenAtom);

  useEffect(() => {
    const protectedScreens = new Set(["selection", "voice", "chat", "contact"]);
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
    }, 30_000); // 30 seconds

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
    loading : <WidgetLoadingScreen organizationId={organizationId}/>,
    error : <WidgetErrorScreen/>,
    auth : <WidgetAuthScreen/>,
    inbox : <p>TODO : Inbox</p>,
    voice : <p>TODO : Vo ice</p>,
    selection : <WidgetSelectioScreen />,
    chat : <WidgetChatScreen />,
    contact : <p> TODO :Contact </p>,
  } as const satisfies Record<string, React.ReactNode>;

  return (
    <main className="mx-auto my-auto max-w-full flex flex-col w-full h-screen justify-center">
      {screenComponents[screen] ?? <p>Unknown screen</p>}
    </main>
  );
};
