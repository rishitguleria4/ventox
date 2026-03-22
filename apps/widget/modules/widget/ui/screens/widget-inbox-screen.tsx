"use client";

import { extractText } from "@convex-dev/agent";
import { usePaginatedQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftCircleIcon, ArrowRightIcon } from "lucide-react";

import { api } from "@workspace/backend/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";

import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";

export const WidgetInboxScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || ""),
  );

  const conversations = usePaginatedQuery(
    api.public.conversations.getMany,
    contactSessionId
      ? {
          contactSessionId,
        }
      : "skip",
    {
      initialNumItems: 10,
    },
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoading } =
    useInfiniteScroll({
      status: conversations.status,
      loadMore: conversations.loadMore,
      loadSize: 10,
      observerEnabled: true,
    });

  return (
    <>
      <WidgetHeader>
        <div className="space-y-4">
          <Button
            variant="transparent"
            size="icon"
            onClick={() => setScreen("selection")}
            className="rounded-full border border-white/18 bg-white/8"
          >
            <ArrowLeftCircleIcon className="size-6" />
          </Button>
          <div>
            <p className="text-3xl font-semibold tracking-tight">Inbox</p>
            <p className="max-w-sm text-sm leading-6 text-white/88">
              Access your active and historical support threads securely.
            </p>
          </div>
        </div>
      </WidgetHeader>
      <div className="widget-main gap-3 overflow-y-auto px-4 py-4">
        {conversations.results.length === 0 ? (
          <div className="widget-card flex min-h-40 items-center justify-center text-center text-sm leading-6 text-muted-foreground">
            No conversations yet. Start a new chat to create your first thread.
          </div>
        ) : null}
        {conversations.results.map((conversation) => (
          <Button
            className="widget-card h-auto w-full justify-between p-0 text-left"
            variant="ghost"
            key={conversation._id}
            onClick={() => {
              setScreen("chat");
              setConversationId(conversation._id);
            }}
          >
            <div className="flex w-full flex-col gap-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Chat
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(conversation._creationTime), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <ConversationStatusIcon status={conversation.status} />
              </div>
              <div className="flex items-start justify-between gap-3">
                <p className="line-clamp-2 text-sm leading-6 text-foreground/88">
                  {conversation.lastMessage?.message
                    ? (extractText(conversation.lastMessage.message) ??
                      "Message unavailable")
                    : "No messages yet"}
                </p>
                <ArrowRightIcon className="mt-1 size-4 shrink-0 text-muted-foreground" />
              </div>
            </div>
          </Button>
        ))}
        <InfiniteScrollTrigger
          canLoadMore={canLoadMore}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          ref={topElementRef}
          noMoreText={conversations.results.length > 0 ? "Start of inbox" : ""}
        />
      </div>
      <WidgetFooter />
    </>
  );
};
