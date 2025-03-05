"use client";
import { languageOptions } from "@/config";
import { useGlobalStore } from "../global-store/context";

export default function SelectLanguage() {
  const language = useGlobalStore((s) => s.language);
  const setLanguage = useGlobalStore((s) => s.setLanguage);
  return (
    <div>
      <select
        className="text-primary-text bg-background rounded-lg p-2 focus:border-2 focus:border-primary w-24"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option disabled value="">
          Select a language
        </option>
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
