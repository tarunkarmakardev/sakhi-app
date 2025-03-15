import { z } from "zod";

export const FeedbackPostPayload = z.object({
  text: z.string(),
  language: z.string(),
});
export const FeedbackPostData = z.object({
  categories: z.record(z.string()),
});

export const FeedbackAudioPostPayload = z.object({
  audio: z.instanceof(Blob), // Ensures it's a Blob (audio file)
  language: z.string(),
});

export type FeedbackAudioPostPayload = z.infer<typeof FeedbackAudioPostPayload>;
export type FeedbackPostPayload = z.infer<typeof FeedbackPostPayload>;
export type FeedbackPostData = z.infer<typeof FeedbackPostData>;
