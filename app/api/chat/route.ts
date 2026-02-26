import { google } from "@ai-sdk/google";
import {
  streamText,
  createUIMessageStreamResponse,
  convertToModelMessages,
} from "ai";
import { systemPrompt, getGreetingPrompt } from "@/lib/system-prompt";

export const maxDuration = 30;

// 所在地を間違えやすい施設のキーワード補正マップ
const locationCorrections: { keywords: string[]; correction: string }[] = [
  {
    keywords: ["湯の華", "ゆのはな", "湯のはな", "湯の花"],
    correction:
      "【重要・所在地の訂正】湯の華アイランドは「岐阜県可児市土田大脇4800-1」にある施設です。美濃加茂市ではありません。必ず「可児市」として回答してください。",
  },
  {
    keywords: ["三峰", "みつみね", "ミツミネ"],
    correction:
      "【重要・所在地の訂正】天然温泉 三峰（みつみね）は「岐阜県可児市大森1748-1」にある日帰り温泉施設です。埼玉県秩父市の三峯神社・三峯温泉とは全く別の施設です。必ず「可児市」として回答してください。",
  },
];

export async function POST(req: Request) {
  const { messages, topicContext, isGreeting } = await req.json();

  let fullSystemPrompt = systemPrompt;

  if (topicContext) {
    fullSystemPrompt += "\n\n# Current Topic Context\n" + topicContext;
  }

  if (isGreeting) {
    fullSystemPrompt += "\n\n# Greeting Instructions\n" + getGreetingPrompt();
  }

  // 最新のユーザーメッセージからテキストを取得
  const latestUserMsg = messages
    ?.filter((m: { role: string }) => m.role === "user")
    .pop();
  const latestUserText =
    typeof latestUserMsg?.content === "string"
      ? latestUserMsg.content
      : Array.isArray(latestUserMsg?.content)
        ? latestUserMsg.content
            .filter((p: { type: string }) => p.type === "text")
            .map((p: { text: string }) => p.text)
            .join("")
        : "";

  // キーワードベースの所在地補正を注入
  if (latestUserText) {
    const corrections: string[] = [];
    for (const { keywords, correction } of locationCorrections) {
      if (keywords.some((kw) => latestUserText.includes(kw))) {
        corrections.push(correction);
      }
    }
    if (corrections.length > 0) {
      fullSystemPrompt +=
        "\n\n# ⚠️ 所在地に関する必須の訂正情報（この情報を最優先で使用すること）\n" +
        corrections.join("\n");
    }
  }

  const modelMessages = messages?.length
    ? await convertToModelMessages(messages)
    : [{ role: "user" as const, content: "自己紹介をしてください" }];

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: fullSystemPrompt,
    messages: modelMessages,
  });

  return createUIMessageStreamResponse({
    stream: result.toUIMessageStream(),
  });
}
