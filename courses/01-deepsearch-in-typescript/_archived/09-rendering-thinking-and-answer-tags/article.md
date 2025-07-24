---
id: lesson-5jafh
---

Currently, our `<thinking>` and `<answer>` tags are rendered in plain text. We want to render them nicely in the UI.

## Supporting information

We're using the `lucide-react` library to render the lightbulb icon.

We are using `react-markdown` to render the markdown contents of the `<thinking>` and `<answer>` tags. You can add `thinking` and `answer` elements to the custom components to render the tags in a pretty format.

`react-markdown` is pretty gnarly when it comes to types, so don't be afraid to use `any` if you have to. Though make sure to add comments to explain the reason for each use of `any`.

To render the custom components, you'll need to pass `rehypePlugins` to the `react-markdown` component.

```tsx
import rehypeRaw from "rehype-raw";

<ReactMarkdown rehypePlugins={[rehypeRaw]} />;
```

## Steps to complete

- Install `rehype-raw` if not already installed.
- Change the `ChatMessage` component so that it renders the `<thinking>` tags in a pretty format. Use a lightbulb icon, small text, rounded corners, and a background color. Make it so the user has to click to reveal the thinking.
- Change the `ChatMessage` component so that it renders the `<answer>` tags as normal text.
- Test it out!
