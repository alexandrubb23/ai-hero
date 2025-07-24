- Now our chunks are looking better, how do we improve
  the way we retrieve them?
- Hybrid Search: BM25 with Embeddings
- LLM re-ranker (rank fusion techniques) to re-rank the BM25 results with the embeddings results
- TRY [summary-based indexing](https://www.llamaindex.ai/blog/a-new-document-summary-index-for-llm-powered-qa-systems-9a32ece2f9ec)
- TRY query rewriting
- TRY eval-ing the query rewriter on its own
- TRY HyDe
- TRY experimenting with different embedding models

---

Query rewriting lets you bring the users query closer to the embedded chunks.

---

One thing you may want to use query rewriting for is when you have a long chain of messages And you want to summarise the user's intent Before going and fetching the chunks.

---

The Agentic RAG (Retrieval-Augmented Generation) paper characterizes advanced RAG as using reranker LLMs to retrieve documents, prioritizing the most contextually relevant information.

https://arxiv.org/pdf/2501.09136

---

The Agentic RAG paper describes a modular RAG system as one which is broken down into several modular parts.

It describes several patterns such as:

- Retrieve then read
- Rewrite, retrieve, re-rank, read
- Retrieve, read, retrieve, read in a loop

There is also one called "demonstrate, search, predict" which I'm not sure what it is.

https://arxiv.org/pdf/2501.09136

---

"BM25 works by building upon the TF-IDF (Term Frequency-Inverse Document Frequency) concept. TF-IDF measures how important a word is to a document in a collection. BM25 refines this by considering document length and applying a saturation function to term frequency, which helps prevent common words from dominating the results." https://www.anthropic.com/news/contextual-retrieval

"Here’s how BM25 can succeed where semantic embeddings fail: Suppose a user queries "Error code TS-999" in a technical support database. An embedding model might find content about error codes in general, but could miss the exact "TS-999" match. BM25 looks for this specific text string to identify the relevant documentation." https://www.anthropic.com/news/contextual-retrieval

---

Contextual retrieval is relatively cheap because of prompt caching.

"Assuming 800 token chunks, 8k token documents, 50 token context instructions, and 100 tokens of context per chunk, the one-time cost to generate contextualized chunks is $1.02 per million document tokens." https://www.anthropic.com/news/contextual-Retrieval

---

Contextual retrieval improves performance across all embedding models, but some benefit more than others.

Anthropic found Gemini and Voyage embeddings to be particularly effective.

---

Cohere reranker

https://cohere.com/rerank

TODO: What's the benefit of using a tailored reranking model instead of a LLM? Latency?
