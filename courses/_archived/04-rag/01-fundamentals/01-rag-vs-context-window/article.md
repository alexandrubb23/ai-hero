`RAG` can construct contact specific for each query, instead of having the same context for all queries.

Many people think that a sufficiently long context window will be the end of `RAG`. I don't think so. However large a context window is, there will be applications that require more than that.

Every context token incurs extra cost and has the potential to add extra latency. `RAG` makes this more efficient by allowing the model to use only the most relevant information for each query.

Models that process long contact windows don't necessarily use that context well.

A model is much better at understanding instructions given at the beginning and the end of a prompt than in the middle.

https://arxiv.org/abs/2307.03172

If your knowledge base is smaller than 200,000 tokens, you can include the entire knowledge base in the prompt that you give the model.

Combined with prompt caching, this makes this approach very fast and cost effective.

https://www.anthropic.com/news/contextual-retrieval

My instinct about `RAG` is that it's rare you find a true generalizable solution. So much depends on the type of content that you're putting into the knowledge base. So much depends on what your chunks look like. And so much depends on what your user queries look like.

There are so many variables at play that simply doing a naive approach - for instance, running it through a 3rd party service - feels like folly.

Many teams build their `RAG` systems using off-the-shelf retrievers and models. But fine-tuning the whole `RAG` system end-to-end can improve its performance significantly.
