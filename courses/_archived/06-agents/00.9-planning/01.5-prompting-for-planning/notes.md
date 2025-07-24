How do you make an agent better at planning? It's all about prompt engineering, of course. You can write a better system prompt with more exemplars.

The exemplars look like this: You provide an example of the task and then you provide an array of possible tools that the model can call in order to fulfill the task.

Task: "Tell me about product X"
Tools: [`get_product`, `get_price`, `get_reviews`]
