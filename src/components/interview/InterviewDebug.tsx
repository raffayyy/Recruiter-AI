// import React, { useEffect, useState } from 'react';
// import { testWebSocketConnection, validateWebSocketUrl } from '../../utils/debugWebSocket';
// import { useAuth } from '../../contexts/AuthContext';

// interface Props {
//   applicationId: string;
//   onClose: () => void;
// }

// export function InterviewDebug({ applicationId, onClose }: Props) {
//   const { token } = useAuth();
//   const [testing, setTesting] = useState(false);
//   const [testResult, setTestResult] = useState<any>(null);
//   const [websocketUrl, setWebsocketUrl] = useState('');
//   const [backendUrl, setBackendUrl] = useState('http://localhost:8000');
//   const [logMessages, setLogMessages] = useState<string[]>([]);
//   const [audioTested, setAudioTested] = useState(false);
  
//   // Add log message to the list
//   const addLog = (message: string) => {
//     setLogMessages(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
//   };
  
//   useEffect(() => {
//     // Construct the default WebSocket URL
//     const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
//     const host = import.meta.env.VITE_WS_HOST || window.location.hostname;
//     const port = import.meta.env.VITE_WS_PORT || '8000';
//     setWebsocketUrl(`${protocol}//${host}:${port}/interview/ws/${applicationId}`);
    
//     // Test browser audio capabilities
//     testAudioCapabilities();
//   }, [applicationId]);
  
//   // Test audio capabilities in browser
//   const testAudioCapabilities = async () => {
//     if (audioTested) return;
    
//     try {
//       addLog("Testing audio capabilities...");
      
//       // Check MediaRecorder support
//       if (!window.MediaRecorder) {
//         addLog("⚠️ MediaRecorder API not supported in this browser");
//       } else {
//         addLog("✓ MediaRecorder API is supported");
        
//         // Check supported mime types
//         const mimeTypes = [
//           "audio/webm", 
//           "audio/ogg", 
//           "audio/mp4", 
//           "audio/wav"
//         ];
        
//         const supported = mimeTypes.filter(type => MediaRecorder.isTypeSupported(type));
        
//         if (supported.length === 0) {
//           addLog("⚠️ No supported audio formats found");
//         } else {
//           addLog(`✓ Supported audio formats: ${supported.join(', ')}`);
//         }
        
//         // Test microphone access
//         try {
//           const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//           addLog("✓ Microphone access granted");
          
//           // Clean up
//           stream.getTracks().forEach(track => track.stop());
//         } catch (err) {
//           addLog(`⚠️ Microphone access denied: ${(err as Error).message}`);
//         }
//       }
      
//       setAudioTested(true);
//     } catch (error) {
//       addLog(`Error testing audio: ${(error as Error).message}`);
//     }
//   };
  
//   const handleTest = async () => {
//     setTesting(true);
//     setTestResult(null);
    
//     try {
//       // First test HTTP connectivity
//       addLog(`Testing HTTP connectivity to ${backendUrl}...`);
//       try {
//         const httpResponse = await fetch(`${backendUrl}/docs`, { method: 'HEAD' });
//         addLog(`✓ HTTP connection successful (${httpResponse.status})`);
//       } catch (error) {
//         addLog(`⚠️ HTTP connection failed: ${(error as Error).message}`);
//       }
      
//       // Now test WebSocket connection
//       const { valid, wsUrl, message } = validateWebSocketUrl(websocketUrl);
      
//       if (!valid) {
//         setTestResult({
//           success: false,
//           message: `Invalid WebSocket URL: ${message}`
//         });
//         addLog(`✗ WebSocket URL invalid: ${message}`);
//         setTesting(false);
//         return;
//       }
      
//       addLog(`Testing WebSocket connection to ${wsUrl.replace(/token=([^&]+)/, 'token=***')}...`);
      
//       // Test the connection
//       const result = await testWebSocketConnection(wsUrl, token);
//       setTestResult(result);
      
//       if (result.success) {
//         addLog(`✓ WebSocket connection successful: ${result.message}`);
//       } else {
//         addLog(`✗ WebSocket connection failed: ${result.message}`);
//       }
//     } catch (error) {
//       setTestResult({
//         success: false,
//         message: `Error testing connection: ${(error as Error).message}`
//       });
//       addLog(`✗ Test error: ${(error as Error).message}`);
//     } finally {
//       setTesting(false);
//     }
//   };
  
