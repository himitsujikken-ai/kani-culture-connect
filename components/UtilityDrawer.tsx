"use client";

import { useState } from "react";

const utilities = [
  { icon: "🗑️", title: "ゴミ出しカレンダー", desc: "収集日と分別方法" },
  { icon: "📋", title: "行政手続き", desc: "届出・証明書の案内" },
  { icon: "🚨", title: "防災情報", desc: "避難所・警報の確認" },
  { icon: "🚌", title: "公共交通", desc: "バス・電車の時刻表" },
];

export function UtilityDrawer({
  onAsk,
}: {
  onAsk: (question: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-[calc(100%-3rem)]"
        }`}
      >
        {/* Handle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex flex-col items-center py-2 cursor-pointer"
        >
          <div className="w-10 h-1 bg-[#C5A572]/40 rounded-full mb-1" />
          <span className="text-xs text-[#C5A572] font-medium">
            暮らしの引き出し
          </span>
        </button>

        {/* Content */}
        <div className="px-4 pb-6 grid grid-cols-2 gap-3">
          {utilities.map((u) => (
            <button
              key={u.title}
              onClick={() => {
                onAsk(`${u.title}について教えてください`);
                setIsOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#FDF8F5] hover:bg-[#FDE8EC] transition-colors text-left"
            >
              <span className="text-2xl">{u.icon}</span>
              <div>
                <div className="text-sm font-medium text-[#2C2C2C]">
                  {u.title}
                </div>
                <div className="text-xs text-[#2C2C2C]/60">{u.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
