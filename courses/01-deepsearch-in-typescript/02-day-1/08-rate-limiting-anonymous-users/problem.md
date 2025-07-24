---
id: lesson-vc3fs
---

Rate limiting users who have logged in is pretty simple. You track the requests against their email address, and then limit them once they've hit the limit.

But what about users who are not logged in?

If we give users who are not logged in a free trial, it gives them a frictionless way to test our service.

However, it opens us up to several new vectors of attack. I asked about this on [X](https://x.com/mattpocockuk/status/1927667291031752971) and got some great responses.

The bad news is that if you expose a free trial, it's largely impossible to prevent abuse entirely. But you can reduce the incentives for malicious users to abuse your service.

Let's examine a few approaches:

## IP Address Limiting

One approach is to track the IP address of the user, and limit them based on the IP address (e.g. 10 requests per day).

This is a reasonable first line of defense - but it's not perfect. For instance, users could switch their IP address (using a VPN, for example) to avoid the limit.

It's possible to detect VPNs. Many use known IP's which are catalogued in IP reputation databases. You can compare the DNS resolver location with the claimed IP location.

But tricksters will always slip through the net.

## Unique ID's In The Browser

Another approach is to use `localStorage` in the browser to fingerprint the user. You'd save a unique identifier on page load, and use that to track the user.

Again - this is by no means secure, but it's another layer of annoyance for potential hackers.

## Email Address Verification

Another approach is to increase the friction of the free trial by requiring a verified email address.

Creating disposable email addresses is a common way to get around this - but it's cumbersome and relatively tricky to automate.

However, increasing the friction of the free trial is a great way to turn away potential customers. So again, not perfect.

## Bot Filtering

Whatever you do, you'll need to defend against bots. Individual users can't do much damage on their own - but bots can wreak havoc by automating the abuse of your API on a huge scale.

One approach is to use captchas - puzzles which are difficult for bots to solve.

But of course, captchas come at the cost of user experience. No-one likes identifying chimneys on images. And these days bots are getting better at solving them.

I'd recommend a third-party service like [Kasada](https://www.kasada.io/) to help you defend against bots. This is built in to Vercel's new [BotID](https://github.com/vercel-labs/botid-nextjs-starter) service. These services detect bots in the browser, without interrupting the user experience.

## Global Rate Limits

The one indispensable tool you'll need is a global rate limit on your API. In other words, a rate limit on your _system_, not on individual users.

While this doesn't prevent abuse, it can prevent spikes in abuse, which can be extremely costly.

If you're paying for a model, you likely already have a rate limit on your system - the one defined by the model provider.

But having one which you control means you can more carefully monitor your usage, more gracefully handle model limits, and prevent abuse spikes.

This is so handy that we do actually implement it later in the course.

## API Design

Finally, the way you design your API can help discourage abuse.

The more specialised your application is, the less useful it will be for potential hackers. That means putting in a lot of work in your system prompt to make the output as specific as possible.

This won't help us much on this course. Our DeepSearch application is designed to be as general as possible.

But we may be able to apply guardrails which ensure our app is only being used for its intended purpose - we'll touch on these later.
