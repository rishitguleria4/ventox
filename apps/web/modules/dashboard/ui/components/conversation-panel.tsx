"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { getCountryPresentation } from "@workspace/ui/lib/country";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { usePaginatedQuery } from "convex/react";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  ListIcon,
  MessageSquareTextIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

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

type ConversationFilter = "all" | "unresolved" | "escalated" | "resolved";

const filterOptions: Array<{
  icon: typeof ListIcon;
  label: string;
  value: ConversationFilter;
}> = [
  { icon: ListIcon, label: "All", value: "all" },
  { icon: ArrowRightIcon, label: "Unresolved", value: "unresolved" },
  { icon: ArrowUpIcon, label: "Escalated", value: "escalated" },
  { icon: CheckIcon, label: "Resolved", value: "resolved" },
];

const formatTimestamp = (timestamp: number) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));

export const ConversationPanel = () => {
  const [filter, setFilter] = useState<ConversationFilter>("all");
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedConversationId = searchParams.get("conversationId");

  const conversations = usePaginatedQuery(
    api.private.conversations.getMany,
    {
      status: filter === "all" ? undefined : filter,
    },
    {
      initialNumItems: 20,
    },
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoading } =
    useInfiniteScroll({
      status: conversations.status,
      loadMore: conversations.loadMore,
      loadSize: 20,
      observerEnabled: true,
    });

  const loadedCount = useMemo(
    () => conversations.results.length,
    [conversations.results.length],
  );

  const selectConversation = (conversationId: Id<"conversations">) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("conversationId", conversationId);
    router.push("/conversations?" + params.toString());
  };

  return (
    <div className="flex h-full w-full min-w-0 flex-col bg-sidebar/70 text-sidebar-foreground backdrop-blur-2xl">
      <div className="border-b border-sidebar-border/65 px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-sidebar-foreground/55 uppercase">
              Support Inbox
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-sidebar-foreground">
              Conversations
            </h2>
            <p className="mt-1 text-sm leading-6 text-sidebar-foreground/65">
              Review incoming chats, jump into live threads, and keep status
              moving.
            </p>
          </div>

          <div className="rounded-[1.25rem] border border-sidebar-border/70 bg-white/68 px-3 py-2 text-right shadow-[0_24px_48px_-38px_rgba(15,23,42,0.45)] dark:bg-white/6">
            <p className="text-[10px] font-semibold tracking-[0.22em] text-sidebar-foreground/45 uppercase">
              Loaded
            </p>
            <p className="mt-1 text-lg font-semibold text-sidebar-foreground">
              {loadedCount}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as ConversationFilter)}
          >
            <SelectTrigger className="h-11 rounded-[1.2rem] border-sidebar-border/70 bg-white/76 px-3 shadow-none ring-0 transition-colors hover:bg-white hover:text-sidebar-foreground focus-visible:ring-0 dark:bg-white/6 dark:hover:bg-white/10">
              <SelectValue placeholder="Filter conversations" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="size-4" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-3 p-4">
          {conversations.results.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-sidebar-border/70 bg-white/45 p-5 text-sm leading-6 text-sidebar-foreground/70 dark:bg-white/5">
              No conversations match this filter yet.
            </div>
          ) : null}

          {conversations.results.map((conversation) => {
            const preview = conversation.lastMessage
              ? (getMessageText(conversation.lastMessage.message) ??
                "Message content unavailable")
              : "No messages yet";
            const isActive = selectedConversationId === conversation._id;
            const country = getCountryPresentation(
              conversation.contactSession.metadata,
            );

            return (
              <Button
                key={conversation._id}
                className={cn(
                  "group h-auto w-full justify-start rounded-[1.45rem] border px-4 py-4 text-left transition-all duration-200",
                  isActive
                    ? "border-primary/28 bg-gradient-to-br from-primary/14 to-sky-500/10 shadow-[0_30px_70px_-44px_rgba(37,99,235,0.55)]"
                    : "border-sidebar-border/70 bg-white/62 shadow-[0_26px_60px_-48px_rgba(15,23,42,0.45)] hover:-translate-y-0.5 hover:border-white/80 hover:bg-white/90 dark:bg-white/5 dark:hover:bg-white/8",
                )}
                onClick={() => selectConversation(conversation._id)}
                variant="ghost"
              >
                <div className="flex w-full items-start gap-3">
                  <div className="pt-1">
                    <ConversationStatusIcon status={conversation.status} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-sidebar-foreground">
                          {conversation.contactSession.name}
                        </p>
                        <p className="truncate text-xs text-sidebar-foreground/58">
                          {conversation.contactSession.email}
                        </p>
                      </div>
                      <div className="shrink-0 rounded-full border border-white/70 bg-white/72 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-sidebar-foreground/50 uppercase dark:border-white/10 dark:bg-white/6">
                        {conversation.status}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-sidebar-foreground/55">
                      <span className="rounded-full bg-white/70 px-2.5 py-1 dark:bg-white/6">
                        <span className="mr-1" aria-hidden="true">
                          {country.flag}
                        </span>
                        {country.name}
                      </span>
                      <span>{formatTimestamp(conversation._creationTime)}</span>
                    </div>

                    <div className="rounded-[1.15rem] border border-white/65 bg-white/68 px-3.5 py-3 dark:border-white/10 dark:bg-white/6">
                      <div className="flex items-start gap-2.5">
                        <MessageSquareTextIcon className="mt-0.5 size-4 shrink-0 text-sidebar-foreground/40" />
                        <p className="line-clamp-2 text-sm leading-6 text-sidebar-foreground/72">
                          {preview}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}

          <InfiniteScrollTrigger
            ref={topElementRef}
            canLoadMore={canLoadMore}
            isLoading={isLoading}
            onLoadMore={handleLoadMore}
            className="pt-1"
            noMoreText={
              conversations.results.length > 0 ? "Beginning of inbox" : ""
            }
          />
        </div>
      </ScrollArea>
    </div>
  );
};
