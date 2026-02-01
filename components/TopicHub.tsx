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
            className={`flex-shrink-0 px-5 py-2.5 text-base font-semibold tracking-wide transition-all border-2 ${
              isActive
                ? "bg-black text-white border-black"
                : "bg-transparent text-black border-black/20 hover:border-black"
            }`}
          >
            <span className="mr-2">{topic.emoji}</span>
            {topic.label}
          </button>
        );
      })}
    </div>
  );
}
