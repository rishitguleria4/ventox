import Vapi from "@vapi-ai/web";
import { useEffect, useState } from "react";

interface TranscriptMessage
{
    role : "user" | "assistant";
    text : string ;
};

export const useVapi = () => {
    const [vapi] = useState(() => new Vapi(""));
    const [isConnected , setIsConnected] = useState(false);
    const [isConnecting , setIsConnecting] = useState(false);
    const [isSpeaking , setIsSpeaking] = useState(false);
    const [transcript , setTranscript] = useState<TranscriptMessage[]>([]);

    useEffect(() => {
        //only for testing vapi otherwise vapi will be provided by user
        vapi.on("call-start" , () =>
        {
            setIsConnected(true);
            setIsConnecting(false);
            setTranscript([]);
        }
        );
        vapi.on("call-end" , ()=>{
            setIsConnected(false);
            setIsConnecting(false);
            setIsSpeaking(false);
        });
        vapi.on("speech-start" , () =>{
            setIsSpeaking(true);
        })
        vapi.on("speech-end" , () => {
            setIsSpeaking(false);
        });

        vapi.on("error" , (error)=> {
            console.log(error , "VAPI_ERROR");
            setIsConnecting(false);
        });

        vapi.on("message" ,(message) => {
            if (message.type === "transcript" &&  message.transcriptType === "final")
            {
                setTranscript((prev) => [
                    ...prev,
                    {
                        role : message.role === "user" ? "user" :"assistant",
                        text : message.transcript,
                    }
                ] );
            }
        });

        return () =>
        {
            vapi.stop();
        }
    },
    [vapi]);

    const startCall = () => 
    {
        setIsConnecting(true);
        //only for testing vapi otheerwise vapi will be provided by user
        vapi.start("");
    }

    const endCall = () =>
    {
        vapi.stop();
    };

    return{
        isSpeaking,
        isConnecting,
        isConnected,
        transcript,
        startCall,
        endCall,
    }
};
