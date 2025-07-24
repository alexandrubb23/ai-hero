`BM25` is a ranking function that uses lexical matching to find precise word or phrase matches.

`BM25` can succeed where semantic embeddings fail.

Suppose a user queries error code `TS-999` in a technical support database. An embedding model might find content about error codes in general, but could miss the exact `TS-999` match.

https://www.anthropic.com/news/contextual-retrieval

Combining `BM25` and semantic similarity seems like a powerful solution for RAG.

`BM25` can more accurately find the chunks based on exact lexical matching, and semantic embeddings can focus on more semantic meaning. Then you can use a reranker to combine and deduplicate the chunks.

https://www.anthropic.com/news/contextual-retrieval
