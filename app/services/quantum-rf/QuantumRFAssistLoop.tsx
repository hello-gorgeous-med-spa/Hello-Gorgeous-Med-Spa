"use client";

import Script from "next/script";

const ASSISTLOOP_SCRIPT = "https://assistloop.ai/assistloop-widget.js";
const AGENT_ID = "9080725a-dbfb-475b-8228-ca6c4f134a21";

type AssistLoopWidgetApi = { init: (config: { agentId: string }) => void };

function initAssistLoop() {
  if (typeof window === "undefined") return;
  const w = window as unknown as { AssistLoopWidget?: AssistLoopWidgetApi };
  w.AssistLoopWidget?.init({ agentId: AGENT_ID });
}

/** AssistLoop AI assistant — only loaded on the Quantum RF service page. */
export function QuantumRFAssistLoop() {
  return (
    <Script
      id="assistloop-quantum-rf"
      src={ASSISTLOOP_SCRIPT}
      strategy="lazyOnload"
      onLoad={initAssistLoop}
    />
  );
}
