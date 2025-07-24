import { useChat } from "ai/react";
import { createRoot } from "react-dom/client";
import {
  ChatInput,
  Message,
  Wrapper,
} from "../../../_shared/components/components.tsx";
import "./tailwind.css";
import { PlusIcon, XIcon } from "lucide-react";

const App = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat({
    api: "http://localhost:4317/api/chat",
  });

  return (
    <Wrapper>
      {messages.map((message) => (
        <>
          <Message
            key={message.id}
            role={message.role}
            content={message.content}
          />
          {message.toolInvocations?.map(
            (invocation) => {
              if (invocation.state !== "result") {
                return null;
              }
              const args: {
                key: string;
                value: string | undefined;
              } = invocation.args;

              if (!args.value) {
                return (
                  <div className="flex items-center space-x-2  font-mono">
                    <XIcon className="text-red-300" />
                    <span className="text-xs text-gray-300">
                      {args.key}
                    </span>
                  </div>
                );
              }

              return (
                <div className="flex items-center space-x-2 ">
                  <PlusIcon className="text-green-300" />
                  <div>
                    <p className="text-xs text-gray-300 font-mono">
                      {args.key}
                    </p>
                    <p className="text-gray-100 text-sm">
                      {args.value}
                    </p>
                  </div>
                </div>
              );
            },
          )}
        </>
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
