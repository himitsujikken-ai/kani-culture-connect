"use client";

import { useState } from "react";

const utilities = [
  { num: "01", title: "ゴミ出し", en: "WASTE CALENDAR", desc: "収集日と分別方法" },
  { num: "02", title: "行政手続き", en: "PROCEDURES", desc: "届出・証明書の案内" },
  { num: "03", title: "防災情報", en: "DISASTER INFO", desc: "避難所・警報の確認" },
  { num: "04", title: "公共交通", en: "TRANSPORT", desc: "バス・電車の時刻表" },
];

export function UtilityDrawer({
  onAsk,
}: {
  onAsk: (question: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-[calc(100%-3.5rem)]"
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center gap-2 py-3 cursor-pointer border-t-2 border-black"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-black">
            UTILITIES
          </span>
          <span className="text-xs text-[#999]">
            {isOpen ? "▼" : "▲"}
          </span>
        </button>

        <div className="px-6 pb-8">
          {utilities.map((u) => (
            <button
              key={u.title}
              onClick={() => {
                onAsk(`${u.title}について教えてください`);
                setIsOpen(false);
              }}
              className="w-full flex items-baseline gap-4 py-4 border-b border-black/10 hover:bg-[#E9E9E9] transition-colors text-left group"
            >
              <span className="text-3xl font-extralight text-black/20 group-hover:text-black transition-colors">
                {u.num}
              </span>
              <div>
                <div className="text-base font-bold text-black">{u.title}</div>
                <div className="text-xs tracking-[0.1em] text-[#999] mt-0.5">
                  {u.en} — {u.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
