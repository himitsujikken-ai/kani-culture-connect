"use client";

import { useState } from "react";

const utilities = [
  { icon: "壱", title: "ゴミ出し", desc: "収集日と分別方法" },
  { icon: "弐", title: "行政手続き", desc: "届出・証明書の案内" },
  { icon: "参", title: "防災情報", desc: "避難所・警報の確認" },
  { icon: "肆", title: "公共交通", desc: "バス・電車の時刻表" },
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
          className="fixed inset-0 bg-[#2B2B2B]/30 backdrop-blur-[1px] z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-[#F6F4E8] transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-[calc(100%-3.5rem)]"
        }`}
      >
        {/* Handle with kumihimo border */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center gap-3 py-3 cursor-pointer kumihimo-border border-t-4 border-b-0 border-l-0 border-r-0"
        >
          <span
            className="text-sm font-bold tracking-[0.3em] text-[#B8860B]"
            style={{ fontFamily: "'Shippori Mincho', serif" }}
          >
            暮らしの引き出し
          </span>
          <span className="text-xs text-[#B8860B]/50">
            {isOpen ? "▽" : "△"}
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
              className="w-full flex items-center gap-5 py-5 border-b border-[#C5A059]/15 hover:bg-[#C5A059]/5 transition-colors text-left group"
            >
              <span
                className="text-2xl text-[#C5A059]/30 group-hover:text-[#C32121] transition-colors font-bold"
                style={{ fontFamily: "'Noto Serif JP', serif" }}
              >
                {u.icon}
              </span>
              <div>
                <div
                  className="text-lg font-bold text-[#2B2B2B]"
                  style={{ fontFamily: "'Shippori Mincho', serif" }}
                >
                  {u.title}
                </div>
                <div className="text-sm text-[#B8860B]/60 mt-0.5">
                  {u.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
