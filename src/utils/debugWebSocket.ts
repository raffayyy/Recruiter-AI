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

/**
 * Test sending audio data over WebSocket
 * 
 * This function helps diagnose issues with audio recording and transmission by:
 * 1. Creating a test audio recording
 * 2. Sending it via WebSocket
 * 3. Monitoring the response
 */
export function testAudioWebSocketTransmission(url: string, token?: string): Promise<{
  success: boolean;
  message: string;
  stages: Record<string, { success: boolean; message: string; [key: string]: any }>;
}> {
  return new Promise(async (resolve) => {
    const stages: Record<string, { success: boolean; message: string; [key: string]: any }> = {};
    let socket: WebSocket | null = null;
    
    try {
      // Step 1: Test recording an audio sample
      console.log("Testing audio recording capabilities...");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioTracks = stream.getAudioTracks();
        
        if (audioTracks.length === 0) {
          stages.recording = { success: false, message: "No audio tracks available" };
          throw new Error("No audio tracks available");
        }
        
        console.log(`Audio track found: ${audioTracks[0].label}`);
        stages.recording = { 
          success: true, 
          message: `Audio track available: ${audioTracks[0].label}` 
        };
        
        // Record a short audio sample
        const testRecorder = new MediaRecorder(stream);
        const audioChunks: BlobPart[] = [];
        
        testRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };
        
        // Create a promise to wait for recording completion
        const audioBlob = await new Promise<Blob>((resolveRecording, rejectRecording) => {
          testRecorder.onstop = () => {
            if (audioChunks.length === 0) {
              stages.encoding = { success: false, message: "No audio data recorded" };
              rejectRecording(new Error("No audio data recorded"));
              return;
            }
            
            const mimeType = testRecorder.mimeType || 'audio/webm';
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            console.log(`Audio sample recorded: ${audioBlob.size} bytes, format: ${mimeType}`);
            
            stages.encoding = { 
              success: true, 
              message: `Audio sample recorded: ${audioBlob.size} bytes`,
              format: mimeType
            };
            
            resolveRecording(audioBlob);
          };
          
          // Start recording for 1 second
          testRecorder.start();
          console.log("Started test recording...");
          
          // Stop after 1 second
          setTimeout(() => {
            testRecorder.stop();
            console.log("Stopped test recording");
          }, 1000);
        });
        
        // Encode the audio for transmission
        const base64Audio = await new Promise<string>((resolveEncoding, rejectEncoding) => {
          const reader = new FileReader();
          
          reader.onloadend = () => {
            try {
              if (!reader.result) {
                stages.encoding = { 
                  ...stages.encoding, 
                  success: false, 
                  message: "FileReader produced no result" 
                };
                rejectEncoding(new Error("FileReader produced no result"));
                return;
              }
              
              let base64Audio = "";
              if (typeof reader.result === 'string') {
                if (reader.result.indexOf('base64,') >= 0) {
                  base64Audio = reader.result.split('base64,')[1];
                  console.log(`Base64 audio data extracted, length: ${base64Audio.length}`);
                } else {
                  base64Audio = reader.result;
                  console.log(`String audio data, length: ${base64Audio.length}`);
                }
              } else if (reader.result instanceof ArrayBuffer) {
                const array = new Uint8Array(reader.result);
                let binary = '';
                for (let i = 0; i < array.length; i++) {
                  binary += String.fromCharCode(array[i]);
                }
                base64Audio = window.btoa(binary);
                console.log(`ArrayBuffer converted to base64, length: ${base64Audio.length}`);
              }
              
              if (base64Audio.length === 0) {
                stages.encoding = { 
                  ...stages.encoding, 
                  success: false, 
                  message: "Failed to extract audio data" 
                };
                rejectEncoding(new Error("Failed to extract audio data"));
                return;
              }
              
              stages.encoding = { 
                ...stages.encoding,
                success: true, 
                message: `Audio data encoded, length: ${base64Audio.length}` 
              };
              
              resolveEncoding(base64Audio);
            } catch (error) {
              stages.encoding = { 
                ...stages.encoding, 
                success: false, 
                message: `Error encoding audio: ${error instanceof Error ? error.message : String(error)}` 
              };
              rejectEncoding(error);
            }
          };
          
          reader.onerror = (error) => {
            stages.encoding = { 
              ...stages.encoding, 
              success: false, 
              message: `FileReader error: ${String(error)}` 
            };
            rejectEncoding(error);
          };
          
          // Read as data URL for better browser compatibility
          reader.readAsDataURL(audioBlob);
        });
        
        // Connect to WebSocket
        console.log("Testing WebSocket connection...");
        try {
          const fullUrl = token ? `${url}${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}` : url;
          
          socket = await new Promise<WebSocket>((resolveConnection, rejectConnection) => {
            const ws = new WebSocket(fullUrl);
            
            ws.onopen = () => {
              console.log("WebSocket connection established");
              stages.connection = { 
                success: true, 
                message: "WebSocket connection established" 
              };
              resolveConnection(ws);
            };
            
            ws.onerror = (error) => {
              console.error("WebSocket connection error:", error);
              stages.connection = { 
                success: false, 
                message: "WebSocket connection error" 
              };
              rejectConnection(error);
            };
            
            ws.onclose = (event) => {
              if (!stages.connection) {
                console.error(`WebSocket closed during connection: ${event.code}`);
                stages.connection = { 
                  success: false, 
                  message: `WebSocket closed during connection: ${event.code}` 
                };
                rejectConnection(new Error(`WebSocket closed: ${event.code}`));
              }
            };
            
            // Set connection timeout
            setTimeout(() => {
              if (!stages.connection || !stages.connection.success) {
                stages.connection = { 
                  success: false, 
                  message: "WebSocket connection timed out" 
                };
                rejectConnection(new Error("WebSocket connection timed out"));
              }
            }, 5000);
          });
          
          // Send audio data
          console.log("Sending audio data over WebSocket...");
          const message = {
            type: 'response',
            audio_data: base64Audio
          };
          
          socket.send(JSON.stringify(message));
          console.log("Audio data sent successfully");
          stages.transmission = { 
            success: true, 
            message: "Audio data sent successfully" 
          };
          
          // Wait for response
          await new Promise<void>((resolveResponse) => {
            const responseHandler = (event: MessageEvent) => {
              try {
                console.log("Received response from server:", event.data);
                const response = JSON.parse(event.data);
                stages.response = { 
                  success: true, 
                  message: "Received response from server",
                  data: response
                };
                socket?.removeEventListener('message', responseHandler);
                resolveResponse();
              } catch (error) {
                console.error("Error parsing server response:", error);
                stages.response = { 
                  success: true, 
                  message: `Received unparseable response: ${String(event.data).substring(0, 100)}` 
                };
                socket?.removeEventListener('message', responseHandler);
                resolveResponse();
              }
            };
            
            socket?.addEventListener('message', responseHandler);
            
            // Set response timeout
            setTimeout(() => {
              stages.response = { 
                success: false, 
                message: "No response received from server within timeout period" 
              };
              socket?.removeEventListener('message', responseHandler);
              resolveResponse();
            }, 5000);
          });
          
        } catch (error) {
          console.error("Error in WebSocket communication:", error);
          if (!stages.connection) {
            stages.connection = { 
              success: false, 
              message: `WebSocket connection error: ${error instanceof Error ? error.message : String(error)}`
            };
          }
        }
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        
      } catch (error) {
        console.error("Error testing audio:", error);
        if (!stages.recording) {
          stages.recording = { 
            success: false, 
            message: `Error accessing microphone: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
      
      // Determine overall success
      const allStagesSuccessful = Object.values(stages).every(stage => stage.success);
      
      // Close the WebSocket if it's still open
      if (socket && socket.readyState === WebSocket.OPEN) {
        try {
          socket.close();
        } catch (e) {
          console.error("Error closing WebSocket:", e);
        }
      }
      
      resolve({
        success: allStagesSuccessful,
        message: allStagesSuccessful 
          ? "Audio recording and transmission test successful" 
          : "Audio test failed at one or more stages",
        stages
      });
      
    } catch (error) {
      console.error("Unexpected error in test:", error);
      if (socket && socket.readyState === WebSocket.OPEN) {
        try {
          socket.close();
        } catch (e) {
          console.error("Error closing WebSocket:", e);
        }
      }
      
      resolve({
        success: false,
        message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
        stages
      });
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