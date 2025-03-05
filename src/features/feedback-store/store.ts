// src/stores/counter-store.ts
import { createStore } from "zustand/vanilla";

export type FeedbackState = {
  feedback: string;
};

export type FeedbackStateActions = {
  setFeedback: (value: string) => void;
};

export type FeedbackStore = FeedbackState & FeedbackStateActions;

export const defaultInitState: FeedbackState = {
  feedback: "",
};

export const createFeedbackStore = (
  initState: FeedbackState = defaultInitState
) => {
  return createStore<FeedbackStore>()((set) => ({
    ...initState,
    setFeedback: (value) => set(() => ({ feedback: value })),
  }));
};
