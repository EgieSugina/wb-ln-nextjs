import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

// Initialize the Apollo Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Enable introspection in all environments
});

// Initialize handler
const handler = startServerAndCreateNextHandler(apolloServer);

// Export the API route handlers
export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}