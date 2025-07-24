Our current approach is to stop after a maximum number of steps. This is a problem because of the type of content that we're fetching. We don't know how long the content might be - we might get close to exceeding the context window of our LLM in a single scrape.

Instead of stopping after set number of steps, we should use a token budget. We should:

- Track the number of tokens used in each LLM call
- When we get within 10% of the budget, force the system to provide an answer

## Steps To Complete
