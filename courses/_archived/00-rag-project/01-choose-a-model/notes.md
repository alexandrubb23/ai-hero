Day 1: How To Choose A Model

- Choose your AI Provider
- Connect to the AI Provider
- Model selection basics: open/closed, leaderboards
- Reasoning vs non-reasoning models
- Data concerns
- Latency vs Accuracy
- Model Providers vs API providers
- TRY Local Models
- TRY Ollama
- TRY AI SDK Ollama Provider
- Models vs systems
- Context window size

---

77% of enterprise AI usage are using models that are small models less than 13 billion parameters.

https://tomtunguz.com/small-but-mighty-ai/

---

I think models versus systems is an extremely good way to think about it. It defines the role of the AI engineer really well. The AI engineer does not really focus on the model. The engineer focuses on the environment where the model operates.

This means that the AI engineer can squeeze a lot of juice out of a small model by placing it in a part of a smart system.

Which would you consider more powerful: a smart model in a simple system or a simple model in a smart system?

---

To make the most out of the machines, most people choose the largest models that can fit in their machines. Most GPUs come with 16 GB, 24 GB, 48 GB, and 80 GB memory.

So it's not a coincidence that many models today have 7 billion or 65 billion parameters - these models fit neatly into the memory of the most common GPUs.

---

"During the application development process, as you progress through different adaptation techniques, you'll have to do model selection over and over again. Prompt engineering might start with the strongest model overall and then work backward to see if smaller models would work." - Chip Huyen

---

Model selection is extremely complex. It's highly dependent on not only the prompt but the chain used. Decomposing a task into two steps can radically alter the outcome. Then again, some models are just not suited for some tasks, and no matter what chain you use, the outcome won't be good enough.

---

Choosing a model is basically a 4-step process:

1. Figure out the models whose hard attributes don't work for you. This depends on your commercial policies, whether you want to use commercial APIs or host your own models.

2. Use publicly available information like benchmark performance leaderboard rankings. This will help you narrow down the most promising models to experiment with. At this point, you're balancing different objectives such as model quality, latency, and cost.

3. Run experiments with your own evaluation pipeline to find the best model balancing all your objectives.

4. Continually monitor your model in production to detect failures and collect feedback.

---

There's a difference in terms between "open weight" versus "open model". Open weight refers to models that don't come with open data, whereas open model is used for models that do come with open data.

---

Commercial models often use guardrails such as blocking requests to tell racist jokes or generate photos of real people. Proprietary models are more likely to err on the side of over-censoring. These guardrails are good for the vast majority of use cases but can be a limiting factor for certain ones. For instance, if your application requires generating real faces, a model that refuses to generate real faces won't work. In this case, open-source models will be better.

---

The Open LLM leaderboard is a great place to look at the leaderboard for open LLMs.

It measures against various benchmarks and is a great place to see how open AI models stack up against each other.

https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard#/
