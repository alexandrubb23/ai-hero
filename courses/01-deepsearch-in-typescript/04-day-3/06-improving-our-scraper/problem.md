---
id: lesson-d739v
---

Our scraper is still pretty naive. It looks at the HTML of the page, tries to find the main content, and then returns it.

This is fine, but it's not very robust. There are several things it doesn't handle:

1. Some pages render content via JavaScript. Since we're not running the JavaScript on the page, we won't see the content.
2. Some pages are protected by a captcha, which we won't be able to bypass.
3. Many pages that we're scraping don't have a concept of a 'main content'. Reddit posts are a good example of this. This means that the content we provide to the LLM will likely be extremely noisy.

This means we end up with a decision that most DeepSearch applications have to make. Do we improve our scraper, or use a paid service?

## Improving Our Scraper

Let's start with the theory that we could improve our scraper ourselves. There are several ways we could do this.

### Running `jsdom`

We could use `jsdom` to run the JavaScript on the page. This would allow us to see the content that is rendered by JavaScript.

```ts
import { JSDOM } from "jsdom";

export async function scrapeWithJSDOM(
  url: string,
): Promise<string> {
  const response = await fetch(url);
  const html = await response.text();

  const dom = new JSDOM(html, {
    url: url,
    resources: "usable",
    runScripts: "dangerously",
  });

  await new Promise((resolve) =>
    setTimeout(resolve, 2000),
  );

  const content =
    dom.window.document.querySelector("body")
      ?.textContent || "";

  dom.window.close();

  return content.trim();
}
```

This means that we'll be able to see the content that is rendered by JavaScript.

However - you should note the `runScripts: "dangerously"` flag. This means that we are actually running the JavaScript on the page within our server. This is a titanic security risk. But it can be mitigated by running the scraper in a sandboxed environment - without network or file system access.

It's also worth noting that the above code is vastly simplified - it doesn't attempt to extract out the main body content. This means that while this fixes #1 in our list above, it doesn't fix #2 or #3.

### Running `playwright`

We could use a tool like Playwright or Puppeteer to render the entire web page in a headless browser.

This code ends up looking a lot like our `jsdom` code above.

```ts
import { chromium } from "playwright";

export async function scrapeWithPlaywright(
  url: string,
): Promise<string> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url);

  await page.waitForTimeout(2000);

  const content =
    (await page.textContent("body")) || "";

  await browser.close();

  return content.trim();
}
```

Playwright runs inside a headless browser which is more sandboxed than the `jsdom` implementation. Combined with sandboxing your Node process it's running on, this will mean it's more secure.

However, its pretty slow and computationally expensive to run an entire browser. Not only that, but we still have the same issues as `jsdom` - we're not able to extract the main content of the page and captchas will still be a problem.

## Paid Services

At this point, we should turn to paid services that handle the problem for us.

The demand for scrapers has never been higher, and many companies have specialized in this.

## Paid Services

At this point, we should turn to paid services that handle the problem for us.

The demand for scrapers has never been higher, and many companies have specialized in this:

[Jina AI](https://jina.ai/) offers the most generous free tier (10M tokens) and simplest integration - just prepend their domain to any URL. At $0.02 per 1M tokens, it's ideal for single-page scraping.

[Firecrawl](https://firecrawl.dev/) ($16/month) is the enterprise solution for crawling entire websites, with advanced JavaScript handling and TypeScript support.

[Tavily](https://tavily.com/) ($30/month) specializes in real-time web search for AI agents, with strong LangChain integration and search optimization.

Since each of these companies has a generous free tier, I would check out each of them to see how they perform in terms of latency and cost.

The benefit of this is that the code for extracting the main content of the page and bypassing captchas is no longer your responsibility.

It does mean you'll need to monitor the service to see how well it performs - but the cost may be worth it.

Finally, services like these utilize caching to avoid making the same request multiple times. This may mean the pages you're scraping are slightly out of date - again, monitoring is key.

### Browserless

It's also worth considering a service like [Browserless](https://www.browserless.io/), which uses a headless browser to scrape websites.

This is perhaps the most expensive option. Scraping is only a small part of their offering: they also offer browser automation, PDF processing and website testing.

However, for some cases a headless browser is the only way to go.
