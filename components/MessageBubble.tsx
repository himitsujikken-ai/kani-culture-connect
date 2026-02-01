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

  // Extract text content from parts
  const textContent = message.parts
    ?.filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
    .map((p) => p.text)
    .join("") ?? "";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-[#C41E3A] text-white rounded-br-sm"
            : "bg-white/80 text-[#2C2C2C] rounded-bl-sm shadow-sm border border-[#C5A572]/20"
        }`}
      >
        {!isUser && (
          <div className="text-xs text-[#C5A572] font-medium mb-1">
            かに語り
          </div>
        )}
        <div
          className={`whitespace-pre-wrap text-sm leading-relaxed ${
            isStreaming ? "streaming-cursor" : ""
          }`}
        >
          {textContent}
        </div>
      </div>
    </div>
  );
}
