"use client";

import { extractText } from "@convex-dev/agent";
import { usePaginatedQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

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
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-semibold tracking-tight">Inbox</p>
            <p className="text-xs leading-5 text-white/85">
              Access your active and historical support threads.
            </p>
          </div>
          <Button
            variant="transparent"
            size="sm"
            onClick={() => setScreen("selection")}
            className="h-8 gap-1.5 rounded-full border border-white/18 bg-white/10 px-3 text-xs text-white hover:bg-white/20"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back
          </Button>
        </div>
      </WidgetHeader>
      <div className="widget-main gap-2.5 overflow-y-auto px-3 py-3">
        {conversations.results.length === 0 ? (
          <div className="widget-card flex min-h-36 items-center justify-center text-center text-sm leading-6 text-muted-foreground">
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
            <div className="flex w-full flex-col gap-2 p-3.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Chat
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(conversation._creationTime), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <ConversationStatusIcon status={conversation.status} />
              </div>
              <div className="flex items-start justify-between gap-3">
                <p className="line-clamp-2 text-sm leading-5 text-foreground/88">
                  {conversation.lastMessage?.message
                    ? (extractText(conversation.lastMessage.message) ??
                      "Message unavailable")
                    : "No messages yet"}
                </p>
                <ArrowRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
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
