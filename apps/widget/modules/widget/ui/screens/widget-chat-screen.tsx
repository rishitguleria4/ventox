"use client";

import { ArrowLeftIcon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";
import { WidgetFooter } from "../components/widget-footer";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);

  const contactSessionId = organizationId
    ? useAtomValue(contactSessionIdAtomFamily(organizationId))
    : null;

  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  };

  const shouldFetch = !!conversationId && !!contactSessionId;

  const conversation = useQuery(
    api.public.conversations.getOne,
    shouldFetch
      ? {
          conversationId,
          contactSessionId,
        }
      : "skip"
  );

  return (
    <>
      <WidgetHeader>
        <div className="mt-5 space-y-3 px-2 pb-6">
          <p className="text-3xl font-semibold tracking-tight">Chat</p>

          <Button
            size="icon"
            onClick={onBack}
            variant="transparent"
          >
            <ArrowLeftIcon />
          </Button>
        </div>
      </WidgetHeader>

      <div className="flex flex-col flex-1 gap-y-4 p-4">
        <p className="text-sm">
          Chat Screen...
        </p>

        <pre className="text-xs">
          {JSON.stringify(conversation, null, 2)}
        </pre>
      </div>

      <WidgetFooter />
    </>
  );
};