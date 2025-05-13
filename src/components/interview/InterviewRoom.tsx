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
// import { InterviewDebug } from "./InterviewDebug";

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
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const lastProcessedMessageRef = useRef<number>(-1);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(INTERVIEW_DURATION);
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  // WebSocket configuration
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsHost = import.meta.env.VITE_WS_HOST || window.location.hostname;
  const wsPort = import.meta.env.VITE_WS_PORT || '8000';
  const wsUrl = `${wsProtocol}//${wsHost}:${wsPort}`;
  const wsEndpoint = `${wsUrl}/interview/ws/${id}`;
  
  // Log only once on initial render
  const hasLoggedRef = useRef(false);
  if (!hasLoggedRef.current) {
    console.log("Using WebSocket URL:", wsEndpoint);
    console.log("Token available:", !!localStorage.getItem("access_token"));
    hasLoggedRef.current = true;
  }
  
  // Use the websocket hook with stable URL
  const { isConnected, messages, sendMessage } = useWebSocket(wsEndpoint);
  const corsTestRunRef = useRef(false);
  const startInterviewRunRef = useRef(false);
  
  // Add these new states for automatic conversation
  const [isAutomaticMode, setIsAutomaticMode] = useState(false); // Change to false to disable automatic mode
  const [silenceTimer, setSilenceTimer] = useState<number | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [isListening, setIsListening] = useState(false);
  const silenceThreshold = 15; // Threshold for silence detection
  const silenceTimeout = 2000; // Stop recording after 2 seconds of silence
  const maxRecordingTime = 20000; // Maximum recording time (20 seconds)
  const recordingTimerRef = useRef<number | null>(null);
  
  // Move handleEndInterview inside the component
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

  // Add this effect to initialize audio context and analyser for silence detection
  useEffect(() => {
    // Disabled audio context setup since we're not using silence detection
    // if (stream && isAutomaticMode) {
    //   try {
    //     const context = new AudioContext();
    //     const analyserNode = context.createAnalyser();
    //     analyserNode.fftSize = 256;
    //     analyserNode.smoothingTimeConstant = 0.8;
    //     
    //     const source = context.createMediaStreamSource(stream);
    //     source.connect(analyserNode);
    //     // Don't connect to destination to avoid feedback
    //     
    //     setAudioContext(context);
    //     setAnalyser(analyserNode);
    //     console.log("Audio context and analyser initialized for silence detection");
    //   } catch (err) {
    //     console.error("Error setting up audio context:", err);
    //   }
    // }
    
    return () => {
      if (audioContext) {
        try {
          audioContext.close();
        } catch (err) {
          console.error("Error closing audio context:", err);
        }
      }
    };
  }, [stream, isAutomaticMode]);

  // Add this function for detecting silence
  function detectSilence() {
    // Disabled silence detection
    // if (!analyser || !isRecording) return;
    // 
    // const dataArray = new Uint8Array(analyser.frequencyBinCount);
    // analyser.getByteFrequencyData(dataArray);
    // 
    // // Calculate average volume level
    // const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    // 
    // if (average < silenceThreshold) {
    //   // If silent and no timer is set, start the silence timer
    //   if (!silenceTimer) {
    //     console.log("Silence detected, starting silence timer");
    //     const timer = setTimeout(() => {
    //       console.log("Silence timer completed, stopping recording");
    //       stopRecording();
    //       setSilenceTimer(null);
    //     }, silenceTimeout);
    //     setSilenceTimer(timer);
    //   }
    // } else {
    //   // If there's sound and a timer is set, clear it
    //   if (silenceTimer) {
    //     console.log("Sound detected, clearing silence timer");
    //     clearTimeout(silenceTimer);
    //     setSilenceTimer(null);
    //   }
    // }
  }

  // Add this effect to run silence detection
  useEffect(() => {
    let animationFrame: number | undefined;
    
    // Disabled silence detection completely
    // if (isRecording && isAutomaticMode && analyser) {
    //   const checkSilence = () => {
    //     detectSilence();
    //     animationFrame = requestAnimationFrame(checkSilence);
    //   };
    //   animationFrame = requestAnimationFrame(checkSilence);
    // }
    
    return () => {
      if (animationFrame !== undefined) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isRecording, isAutomaticMode, analyser]);

  // Modify the audio handling section in the messages effect
  useEffect(() => {
    // Only process new messages
    if (messages.length > 0 && lastProcessedMessageRef.current < messages.length - 1) {
      const messageIndex = messages.length - 1;
      const latestMessage = messages[messageIndex];
      console.log("Processing new message:", latestMessage);
      
      lastProcessedMessageRef.current = messageIndex;

      if (latestMessage.type === "question" && typeof latestMessage.question === "string") {
        setServerQuestion(latestMessage.question);
      } else if (latestMessage.type === "audio") {
        // Ensure we're not already playing audio
        if (isPlayingAudio) {
          console.log("Already playing audio, skipping");
          return;
        }
        
        // Set playing state immediately to prevent parallel attempts
        setIsPlayingAudio(true);
        
        // Clean up any previous audio playback
        if (audioElementRef.current) {
          // Use try-catch to handle potential errors during cleanup
          try {
            audioElementRef.current.pause();
            audioElementRef.current.src = '';
          } catch (err) {
            console.error("Error cleaning up previous audio:", err);
          }
          audioElementRef.current = null;
        }
        
        // Add a safety timeout to reset isPlayingAudio in case something fails
        const safetyTimeout = setTimeout(() => {
          if (isPlayingAudio) {
            console.log("Safety timeout: Resetting isPlayingAudio state");
            setIsPlayingAudio(false);
          }
        }, 10000); // 10 seconds max for audio playback
        
        // Small delay to ensure cleanup is complete
        setTimeout(() => {
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
              
              // Create new audio element
              const audio = new Audio();
              
              // Set up all event handlers before setting the source
              audio.onended = () => {
                console.log("Audio playback finished");
                clearTimeout(safetyTimeout);
                if (audioElementRef.current === audio) {
                  audioElementRef.current = null;
                }
                URL.revokeObjectURL(url);
                setIsPlayingAudio(false);
              };
              
              audio.onerror = (e) => {
                console.error("Audio playback error:", e);
                clearTimeout(safetyTimeout);
                if (audioElementRef.current === audio) {
                  audioElementRef.current = null;
                }
                URL.revokeObjectURL(url);
                setIsPlayingAudio(false);
              };
              
              // Store reference to new audio element
              audioElementRef.current = audio;
              
              // Set source
              audio.src = url;
              
              // Use a small delay before playing to ensure browser is ready
              setTimeout(() => {
                if (audioElementRef.current === audio) {
                  audio.play().catch((err) => {
                    console.error("Failed to play audio:", err);
                    clearTimeout(safetyTimeout);
                    if (audioElementRef.current === audio) {
                      audioElementRef.current = null;
                    }
                    URL.revokeObjectURL(url);
                    setIsPlayingAudio(false);
                  });
                } else {
                  // Another audio element was created in the meantime
                  clearTimeout(safetyTimeout);
                  URL.revokeObjectURL(url);
                  setIsPlayingAudio(false);
                }
              }, 100);
            } else {
              console.error("No valid audio data found in message", latestMessage);
              clearTimeout(safetyTimeout);
              setIsPlayingAudio(false);
            }
          } catch (err) {
            console.error("Error processing audio data:", err);
            clearTimeout(safetyTimeout);
            setIsPlayingAudio(false);
          }
        }, 50); // Small delay for cleanup
        
        // Return a cleanup function that will run when the component unmounts
        return () => {
          clearTimeout(safetyTimeout);
          if (audioElementRef.current) {
            try {
              audioElementRef.current.pause();
              audioElementRef.current.src = '';
            } catch (err) {
              console.error("Error in cleanup:", err);
            }
            audioElementRef.current = null;
          }
          setIsPlayingAudio(false);
        };
      }
    }
    
    // Cleanup function
    return () => {
      if (audioElementRef.current) {
        try {
          audioElementRef.current.pause();
          audioElementRef.current.src = '';
        } catch (err) {
          console.error("Error in cleanup:", err);
        }
        audioElementRef.current = null;
      }
    };
  }, [messages, isPlayingAudio]);

  // Add a manual reset button for emergency cases
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Allow ESC key to reset audio state
      if (e.key === 'Escape') {
        if (isPlayingAudio) {
          console.log("Emergency reset of audio state");
          if (audioElementRef.current) {
            try {
              audioElementRef.current.pause();
              audioElementRef.current.src = '';
            } catch (err) {
              console.error("Error stopping audio:", err);
            }
            audioElementRef.current = null;
          }
          setIsPlayingAudio(false);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlayingAudio]);

  // Add this cleanup effect for automatic mode timers
  useEffect(() => {
    return () => {
      // Clean up timers on component unmount
      if (silenceTimer) {
        clearTimeout(silenceTimer);
      }
      if (recordingTimerRef.current) {
        clearTimeout(recordingTimerRef.current);
      }
    };
  }, [silenceTimer]);

  // Improve the stopRecording function to ensure proper cleanup
  const stopRecording = useCallback(() => {
    if (!mediaRecorder) {
      console.warn("No active media recorder");
      return;
    }

    try {
      console.log("Stopping recording...");
      // Use try-catch for each step to ensure robustness
      try {
        mediaRecorder.stop();
        console.log("MediaRecorder stopped successfully");
      } catch (err) {
        console.error("Error stopping mediaRecorder:", err);
      }
      
      // Reset state immediately to prevent race conditions
      setIsRecording(false);
      setMediaRecorder(null);
    } catch (err) {
      console.error("Error in stopRecording:", err);
      // Ensure states are reset even if there's an error
      setIsRecording(false);
      setMediaRecorder(null);
    }
  }, [mediaRecorder]);

  // Update the handleHoldToRecord function to ensure it works consistently
  const handleHoldToRecord = useCallback((isHolding: boolean) => {
    console.log("Hold to record:", isHolding);
    
    // Don't allow recording if audio is playing
    if (isPlayingAudio) {
      console.log("Cannot record while audio is playing");
      return;
    }
    
    if (isHolding) {
      // Start recording when button is pressed
      if (!isRecording && stream) {
        startRecording();
      }
    } else {
      // Stop recording when button is released
      if (isRecording && mediaRecorder) {
        stopRecording();
      }
    }
  }, [isRecording, stream, mediaRecorder, stopRecording, isPlayingAudio]);

  // Modify the toggleRecording function to update UI indicators
  function toggleRecording() {
    console.log("Toggle recording called, current state:", isRecording);
    if (!isRecording) {
      // Start recording - will set isRecording to true inside startRecording
      startRecording();
    } else {
      // Stop recording - will set isRecording to false inside the recorder's onstop handler
      stopRecording();
    }
  }

  // Update the startRecording function
  function startRecording() {
    if (!stream) {
      console.error("No media stream available");
      return;
    }

    if (isPlayingAudio) {
      console.warn("Cannot start recording while audio is playing");
      return;
    }
    
    if (isRecording) {
      console.warn("Already recording, stopping previous recording first");
      stopRecording();
    }

    // Clear any existing max recording timeout
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    // First make sure any existing recorder is stopped and cleaned up
    if (mediaRecorder) {
      console.log("Stopping existing recorder before starting a new one");
      try {
        mediaRecorder.stop();
      } catch (err) {
        console.error("Error stopping existing recorder:", err);
      }
      setMediaRecorder(null);
    }

    // Reset audio chunks array for new recording
    audioChunksRef.current = [];

    // Check if audio track exists
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      console.error("No audio track found in the stream");
      alert("No microphone detected. Please ensure your microphone is connected and working properly.");
      return;
    }
    
    const audioTrack = audioTracks[0];
    console.log("Audio track status:", {
      label: audioTrack.label,
      enabled: audioTrack.enabled,
      muted: audioTrack.muted,
      readyState: audioTrack.readyState
    });
    
    // Ensure track is enabled
    audioTrack.enabled = true;

    try {
      // Create the recorder with default settings
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log(`Audio chunk received: ${event.data.size} bytes, type: ${event.data.type}`);
        } else {
          console.warn("Received empty audio chunk");
        }
      };
      
      recorder.onstop = () => {
        console.log("MediaRecorder onstop event fired");
        
        // Ensure recording state is set to false
        setIsRecording(false);
        
        if (audioChunksRef.current.length === 0) {
          console.error("No audio data captured");
          return;
        }
        
        const audioBlob = new Blob(audioChunksRef.current);
        
        console.log(`Recording complete, blob size: ${audioBlob.size} bytes, type: ${audioBlob.type}`);
        
        // Log audio chunks for debugging
        console.log("Audio chunks details:", audioChunksRef.current.map(chunk => {
          if (chunk instanceof Blob) {
            return { size: chunk.size, type: chunk.type };
          } else {
            return { type: typeof chunk };
          }
        }));
        
        // Send audio to backend for processing
        sendAudioToBackend(audioBlob);
        
        // Clear chunks after sending
        audioChunksRef.current = [];
      };
      
      recorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setIsRecording(false);
        setMediaRecorder(null);
      };
      
      // Start recording immediately
      recorder.start(1000);
      setMediaRecorder(recorder);
      setIsRecording(true);
      console.log("Recording started with MediaRecorder state:", recorder.state);
      
      // Disabled automatic maximum recording time limit
      // if (isAutomaticMode) {
      //   // Set maximum recording time safety limit
      //   recordingTimerRef.current = setTimeout(() => {
      //     console.log("Maximum recording time reached, stopping recording");
      //     if (isRecording && mediaRecorder) {
      //       stopRecording();
      //     }
      //   }, maxRecordingTime);
      // }
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Failed to start recording: " + (err instanceof Error ? err.message : String(err)));
      // Reset states if recording fails to start
      setIsRecording(false);
      setMediaRecorder(null);
    }
  }

  // Initialize interview
  useEffect(() => {
    const startInterview = async () => {
      if (startInterviewRunRef.current) return;
      startInterviewRunRef.current = true;
      try {
        console.log("Starting interview...");
        try {
          const response = await api.applications.createInterview(id!);

          if (response.status === "success") {
            console.log("Interview created successfully");
            setInterviewStarted(true);
          } else if (response.detail === "Interview already in progress") {
            // If interview is already in progress, still set it as started
            console.log("Interview already in progress, continuing...");
            setInterviewStarted(true);
          } else {
            console.error("Failed to start interview:", response);
            navigate("/dashboard");
          }
        } catch (error: any) {
          // Check for the "Interview already in progress" error case
          if (error?.response?.data?.detail === "Interview already in progress") {
            console.log("Interview already in progress, continuing...");
            setInterviewStarted(true);
          } else {
            console.error("Error starting interview:", error);
            // Only navigate away if the WebSocket isn't connected within 10 seconds
            const connectTimeout = setTimeout(() => {
              if (!isConnected) {
                alert("Failed to connect to the interview server. Please try again later.");
                navigate("/dashboard");
              }
            }, 10000);
            
            return () => clearTimeout(connectTimeout);
          }
        }
      } catch (error) {
        console.error("Unexpected error in startInterview:", error);
        alert("An unexpected error occurred. Please try again later.");
        navigate("/dashboard");
      }
    };

    if (id && !interviewStarted) {
      startInterview();
    }
  }, [id, interviewStarted, navigate, isConnected]);

  // Reset refs when component unmounts
  useEffect(() => {
    return () => {
      corsTestRunRef.current = false;
      startInterviewRunRef.current = false;
    };
  }, []);

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

  // Update the sendAudioToBackend function
  function sendAudioToBackend(audioBlob: Blob) {
    if (!isConnected) {
      console.warn("WebSocket not connected, can't send audio");
      return;
    }

    console.log("Sending audio to backend...");
    
    // Log blob details
    console.log("Audio blob details:", {
      size: audioBlob.size,
      type: audioBlob.type
    });
    
    const reader = new FileReader();

    reader.onloadend = () => {
      try {
        if (!reader.result) {
          throw new Error("FileReader result is null");
        }
        
        // Get base64 data from result
        let base64Audio = "";
        
        if (typeof reader.result === 'string') {
          // Extract base64 from data URL
          const base64Start = reader.result.indexOf('base64,');
          if (base64Start >= 0) {
            base64Audio = reader.result.substring(base64Start + 7);
          }
        }
        
        if (!base64Audio) {
          throw new Error("Failed to convert audio to base64");
        }
        
        // Log base64 info
        console.log(`Audio data size: ${base64Audio.length} bytes, first 20 chars: ${base64Audio.substring(0, 20)}...`);
        
        // Send message to backend
        const success = sendMessage({
          type: "response",
          response: base64Audio
        });
        
        console.log("Audio send attempt result:", success ? "success" : "failed");
        
        // Show status notification
        const notificationEl = document.createElement('div');
        notificationEl.style.position = 'fixed';
        notificationEl.style.bottom = '20px';
        notificationEl.style.right = '20px';
        notificationEl.style.padding = '10px 20px';
        notificationEl.style.borderRadius = '4px';
        notificationEl.style.color = 'white';
        notificationEl.style.zIndex = '9999';
        
        if (success) {
          notificationEl.style.backgroundColor = 'green';
          notificationEl.textContent = `Audio sent (${base64Audio.length} bytes)`;
        } else {
          notificationEl.style.backgroundColor = 'red';
          notificationEl.textContent = 'Failed to send audio';
        }
        
        document.body.appendChild(notificationEl);
        setTimeout(() => {
          if (document.body.contains(notificationEl)) {
            document.body.removeChild(notificationEl);
          }
        }, 3000);
        
      } catch (err) {
        console.error("Error encoding audio:", err);
        alert("Error sending audio: " + (err instanceof Error ? err.message : String(err)));
      } finally {
        // Always ensure we're ready for next recording
        audioChunksRef.current = [];
      }
    };

    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      alert("Error reading audio data");
      // Ensure we're ready for next recording
      audioChunksRef.current = [];
    };

    // Read as data URL
    reader.readAsDataURL(audioBlob);
  }

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
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Status bar with timer and connection status */}
      <div className="flex items-center justify-between bg-gray-900 p-2 px-4 border-b border-gray-800">
        {/* Connection status indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-gray-300">
            {isConnected ? "Connected" : "Connecting..."}
          </span>
        </div>
        
        {/* Timer display with improved styling */}
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1
            ${timeRemaining < 120 
              ? "bg-red-600 animate-pulse" 
              : timeRemaining < 300 
                ? "bg-yellow-600" 
                : "bg-blue-600"
            } text-white text-sm font-medium`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Main interview area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Virtual Interviewer - Takes most of the screen */}
        <div className="flex-1 p-4 overflow-auto">
          <VirtualInterviewer
            isAnswering={isRecording}
            question={serverQuestion}
          />
        </div>
        
        {/* Side panel with camera and tips */}
        <div className="w-full md:w-80 p-4 bg-gray-900 border-t md:border-t-0 md:border-l border-gray-800 flex flex-col overflow-auto">
          {/* Self View */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Camera Preview</h3>
            <VideoPanel
              stream={stream}
              isMuted={true}
              isVideoOn={true}
            />
          </div>
          
          {/* Interview Tips */}
          <div className="flex-1">
            <ProctoringWarnings />
          </div>
        </div>
      </div>
      
      {/* Time warning */}
      {showTimeWarning && (
        <div className="fixed top-16 right-4 z-50 animate-pulse rounded-lg bg-red-600 p-3 text-white shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">2 minutes remaining!</span>
          </div>
        </div>
      )}

      {/* Controls at the bottom */}
      <div className="w-full">
        <InterviewControls
          isMuted={isMuted}
          onEndInterview={() => handleEndInterview()}
          isRecording={isRecording}
          onHoldToRecord={handleHoldToRecord}
          isAudioPlaying={isPlayingAudio}
        />
      </div>
    </div>
  );
}
