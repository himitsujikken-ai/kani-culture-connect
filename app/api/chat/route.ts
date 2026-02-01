import { google } from "@ai-sdk/google";
import { streamText, createUIMessageStreamResponse } from "ai";
import { systemPrompt } from "@/lib/system-prompt";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, topicContext } = await req.json();

  const fullSystemPrompt = topicContext
    ? `${systemPrompt}\n\n# Current Topic Context\n${topicContext}`
    : systemPrompt;

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: fullSystemPrompt,
    messages,
  });

  return createUIMessageStreamResponse({
    stream: result.toUIMessageStream(),
  });
}
