---
id: lesson-koanm
---

## The Problem

We are already seeing that our application is tricky to monitor. There are long conversational threads, Tool calls, And database queries we need to keep track of.

This will get even worse when we head to production. Our application will be put in front of users and anything that goes wrong could either cost us a lot of money (via calling the LLM) or annoy our users.

We need to add some kind of observability platform - one that we can use locally to assist our development and also monitor our production application.

## Which Observability Platform?

There are many many options in this space. A whole cottage industry has sprung up around observability platforms targeted to LLMs.

You could even decide to go for a more mature player in this space. Vercel's AI SDK supports OpenTelemetry so any platform that allows for collecting OpenTelemetry data would work.

For this course, I've decided to go for [Langfuse](https://langfuse.com/). It's a platform that allows you to monitor and trace LLM applications. Here's why I picked it:

- It's **open source**, and can be **[run locally via Docker](https://langfuse.com/self-hosting/local)**, so it's safer from vendor lock-in concerns
- It has a **generous [free tier](https://langfuse.com/pricing)**, so it's easy to get started
- It **integrates well with [Vercel's AI SDK](https://langfuse.com/docs/integrations/vercel-ai-sdk)**, so it's simple to set up

However, I wouldn't blame you for going for any of the other solutions in this space. They all have their pros and cons and are each fighting it out for dominance.

The constraints I have - choosing a good enough tool for the course - are not quite the same constraints that you'll have in production. However, I'm happy enough with Langfuse that I'm comfortable recommending it.

The course isn't sponsored by Langfuse - I just thought the product was good enough to recommend.
