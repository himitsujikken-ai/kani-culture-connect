export interface Topic {
  id: string;
  label: string;
  emoji: string;
  contextPrompt: string;
}

export const topics: Topic[] = [
  {
    id: "sengoku",
    label: "蘭丸と戦国を語る",
    emoji: "⚔️",
    contextPrompt:
      "ユーザーは戦国時代と可児市の関わりに興味があります。森蘭丸、明智光秀、金山城、久々利城などの話題を中心に、戦国ロマンあふれる語り口で応答してください。",
  },
  {
    id: "rose",
    label: "バラの香りを巡る",
    emoji: "🌹",
    contextPrompt:
      "ユーザーはぎふワールド・ローズガーデンやバラの文化に興味があります。バラの品種、見頃、庭園の魅力を詩的に語り、可児市と花の文化を結びつけて応答してください。",
  },
  {
    id: "craftsman",
    label: "職人の技に触れる",
    emoji: "🎸",
    contextPrompt:
      "ユーザーはヤイリギターや可児市のものづくり文化に興味があります。職人の技、志野焼・織部焼、地場産業の誇りを情熱的に語ってください。",
  },
];
