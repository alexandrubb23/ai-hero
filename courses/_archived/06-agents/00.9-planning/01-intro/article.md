Every agent should use a planning process. The output of the planning process is a plan - A roadmap outlining the steps needed to accomplish a task.

You often want the model to consider the task, consider the different options to achieve the task and choose the most promising option.

As an important computational problem, planning is very well studied.

One open question is how well foundation models can plan.

Many researchers think that foundation models cannot plan at all.

Instead of actually planning they are simply retrieving things from their corpus that look like plans.

However this may be because we don't know how to use LLMs the right way in order to generate plans.

Planning is, at its core, a search problem. You search among different paths to the goal, you predict the outcome of each path and you pick the path with the most promising outcome.

Making plans as if through a maze often requires backtracking. You reach a dead end and you have to backtrack to a certain point.

Some say that models can only generate forward actions. They can't go backwards to generate alternate actions.

It's also possible that language models are poor planners because they aren't given the tools necessary to plan.

It's necessary to know the outcome state to determine whether to take an action or not.

This paper argues that an LLM, by containing so much information about the world, is capable of predicting the outcome of each action.

https://arxiv.org/abs/2305.14992
