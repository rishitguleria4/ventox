"use client"
"use client"
import { screenAtom } from "../../atoms/widget-atoms"
import { WidgetAuthScreen } from "../screens/widget-auth-screen"
import { useAtomValue } from "jotai"
interface Props {
  organizationId: string
}

export const WidgetView = ({ organizationId }: Props) => {
  const screen = useAtomValue(screenAtom);

  const screenComponents = {
    error : <p>TODO: Error</p>,
    loading : <p>TODO:Loading</p>,
    auth : <WidgetAuthScreen/>,
    voice :<p>TODO : Inbox</p>,
    selection : <p>TODO : Selection </p>,
    chat : <p>TODO : Chat</p>,
    contact : <p> TODO :Contact </p>,
  } as const satisfies Record<string, React.ReactNode>;

  return (
    <main className="flex flex-col w-full h-screen justify">
      {screenComponents[screen] ?? <p>Unknown screen</p>}
    </main>
  );
    </main>
  );
};
