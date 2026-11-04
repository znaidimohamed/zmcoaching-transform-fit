import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Tried in order. If one is retired (404), overloaded or out of quota, the next one is used.
// Google retires models regularly: set GEMINI_MODEL in Render to switch without a code change.
const MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
].filter((m, i, arr): m is string => !!m && arr.indexOf(m) === i);

const MAX_MESSAGE_LENGTH = 1000;

type GeminiError = { status?: number; message?: string };

const buildPrompt = (message: string) => `
    You are ZM Coach AI, a fitness coaching assistant.

    IMPORTANT LANGUAGE RULES:
    - If the user writes in Tunisian Arabic, reply ONLY in Tunisian Arabic.
    - If the user writes in French, reply ONLY in French.
    - If the user writes in English, reply ONLY in English.
    - NEVER switch language by yourself.

    BEHAVIOR:
    - Keep answers short and motivating.
    - Act like a real fitness coach.
    - Give practical fitness and nutrition advice.
    - Avoid medical advice.
    - Keep responses under 80 words.

    User message:
    ${message}
    `;

export const coachChat = async (req: Request, res: Response) => {
  const message =
    typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ message: "Message is too long" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("[AI] GEMINI_API_KEY is missing on the server");
    return res.status(500).json({ message: "AI failed", reason: "no_api_key" });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  let lastError: GeminiError = {};

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(buildPrompt(message));
      const reply = result.response.text();

      if (reply && reply.trim()) {
        return res.json({ reply });
      }

      lastError = { message: "Empty reply from model" };
      console.error(`[AI] ${modelName} returned an empty reply`);
    } catch (error) {
      const err = error as GeminiError;
      lastError = err;

      console.error(
        `[AI] ${modelName} failed | status: ${err.status ?? "n/a"} | ${err.message ?? error}`
      );

      // Invalid / revoked key or bad request: other models will fail the same way.
      if (err.status === 400 || err.status === 401 || err.status === 403) {
        break;
      }
    }
  }

  // Tell the front-end what kind of failure it was (the real error is in the server logs).
  const status = lastError.status;

  if (status === 400 || status === 401 || status === 403) {
    return res.status(500).json({ message: "AI failed", reason: "invalid_key" });
  }

  if (status === 429) {
    return res.status(429).json({ message: "AI failed", reason: "quota" });
  }

  return res.status(503).json({ message: "AI failed", reason: "unavailable" });
};
