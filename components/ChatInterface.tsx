"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useMemo, type FormEvent } from "react";
import { MessageBubble } from "./MessageBubble";
import { TopicHub } from "./TopicHub";
import { UtilityDrawer } from "./UtilityDrawer";
import { topics, type Topic } from "@/lib/topics";

export function ChatInterface() {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [typewriterDelay, setTypewriterDelay] = useState(60);
  const scrollRef = useRef<HTMLDivElement>(null);

  const topicContext =
    topics.find((t) => t.id === activeTopic)?.contextPrompt ?? null;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { topicContext, isGreeting: isFirstMessage },
      }),
    [topicContext, isFirstMessage]
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
    if (isFirstMessage) {
      setIsFirstMessage(false);
    }
  };

  const handleUtilityAsk = (question: string) => {
    sendMessage({ text: question });
    if (isFirstMessage) {
      setIsFirstMessage(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto relative z-10">
      {/* Obi diagonal accent */}
      <div className="obi-accent top-24 -left-1/4" />

      {/* Header */}
      <header className="px-6 pt-8 pb-4 relative">
        <p className="text-[0.7rem] tracking-[0.3em] text-[#B8860B] mb-2" style={{ fontFamily: "'Didot', 'Noto Serif JP', serif" }}>
          KANI CITY BRAIN BANK
        </p>
        <h1
          className="text-4xl font-extrabold tracking-wider text-[#2B2B2B] leading-tight"
          style={{ fontFamily: "'Noto Serif JP', 'Shippori Mincho', serif" }}
        >
          可児市ブレインバンク
        </h1>
        <div className="brush-line w-20 mt-3" />
      </header>

      {/* Topic Hub */}
      <TopicHub activeTopic={activeTopic} onSelectTopic={handleTopicSelect} />

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pb-48">
        {messages.length === 0 && (
          <div className="mt-12 relative">
            <p
              className="text-5xl font-black text-[#C5A059]/10 leading-none mb-4"
              style={{ fontFamily: "'Noto Serif JP', serif", writingMode: "vertical-rl" }}
            >
              問
            </p>
            <p className="text-lg text-[#2B2B2B]/50 leading-[2] mt-6">
              可児市の歴史・文化・暮らしについて
              <br />
              なんでもお尋ねください
            </p>
            <div className="mt-4 brush-line w-16" />
          </div>
        )}
        {messages.map((m, i) => (
          <MessageBubble
            key={m.id}
            message={m}
            isStreaming={
              isLoading && i === messages.length - 1 && m.role === "assistant"
            }
            typewriterDelay={typewriterDelay}
          />
        ))}
      </div>

      {/* Input area */}
      <div className="fixed bottom-14 left-0 right-0 px-6 pb-3 z-20">
        {/* Speed slider */}
        <div className="max-w-3xl mx-auto flex items-center gap-3 mb-2 px-1">
          <span className="text-xs text-[#B8860B]/60" style={{ fontFamily: "'Shippori Mincho', serif" }}>
            🐢
          </span>
          <input
            type="range"
            min={10}
            max={120}
            step={10}
            value={120 - typewriterDelay + 10}
            onChange={(e) => setTypewriterDelay(120 - Number(e.target.value) + 10)}
            className="flex-1 h-1 accent-[#C5A059] cursor-pointer"
          />
          <span className="text-xs text-[#B8860B]/60" style={{ fontFamily: "'Shippori Mincho', serif" }}>
            🐇
          </span>
        </div>
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="お聞きになりたいことをどうぞ..."
            className="flex-1 px-5 py-4 bg-white/80 backdrop-blur-sm text-base text-[#2B2B2B] placeholder:text-[#B8860B]/40 focus:outline-none border border-[#C5A059]/30 focus:border-[#C5A059] rounded-sm transition-colors"
            style={{ fontFamily: "'Shippori Mincho', serif" }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-4 bg-[#C32121] text-white text-base font-bold tracking-widest disabled:opacity-20 hover:bg-[#A01A1A] transition-colors rounded-sm"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          >
            送る
          </button>
        </form>
      </div>

      {/* Utility Drawer */}
      <UtilityDrawer onAsk={handleUtilityAsk} />
    </div>
  );
}
