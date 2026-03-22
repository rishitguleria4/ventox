"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { Form, FormField } from "@workspace/ui/components/form";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import {
  getAssistantDisplayName,
  getAssistantDisplayTone,
} from "@workspace/ui/lib/assistant";
import { getCountryPresentation } from "@workspace/ui/lib/country";
import { cn } from "@workspace/ui/lib/utils";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import {
  CheckIcon,
  Clock3Icon,
  Globe2Icon,
  MailIcon,
  MonitorIcon,
  RefreshCwIcon,
  TriangleAlertIcon,
  User2Icon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { ConversationPanel } from "../components/conversation-panel";

const getMessageText = (
  message:
    | {
        content?: unknown;
      }
    | undefined,
) => {
  if (!message) {
    return undefined;
  }

  const { content } = message;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) =>
        typeof part === "object" &&
        part !== null &&
        "type" in part &&
        "text" in part &&
        part.type === "text" &&
        typeof part.text === "string"
          ? part.text
          : null,
      )
      .filter((value): value is string => Boolean(value))
      .join("\n")
      .trim();
  }

  return undefined;
};

const statusOptions = [
  {
    label: "Unresolved",
    value: "unresolved",
  },
  {
    label: "Escalated",
    value: "escalated",
  },
  {
    label: "Resolved",
    value: "resolved",
  },
] as const;

const formatTimestamp = (timestamp: number) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));

const replyFormSchema = z.object({
  message: z.string().trim().min(1, "Reply is required"),
});

