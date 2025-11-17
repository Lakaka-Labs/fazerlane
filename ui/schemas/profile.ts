import z from "zod";

export const profileSchema = z.object({
  username: z
    .string()
    .regex(
      /^[A-Za-z0-9_]{3,30}$/,
      "Username must be 3–30 chars and contain only letters, numbers, or _"
    ),
  // email: z.string().email("Invalid email"),
});

export const apiKeySchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
});

export const customPromptSchema = z.object({
  customPrompt: z
    .string()
    .max(1000, "Prompt must be less than 1000 characters"),
});

export type ProfileFields = z.infer<typeof profileSchema>;
export type ApiKeyFields = z.infer<typeof apiKeySchema>;
export type CustomPromptFields = z.infer<typeof customPromptSchema>;
