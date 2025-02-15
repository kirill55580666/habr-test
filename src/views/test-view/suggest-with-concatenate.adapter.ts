import { ISuggestMention } from "@/infrastructure/suggest-mention";

export const suggestWithConcatenateAdapter = (
  payload: ISuggestMention[]
): ISuggestMention[] =>
  payload.map((suggest) => ({
    ...suggest,
    name: suggest.name || suggest.alias,
    alias: suggest.type === "company" ? "Компания" : "@" + suggest.alias,
  }));
