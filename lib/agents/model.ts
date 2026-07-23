import { createOpenAI } from "@ai-sdk/openai";

// Using GPT-4o-mini: cheapest OpenAI model with reliable structured JSON output
// Cost: ~$0.15/1M input tokens, $0.60/1M output tokens
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const aiModel = openai("gpt-4o-mini");
