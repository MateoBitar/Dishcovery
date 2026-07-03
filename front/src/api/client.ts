// client.ts
// GraphQL Client for making requests to the backend
import { storage } from '../utils/storage';

const GRAPHQL_ENDPOINT = 'http://localhost:9898/graphql';  // Backend GraphQL endpoint

// Interface for GraphQL response structure
interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: Record<string, any>;
  }>;
}

// GraphQL Client class
export class GraphQLClient {
  static async request<T>(  // Generic method to make GraphQL requests
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    const token = storage.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {  // Make fetch request
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GraphQLResponse<T> = await response.json();  // Parse JSON response

      if (result.errors) {
        const errorMessage = result.errors[0]?.message || 'GraphQL error occurred';
        throw new Error(errorMessage);
      }

      if (!result.data) {
        throw new Error('No data returned from GraphQL');
      }

      return result.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
}
