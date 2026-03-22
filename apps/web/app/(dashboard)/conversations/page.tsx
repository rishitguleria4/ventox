"use client";

import dynamic from "next/dynamic";

const ConversationsView = dynamic(
  () =>
    import("@/modules/dashboard/ui/views/conversations-view").then(
      (module) => module.ConversationsView,
    ),
  { ssr: false },
);

const Page = () => <ConversationsView />;

export default Page;
