import { forwardRef } from "react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface InfiniteScrollTriggerProps {
  canLoadMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  loadMoreText?: string;
  noMoreText?: string;
  className?: string;
}

export const InfiniteScrollTrigger = forwardRef<
  HTMLDivElement,
  InfiniteScrollTriggerProps
>(
  (
    {
      canLoadMore,
      isLoading,
      onLoadMore,
      loadMoreText = "Load More",
      noMoreText = "No More Items",
      className,
    },
    ref,
  ) => {
    let text = loadMoreText;

    if (isLoading) {
      text = "Loading...";
    } else if (!canLoadMore) {
      text = noMoreText;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full items-center justify-center py-2",
          className,
        )}
      >
        {canLoadMore || isLoading ? (
          <Button
            disabled={!canLoadMore || isLoading}
            onClick={onLoadMore}
            variant="ghost"
          >
            {text}
          </Button>
        ) : noMoreText ? (
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground/70 uppercase">
            {noMoreText}
          </p>
        ) : null}
      </div>
    );
  },
);

InfiniteScrollTrigger.displayName = "InfiniteScrollTrigger";
