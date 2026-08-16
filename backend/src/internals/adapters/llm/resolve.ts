import Gemini from "./index.ts";
import type LLMRepository from "../../domain/llm/repository.ts";
import type AppSecrets from "../../../packages/secret";
import {googleGeminiClient} from "../../../packages/utils/connections.ts";

/**
 * Picks the LLM client for a single request: the user's own Gemini key when they
 * configured one, otherwise the platform client.
 *
 * Always use the returned value locally — never assign it back onto a command's
 * field. Commands are constructed once at boot, so a swapped field would leak one
 * user's key (and their quota) to every later request from every other user.
 */
export const llmForUser = (
    apiKey: string | undefined | null,
    appSecrets: AppSecrets,
    platformLLM: LLMRepository
): LLMRepository => {
    if (!apiKey) return platformLLM
    return new Gemini(googleGeminiClient(apiKey), appSecrets, true)
}
