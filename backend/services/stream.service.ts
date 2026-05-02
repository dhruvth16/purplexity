import { PROPMT_TEMPLATE, SYSTEM_PROMPT, FOLLOW_UP_PROMPT_TEMPLATE } from "../lib/prompt";
import { zodToJsonSchema } from "zod-to-json-schema";
import { tavily } from "@tavily/core";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

const TAVILY_KEY = process.env.TAVILY_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const client = tavily({ apiKey: TAVILY_KEY });
const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

const resSchema = z.object({
  answer: z.array(z.string()),
  followUpQuestions: z.array(z.string()),
});

export async function streamService(query: string) {
  const searchResult = await client.search(query as string, {
    searchDepth: "advanced",
  });

  const webSearchResult = searchResult.results;

  const prompt = PROPMT_TEMPLATE.replace(
    "{{WEB_SEARCH_RESULT}}",
    JSON.stringify(webSearchResult),
  ).replace("{{USER_QUERY}}", query);

  const response = await ai.models.generateContentStream({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resSchema as any),
    },
  });

  return {
    response,
    sources: webSearchResult,
  };
}

export async function followUpStreamService(
  query: string,
  conversationContext: string,
) {
  const searchResult = await client.search(query as string, {
    searchDepth: "advanced",
  });

  const webSearchResult = searchResult.results;

  const prompt = FOLLOW_UP_PROMPT_TEMPLATE.replace(
    "{{CONVERSATION_CONTEXT}}",
    conversationContext,
  )
    .replace("{{WEB_SEARCH_RESULT}}", JSON.stringify(webSearchResult))
    .replace("{{USER_QUERY}}", query);

  const response = await ai.models.generateContentStream({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resSchema as any),
    },
  });

  return {
    response,
    sources: webSearchResult,
  };
}
