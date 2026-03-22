"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  ArrowRightIcon,
  MessageSquareTextIcon,
  SparklesIcon,
} from "lucide-react";

import { api } from "@workspace/backend/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";

import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  errorMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";

export const WidgetSelectionScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || ""),
  );

  const createConversations = useMutation(api.public.conversations.create);
  const [isPending, setIsPending] = useState(false);
  const setConversationId = useSetAtom(conversationIdAtom);

  const handleNewConversation = async () => {
    if (!organizationId) {
      setScreen("error");
      setErrorMessage("Missing Organization Id");
      return;
    }
    if (!contactSessionId) {
      setScreen("auth");
      return;
    }
    setIsPending(true);
    try {
      const conversationId = await createConversations({
        contactSessionId,
        organizationId,
      });
      setErrorMessage(null);
      setScreen("chat");
      setConversationId(conversationId);
    } catch {
      setScreen("auth");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <WidgetHeader>
        <div className="space-y-3">
          <p className="text-3xl font-semibold tracking-tight">
            Ventox Support
          </p>
          <p className="max-w-sm text-sm leading-6 text-white/88">
            Initiate a secure conversation with our dedicated support team.
          </p>
        </div>
      </WidgetHeader>

      <div className="widget-main gap-4 px-4 py-4 min-h-0 overflow-y-auto">
        <div className="widget-card">
          <div className="widget-pill w-fit bg-primary/18 text-primary-foreground">
            New conversation
          </div>
          <h2 className="mt-4 text-xl font-semibold">
            Connect with Support
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Our intelligent agents provide immediate resolution, with seamless
            escalation to our support specialists for complex inquiries.
          </p>
          <Button
            className="mt-5 h-12 w-full justify-between rounded-[1.15rem] px-4"
            disabled={isPending}
            onClick={handleNewConversation}
            size="lg"
          >
            <div className="flex items-center gap-2">
              <MessageSquareTextIcon className="size-4" />
              <span>Start chat</span>
            </div>
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>

        <div className="grid gap-3">
          {[
            "Instant issue resolution.",
            "Seamless escalation to support specialists.",
            "Secure, persistent session management.",
          ].map((item) => (
            <div key={item} className="widget-soft-card flex items-start gap-3">
              <SparklesIcon className="mt-0.5 size-4 text-primary" />
              <p className="text-sm leading-6 text-foreground/88">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <WidgetFooter />
    </>
  );
};
