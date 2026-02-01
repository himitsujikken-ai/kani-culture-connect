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
    <div className="flex flex-col h-screen max-w-3xl mx-auto relative">
      {/* Header */}
      <header className="px-6 pt-8 pb-2">
        <div className="text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-[#999] mb-1">
          01. KANI CITY AI
        </div>
        <h1 className="text-4xl font-black tracking-tight text-black leading-none">
          可児市ブレインバンク
        </h1>
        <div className="mt-2 h-0.5 w-12 bg-black" />
      </header>

      {/* Topic Hub */}
      <TopicHub activeTopic={activeTopic} onSelectTopic={handleTopicSelect} />

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pb-36">
        {messages.length === 0 && (
          <div className="mt-16">
            <p className="text-6xl font-black text-black/5 leading-none mb-6">
              ASK
              <br />
              ANYTHING
            </p>
            <p className="text-lg text-[#999] leading-relaxed">
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
      <div className="fixed bottom-14 left-0 right-0 px-6 pb-3">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="質問を入力..."
            className="flex-1 px-5 py-4 bg-white text-base text-black placeholder:text-[#ccc] focus:outline-none border-2 border-black/10 focus:border-black transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-4 bg-black text-white text-base font-bold tracking-wider disabled:opacity-20 hover:bg-[#333] transition-colors"
          >
            SEND
          </button>
        </form>
      </div>

      {/* Utility Drawer */}
      <UtilityDrawer onAsk={handleUtilityAsk} />
    </div>
  );
}
