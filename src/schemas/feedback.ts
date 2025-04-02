import { z } from "zod";

export const FeedbackPostPayloadSchema = z.object({
  audio: z.instanceof(Blob).nullable(), // Allows `Blob` or `null`
  language: z.string(),
});
export const FeedbackPostDataSchema = z.object({
  categories: z.object({
    generalFeedback: z.record(z.string()),
    personalFeedback: z.record(z.string()),
  }),
  criticalComplaints: z.object({
    criticalTypes: z.array(z.string()),
    alertTrigger: z.boolean(),
  }),
  audioUrl: z.string(),
});

export type FeedbackPostPayload = z.infer<typeof FeedbackPostPayloadSchema>;
export type FeedbackPostData = z.infer<typeof FeedbackPostDataSchema>;
