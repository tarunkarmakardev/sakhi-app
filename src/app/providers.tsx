"use client";
import { GlobalStoreProvider } from "@/features/global-store/context";
import QueryProvider from "@/features/query-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <GlobalStoreProvider>{children}</GlobalStoreProvider>
    </QueryProvider>
  );
}
