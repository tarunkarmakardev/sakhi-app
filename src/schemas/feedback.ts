import { z } from "zod";

export const FeedbackPostPayload = z.object({
  text: z.string(),
  language: z.string(),
});
export const FeedbackPostData = z.object({
  categories: z.record(z.string()),
});

export type FeedbackPostPayload = z.infer<typeof FeedbackPostPayload>;
export type FeedbackPostData = z.infer<typeof FeedbackPostData>;
