import { z } from "zod";

export const FeedbackPostPayloadSchema = z.object({
  audio: z.instanceof(Blob).nullable(), // Allows `Blob` or `null`
  language: z.string(),
});
export const FeedbackPostDataSchema = z.object({
  categories: z.record(z.string()),
  videoUrl: z.string(),
});

export type FeedbackPostPayload = z.infer<typeof FeedbackPostPayloadSchema>;
export type FeedbackPostData = z.infer<typeof FeedbackPostDataSchema>;
