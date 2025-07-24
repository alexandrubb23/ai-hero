import { useChat } from "ai/react";
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
  } = useChat({
    api: "http://localhost:4317/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "user",
        content: "Hello, world!",
      },
    ],
  });

  return (
    <Wrapper>
      {messages.map((message) => {
        const latestAnnotation =
          message.annotations?.[
            message.annotations.length - 1
          ];
        return (
          <div key={message.id}>
            <Message
              role={message.role}
              content={message.content}
            />
            {latestAnnotation && (
              <pre>
                {JSON.stringify(
                  latestAnnotation,
                  null,
                  2,
                )}
              </pre>
            )}
          </div>
        );
      })}

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
