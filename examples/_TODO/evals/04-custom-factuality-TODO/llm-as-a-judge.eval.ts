import { createScorer, evalite } from "evalite";
import { scoreForFactuality } from "./llm-as-a-judge.ts";
import { NumericDiff } from "autoevals";

evalite("Fact Checker Eval", {
  data: async () => [
    {
      input: {
        question: "Is the sky blue?",
        groundTruth:
          "The sky appears blue due to Rayleigh scattering.",
        submission: "Yes, the sky is blue",
      },
      expected: {
        score: 1,
      },
    },
    {
      input: {
        question: "What is the capital of France?",
        groundTruth:
          "Paris is the capital and largest city of France.",
        submission: "Paris is the capital of France",
      },
      expected: {
        score: 1,
      },
    },
    {
      input: {
        question: "Who invented the telephone?",
        groundTruth:
          "Alexander Graham Bell is credited with inventing the first practical telephone.",
        submission:
          "Thomas Edison invented the telephone",
      },
      expected: {
        score: 0,
      },
    },
    {
      input: {
        question: "What is the speed of light?",
        groundTruth:
          "The speed of light in vacuum is approximately 299,792,458 meters per second.",
        submission:
          "Light travels at about 300,000 kilometers per second",
      },
      expected: {
        score: 1,
      },
    },
  ],
  task: async (input) => {
    return scoreForFactuality(input);
  },
  scorers: [
    createScorer({
      name: "Score matches",
      scorer: ({ output, expected }) => {
        return NumericDiff({
          output: output.score,
          expected: expected?.score,
        }) as any;
      },
    }),
  ],
  experimental_customColumns: async ({
    input,
    output,
    expected,
  }) => [
    {
      label: "Input",
      value: [
        `**Question**`,
        `- ${input.question}`,
        `**Submission**`,
        `- ${input.submission}`,
        `**Ground Truth**`,
        `- ${input.groundTruth}`,
      ].join("\n\n"),
    },
    {
      label: "Output",
      value: output.score,
    },
    {
      label: "Expected",
      value: expected!.score,
    },
    {
      label: "Rationale",
      value: (output as any).rationale,
    },
  ],
});
