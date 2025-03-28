"use client";
import { type ReactNode, createContext, useRef } from "react";
import { useStore } from "zustand";
import { type FeedbackStore, createGlobalStore } from "../store";
import useContextOrError from "@/lib/hooks";

export type GlobalStoreApi = ReturnType<typeof createGlobalStore>;

export const GlobalStoreContext = createContext<GlobalStoreApi | null>(null);

export interface GlobalStoreProviderProps {
  children: ReactNode;
}

export const GlobalStoreProvider = ({ children }: GlobalStoreProviderProps) => {
  const storeRef = useRef<GlobalStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createGlobalStore();
  }

  return (
    <GlobalStoreContext.Provider value={storeRef.current}>
      {children}
    </GlobalStoreContext.Provider>
  );
};

GlobalStoreContext.displayName = "GlobalStoreProvider";

export const useGlobalStore = <T,>(
  selector: (store: FeedbackStore) => T,
): T => {
  const counterStoreContext = useContextOrError(GlobalStoreContext);
  return useStore(counterStoreContext, selector);
};
