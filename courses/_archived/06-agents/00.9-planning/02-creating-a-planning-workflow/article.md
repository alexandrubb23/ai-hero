Planning should be decoupled from execution. You should create a chain where the first call creates the plan, and then only after the plan is validated is it then executed.

Validating the plan is really important. You can validate the plan using heuristics. For example, one simple heuristic is to eliminate plans with invalid actions. If the plan requires a `Google` search and the agent doesn't have access to a `Google` search, the plan is invalid.

Your system can have three components. One generates plans, one validates plans, and the other executes the plan.
