import { google } from "@ai-sdk/google";
import {
  streamText,
  createUIMessageStreamResponse,
  convertToModelMessages,
} from "ai";
import { systemPrompt, getGreetingPrompt } from "@/lib/system-prompt";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, topicContext, isGreeting } = await req.json();

  let fullSystemPrompt = systemPrompt;

  if (topicContext) {
    fullSystemPrompt += "\n\n# Current Topic Context\n" + topicContext;
  }

  if (isGreeting) {
    fullSystemPrompt += "\n\n# Greeting Instructions\n" + getGreetingPrompt();
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
