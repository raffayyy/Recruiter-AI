/**
 * WebSocket Connection Tester
 * 
 * This utility helps diagnose WebSocket connection issues without modifying backend code.
 */

export function testWebSocketConnection(url: string, token?: string): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  return new Promise((resolve) => {
    let resolved = false;
    console.log(`Testing WebSocket connection to ${url}`);
    
    // Set timeout for connection attempt
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve({
          success: false,
          message: 'Connection timed out after 10 seconds'
        });
      }
    }, 10000);
    
    try {
      // Add token as query param if provided
      const fullUrl = token ? `${url}${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}` : url;
      
      const ws = new WebSocket(fullUrl);
      
      ws.onopen = () => {
        clearTimeout(timeout);
        
        // Send a ping to test if the connection is functioning
        try {
          ws.send(JSON.stringify({ type: 'ping' }));
          
          // Set a timeout to close if we don't get a response
          setTimeout(() => {
            if (!resolved) {
              ws.close();
              resolved = true;
              resolve({
                success: true,
                message: 'Connection established but no response to ping',
                details: { readyState: ws.readyState }
              });
            }
          }, 2000);
        } catch (error) {
          if (!resolved) {
            resolved = true;
            resolve({
              success: false,
              message: 'Failed to send ping message',
              details: error
            });
          }
        }
      };
      
      ws.onmessage = (event) => {
        clearTimeout(timeout);
        if (!resolved) {
          resolved = true;
          try {
            const data = JSON.parse(event.data);
            resolve({
              success: true,
              message: 'Connection successful and received response',
              details: data
            });
          } catch (error) {
            resolve({
              success: true,
              message: 'Connection successful but received invalid JSON',
              details: { raw: event.data }
            });
          }
        }
        ws.close();
      };
      
      ws.onerror = (error) => {
        clearTimeout(timeout);
        if (!resolved) {
          resolved = true;
          resolve({
            success: false,
            message: 'Connection error',
            details: { error }
          });
        }
      };
      
      ws.onclose = (event) => {
        clearTimeout(timeout);
        if (!resolved) {
          resolved = true;
          resolve({
            success: false,
            message: `Connection closed with code ${event.code}: ${event.reason}`,
            details: { code: event.code, reason: event.reason }
          });
        }
      };
    } catch (error: unknown) {
      clearTimeout(timeout);
      if (!resolved) {
        resolved = true;
        resolve({
          success: false,
          message: 'Failed to create WebSocket',
          details: error
        });
      }
    }
  });
}

export function validateWebSocketUrl(url: string): { valid: boolean; wsUrl: string; message?: string } {
  if (!url) {
    return { valid: false, wsUrl: '', message: 'URL is empty' };
  }
  
  try {
    const urlObj = new URL(url);
    
    // Handle HTTP URLs and convert to WebSocket
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      const wsProtocol = urlObj.protocol === 'https:' ? 'wss:' : 'ws:';
      return { 
        valid: true, 
        wsUrl: `${wsProtocol}//${urlObj.host}${urlObj.pathname}${urlObj.search}` 
      };
    }
    
    // Handle WebSocket URLs directly
    if (urlObj.protocol === 'ws:' || urlObj.protocol === 'wss:') {
      return { valid: true, wsUrl: url };
    }
    
    return { 
      valid: false, 
      wsUrl: '', 
      message: `Invalid protocol: ${urlObj.protocol}. Expected http(s): or ws(s):` 
    };
  } catch (error) {
    return { 
      valid: false, 
      wsUrl: '', 
      message: `Invalid URL: ${(error as Error).message}` 
    };
  }
} 