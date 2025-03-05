// src/stores/counter-store.ts
import { createStore } from "zustand/vanilla";

export type GlobalState = {
  feedback: string;
  language: string;
};

export type GlobalStateActions = {
  setFeedback: (value: string) => void;
  setLanguage: (value: string) => void;
};

export type FeedbackStore = GlobalState & GlobalStateActions;

export const defaultInitState: GlobalState = {
  feedback: "",
  language: "en-US",
};

export const createGlobalStore = (
  initState: GlobalState = defaultInitState
) => {
  return createStore<FeedbackStore>()((set) => ({
    ...initState,
    setFeedback: (value) => set((s) => ({ ...s, feedback: value })),
    setLanguage: (value) => set((s) => ({ ...s, language: value })),
  }));
};
