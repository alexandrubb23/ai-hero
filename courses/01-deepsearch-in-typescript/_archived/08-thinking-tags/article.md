---
id: lesson-susvn
---

Our 'think' tool is OK, but not perfect. It encourages the LLM to think about something, but it also adds an extra round-trip to the LLM in order to log the thought.

We'd like to encourage the LLM to do thinking in the stream, and not add an extra round-trip to the LLM in order to log the thought.

To achieve that, we can encourage the LLM to conduct its thoughts in `<thinking>` tags. These should be used to contain plans about the work ahead, and reflections on the work that has been done.

However, we should also make sure that the final answer is _not_ formatted as a `<thinking>` tag. So, we should add an `<answer>` tag, and encourage the LLM to write its final answer inside that tag.

## Steps to complete

- Find the system prompt

- Remove all code to do with the `think` tool

- Edit the system prompt to encourage the LLM to conduct its thoughts in `<thinking>` tags.

- Edit the system prompt to encourage the LLM to write its final answer in `<answer>` tags.
