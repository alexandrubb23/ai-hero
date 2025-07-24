---
id: lesson-j8lhh
---

Our application currently isn't very resilient to users refreshing the page.

When they refresh the page during a stream, the stream is lost.

We can fix this by using the `resumable-stream` package.

This package allows us to create streams that can be resumed. When a user refreshes the page, we can resume the stream from the last message.

## Overview

## Steps To Complete

### Database

- Inside our database, create a table for `streams`. A `chat` can have multiple streams. A stream has the following properties:

```ts
type Stream = {
  id: string;
  chatId: string;
  createdAt: Date;
};
```

- Create some db helpers for creating and retrieving streams:

  - `createStream` should take in a chatId and return a streamId.
  - `getStreamsByChatId` should take in a chatId and return all streams for that chat. It should not allow you to retrieve it if you don't have access to the chat.

### Resumable Streams

- Install the `resumable-stream` package. Since we're using `ioredis` (which is already installed), we'll need to import it from the `resumable-stream/ioredis` entrypoint.
- Create a function for retrieving the `globalStreamContext`. It's a singleton, so there should be one per process:

```ts
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from "resumable-stream/ioredis";
import { after } from "next/server";

let globalStreamContext: ResumableStreamContext | null =
  null;

export function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext =
        createResumableStreamContext({
          keyPrefix: "resumable-stream",
          waitUntil: after,
        });
    } catch (error: any) {
      if (error.message.includes("REDIS_URL")) {
        console.log(
          " > Resumable streams are disabled due to missing REDIS_URL",
        );
      } else {
        console.error(error);
      }
    }
  }

  return globalStreamContext;
}
```

### `POST` `/api/chat`

- Inside our existing `POST` endpoint for `/api/chat`, do multiple things:

  - When the stream starts, create a stream in the database using `createStream`, saved in a variable called `streamId`.
  - When we return the response, instead of using `createDataStreamResponse`, use `createDataStream` from `ai`:

```ts
import { createDataStream } from "ai";

const stream = createDataStream({
  execute: async (dataStream) => {
    // ...
  },
});
```

- When we return the response from our `POST` endpoint, wrap it in `streamContext.resumableStream`. Since `streamContext` might be `undefined`, we also need to account for that by simply wrapping the stream in a `Response` object:

```ts
const streamContext = getStreamContext();

if (streamContext) {
  return new Response(
    await streamContext.resumableStream(
      streamId,
      () => stream,
    ),
  );
} else {
  return new Response(stream);
}
```

- We also need to make sure we consume the stream, so that the stream does not get cut off by the data stream ending.

```ts
import { streamText } from "ai";

const result = streamText({
  // ...whatever options we're passing here
});

result.consumeStream();
```

### `useAutoResume`

- Create a hook for resuming a stream called `useAutoResume`. Here, I've added a `DataPart` type that we'll use to parse the data from the stream. There may already be a type for the `data` property somewhere in the codebase, so add `append-message` to that if it exists.

```ts
"use client";

import { useEffect } from "react";
import type { Message } from "ai";
import type { UseChatHelpers } from "@ai-sdk/react";

export type DataPart = {
  type: "append-message";
  message: string;
};

export interface UseAutoResumeParams {
  initialMessages: Message[];
  experimental_resume: UseChatHelpers["experimental_resume"];
  data: UseChatHelpers["data"];
  setMessages: UseChatHelpers["setMessages"];
}

export function useAutoResume({
  initialMessages,
  experimental_resume,
  data,
  setMessages,
}: UseAutoResumeParams) {
  useEffect(() => {
    const mostRecentMessage = initialMessages.at(-1);

    if (mostRecentMessage?.role === "user") {
      experimental_resume();
    }

    // we intentionally run this once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!data) return;
    if (data.length === 0) return;

    const dataPart = data[0] as DataPart;

    if (dataPart.type === "append-message") {
      const message = JSON.parse(
        dataPart.message,
      ) as Message;
      setMessages([...initialMessages, message]);
    }
  }, [data, initialMessages, setMessages]);
}
```

If you get errors about `experimental_resume` not being a function, make sure you're on the latest version of `@ai-sdk/react`, by updating it via `pnpm`.

### `ChatPage`

- Add the `useAutoResume` hook to our `ChatPage` component.
- Pass an `id` parameters into `useChat` to identify the chat. This will be passed to `GET` `/api/chat` to resume the stream.

```tsx
import { useChat } from "@ai-sdk/react";

// ...other code
useChat({
  id: chatIdFromProps,
});
// ...other code
```

### `GET` `/api/chat`

- Create a `GET` endpoint in `/api/chat`. This will be responsible for resuming the stream. This will take in a query parameter of `chatId`.

```ts
import { createDataStream } from "ai";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new Response("Missing chatId", {
      status: 400,
    });
  }

  const userId = "foo"; // Get the user id from the current auth session

  // Check that the user exists
  // Check that the user is the owner of the chat
  // Check that the chat exists

  const streams =
    await whateverOurDbHelperToGetTheStreamsIs({
      chatId,
      userId,
    });

  const recentStream = streams.at(-1);

  if (!recentStream) {
    return new Response("No stream found", {
      status: 404,
    });
  }

  const streamContext = getStreamContext();

  const emptyDataStream = createDataStream({
    execute: async (dataStream) => {},
  });

  const resumedStream =
    await streamContext.resumableStream(
      recentStream.id,
      () => emptyDataStream,
    );

  // If the stream was resumed, return the stream
  if (resumedStream) {
    return new Response(resumedStream, {
      status: 200,
    });
  }

  // Use existing db helpers to get the most recent message
  const chat = await whateverOurDbHelperToGetTheChatIs(
    {
      chatId,
      userId,
    },
  );
  const mostRecentMessage = chat.messages.at(-1);

  // If there are no messages, return an empty stream
  if (!mostRecentMessage) {
    return new Response(emptyDataStream, {
      status: 200,
    });
  }

  // If the most recent message is not an assistant message,
  // return an empty stream
  if (mostRecentMessage.role !== "assistant") {
    return new Response(emptyDataStream, {
      status: 200,
    });
  }

  // If the stream was not resumed, create a new stream which
  // writes some data to the stream to append the most recent message
  const restoredStream = createDataStream({
    execute: (buffer) => {
      buffer.writeData({
        type: "append-message",
        message: JSON.stringify(mostRecentMessage),
      });
    },
  });

  // Return the stream
  return new Response(restoredStream, { status: 200 });
}
```
