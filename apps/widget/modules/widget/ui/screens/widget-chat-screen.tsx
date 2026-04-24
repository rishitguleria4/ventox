"use client";

import { extractText } from "@convex-dev/agent";
import { useThreadMessages } from "@convex-dev/agent/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@workspace/backend/convex/_generated/api";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import {
  AIConversations,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversations";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Form, FormField } from "@workspace/ui/components/form";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import {
  getAssistantDisplayName,
  getAssistantDisplayTone,
} from "@workspace/ui/lib/assistant";
import { cn } from "@workspace/ui/lib/utils";
import { useAction, useQuery } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon, Wand2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";

import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";

const formSchema = z.object({
  message: z.string().trim().min(1, "Message is required"),
});

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId ?? ""),
  );

  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  };

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
        conversationId,
        contactSessionId,
      }
      : "skip",
  );

  useEffect(() => {
    if (conversation !== null) {
      return;
    }

    setConversationId(null);
    setScreen("selection");
  }, [conversation, setConversationId, setScreen]);

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? {
        threadId: conversation.threadId,
        contactSessionId,
      }
      : "skip",
    { initialNumItems: 10 },
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoading } =
    useInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 10,
      observerEnabled: true,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      message: "",
    },
  });

  const createMessage = useAction(api.public.messages.create);
  const enhanceDraft = useAction(api.public.messages.enhanceDraft);
  const [isEnhancingDraft, setIsEnhancingDraft] = useState(false);

  const onEnhance = async () => {
    if (!conversation || !contactSessionId) {
      return;
    }

    const currentMessage = form.getValues("message").trim();

    if (!currentMessage) {
      form.setError("message", {
        message: "Write a message first, then enhance it.",
      });
      return;
    }

    setIsEnhancingDraft(true);

    try {
      const result = await enhanceDraft({
        threadId: conversation.threadId,
        draft: currentMessage,
        contactSessionId,
      });

      form.setValue("message", result.text, {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.clearErrors("message");
    } catch {
      form.setError("message", {
        message: "Unable to enhance your message right now.",
      });
    } finally {
      setIsEnhancingDraft(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation || !contactSessionId) {
      return;
    }

    try {
      await createMessage({
        threadId: conversation.threadId,
        prompt: values.message,
        contactSessionId,
      });

      form.reset();
    } catch {
      form.setError("message", {
        message: "Unable to send your message right now.",
      });
    }
  };

  return (
    <>
      <WidgetHeader>
        <div className="space-y-4">
          <Button
            className="rounded-full border border-white/18 bg-white/8"
            size="icon"
            onClick={onBack}
            variant="transparent"
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
          <div>
            <p className="text-3xl font-semibold tracking-tight">Chat</p>
            <p className="max-w-sm text-sm leading-6 text-white/88">
              Secure communication channel actively monitored by our support team.
            </p>
          </div>
        </div>
      </WidgetHeader>

      <div className="widget-main gap-4 px-4 py-4 min-h-0 overflow-hidden">
        {conversation?.status === "escalated" ? (
          <div className="widget-soft-card border-amber-500/25 bg-amber-500/10 text-amber-950 dark:text-amber-100 shrink-0">
            Human support is handling this conversation now. Keep replying here
            and the company dashboard handler can answer directly.
          </div>
        ) : null}

        <div className="widget-card flex min-h-0 flex-1 flex-col overflow-hidden p-0">
          <AIConversations className="flex min-h-0 flex-1 flex-col">
            <AIConversationContent className="flex min-h-full flex-col p-0">
              <InfiniteScrollTrigger
                onLoadMore={handleLoadMore}
                canLoadMore={canLoadMore}
                isLoading={isLoading}
                ref={topElementRef}
                className="px-4 pt-4"
                noMoreText={
                  messages.results.length > 0 ? "Start of conversation" : ""
                }
              />
              <div className="flex flex-1 flex-col justify-end gap-2 px-4 pb-4">
                {messages.results.length === 0 ? (
                  <div className="flex min-h-40 items-center justify-center rounded-[1.3rem] border border-dashed border-border/70 bg-background/40 px-4 text-center text-sm text-muted-foreground">
                    Awaiting secure message transmission...
                  </div>
                ) : null}
                {(messages?.results ?? []).map((item) => {
                  const message = item.message;
                  if (!message) {
                    return null;
                  }

                  const text =
                    extractText(message) ?? "LOADING.....WAIT FOR A SEC";
                  const assistantLabel =
                    message.role === "assistant"
                      ? getAssistantDisplayName(item.agentName)
                      : null;
                  const assistantTone =
                    message.role === "assistant"
                      ? getAssistantDisplayTone(item.agentName)
                      : null;

                  return (
                    <AIMessage
                      key={item.key}
                      from={message.role === "user" ? "user" : "assistant"}
                    >
                      <AIMessageContent>
                        {assistantLabel ? (
                          <p
                            className={cn(
                              "text-[11px] font-semibold tracking-[0.18em] uppercase",
                              assistantTone === "human"
                                ? "text-emerald-700 dark:text-emerald-300"
                                : assistantTone === "update"
                                  ? "text-amber-700 dark:text-amber-300"
                                  : "text-sky-700 dark:text-sky-300",
                            )}
                          >
                            {assistantLabel}
                          </p>
                        ) : null}
                        <AIResponse className="leading-7">{text}</AIResponse>
                      </AIMessageContent>
                      {message.role === "assistant" && (
                        <DicebearAvatar
                          seed={item.agentName ?? "assistant"}
                          size={42}
                          badgeImageUrl="/logo.svg"
                        />
                      )}
                    </AIMessage>
                  );
                })}
              </div>
            </AIConversationContent>

            <AIConversationScrollButton />
          </AIConversations>
        </div>
      </div>

      <Form {...form}>
        <div className="border-t border-white/12 bg-white/58 px-4 py-4 backdrop-blur-xl dark:bg-slate-950/50">
          <AIInput
            className="border-white/60 bg-white/76"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              disabled={conversation?.status === "resolved"}
              name="message"
              render={({ field, fieldState }) => (
                <>
                  <AIInputTextarea
                    disabled={
                      conversation?.status === "resolved" ||
                      form.formState.isSubmitting
                    }
                    onChange={field.onChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    placeholder={
                      conversation?.status === "resolved"
                        ? "This conversation has been resolved."
                        : conversation?.status === "escalated"
                          ? "Reply to human support..."
                          : "Type your message..."
                    }
                    value={field.value}
                  />
                  <AIInputToolbar className="gap-3">
                    <AIInputTools className="gap-2">
                      <Badge
                        variant="outline"
                        className="rounded-full border-border/70 px-3 py-1 text-[10px] tracking-[0.18em] uppercase"
                      >
                        Support reply
                      </Badge>
                      <button
                        type="button"
                        onClick={onEnhance}
                        disabled={
                          conversation?.status === "resolved" ||
                          form.formState.isSubmitting ||
                          isEnhancingDraft
                        }
                        className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-medium text-indigo-600 transition-all duration-300 hover:bg-indigo-500/20 hover:text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 dark:hover:bg-indigo-500/25 active:scale-95"
                      >
                        <Wand2Icon className="size-3" />
                        {isEnhancingDraft ? "Enhancing..." : "Enhance"}
                      </button>
                    </AIInputTools>
                    <AIInputSubmit
                      disabled={
                        conversation?.status === "resolved" ||
                        !form.formState.isValid ||
                        form.formState.isSubmitting ||
                        isEnhancingDraft
                      }
                      size="default"
                      status={
                        form.formState.isSubmitting ? "submitted" : "ready"
                      }
                      type="submit"
                    >
                      Send
                    </AIInputSubmit>
                  </AIInputToolbar>
                  {fieldState.error?.message ? (
                    <p className="px-4 pb-4 text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </>
              )}
            />
          </AIInput>
        </div>
      </Form>
      <WidgetFooter />
    </>
  );
};
