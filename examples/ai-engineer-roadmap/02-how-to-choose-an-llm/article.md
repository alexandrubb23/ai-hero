---
id: post_mvs9f
---

Choosing the right model is crucial to the success of your AI-powered app. But it's not an easy call.

It's a tough, many-layered decision that you don't only make once. You'll have to make it **over and over again** as new models emerge and your app evolves.

I've split this decision down into several key questions you'll need to ask yourself when choosing a model.

## 1. Should I Use An Open Or Closed Model?

There are two main types of models you'll need to choose from: **open** and **closed**.

### Open Models

Open source models are models that are free to download and use. However, you'll need to host and run them yourself if you want to build an app with them.

Open models can be run on your own hardware, or on a cloud provider like AWS or Azure.

The [Open LLM Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard#/) is a great place to look for open models.

### Closed Models

Closed-source models are ones controlled by companies. You need to pay to use them, but they are hosted by the company, so you don't need to worry about running them yourself.

The most powerful models in the world are currently closed-source. But open models are improving all the time.

[Chatbot Arena](https://lmarena.ai/?leaderboard) is a good place to compare closed-source against open-source models.

### Model Providers, API Providers, and Hosting Your Own Model

There are two types of companies who host models for you to use:

**Model providers** use closed-source models. You pay to use their models, but they're hosted by the company. These include OpenAI, Google, Anthropic, Deepseek, and many more.

**API providers** host open source models, and charge you a fee for using them. They include Hugging Face, Groq, and others.

You can also host your own model. This is the most flexible option, but also the most expensive. You'll need to pay for the hardware to run the model, and you'll be responsible for keeping it up and running.

## 2. How Much Will It Cost?

The way you'll pay for your LLM usage changes depending on whether you're hosting your model or not.

### Cost Per Token

Most model providers charge by token. The more tokens you use, the more you pay. The most common way this is expressed is "cost per 1m tokens".

You don't just get charged for input tokens (what you say to the model), but also for completion tokens (how the model replies).

This is a traditional 'pay per usage' model - just like serverless platforms charging you for compute time. Tokens are a decent metric for how much you're using the model.

There is a worldwide race-to-the-bottom on token prices, as companies compete for market share. Price comparison websites like [Helicone's](https://www.helicone.ai/llm-cost) are useful for comparing prices.

### Hosting Open-Source Models

Hosting open-source models can be a more cost-effective option. Instead of paying per token, you now pay a fixed fee to host the model.

This also has the benefit of keeping you entirely in control of your own data. This can be important for data residency and privacy reasons.

However, models need to be hosted on powerful hardware, which can be expensive. You'll need to balance the cost of hosting the model with the cost of using a model provider.

My general suggestion is to start with third-party APIs. They give you the most flexibility and are reasonably cost-effective. Later, you can move to hosting your own models if you need to.

## 3. How Important Is Latency?

Another important feature to consider is **latency**. Latency is the approximate time it takes for the model to respond to a query. Fast responses can be crucial for many use cases, and can make your application more useful to users.

Latency is affected by the **size of the model** - smaller models are faster to run, but often less accurate.

Latency is also affected by the **hardware** the model is running on. More powerful hardware can run models faster.

And finally, it's affected by any **inference optimizations** made to the model. This helps speed up the inference function of the model. They include quantization, distillation and parallelism - and are somewhat outside the bounds of this article.

### Measuring Latency

There are two main metrics to consider when measuring latency:

- **TTFT: Time to first token**: how long it takes for the model to start generating a response
- **TPOT: Time per output token**: how long it takes for the model to generate each token

## 4. How Do I Assess Model Performance?

Cost and latency are important, but a model is useless if it cannot perform the task required.

As a general rule, smaller models will perform worse. A smaller model will have fewer parameters - and so a smaller space in which to store information.

### Public Benchmarks

The performance of a model is an extremely slippery metric. It's extremely difficult to look at two models and say which one is better.

A common approach that model providers (and open-source projects) take is to use benchmarks. These are standardized tests that measure the performance of a model on a specific task. These benchmarks can grade the model at certain tasks, such as translation, summarization, question-answering, or coding.

Benchmarks are a decent early indicator for a model's performance. However, there is a constant danger of model providers overfitting their models to these benchmarks. This can either happen by the model accidentally consuming the benchmark data during pre-training, or organizational pressure to improve benchmark scores.

In some benchmarks, models are compared against each other - with humans grading which model produces the better output. [Chatbot Arena](https://lmarena.ai/?leaderboard) is a good example of this - and worth checking out for an early indicator of model performance.

### Specialized Models

Some models will perform better at certain tasks. This often depends on the model's training data - if it has been trained on large amounts of code examples, it will be better at coding tasks. The same is true for many disciplines: translation, classification, summarization, etc.

If you have a specialized task, it's worth looking for models which are specialized for that task. These models will usually outperform general-purpose models. They are also often smaller - so, faster and more efficient.

### Reasoning Models

Some models have been specifically designed to pause before providing a response. These are the **reasoning** class of models, a trend initiated by OpenAI's o1.

These models often perform better at tasks requiring forward planning and critical thinking, like coding and math problems. They also output their planning process with reasoning tokens, which can be useful to stream to the user in real-time.

However, they are often more expensive than regular models, and take longer to respond. It's a performance/latency tradeoff.

### Evals

The only way a model can truly be evaluated is by testing it in the context of your application. This is why building evals for your system is so crucial.

[Evals](https://aihero.dev/what-are-evals) are a set of benchmarks you run on your own system. They let you see whether your system is improving or degrading over time. We'll cover them in more depth later.

## 5. How Big A Context Window Do I Need?

The context window is the number of tokens the model can see at a time. The larger the context window, the more information the model can use to generate its next word.

This limit is counted in tokens, and counts both input and completion tokens. Passing too long an input to a model (or forcing it to generate too long a response) can cause an API error, or prevent it from generating a response.

The context window size is related to the mechanism the model uses to generate text - so is tied to the design of the model itself. Context window sizes are growing all the time. Currently, Gemini models have the largest context windows.

Since the context window is limited on all models, managing it is a constant battle for AI engineers. Patterns like chunking in RAG are designed to squeeze more information into the context window.

## Conclusion

These five factors are important for choosing your model:

- Open or Closed
- Cost
- Latency
- Performance
- Context Window

Leaderboards and benchmarks are a good place to start. However, the only way to truly assess a model's suitability is to test it in your application via experimentation with your own evals.
