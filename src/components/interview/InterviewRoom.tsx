import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { VideoPanel } from "./VideoPanel";
import { InterviewControls } from "./InterviewControls";
import { VirtualInterviewer } from "./VirtualInterviewer";
import { ProctoringWarnings } from "./ProctoringWarnings";
import { useVideoStream } from "../../hooks/useVideoStream";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, AlertTriangle, AlertOctagon } from "lucide-react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useTabProctoring } from "../../hooks/useTabProctoring";
import api from "../../lib/api";
import { TabProctoring } from "./TabProctoring";
import { FaceViolation } from "../../hooks/useFaceDetection";
import { endInterview } from "../../services/api/candidate_endpoints";
// import { InterviewDebug } from "./InterviewDebug";

// 15 minutes interview duration
const INTERVIEW_DURATION = 10 * 60; // seconds

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
  
  // Add new state for proctoring violations
  const [proctoringViolations, setProctoringViolations] = useState<FaceViolation[]>([]);
  const maxFaceViolations = 5000; // Maximum allowed face violations (changed from 10 to 5)

  // Tab proctoring state
  const { tabSwitchCount, showTabWarning } = useTabProctoring({
    maxViolations: 3,
    onMaxViolationsReached: () => {
      // End interview on 3rd violation
      console.log("Maximum tab switches reached, ending interview");
      handleEndInterview(true, "Tab switching violation");
    },
    onViolation: () => {
      // Report tab switch violation to backend
      if (isConnected) {
        sendMessage({
          type: "violation",
          violation: "tab_switched",
          message: "User switched to another tab/window"
        });
      }
    }
  });
  
    // Extract values already handled by destructuring above

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
  const recordingTimerRef = useRef<number | null>(null);
  
  // Add a function to report violations to the backend
  const reportViolation = useCallback((type: string, message: string) => {
    if (isConnected) {
      sendMessage({
        type: "violation",
        violation: type,
        message: message
      });
      console.log(`Violation reported to backend: ${type} - ${message}`);
    }
  }, [isConnected, sendMessage]);
  
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
  
  // Handler for face proctoring violations
  const handleProctoringViolation = useCallback((violation: FaceViolation) => {
    console.log("Proctoring violation detected:", violation);
    
    // Report face violation to backend
    if (isConnected) {
      sendMessage({
        type: "violation",
        violation: "face_violation",
        message: violation.message
      });
      console.log("Face violation reported to backend");
    }
    
    // Add to violations list (keeping only the last 20 violations)
    setProctoringViolations(prev => {
      const updated = [...prev, violation];
      
      // Simplified logic: just check if total violations exceed the maximum
      if (updated.length >= maxFaceViolations) {
        console.log(`Maximum face violations reached (${maxFaceViolations}), ending interview`);
        // Use setTimeout to avoid state update during render
        setTimeout(() => {
          handleEndInterview(true, `Face proctoring violation: ${violation.message}`);
        }, 0);
      }
      
      return updated.slice(-20); // Keep only the last 20 violations
    });
  }, [maxFaceViolations, isConnected, sendMessage]);
  
  // Expand handleEndInterview to include a reason parameter
  const handleEndInterview = useCallback((isAutoSubmit = false, reason = "") => {
    const confirmMessage = isAutoSubmit && reason 
      ? `Interview ended: ${reason}`
      : "Are you sure you want to end the interview?";
      
    if (isAutoSubmit || confirm(confirmMessage)) {
      // Stop recording if active
      if (isRecording && mediaRecorder) {
        stopRecording();
      }

      // Stop all media tracks
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      endInterview(id!);

      // Navigate to completion page
      navigate("/interview-complete", {
        state: {
          autoSubmitted: isAutoSubmit,
          applicationId: id,
          reason: reason,
        },
      });
    }
  }, [id, isRecording, mediaRecorder, navigate, stream, stopRecording]);

  // Add this effect to initialize audio context and analyser for silence detection
  useEffect(() => {
    
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


  // Add this effect to run silence detection
  useEffect(() => {
    let animationFrame: number | undefined;
    
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
    <div className="flex flex-col h-screen overflow-hidden bg-gray-900 text-white">
      {/* Header - reduced padding */}
      <header className="px-4 py-3 border-b border-gray-800">
        <div className="container mx-auto flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">Recruiter.ai Interview</h1>
          
          {/* Timer display */}
          <div className="flex items-center gap-3">
            <div 
              className={`flex items-center gap-2 ${showTimeWarning ? 'text-red-400' : 'text-blue-400'}`}
            >
              <Clock className="h-5 w-5" />
              <span className="text-lg">
                {formatTime(timeRemaining)}
              </span>
            </div>
            
            {showTabWarning && (
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle className="h-5 w-5" />
                <span>Tab switching detected</span>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content area - with reduced padding */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="container mx-auto flex-1 py-3 px-4 flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1">
            {/* Video interview section */}
            <div className="col-span-2 flex flex-col">
              {/* Video feeds in grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 flex-auto">
                <div className="flex flex-col">
                  <h2 className="text-lg font-medium mb-1">You</h2>
                  <div className="flex-1 min-h-0"> {/* Force contained height */}
                    <VideoPanel 
                      stream={stream} 
                      isMuted={isMuted} 
                      isVideoOn={isVideoOn}
                      onViolation={handleProctoringViolation}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <h2 className="text-lg font-medium mb-1">Interviewer</h2>
                  <div className="flex-1 min-h-0"> {/* Force contained height */}
                    <VirtualInterviewer 
                      isAnswering={isRecording}
                      serverQuestion={serverQuestion}
                    />
                  </div>
                </div>
              </div>
              
              {/* Interview Controls - Now with fixed height */}
              <div className="bg-gray-800 p-3 rounded-lg">
                <h2 className="text-lg font-medium mb-2">Interview Controls</h2>
                <InterviewControls 
                  isMuted={isMuted}
                  isVideoOn={isVideoOn}
                  isRecording={isRecording}
                  onToggleAudio={() => setIsMuted(!isMuted)}
                  onToggleVideo={() => setIsVideoOn(!isVideoOn)}
                  onToggleRecording={toggleRecording}
                  onHoldToRecord={handleHoldToRecord}
                  onEndInterview={() => handleEndInterview()}
                  isAudioPlaying={isPlayingAudio}
                />
              </div>
            </div>
            
            {/* Interview guidance section */}
            <div className="overflow-auto">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-medium mb-1">Interview Tips</h2>
                  <ProctoringWarnings violations={proctoringViolations} />
                </div>
                
                <div>
                  <h2 className="text-lg font-medium mb-1">Tab Activity Monitoring</h2>
                  <TabProctoring 
                    maxViolations={3}
                    onMaxViolationsReached={() => handleEndInterview(true, "Tab switching violation")}
                  />
                </div>
                
                {/* Debugger section - hidden by default */}
                {showDebugger && (
                  <div>
                    <h2 className="text-lg font-medium mb-1">Debug Info</h2>
                    {/* <InterviewDebug
                      isConnected={isConnected}
                      messages={messages}
                      isRecording={isRecording}
                      isPlayingAudio={isPlayingAudio}
                    /> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
