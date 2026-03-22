import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import { ConversationPanel } from "../components/conversation-panel";

interface ConversationLayoutProps {
  children: React.ReactNode;
}

export const ConversationLayout = ({ children }: ConversationLayoutProps) => {
  return (
    <ResizablePanelGroup className="h-full flex-1">
      <ResizablePanel defaultSize={30} maxSize={45} minSize={22}>
        <ConversationPanel />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="h-full" defaultSize={70}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
