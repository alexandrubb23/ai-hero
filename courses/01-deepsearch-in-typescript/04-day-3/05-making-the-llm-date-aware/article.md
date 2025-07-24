---
id: lesson-887ql
---

Our current implementation is not date-aware. This will lead to issues where users will ask for up to date information and the LLM won't know what "up to date" means.

The solution is pretty simple. We need to tell the LLM what the current date and time is whenever we call it.

## Steps To Complete

- Find the place where the LLM is being called via `streamText`.

- Add the current date to the `system` prompt, with an encouragement to use the date in their queries when the user asks for up to date information.

- Make sure that the information returned from the search API contains the date that the article was published. This should be available on `results.organic`.

- Try out the system with information that is up to date, like the weather or the latest sports scores
