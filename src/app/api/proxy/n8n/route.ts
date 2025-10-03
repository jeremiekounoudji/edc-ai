import { NextRequest } from 'next/server';

// n8n webhook URL
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL|| "https://unterminative-eladia-nongenuinely.ngrok-free.dev/webhook-test/b03f3332-b73c-46df-aba1-d41a4e58db24";

/**
 * POST handler for proxying requests to n8n
 * Browser → Next.js API route → n8n
 */
export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    console.log('Proxying request to n8n:', { 
      url: N8N_WEBHOOK_URL, 
      body: body.chatMessage ? `${body.chatMessage.substring(0, 50)}...` : body 
    });
    
    // Forward the request to n8n with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 15 second timeout
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('n8n response status:', response.status);
    
    // Check if the response is successful
    if (!response.ok) {
      console.error('n8n request failed:', {
        status: response.status,
        statusText: response.statusText
      });
      
      // Return a more user-friendly error message
      return new Response(
        JSON.stringify({ 
          error: 'Service temporarily unavailable',
          message: 'The AI service is currently unavailable. Please try again in a few moments.',
          status: response.status,
          timestamp: new Date().toISOString()
        }),
        {
          status: 503, // Service Unavailable
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Parse the response as JSON
    const responseData = await response.json();
    
    // Return the response as JSON
    return new Response(
      JSON.stringify(responseData),
      {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error proxying request to n8n:', error);
    
    // Handle different types of errors
    let errorMessage = 'Internal server error when proxying to AI service';
    let errorStatus = 500;
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout - the AI service is taking too long to respond';
        errorStatus = 504; // Gateway Timeout
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to AI service - the service may be temporarily unavailable';
        errorStatus = 502; // Bad Gateway
      }
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'AI Service Unavailable',
        message: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      {
        status: errorStatus,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

/**
 * GET handler for health check
 */
export async function GET() {
  return new Response(
    JSON.stringify({ 
      message: 'n8n proxy API route is working',
      timestamp: new Date().toISOString(),
      endpoint: N8N_WEBHOOK_URL
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// Ensure this route uses the Node.js runtime
export const runtime = 'nodejs';