import { useChat } from "ai/react";
import React from "react";
import { createRoot } from "react-dom/client";
import {
  ChatInput,
  Message,
  Wrapper,
} from "../../../_shared/components/components.tsx";
import "./tailwind.css";

const App = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat({});

  return (
    <Wrapper>
      {messages.map((message) => (
        <Message
          key={message.id}
          role={message.role}
          content={message.content}
        />
      ))}
      <ChatInput
        input={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </Wrapper>
  );
};

const root = createRoot(
  document.getElementById("root")!,
);
root.render(<App />);