export const ConversationsView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedConversationId = searchParams.get(
    "conversationId",
  ) as Id<"conversations"> | null;
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);

  const initialConversation = usePaginatedQuery(
    api.private.conversations.getMany,
    { status: undefined },
    { initialNumItems: 1 },
  );

  useEffect(() => {
    if (selectedConversationId || initialConversation.results.length === 0) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("conversationId", initialConversation.results[0]!._id);
    router.replace("/conversations?" + params.toString());
  }, [
    initialConversation.results,
    router,
    searchParams,
    selectedConversationId,
  ]);

  const conversation = useQuery(
    api.private.conversations.getOne,
    selectedConversationId
      ? {
          conversationId: selectedConversationId,
        }
      : "skip",
  );

  const messages = usePaginatedQuery(
    api.private.messages.getMany,
    conversation
      ? {
          threadId: conversation.threadId,
          streamArgs: undefined,
        }
      : "skip",
    {
      initialNumItems: 20,
    },
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoading } =
    useInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 20,
      observerEnabled: true,
    });

  const updateStatus = useMutation(api.private.conversations.updateStatus);
  const sendHumanReply = useMutation(api.private.messages.create);
  const replyForm = useForm<z.infer<typeof replyFormSchema>>({
    resolver: zodResolver(replyFormSchema),
    mode: "onChange",
    defaultValues: {
      message: "",
    },
  });

  const orderedMessages = useMemo(
    () => [...messages.results].reverse(),
    [messages.results],
  );

  const handleStatusChange = async (
    nextStatus: "unresolved" | "escalated" | "resolved",
  ) => {
    if (!conversation || conversation.status === nextStatus) {
      return;
    }

    setIsUpdatingStatus(true);
    try {
      await updateStatus({
        conversationId: conversation._id,
        status: nextStatus,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleHumanReply = async (values: z.infer<typeof replyFormSchema>) => {
    if (!conversation) {
      return;
    }

    setIsSendingReply(true);

    try {
      await sendHumanReply({
        conversationId: conversation._id,
        prompt: values.message,
      });

      replyForm.reset();
    } catch {
      replyForm.setError("message", {
        message: "Unable to send the reply right now.",
      });
    } finally {
      setIsSendingReply(false);
    }
  };

  useEffect(() => {
    replyForm.reset();
  }, [replyForm, selectedConversationId]);

  useEffect(() => {
    if (
      !selectedConversationId ||
      conversation !== null ||
      initialConversation.results.length === 0
    ) {
      return;
    }

    const fallbackConversationId = initialConversation.results[0]?._id;

    if (
      !fallbackConversationId ||
      fallbackConversationId === selectedConversationId
    ) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("conversationId", fallbackConversationId);
    router.replace("/conversations?" + params.toString());
  }, [
    conversation,
    initialConversation.results,
    router,
    searchParams,
    selectedConversationId,
  ]);

  if (
    !selectedConversationId &&
    initialConversation.status === "LoadingFirstPage"
  ) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center px-4 py-6 md:px-6">
        <Card className="glass-panel w-full max-w-xl py-0">
          <CardHeader>
            <CardTitle>Loading conversations</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!selectedConversationId && initialConversation.results.length === 0) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center px-4 py-6 md:px-6">
        <Card className="glass-panel w-full max-w-xl py-0">
          <CardHeader>
            <CardTitle>No conversations yet</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            New customer chats from the widget will appear here automatically.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedConversationId && conversation === undefined) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center px-4 py-6 md:px-6">
        <Card className="glass-panel w-full max-w-xl py-0">
          <CardHeader>
            <CardTitle>Loading thread</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (selectedConversationId && conversation === null) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center px-4 py-6 md:px-6">
        <Card className="glass-panel w-full max-w-xl py-0">
          <CardHeader>
            <CardTitle>Conversation not found</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Pick another conversation from the inbox to continue reviewing
            messages.
          </CardContent>
        </Card>
      </div>
    );
  }

  const country = getCountryPresentation(conversation?.contactSession.metadata);
  const replyModeCopy =
    conversation?.status === "resolved"
      ? "This thread is resolved. Switch it back to unresolved or escalated before sending another message."
      : conversation?.status === "escalated"
        ? "Human support is active. Your reply will appear in the widget immediately."
        : "Sending a dashboard reply will escalate this conversation and pause AI auto-replies.";
  const messageCountLabel =
    orderedMessages.length === 1
      ? "1 message loaded"
      : orderedMessages.length + " messages loaded";

  return (
    <div className="flex h-full min-h-0 flex-col px-3 py-3 md:px-5 md:py-5 xl:px-6 xl:py-6">
      <div className="grid h-full min-h-0 gap-5 xl:grid-cols-[minmax(320px,360px)_minmax(0,1fr)]">
        <div className="glass-panel min-h-[360px] overflow-hidden py-0 xl:min-h-0">
          <ConversationPanel />
        </div>

        <div className="flex min-h-0 flex-col gap-5">
          {conversation ? (
            <>
              <section className="glass-panel relative overflow-hidden p-5 md:p-6">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-primary/12 via-sky-500/8 to-emerald-400/10" />
                <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <ConversationStatusIcon status={conversation.status} />
                      <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1 capitalize"
                      >
                        {conversation.status}
                      </Badge>
                      <div className="rounded-full border border-white/65 bg-white/72 px-3 py-1 text-xs font-medium text-muted-foreground shadow-[0_18px_40px_-34px_rgba(15,23,42,0.4)] dark:border-white/10 dark:bg-white/6">
                        {messageCountLabel}
                      </div>
                    </div>

                    <div>
                      <p className="page-eyebrow">Customer Support Workspace</p>
                      <h1 className="page-title mt-2 text-2xl md:text-4xl">
                        {conversation.contactSession.name}
                      </h1>
                      <p className="page-subtitle mt-3 max-w-3xl leading-7">
                        Review the full transcript, customer details, and live
                        support status from one polished workspace.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5 text-sm">
                      <div className="rounded-full border border-white/65 bg-white/72 px-3.5 py-2 text-foreground shadow-[0_16px_38px_-32px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/6">
                        <span className="mr-2" aria-hidden="true">
                          {country.flag}
                        </span>
                        {country.name}
                      </div>
                      <div className="rounded-full border border-white/65 bg-white/72 px-3.5 py-2 text-foreground shadow-[0_16px_38px_-32px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/6">
                        {conversation.contactSession.email}
                      </div>
                      <div className="rounded-full border border-white/65 bg-white/72 px-3.5 py-2 text-foreground shadow-[0_16px_38px_-32px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/6">
                        Created {formatTimestamp(conversation._creationTime)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 rounded-[1.45rem] border border-white/60 bg-white/58 p-2 shadow-[0_28px_64px_-46px_rgba(15,23,42,0.5)] backdrop-blur-sm dark:border-white/10 dark:bg-white/6">
                    {statusOptions.map((statusOption) => (
                      <Button
                        key={statusOption.value}
                        className={cn(
                          "min-w-[132px] justify-center rounded-[1.15rem] px-4 shadow-none",
                          conversation.status === statusOption.value &&
                            "shadow-[0_20px_38px_-24px_rgba(15,23,42,0.4)]",
                        )}
                        disabled={
                          isUpdatingStatus ||
                          conversation.status === statusOption.value
                        }
                        onClick={() => handleStatusChange(statusOption.value)}
                        variant={
                          conversation.status === statusOption.value
                            ? "default"
                            : "outline"
                        }
                      >
                        {statusOption.value === "resolved" ? (
                          <CheckIcon className="size-4" />
                        ) : statusOption.value === "escalated" ? (
                          <TriangleAlertIcon className="size-4" />
                        ) : (
                          <RefreshCwIcon className="size-4" />
                        )}
                        {statusOption.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </section>

              <div className="grid h-full min-h-0 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
                <Card className="glass-panel flex min-h-0 flex-col overflow-hidden py-0">
                  <CardHeader className="border-b border-border/60 px-5 py-5 md:px-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="page-eyebrow">Live Transcript</p>
                        <CardTitle className="mt-2 text-xl">
                          Transcript
                        </CardTitle>
                        <CardDescription className="mt-2 max-w-2xl leading-6">
                          Messages now follow natural chat order, with the
                          newest reply staying at the bottom where support teams
                          expect it.
                        </CardDescription>
                      </div>

                      <div className="rounded-[1.2rem] border border-white/65 bg-white/72 px-4 py-3 text-right shadow-[0_20px_45px_-38px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/6">
                        <p className="text-[10px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                          Loaded
                        </p>
                        <p className="mt-1 text-lg font-semibold">
                          {orderedMessages.length}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex min-h-0 flex-1 flex-col p-0">
                    <AIConversations className="flex min-h-0 flex-1 flex-col">
                      <AIConversationContent className="flex min-h-full flex-col p-0">
                        <InfiniteScrollTrigger
                          ref={topElementRef}
                          canLoadMore={canLoadMore}
                          isLoading={isLoading}
                          onLoadMore={handleLoadMore}
                          className="px-4 pt-4 md:px-6 md:pt-5"
                          noMoreText={
                            orderedMessages.length > 0
                              ? "Start of conversation"
                              : ""
                          }
                        />

                        <div className="flex flex-1 flex-col justify-end gap-3 px-4 pb-5 md:px-6 md:pb-6">
                          {orderedMessages.length === 0 ? (
                            <div className="flex min-h-56 items-center justify-center rounded-[1.6rem] border border-dashed border-border/70 bg-background/40 px-4 text-center text-sm text-muted-foreground">
                              No messages have been saved for this thread yet.
                            </div>
                          ) : null}

                          {orderedMessages.map((item) => {
                            const message = item.message;

                            if (!message) {
                              return null;
                            }

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
                                key={
                                  item.id ??
                                  String(item.order) +
                                    "-" +
                                    String(item.stepOrder)
                                }
                                from={
                                  message.role === "user" ? "user" : "assistant"
                                }
                              >
                                <AIMessageContent
                                  className={cn(
                                    message.role === "assistant" &&
                                      "border-white/70 bg-white/88 shadow-[0_22px_48px_-38px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-white/7",
                                  )}
                                >
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
                                  <AIResponse className="text-[15px] leading-7">
                                    {getMessageText(message) ??
                                      "Unsupported message format"}
                                  </AIResponse>
                                </AIMessageContent>
                              </AIMessage>
                            );
                          })}
                        </div>
                      </AIConversationContent>
                      <AIConversationScrollButton />
                    </AIConversations>

                    <div className="border-t border-border/60 bg-gradient-to-b from-white/20 to-white/5 p-4 md:p-5">
                      <div
                        className={cn(
                          "mb-4 rounded-[1.35rem] border px-4 py-3.5 text-sm leading-6 shadow-[0_18px_42px_-36px_rgba(15,23,42,0.35)]",
                          conversation.status === "resolved"
                            ? "border-border/70 bg-background/60 text-muted-foreground"
                            : conversation.status === "escalated"
                              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100"
                              : "border-amber-500/25 bg-amber-500/10 text-amber-950 dark:text-amber-100",
                        )}
                      >
                        {replyModeCopy}
                      </div>

                      <Form {...replyForm}>
                        <AIInput
                          className="border-white/65 bg-white/74"
                          onSubmit={replyForm.handleSubmit(handleHumanReply)}
                        >
                          <FormField
                            control={replyForm.control}
                            disabled={conversation.status === "resolved"}
                            name="message"
                            render={({ field, fieldState }) => (
                              <>
                                <AIInputTextarea
                                  disabled={
                                    conversation.status === "resolved" ||
                                    isSendingReply
                                  }
                                  onChange={field.onChange}
                                  onKeyDown={(event) => {
                                    if (
                                      event.key === "Enter" &&
                                      !event.shiftKey
                                    ) {
                                      event.preventDefault();
                                      replyForm.handleSubmit(
                                        handleHumanReply,
                                      )();
                                    }
                                  }}
                                  placeholder={
                                    conversation.status === "resolved"
                                      ? "This conversation is resolved."
                                      : conversation.status === "escalated"
                                        ? "Write the next human support reply..."
                                        : "Reply as the company handler and escalate to human support..."
                                  }
                                  value={field.value}
                                />
                                <AIInputToolbar className="gap-3">
                                  <AIInputTools>
                                    <Badge
                                      variant="outline"
                                      className="rounded-full border-border/70 px-3 py-1 text-[10px] tracking-[0.18em] uppercase"
                                    >
                                      Human Reply
                                    </Badge>
                                    <span className="hidden text-xs text-muted-foreground md:inline">
                                      Press Enter to send
                                    </span>
                                  </AIInputTools>
                                  <AIInputSubmit
                                    className="min-w-[92px]"
                                    disabled={
                                      conversation.status === "resolved" ||
                                      !replyForm.formState.isValid ||
                                      isSendingReply
                                    }
                                    size="default"
                                    status={
                                      isSendingReply ? "submitted" : "ready"
                                    }
                                    type="submit"
                                  >
                                    Reply
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
                      </Form>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex min-h-0 flex-col gap-5">
                  <Card className="glass-panel py-0">
                    <CardHeader className="border-b border-border/60 px-5 py-5">
                      <CardTitle>Contact</CardTitle>
                      <CardDescription>
                        The core customer details attached to this thread.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 p-5">
                      <div className="rounded-[1.3rem] border border-white/60 bg-white/62 p-4 shadow-[0_18px_42px_-36px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/6">
                        <div className="flex items-start gap-3">
                          <User2Icon className="mt-0.5 size-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">
                              {conversation.contactSession.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Customer name
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[1.3rem] border border-white/60 bg-white/62 p-4 shadow-[0_18px_42px_-36px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/6">
                        <div className="flex items-start gap-3">
                          <MailIcon className="mt-0.5 size-4 text-primary" />
                          <div>
                            <p className="break-all text-sm font-medium">
                              {conversation.contactSession.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Email address
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[1.3rem] border border-white/60 bg-white/62 p-4 shadow-[0_18px_42px_-36px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/6">
                        <div className="flex items-start gap-3">
                          <Globe2Icon className="mt-0.5 size-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">
                              <span className="mr-2" aria-hidden="true">
                                {country.flag}
                              </span>
                              {country.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Country
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[1.3rem] border border-white/60 bg-white/62 p-4 shadow-[0_18px_42px_-36px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/6">
                        <div className="flex items-start gap-3">
                          <Clock3Icon className="mt-0.5 size-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">
                              {formatTimestamp(conversation._creationTime)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Conversation created
                            </p>
                          </div>
                        </div>
                      </div>

                      {conversation.contactSession.metadata?.viewportSize ? (
                        <div className="rounded-[1.3rem] border border-white/60 bg-white/62 p-4 shadow-[0_18px_42px_-36px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/6">
                          <div className="flex items-start gap-3">
                            <MonitorIcon className="mt-0.5 size-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium">
                                {
                                  conversation.contactSession.metadata
                                    .viewportSize
                                }
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Viewport
                                {conversation.contactSession.metadata.platform
                                  ? " on " +
                                    conversation.contactSession.metadata
                                      .platform
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>

                  <Card className="glass-panel py-0">
                    <CardHeader className="border-b border-border/60 px-5 py-5">
                      <CardTitle>Session Context</CardTitle>
                      <CardDescription>
                        Thread metadata and browsing context for support
                        debugging.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 p-5 text-sm">
                      <div className="rounded-[1.3rem] border border-white/60 bg-white/62 p-4 shadow-[0_18px_42px_-36px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/6">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-muted-foreground">
                            Organization
                          </span>
                          <span className="break-all text-right font-medium">
                            {conversation.organizationId}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-[1.3rem] border border-white/60 bg-white/62 p-4 shadow-[0_18px_42px_-36px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/6">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-muted-foreground">Thread</span>
                          <span className="break-all text-right font-medium">
                            {conversation.threadId}
                          </span>
                        </div>
                      </div>

                      {conversation.contactSession.metadata?.currentUrl ? (
                        <div className="rounded-[1.3rem] border border-white/60 bg-white/62 p-4 shadow-[0_18px_42px_-36px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/6">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-muted-foreground">
                              Current URL
                            </span>
                            <span className="break-all text-right font-medium">
                              {conversation.contactSession.metadata.currentUrl}
                            </span>
                          </div>
                        </div>
                      ) : null}

                      {conversation.contactSession.metadata?.timezone ? (
                        <div className="rounded-[1.3rem] border border-white/60 bg-white/62 p-4 shadow-[0_18px_42px_-36px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/6">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-muted-foreground">
                              Timezone
                            </span>
                            <span className="text-right font-medium">
                              {conversation.contactSession.metadata.timezone}
                            </span>
                          </div>
                        </div>
                      ) : null}

                      {conversation.contactSession.metadata?.referrer ? (
                        <div className="rounded-[1.3rem] border border-white/60 bg-white/62 p-4 shadow-[0_18px_42px_-36px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/6">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-muted-foreground">
                              Referrer
                            </span>
                            <span className="break-all text-right font-medium">
                              {conversation.contactSession.metadata.referrer}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
