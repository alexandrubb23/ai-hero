import type { Action } from "./get-next-action.ts";

type Source = {
  title: string;
  url: string;
  snippet: string;
  favicon?: string;
};

export type OurMessageAnnotation =
  | {
      type: "NEW_ACTION";
      action: Action;
    }
  | {
      type: "SOURCES";
      sources: Source[];
    }
  | {
      type: "USAGE";
      totalTokens: number;
    };

export type GuardrailResult = {
  classification: "allow" | "refuse";
  reason?: string;
};
