"use client";
import { FeedbackStoreProvider } from "@/features/feedback-store/context";
import QueryProvider from "@/features/query-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <FeedbackStoreProvider>{children}</FeedbackStoreProvider>
    </QueryProvider>
  );
}
