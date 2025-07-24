Code execution is an alternative model to orchestrators. By getting the `LLM` to write and execute code, you can essentially ask the element to call tools via the code it creates.

The code it creates represents a kind of chain of thought of the `LLM`. Then, with some clever tricks, you can inject your tools into the code execution environment, and have the `LLM` call them.

But having the `LLM` write and execute code is obviously very dangerous.

So knowing how to safely sandbox the `LLM` is critical.
