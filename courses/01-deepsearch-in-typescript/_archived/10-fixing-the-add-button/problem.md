---
id: lesson-kcoi9
---

I noticed a bug in my local implementation where the 'new chat' button doesn't quite work.

It removes the `id` from the search params, but the `useChat` hook doesn't get reset.

<Video resourceId="newchatbugreport-FSLRVppvv.mp4" />

Let's fix that.

## Steps To Complete

- Find the component where the `useChat` hook is initialized.
- Find the place where that component is called.
- Add a `key` prop to the component, with the `id` from the search params.
- Run the app and test that the new chat button works.

```tsx
<ChatPage
  key={chatId} // new!
  userName={userName}
  isAuthenticated={isAuthenticated}
  chatId={chatId}
  initialMessages={initialMessages}
/>
```
