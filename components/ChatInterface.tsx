"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { useState, useRef, useEffect, useMemo, type FormEvent } from "react";
import { MessageBubble } from "./MessageBubble";
import { TopicHub } from "./TopicHub";
import { UtilityDrawer } from "./UtilityDrawer";
import { topics, type Topic } from "@/lib/topics";

export function ChatInterface() {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const topicContext =
    topics.find((t) => t.id === activeTopic)?.contextPrompt ?? null;

  const transport = useMemo(
    () =>
      new TextStreamChatTransport({
        api: "/api/chat",
        body: { topicContext },
      }),
    [topicContext]
  );

  const { messages, sendMessage, status } = useChat({ transport });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleTopicSelect = (topic: Topic | null) => {
    setActiveTopic(topic?.id ?? null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleUtilityAsk = (question: string) => {
    sendMessage({ text: question });
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto relative">
      {/* Header */}
      <header className="text-center py-4 px-4">
        <h1 className="text-lg font-bold text-[#2C2C2C]">
          Kani-Culture Connect
        </h1>
        <p className="text-xs text-[#C5A572]">可児市の記憶と文化を語るAI</p>
      </header>

      {/* Topic Hub */}
      <TopicHub activeTopic={activeTopic} onSelectTopic={handleTopicSelect} />

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-32">
        {messages.length === 0 && (
          <div className="text-center mt-20 text-[#2C2C2C]/40">
            <p className="text-4xl mb-3">🏯</p>
            <p className="text-sm">
              可児市の歴史・文化・暮らしについて
              <br />
              なんでもお尋ねください
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <MessageBubble
            key={m.id}
            message={m}
            isStreaming={
              isLoading && i === messages.length - 1 && m.role === "assistant"
            }
          />
        ))}
      </div>

      {/* Input */}
      <div className="fixed bottom-12 left-0 right-0 px-4 pb-2">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="可児市について聞いてみましょう..."
            className="flex-1 rounded-full px-4 py-3 bg-white/90 border border-[#C5A572]/30 text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 focus:outline-none focus:border-[#C41E3A]/50 shadow-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-full w-10 h-10 flex items-center justify-center bg-[#C41E3A] text-white disabled:opacity-40 shadow-sm hover:bg-[#A01830] transition-colors"
          >
            ↑
          </button>
        </form>
      </div>

      {/* Utility Drawer */}
      <UtilityDrawer onAsk={handleUtilityAsk} />
    </div>
  );
}
