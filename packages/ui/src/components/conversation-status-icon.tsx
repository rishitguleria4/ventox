import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface ConversationStatusIconProps {
  status: "unresolved" | "escalated" | "resolved";
}

const statusConfig = {
  resolved: {
    icon: CheckIcon,
    className: "bg-[#3FB62F]",
  },
  escalated: {
    icon: ArrowUpIcon,
    className: "bg-destructive",
  },
  unresolved: {
    icon: ArrowRightIcon,
    className: "bg-red-500",
  },
} as const;

export const ConversationStatusIcon = ({
  status,
}: ConversationStatusIconProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded-full size-7",
        config.className,
      )}
    >
      <Icon className="size-4 stroke-3 text-white" />
    </div>
  );
};