So far, our orchestrators have been communicating with their agents using tool calls.

But there's a different potential architecture we can use here.

Instead of calling the agents directly, the orchestrator can send them messages through a queue.

All agents will report to the same queue:

```ts
type Message = {
  // The agent that should receive the message
  to: string;
  // The agent that sent the message
  from: string;
  // The message to send
  message: string;
  sentTime: number;
};
```

This makes our process a lot easier to debug. We can log the state of the queue at any time. We can implement retry logic. We can slow down or speed up the rate at which messages are consumed.
