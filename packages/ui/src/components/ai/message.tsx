import type { ComponentProps, HTMLAttributes } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { cn } from "@workspace/ui/lib/utils";

export type AIMessageProps = HTMLAttributes<HTMLDivElement> & {
  from: "user" | "assistant";
};

export const AIMessage = ({ className, from, ...props }: AIMessageProps) => (
  <div
    className={cn(
      "group flex w-full items-end gap-3 py-2.5",
      from === "user"
        ? "is-user justify-end"
        : "is-assistant flex-row-reverse justify-end",
      "[&>div]:max-w-[min(84%,44rem)]",
      className,
    )}
    {...props}
  />
);

export type AIMessageContentProps = HTMLAttributes<HTMLDivElement>;

export const AIMessageContent = ({
  children,
  className,
  ...props
}: AIMessageContentProps) => (
  <div
    className={cn(
      "break-words",
      "flex flex-col gap-2 rounded-[1.4rem] border border-white/65 px-4 py-3 text-sm leading-relaxed shadow-[0_20px_45px_-34px_rgba(15,23,42,0.45)] backdrop-blur-sm",
      "bg-white/82 text-foreground dark:border-white/10 dark:bg-white/6",
      "group-[.is-user]:border-transparent group-[.is-user]:bg-gradient-to-br group-[.is-user]:from-primary group-[.is-user]:via-primary group-[.is-user]:to-sky-500 group-[.is-user]:text-primary-foreground group-[.is-user]:shadow-[0_24px_40px_-24px_rgba(37,99,235,0.65)]",
      className,
    )}
    {...props}
  >
    <div className="space-y-2">{children}</div>
  </div>
);

export type AIMessageAvatarProps = ComponentProps<typeof Avatar> & {
  src: string;
  name?: string;
};

export const AIMessageAvatar = ({
  src,
  name,
  className,
  ...props
}: AIMessageAvatarProps) => (
  <Avatar className={cn("size-8", className)} {...props}>
    <AvatarImage alt="" className="mt-0 mb-0" src={src} />
    <AvatarFallback>{name?.slice(0, 2) || "ME"}</AvatarFallback>
  </Avatar>
);
