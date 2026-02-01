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
        <div className="bg-[#1D365D] text-[#F6F4E8] rounded-sm px-5 py-3 max-w-[80%] relative">
          <p className="text-base leading-[1.9]">{textContent}</p>
          {/* Gold corner accent */}
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#C5A059]/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 relative">
      {/* Vertical label */}
      <div
        className="text-[0.6rem] tracking-[0.2em] text-[#B8860B]/60 mb-2"
        style={{ fontFamily: "'Didot', serif" }}
      >
        BRAIN BANK
      </div>
      <div
        className={`text-lg leading-[2] text-[#2B2B2B] ${
          isStreaming ? "streaming-cursor" : ""
        }`}
        style={{ fontFamily: "'Shippori Mincho', serif" }}
      >
        {textContent}
      </div>
      {/* Brush stroke divider */}
      <div className="brush-line w-12 mt-4" />
    </div>
  );
}
