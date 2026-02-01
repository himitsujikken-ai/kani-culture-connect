"use client";

import type { UIMessage } from "ai";

export function MessageBubble({
  message,
  isStreaming,
}: {
  message: UIMessage;
  isStreaming?: boolean;
}) {
  const isUser = message.role === "user";

  const textContent =
    message.parts
      ?.filter(
        (p): p is Extract<typeof p, { type: "text" }> => p.type === "text"
      )
      .map((p) => p.text)
      .join("") ?? "";

  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="bg-black text-white rounded-2xl rounded-br-sm px-5 py-3 max-w-[80%]">
          <p className="text-base leading-relaxed">{textContent}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-[#999] mb-2">
        BRAIN BANK
      </div>
      <div
        className={`text-lg leading-[1.8] text-[#333] ${
          isStreaming ? "streaming-cursor" : ""
        }`}
      >
        {textContent}
      </div>
      <div className="mt-3 h-px bg-black/10" />
    </div>
  );
}