//   const handleTestAPI = async () => {
//     setTesting(true);
//     setTestResult(null);
    
//     try {
//       addLog(`Testing API endpoint: ${backendUrl}/interview/start/${applicationId}`);
      
//       const response = await fetch(`${backendUrl}/interview/start/${applicationId}`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       const data = await response.json();
      
//       setTestResult({
//         success: response.ok,
//         message: response.ok 
//           ? 'API connection successful' 
//           : `API error: ${response.status} ${response.statusText}`,
//         details: data
//       });
      
//       if (response.ok) {
//         addLog(`✓ API request successful`);
//       } else {
//         addLog(`✗ API request failed: ${response.status} ${response.statusText}`);
//         if (data.detail) {
//           addLog(`  Error details: ${data.detail}`);
//         }
//       }
//     } catch (error) {
//       setTestResult({
//         success: false,
//         message: `API connection failed: ${(error as Error).message}`
//       });
//       addLog(`✗ API connection error: ${(error as Error).message}`);
//     } finally {
//       setTesting(false);
//     }
//   };
  
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
//         <h2 className="text-xl font-bold mb-4">Interview Connection Debugger</h2>
        
//         <div className="mb-4">
//           <h3 className="font-medium mb-2">Application ID</h3>
//           <div className="p-2 bg-gray-100 rounded">{applicationId}</div>
//         </div>
        
//         <div className="mb-4">
//           <h3 className="font-medium mb-2">WebSocket URL</h3>
//           <input
//             type="text"
//             value={websocketUrl}
//             onChange={(e) => setWebsocketUrl(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         </div>
        
//         <div className="mb-4">
//           <h3 className="font-medium mb-2">Backend API URL</h3>
//           <input
//             type="text"
//             value={backendUrl}
//             onChange={(e) => setBackendUrl(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         </div>
        
//         <div className="flex gap-3 mb-4">
//           <button
//             onClick={handleTest}
//             disabled={testing}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
//           >
//             {testing ? 'Testing...' : 'Test WebSocket Connection'}
//           </button>
          
//           <button
//             onClick={handleTestAPI}
//             disabled={testing}
//             className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
//           >
//             {testing ? 'Testing...' : 'Test API Connection'}
//           </button>
          
//           <button
//             onClick={testAudioCapabilities}
//             disabled={testing}
//             className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
//           >
//             Test Audio
//           </button>
//         </div>
        
//         {testResult && (
//           <div className={`p-4 rounded mb-4 ${testResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
//             <h3 className="font-medium mb-2">Test Result</h3>
//             <p className="mb-2">{testResult.message}</p>
//             {testResult.details && (
//               <pre className="bg-gray-800 text-white p-3 rounded overflow-x-auto text-sm">
//                 {JSON.stringify(testResult.details, null, 2)}
//               </pre>
//             )}
//           </div>
//         )}
        
//         <div className="mb-4">
//           <h3 className="font-medium mb-2">Debug Log</h3>
//           <div className="bg-gray-900 text-gray-100 p-3 rounded h-40 overflow-y-auto font-mono text-xs">
//             {logMessages.map((msg, index) => (
//               <div key={index} className="mb-1">{msg}</div>
//             ))}
//           </div>
//         </div>
        
//         <div className="mt-4">
//           <h3 className="font-medium mb-2">Troubleshooting Tips</h3>
//           <ul className="list-disc pl-6 space-y-1 text-sm">
//             <li>Ensure your backend server is running (<code>uvicorn app.main:app --reload</code>)</li>
//             <li>Check that the WebSocket port (8000) is not blocked by a firewall</li>
//             <li>Verify your authentication token is valid (check expiration)</li>
//             <li>Make sure the application ID exists in the database</li>
//             <li>Check browser console for CORS-related errors</li>
//             <li>Try using Chrome, which has better WebRTC support</li>
//             <li>If all else fails, try restarting both frontend and backend servers</li>
//           </ul>
//         </div>
        
//         <div className="mt-6 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// } 