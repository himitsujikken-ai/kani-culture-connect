"use client";

import { useState, useEffect, useRef } from "react";
import type { UIMessage } from "ai";

const TYPEWRITER_DELAY = 60; // ms per character

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

  // Typewriter effect for assistant messages
  const [displayedLen, setDisplayedLen] = useState(
    isUser || (!isStreaming && textContent.length > 0) ? textContent.length : 0
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isUser) return;
    // If already done streaming and fully displayed, snap to full
    if (!isStreaming && displayedLen >= textContent.length) {
      setDisplayedLen(textContent.length);
      return;
    }
    // Advance one character at a time
    if (displayedLen < textContent.length) {
      timerRef.current = setTimeout(() => {
        setDisplayedLen((prev) => prev + 1);
      }, TYPEWRITER_DELAY);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [displayedLen, textContent, isStreaming, isUser]);

  // When streaming finishes and we've caught up, snap remaining
  useEffect(() => {
    if (!isStreaming && !isUser && displayedLen >= textContent.length) {
      setDisplayedLen(textContent.length);
    }
  }, [isStreaming, isUser, displayedLen, textContent.length]);

  const visibleText = isUser ? textContent : textContent.slice(0, displayedLen);
  const stillTyping = !isUser && displayedLen < textContent.length;

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
        className={`text-lg leading-[2] text-[#2B2B2B] whitespace-pre-wrap ${
          stillTyping || isStreaming ? "streaming-cursor" : ""
        }`}
        style={{ fontFamily: "'Shippori Mincho', serif" }}
      >
        {visibleText}
      </div>
      {/* Brush stroke divider */}
      <div className="brush-line w-12 mt-4" />
    </div>
  );
}
