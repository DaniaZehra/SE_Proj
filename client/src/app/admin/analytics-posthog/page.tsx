'use client'

import { useState, useEffect } from "react";

export default function Analytics(){
    const [iframeHeight, setIframeHeight] = useState("700px");

    useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
        if (event.data.event === "posthog:dimensions") {
        setIframeHeight(`${event.data.height}px`);
        }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
    }, []);

    return(
        <div>
            <iframe width="100%" height={iframeHeight} allowFullScreen src="https://us.posthog.com/embedded/4f5XOjXnZWtneKLaHgGpGLuKDZWAlQ"></iframe>
        </div>
    )
}