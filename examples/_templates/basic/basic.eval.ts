import { Levenshtein } from "autoevals";
import { evalite } from "evalite";
import { someFunc } from "./basic.ts";

evalite("Some Func", {
  data: async () => [
    {
      input: "Some input",
      expected: "Some expected output",
    },
  ],
  task: async (input) => {
    return someFunc(input);
  },
  scorers: [Levenshtein],
});
