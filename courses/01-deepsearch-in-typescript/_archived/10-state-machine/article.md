One huge benefit from breaking our system into component parts is that we can add elements of determinism to it.

For instance, we know there are certain things our loop should never do.

- After it's taken a 'visit' action, it shouldn't take a 'visit' action directly afterwards.
- At the very start of the loop, it shouldn't immediately take an 'answer' action - it should search first.

This is starting to sound a bit like a state machine - a method for modelling systems that can be in several discreet states.

In this case, we have four states:

- Start (the very start of the loop)
- Searching (after the 'search' action has been taken)
- Answering (after the 'answer' action has been taken)
- Visiting (after the 'visit' action has been taken)

We can represent this as a state machine as an object. The keys are the possible states, and the values are the allowed next actions.

```ts
const machine = {
  start: ["search"],
  searching: ["visit", "answer", "search"],
  visiting: ["search", "answer"],
  answering: [],
} as const;
```

We'll need to add some types for this to our shared types file:

```ts
type State =
  | "start"
  | "searching"
  | "visiting"
  | "answering";

type Action = "search" | "visit" | "answer";
```

To adopt this, we'll need to add a `state` property to our shared system context:

```ts
class SystemContext {
  state: State = "start";
}
```

We can then use this inside our `getNextAction` function to ensure that the next action is allowed.

We can do this by dynamically changing the `schema` passed to `generateObject` to only allow certain choices in the `nextAction` field.

```ts
import { z } from "zod";
import { Action } from "./wherever-the-types-file-is";

const getActionSchema = (allowedActions: Action[]) =>
  z.object({
    type: z.enum(allowedActions),
  });
```
