"use client";

import { topics, type Topic } from "@/lib/topics";

export function TopicHub({
  activeTopic,
  onSelectTopic,
}: {
  activeTopic: string | null;
  onSelectTopic: (topic: Topic | null) => void;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto px-6 py-4">
      {topics.map((topic) => {
        const isActive = activeTopic === topic.id;
        return (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(isActive ? null : topic)}
            className={`flex-shrink-0 px-5 py-3 text-base tracking-widest transition-all rounded-sm relative overflow-hidden ${
              isActive
                ? "bg-[#C32121] text-[#F6F4E8]"
                : "bg-[#F6F4E8]/80 text-[#2B2B2B] border border-[#C5A059]/30 hover:border-[#C5A059]"
            }`}
            style={{ fontFamily: "'Shippori Mincho', serif" }}
          >
            <span className="mr-2 text-lg">{topic.emoji}</span>
            {topic.label}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A059]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
