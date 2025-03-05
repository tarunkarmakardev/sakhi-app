"use client";
import { type ReactNode, createContext, useRef } from "react";
import { useStore } from "zustand";
import { type FeedbackStore, createFeedbackStore } from "../store";
import useContextOrError from "@/lib/hooks";

export type FeedbackStoreApi = ReturnType<typeof createFeedbackStore>;

export const FeedbackStoreContext = createContext<FeedbackStoreApi | null>(
  null
);

export interface FeedbackStoreProviderProps {
  children: ReactNode;
}

export const FeedbackStoreProvider = ({
  children,
}: FeedbackStoreProviderProps) => {
  const storeRef = useRef<FeedbackStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createFeedbackStore();
  }

  return (
    <FeedbackStoreContext.Provider value={storeRef.current}>
      {children}
    </FeedbackStoreContext.Provider>
  );
};

FeedbackStoreContext.displayName = "FeedbackStoreContext";

export const useFeedbackStore = <T,>(
  selector: (store: FeedbackStore) => T
): T => {
  const counterStoreContext = useContextOrError(FeedbackStoreContext);
  return useStore(counterStoreContext, selector);
};
