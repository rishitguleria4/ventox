'use client'

import { useVapi } from "@/modules/widget/hooks/use-vapi";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const {
    isSpeaking,
    isConnecting,
    isConnected,
    transcript,
    startCall,
    endCall,
  } = useVapi();

  return (
    <div className="flex flex-col items-center justify-center min-h-svh max-w-md mx-auto w-full gap-4">
      <p>apps/widget</p>

      <Button onClick={() => startCall()}>
        START CALL
      </Button>

      <Button onClick={() => endCall()} variant="destructive">
        END CALL
      </Button>

      <p>isConnected: {String(isConnected)}</p>
      <p>isConnecting: {String(isConnecting)}</p>
      <p>isSpeaking: {String(isSpeaking)}</p>

      <pre className="text-xs w-full overflow-auto">
        {JSON.stringify(transcript, null, 2)}
      </pre>
    </div>
  );
}