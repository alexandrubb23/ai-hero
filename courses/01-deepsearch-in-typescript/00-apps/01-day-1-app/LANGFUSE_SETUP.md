# Langfuse Cloud Setup Instructions

This application is configured to use Langfuse Cloud for LLM observability and tracing.

## Getting Started

1. **Sign up for Langfuse Cloud**

   - Go to [cloud.langfuse.com](https://cloud.langfuse.com)
   - Create a free account

2. **Create a Project**

   - After signing up, create a new project
   - Give it a meaningful name (e.g., "AI Hero Chat App")

3. **Get Your API Keys**

   - In your project dashboard, go to "Settings" → "API Keys"
   - Copy the `Public Key` and `Secret Key`

4. **Configure Environment Variables**

   - Copy `.env.example` to `.env` if you haven't already
   - Add your Langfuse credentials:

   ```bash
   LANGFUSE_SECRET_KEY="sk-lf-..."
   LANGFUSE_PUBLIC_KEY="pk-lf-..."
   LANGFUSE_BASEURL="https://cloud.langfuse.com"
   ```

5. **Start Your Application**
   - Run `pnpm run dev`
   - The application will automatically start sending traces to Langfuse Cloud

## What Gets Tracked

The application automatically tracks:

- **Conversations**: Each chat session is traced as a conversation
- **Messages**: User inputs and AI responses
- **Tool Calls**: Web search operations via Serper
- **Token Usage**: Input/output tokens and costs
- **Latency**: Response times for each generation
- **Errors**: Any failures in the AI pipeline

## Viewing Your Data

1. Go to your project dashboard on [cloud.langfuse.com](https://cloud.langfuse.com)
2. Navigate to:
   - **Traces**: See individual conversation flows
   - **Sessions**: Group traces by user sessions
   - **Users**: Track usage per user
   - **Scores**: Monitor response quality
   - **Analytics**: Usage patterns and costs

## Local Development

If Langfuse environment variables are not set, the application will:

- Log "Langfuse not configured. Tracing disabled." in development
- Continue to work normally without observability
- Not block any functionality

This means you can run the app locally without Langfuse if needed.

## Production Considerations

- Langfuse Cloud has a generous free tier suitable for development and small production workloads
- Monitor your usage in the Langfuse dashboard
- Consider setting up alerts for unusual usage patterns
- Review traces regularly to optimize your LLM application performance
