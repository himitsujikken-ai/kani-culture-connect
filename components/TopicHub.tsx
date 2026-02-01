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
    <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
      {topics.map((topic) => {
        const isActive = activeTopic === topic.id;
        return (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(isActive ? null : topic)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isActive
                ? "bg-[#C41E3A] text-white shadow-md"
                : "bg-white/70 text-[#2C2C2C] hover:bg-white border border-[#C5A572]/30"
            }`}
          >
            <span>{topic.emoji}</span>
            <span>{topic.label}</span>
          </button>
        );
      })}
    </div>
  );
}
