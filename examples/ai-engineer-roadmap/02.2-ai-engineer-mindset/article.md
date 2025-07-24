---
id: post_jz4cs
---

Building with LLMs requires a fundamental shift in how you think about software development. You're no longer designing deterministic systems where inputs map to predictable outputs. Instead, you're working with probabilistic systems which are inherently unpredictable. To ship a great application, you need to clearly define your success criteria and build a culture of continuous improvement based on real user data.

## Productionizing LLM Apps Is Hard

It's relatively simple to get a demo up and running. But productionizing an LLM-powered app is a different story:

<ThemeImage urls={{dark: "https://res.cloudinary.com/total-typescript/image/upload/v1742898012/aihero.dev/ai-roadmap/what-are-llms-useful-for/dark/How_Good_AI_Apps_Get_Built_wbdrhf.svg", light: "https://res.cloudinary.com/total-typescript/image/upload/v1742898035/aihero.dev/ai-roadmap/what-are-llms-useful-for/light/How_Good_AI_Apps_Get_Built_xhw24q.svg"}} width={811} height={501} alt="Line chart titled 'How Good AI Apps Get Built' showing initial performance decline after launch, then steady improvement as feedback and evals are added. Left side labeled 'The Vibes-Only Trough', right side labeled 'The Eval Slope'." />

The journey starts in what I call the "Vibes-Only Trough." You've got your app working with the LLM, tested it with a few examples, and it seems to be doing what you want. But when you put it in front of real users, they'll interact with it in ways you never imagined. The flexibility of natural language means users can push your system far beyond its intended use cases, exposing edge cases and failure modes you couldn't have predicted.

This is where systematic evaluation comes in. As you move up the "Data-Driven Slope," you build proper evaluation frameworks, collect data, and measure performance. You're no longer relying on vibes - you're making data-driven decisions about your app's performance.

But the journey won't be straightforward. Your app's quality will swing wildly as you experiment. Some changes will make things better, others worse.

<ThemeImage urls={{dark: "https://res.cloudinary.com/total-typescript/image/upload/v1742900549/aihero.dev/ai-roadmap/what-are-llms-useful-for/dark/AI_Engineering_Is_Experimental_ygyths.svg", light: "https://res.cloudinary.com/total-typescript/image/upload/v1742900613/aihero.dev/ai-roadmap/what-are-llms-useful-for/light/AI_Engineering_Is_Experimental_h0tdax.svg"}} width={755} height={519} alt="Line chart titled 'AI Engineering Is Experimental' showing quality over time with high variability. Several red X marks indicate failed experiments. Overall trend is upward despite frequent drops, illustrating trial-and-error progress in AI engineering." />

Don't panic - this volatility is built into the game. The trick is tracking these changes systematically and learning from each iteration. This is why we need a new approach to development, one that embraces the probabilistic nature of LLMs while maintaining rigorous evaluation practices.

## Defining Your Success Criteria

The first step in managing this probabilistic nature is defining what success looks like for your app. In traditional software, success criteria are often straightforward - a login system either works or it doesn't. But with LLM-powered apps, success is rarely binary.

Let's say you're building a sentiment analysis system that classifies customer reviews. What does "success" look like? You need specific, measurable criteria that align with your app's purpose:

- **Accuracy**: 92% agreement with human expert sentiment labels across diverse industries
- **Response Time**: 95% of classifications completed within 500ms
- **Confidence Scoring**: 90% of high-confidence predictions (>0.9) should match human judgment

The key is making these criteria specific and measurable. Instead of vague "good performance" or impossible targets like 100% accuracy, use concrete numbers based on industry benchmarks. Even subjective metrics like "code quality" can be quantified - for example, "95% of generated functions pass all unit tests on first run."

Without clear, measurable success criteria, you'll never know if your changes are making things better or worse. And in the probabilistic world of LLM apps, that's a recipe for endless tweaking without real progress.

For a deeper dive into crafting effective success criteria, check out Anthropic's guide on [defining success for LLM applications](https://docs.anthropic.com/en/docs/build-with-claude/define-success).

## Data Is Your Most Valuable Asset

Your app's performance is only as good as the data you collect about how it's being used. But collecting data isn't enough - you need to build a data-driven culture in your organization. This means making decisions based on real metrics, not gut feelings, and using that data to measure against your success criteria.

Every user interaction is a data point you can use to improve your app:

- **Improve Prompts**: Use successful and failed responses to refine your prompt engineering
- **Fine-tune Models**: Collect high-quality user interactions to create training data for model fine-tuning
- **Track Success Rates**: Monitor which features or responses users find most helpful
- **Spot Edge Cases**: Use failures to identify and handle unexpected scenarios

This can feel alien to traditional developers. Most write code, test it, and ship it. But with LLM-powered apps, you'll spend a lot of time staring at spreadsheets and tracking metrics. It's not glamorous work, but it's essential. The best AI engineers embrace this data-driven mindset, even when it means doing the boring stuff.

Start with simple feedback mechanisms like thumbs up/down buttons, then gradually build more sophisticated data collection as you learn what metrics matter most. I've heard that one of the largest code generation platforms has a dedicated Slack channel that alerts developers to investigate every downvote. Every negative interaction becomes a learning opportunity. If you can't measure it, you can't improve it.

## Conclusion

Building LLM-powered apps requires a fundamental shift in mindset. You're moving from deterministic systems to probabilistic ones that need constant evaluation. Here's an uncomfortable truth: the first version of your app won't be great - you simply don't have enough data yet. But that's okay. The real magic happens when you build a culture of continuous improvement based on real user data.

The key isn't to eliminate uncertainty (that's impossible with LLMs), but to understand and manage it through systematic evaluation. Success comes from defining clear, measurable criteria and treating every user interaction as a learning opportunity. While this might feel foreign to traditional developers, it's essential to AI engineering.

In our next article, we'll dive deep into how to build evaluation systems - what we call "evals" - that help you understand and manage the probabilistic nature of your app. We'll explore how to create systematic ways to measure performance, track improvements, and make data-driven decisions about your app's development.
