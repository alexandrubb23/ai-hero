#!/bin/bash

echo "Starting Langfuse locally..."

# Start Langfuse with Docker Compose
docker-compose -f docker-compose.langfuse.yml up -d

echo "Langfuse is starting..."
echo "It will be available at: http://localhost:3030"
echo ""
echo "Default credentials for first setup:"
echo "  - Create a new account on first visit"
echo "  - Set up your project and get API keys"
echo ""
echo "To stop Langfuse, run:"
echo "  docker-compose -f docker-compose.langfuse.yml down"
