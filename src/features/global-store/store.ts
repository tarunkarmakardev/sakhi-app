// src/stores/counter-store.ts
import { createStore } from "zustand/vanilla";

export type GlobalState = {
  feedback: string;
  language: string;
  audioBlob: Blob | null;
};

export type GlobalStateActions = {
  setFeedback: (value: string) => void;
  setLanguage: (value: string) => void;
  setAudioBlob: (blob: Blob | null) => void;
};

export type FeedbackStore = GlobalState & GlobalStateActions;

export const defaultInitState: GlobalState = {
  feedback: "",
  language: "te",
  audioBlob: null,
};

export const createGlobalStore = (
  initState: GlobalState = defaultInitState,
) => {
  return createStore<FeedbackStore>()((set) => ({
    ...initState,
    setFeedback: (value) => set((s) => ({ ...s, feedback: value })),
    setLanguage: (value) => set((s) => ({ ...s, language: value })),
    setAudioBlob: (blob) => set((s) => ({ ...s, audioBlob: blob })),
  }));
};
