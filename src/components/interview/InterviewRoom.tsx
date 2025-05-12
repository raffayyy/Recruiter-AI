import React, { useRef, useEffect, useState, useCallback } from "react";
import { VideoPanel } from "./VideoPanel";
import { InterviewControls } from "./InterviewControls";
import { VirtualInterviewer } from "./VirtualInterviewer";
import { ProctoringWarnings } from "./ProctoringWarnings";
import { useVideoStream } from "../../hooks/useVideoStream";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, AlertTriangle } from "lucide-react";
import { useWebSocket } from "../../hooks/useWebSocket";
import api from "../../lib/api";
import { InterviewDebug } from "./InterviewDebug";

// 15 minutes interview duration
const INTERVIEW_DURATION = 15 * 60; // seconds

export function InterviewRoom() {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(true); // Start muted by default
  const [isVideoOn, setIsVideoOn] = useState(true);
  const { stream, error } = useVideoStream();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isRecording, setIsRecording] = useState(false);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const [serverQuestion, setServerQuestion] = useState("");
  const { id } = useParams();
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [showDebugger, setShowDebugger] = useState(false);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(INTERVIEW_DURATION);
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsHost = import.meta.env.VITE_WS_HOST || window.location.hostname;
  const wsPort = import.meta.env.VITE_WS_PORT || '8000';
  const wsUrl = `${wsProtocol}//${wsHost}:${wsPort}`;
  const wsEndpoint = `${wsUrl}/interview/ws/${id}`;
  
  // Add debugging information
  console.log("Using WebSocket URL:", wsEndpoint);
  console.log("Token available:", !!localStorage.getItem("access_token"));
  // Use the websocket hook
  const { isConnected, messages, sendMessage } = useWebSocket(wsEndpoint);

  // Add this right after the socket hook definition
  useEffect(() => {
    // Enhanced connection debugging
    console.log("WebSocket connection state:", {
      isConnected,
      endpoint: wsEndpoint,
      messagesCount: messages.length
    });

    if (!isConnected) {
      // Log additional information for debugging
      const corsTest = async () => {
        try {
          const testEndpoint = `http://${wsHost}:${wsPort}/interview/start/${id}`;
          console.log("Testing HTTP endpoint:", testEndpoint);
          
          const response = await fetch(testEndpoint, {
            method: 'HEAD',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
            }
          });
          
          console.log("HTTP endpoint test result:", {
            status: response.status,
            ok: response.ok,
            headers: {
              'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
              'server': response.headers.get('server')
            }
          });
        } catch (error) {
          console.error("HTTP endpoint test failed:", error);
        }
      };
      
      corsTest();
    }
  }, [isConnected, wsEndpoint, wsHost, wsPort, id, messages.length]);

  // Define stopRecording function using useCallback
  const stopRecording = useCallback(() => {
    if (!mediaRecorder) {
      console.warn("No active media recorder");
      return;
    }

    try {
      mediaRecorder.stop();
      setMediaRecorder(null);
      console.log("Recording stopped");
    } catch (err) {
      console.error("Error stopping recording:", err);
    }
  }, [mediaRecorder]);

  // Initialize interview
  useEffect(() => {
    const startInterview = async () => {
      try {
        console.log("Starting interview...");
        const response = await api.applications.createInterview(id!);

        if (response.status === "success") {
          console.log("Interview created successfully");
          setInterviewStarted(true);
        } else {
          console.error("Failed to start interview:", response);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error starting interview:", error);
        navigate("/dashboard");
      }
    };

    if (id && !interviewStarted) {
      startInterview();
    }
  }, [id, interviewStarted, navigate]);

  // Process incoming messages
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      console.log("Received message:", latestMessage);

      if (latestMessage.type === "question" && typeof latestMessage.question === "string") {
        setServerQuestion(latestMessage.question);
      } else if (latestMessage.type === "audio") {
        try {
          let audioBase64;
          let contentType = "audio/ogg";
          
          // Handle different audio data formats from backend
          if (typeof latestMessage.audio_data === 'string') {
            // Direct base64 string
            audioBase64 = latestMessage.audio_data;
          } else if (latestMessage.audio_data && typeof latestMessage.audio_data === 'object') {
            // Object with audio_base64 property - use type assertion with interface
            interface AudioData {
              audio_base64?: string;
              content_type?: string;
            }
            
            const audioData = latestMessage.audio_data as AudioData;
            
            if (audioData.audio_base64) {
              audioBase64 = audioData.audio_base64;
              
              if (audioData.content_type) {
                contentType = audioData.content_type;
              }
            }
          }
          
          if (audioBase64) {
            console.log(`Playing audio (format: ${contentType})`);
            
            // Convert base64 to binary
            const binary = atob(audioBase64);
            const array = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
              array[i] = binary.charCodeAt(i);
            }
            
            // Create blob and URL
            const blob = new Blob([array], { type: contentType });
            const url = URL.createObjectURL(blob);
            
            // Play the audio
            const audio = new Audio(url);
            audio.onended = () => {
              URL.revokeObjectURL(url);
              console.log("Audio playback finished");
            };
            audio.onerror = (e) => {
              console.error("Audio playback error:", e);
              URL.revokeObjectURL(url);
            };

            // Play with error handling
            audio.play().catch((err) => {
              console.error("Failed to play audio:", err);
              // Try alternative method if first attempt fails
              setTimeout(() => {
                const newAudio = document.createElement("audio");
                newAudio.src = url;
                document.body.appendChild(newAudio);
                newAudio.play()
                  .then(() => console.log("Fallback audio playing"))
                  .catch(e => console.error("Fallback audio failed:", e));
                newAudio.onended = () => {
                  document.body.removeChild(newAudio);
                  URL.revokeObjectURL(url);
                };
              }, 100);
            });
          } else {
            console.error("No valid audio data found in message", latestMessage);
          }
        } catch (err) {
          console.error("Error processing audio data:", err);
        }
      }
    }
  }, [messages]);

  // Timer effect with auto-submit
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          
          // Auto-submit when time ends - inlined to avoid dependency issues
          console.log("Interview time ended, auto-submitting...");
          if (confirm("Your time is up. The interview will be submitted now.")) {
            // Stop recording if active
            if (isRecording && mediaRecorder) {
              stopRecording();
            }

            // Stop all media tracks
            if (stream) {
              stream.getTracks().forEach((track) => track.stop());
            }

            // Navigate to completion page
            navigate("/interview-complete", {
              state: {
                autoSubmitted: true,
                applicationId: id,
              },
            });
          }
          
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [id, isRecording, mediaRecorder, navigate, stream, stopRecording]);

  // Show warning when 2 minutes left
  useEffect(() => {
    if (timeRemaining === 120) {
      setShowTimeWarning(true);
      setTimeout(() => setShowTimeWarning(false), 10000); // Hide after 10 seconds
    }
  }, [timeRemaining]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  function sendAudioToBackend(audioBlob: Blob) {
    if (!isConnected) {
      console.warn("WebSocket not connected, can't send audio");
      return;
    }

    console.log("Sending audio to backend...");
    const reader = new FileReader();

    reader.onloadend = () => {
      try {
        // Process audio data based on the result type
        let base64Audio = "";
        
        if (reader.result instanceof ArrayBuffer) {
          // Convert ArrayBuffer to base64
          const binary = String.fromCharCode(...new Uint8Array(reader.result));
          base64Audio = btoa(binary);
        } else if (typeof reader.result === 'string') {
          // Handle string result directly
          base64Audio = btoa(reader.result);
        } else {
          throw new Error("Unexpected FileReader result type");
        }
        
        // Log size for debugging
        console.log(`Audio data size: ${base64Audio.length} bytes`);
        
        // The WebSocket client will format this correctly to match backend
        sendMessage({
          type: "response",
          audio_data: base64Audio
        });
        
        console.log("Audio sent successfully");
      } catch (err) {
        console.error("Error encoding audio:", err);
      }
    };

    // For consistent browser support, read as ArrayBuffer
    reader.readAsArrayBuffer(audioBlob);
  }

  function startRecording() {
    if (!stream) {
      console.error("No media stream available");
      return;
    }

    try {
      // Find the best supported audio format
      const options = { mimeType: "audio/webm" };
      
      if (MediaRecorder.isTypeSupported("audio/webm")) {
        console.log("Using audio/webm");
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        console.log("Using audio/mp4");
        options.mimeType = "audio/mp4";
      } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
        console.log("Using audio/ogg");
        options.mimeType = "audio/ogg";
      } else {
        console.log("Using default codec");
      }
      
      const recorder = new MediaRecorder(stream, options);
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log(`Audio chunk received: ${event.data.size} bytes`);
        }
      };
      
      recorder.onstop = () => {
        setIsRecording(false);
        
        if (audioChunksRef.current.length === 0) {
          console.error("No audio data captured");
          return;
        }
        
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType
        });
        
        console.log(`Recording complete, blob size: ${audioBlob.size} bytes, type: ${audioBlob.type}`);
        
        // Send audio to backend for processing
        sendAudioToBackend(audioBlob);
      };
      
      // Request data every 500ms for smoother interaction
      recorder.start(500);
      setMediaRecorder(recorder);
      setIsRecording(true);
      console.log("Recording started");
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  }

  function toggleRecording() {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
    setIsRecording(!isRecording);
  }

  const handleEndInterview = (isAutoSubmit = false) => {
    if (
      isAutoSubmit ||
      confirm("Are you sure you want to end the interview?")
    ) {
      // Stop recording if active
      if (isRecording && mediaRecorder) {
        stopRecording();
      }

      // Stop all media tracks
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      // Navigate to completion page
      navigate("/interview-complete", {
        state: {
          autoSubmitted: isAutoSubmit,
          applicationId: id,
        },
      });
    }
  };

  // Connection status indicator
  const ConnectionStatus = () => (
    <div className="absolute top-4 left-4 z-10">
      <div
        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-white ${
          isConnected ? "bg-green-600" : "bg-red-600"
        }`}
      >
        <div
          className={`h-2 w-2 rounded-full ${
            isConnected ? "bg-green-300" : "bg-red-300"
          }`}
        />
        <span className="text-xs font-medium">
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 p-4 text-white">
        <div className="rounded-lg bg-red-900/50 p-6 text-center">
          <p className="text-lg">Failed to access camera and microphone</p>
          <p className="mt-2 text-sm text-red-300">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!interviewStarted || !isConnected) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 p-4 text-white">
        <div className="rounded-lg bg-gray-800 p-6 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-lg">Connecting to interview server...</p>
          <p className="mt-2 text-sm text-gray-400">
            Please wait while we set up your interview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 h-screen">
      {/* Connection status indicator */}
      <ConnectionStatus />

      {/* Timer display */}
      <div className="absolute top-4 right-4 z-10">
        <div
          className={`flex items-center gap-2 rounded-lg ${
            timeRemaining < 120 ? "bg-red-600" : "bg-blue-600"
          } px-3 py-1.5 text-white`}
        >
          <Clock className="h-4 w-4" />
          <span className="font-medium">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Time warning */}
      {showTimeWarning && (
        <div className="absolute top-16 right-4 z-10 w-64 animate-pulse rounded-lg bg-red-600 p-3 text-white">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">2 minutes remaining!</span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row p-4 md:p-6 h-full">
        {/* Main Content - Takes full width on mobile, partial on desktop */}
        <div className="relative flex-1 mb-4 md:mb-0">
          {/* Virtual Interviewer (Main Focus) */}
          <VirtualInterviewer
            isAnswering={!isMuted}
            question={serverQuestion}
          />
          
          {/* Mobile-only controls - visible only on small screens */}
          <div className="block md:hidden mt-4">
            <InterviewControls
              isMuted={isMuted}
              onToggleAudio={() => setIsMuted(!isMuted)}
              onEndInterview={() => handleEndInterview()}
              isRecording={isRecording}
              onToggleRecording={toggleRecording}
            />
          </div>
        </div>
        
        {/* Right side panel - Takes full width on mobile, partial on desktop */}
        <div className="flex flex-col w-full md:w-72 md:ml-4">
          {/* Self View */}
          <div className="w-full">
            <VideoPanel
              stream={stream}
              isMuted={isMuted}
              isVideoOn={isVideoOn}
              onToggleAudio={() => setIsMuted(!isMuted)}
              onToggleVideo={() => setIsVideoOn(!isVideoOn)}
            />
          </div>
          
          {/* Desktop controls - hidden on mobile */}
          <div className="hidden md:block mt-4">
            <InterviewControls
              isMuted={isMuted}
              onToggleAudio={() => setIsMuted(!isMuted)}
              onEndInterview={() => handleEndInterview()}
              isRecording={isRecording}
              onToggleRecording={toggleRecording}
            />
          </div>
          
          {/* Proctoring Warnings */}
          <div className="mt-4">
            <ProctoringWarnings />
          </div>
        </div>
      </div>

      {/* Debug tools */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowDebugger(true)}
          className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
          title="Debug Connection"
        >
          <AlertTriangle size={20} />
        </button>
      </div>
      
      {showDebugger && (
        <InterviewDebug 
          applicationId={id || ""} 
          onClose={() => setShowDebugger(false)} 
        />
      )}
    </div>
  );
}
