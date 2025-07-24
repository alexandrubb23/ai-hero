## Verbal Reasoning

ReAct appears to take advantage of verbal reasoning. This has been theorized to play an important role in human cognition for enabling self-regulation and strategization.

Between two specific actions we may reason in language in order to:

- Track progress
- Handle exceptions
- Realize when external information is needed.

This synergy between acting and reasoning allows humans to learn new tasks quickly.

Relying only on the result of acting and observation is not enough. Without the thought to contextualize the action, it may not be clear to the LLM what the result of the action was.

## Reasoning Traces

ReAct calls reasoning outputs "reasoning traces".

Reasoning traces help the model induce, track, and update action plans, as well as handle exceptions. Actions allow it to interface with and gather additional information from external sources such as knowledge bases or environments.

One bonus here is that the traces are human-interpretable. This level of transparency means a human can go in and debug the traces produced by the model. This is really useful, especially for working out where the model went wrong.

ReAct calls these plans "trajectories" instead of actual plans.

## CoT vs ReAct

In the ReAct paper, they say that traditional chain of thought reasoning is a static black box where the model uses its own internal representations to generate thoughts, and it's not grounded in the external world, which limits its ability to reason reactively or update its knowledge.

The reason for writing this paper is that they say there have not been studies on how reasoning and acting can be combined in a synergistic manner for general task solving.

The best approach overall is a combination of ReAct and chain of thought that allows for use of both internal knowledge and externally obtained information during reasoning.

The problem-solving process demonstrated by ReAct is more factual and grounded, whereas chain of thought is more accurate in formulating reasoning structure but can easily suffer from hallucinated facts or thoughts.

They claim that the best approach is to incorporate ReAct and chain of thought and let the model decide when to switch to the other method based on a couple of heuristics. For instance, when ReAct fails to answer within a given number of steps, back off to chain of thought, or when the majority answer among a certain set of chain of thought self-consistency samples occurs less than a number of times (i.e., the internal knowledge might not support the task confidently), back off to ReAct.

## Vs Action Only

The ReAct paper shows consistent advantages over controlled baselines with actions only instead of also adding thoughts.

## Fine-Tuning

One benefit of ReAct is that it can be done without fine-tuning the model. You can provide a few in-context examples, and it's good to go.

When fine-tuned with 3,000 examples, ReAct becomes even better. They fine-tuned PaLM 8B to outperform PaLM 62B. ReAct is more conducive to being fine-tuned than chain of thought or standard. Fine-tuning chain of thought essentially teaches models to memorize hallucinated knowledge facts. But fine-tuning ReAct tells the models how to reason and act to access information from Wikipedia.

## Research Agent

To test how ReAct worked, they designed a simple tool set. They basically tested it against two different datasets: HotpotQA and FEVER. HotpotQA is a question answering benchmark, and FEVER is a fact verification benchmark.

ReAct designed a simple tool set to solve the problem. They wanted access to Wikipedia, so they had three tools:

1. Search: Returns the first 5 sentences from the corresponding wiki page if it exists, or suggests similar entries from the Wikipedia search engine.

2. Lookup: Returns the next sentence in the page containing a set string, simulating how `Ctrl+F` works in a browser.

3. Finish: Completes the current task with a specified answer.

They compared against standard prompting, which removes all thoughts, actions, and observations in ReAct trajectories.

They also compared it with chain of thought prompting, which does the same thing but of course adds the "let's think step by step" marker.

Finally, they use an acting-only prompt which removes thoughts in ReAct trajectories.

## Prompting

Each in-context example is a human trajectory of actions, thoughts, and environment observations to solve a task instance.

To prompt the model, they chose a few cases from the training set and manually wrote down ReAct format trajectories to use as exemplars in the prompts.

They had exemplars that decompose questions, for instance: "I need to search X, find Y, then find Z." They had others that extract information from Wikipedia observations, such as "X was started in 1844." They had exemplars which performed common sense reasoning, like "X is not Y, so Z must instead be..." Or arithmetic reasoning, such as "1844 is less than 1989."

## Benefits

There are several benefits of using ReAct:

First of all, it's intuitive and easy to design. Human annotators can simply jot down their thoughts as they're imagining going through the task. It's also very flexible. ReAct works for diverse tasks with distinct action spaces and reasoning needs, such as:

- QA
- Fact verification
- Text game
- Web navigation

ReAct requires very few in-context examples (1-6) in order to perform its work. Humans can also potentially control or correct the agent behavior by thought editing, i.e., actually going in and editing the thoughts as they go.

## Failures

One interesting failure mode specific to ReAct is where the model repetitively generates the previous thoughts and actions. The model sometimes fails to jump out of the loop because it fails to reason about what the next action should be.

Another failure mode is a failure to retrieve informative knowledge via its tools. When it fails to find good information, it derails the model's reasoning and gives it a hard time to reformulate its thoughts.
