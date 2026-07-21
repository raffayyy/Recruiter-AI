import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { VideoPanel } from "./VideoPanel";
import { InterviewControls } from "./InterviewControls";
import { VirtualInterviewer } from "./VirtualInterviewer";
import { ProctoringWarnings } from "./ProctoringWarnings";
import { useVideoStream } from "../../hooks/useVideoStream";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, AlertTriangle, MessageSquare, Mic, Volume2, Wifi, WifiOff } from "lucide-react";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useTabProctoring } from "../../hooks/useTabProctoring";
import api from "../../lib/api";
import { TabProctoring } from "./TabProctoring";
import { FaceViolation } from "../../hooks/useFaceDetection";
import { endInterview } from "../../services/api/candidate_endpoints";
import { WS_URL } from "../../config";
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
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const interviewEndedRef = useRef(false);
  const [startError, setStartError] = useState<string | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  
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

  // WebSocket configuration — derived from the API URL (see src/config.ts) so it
  // matches the backend host/protocol both locally and in production.
  const wsEndpoint = `${WS_URL}/interview/ws/${id}`;
  
  // Log only once on initial render
  const hasLoggedRef = useRef(false);
  if (!hasLoggedRef.current) {
    console.log("Using WebSocket URL:", wsEndpoint);
    console.log("Token available:", !!localStorage.getItem("access_token"));
    hasLoggedRef.current = true;
  }
  
  // Only open the WebSocket AFTER the interview session exists on the backend
  // (i.e. /interview/start has run). Connecting earlier races the session
  // creation: the backend closes with code 4000 ("No active interview session")
  // and the client exhausts its retries before the session is ready — which
  // left the room stuck on "Connecting", especially on a cold Render start.
  const { isConnected, messages, sendMessage } = useWebSocket(
    interviewStarted ? wsEndpoint : ""
  );
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
  
  // Actually end the interview: stop media, notify backend, go to completion.
  // Guarded so it only runs once (timer, {type:"end"}, and manual can all fire).
  const doEndInterview = useCallback((isAutoSubmit = false, reason = "") => {
    if (interviewEndedRef.current) return;
    interviewEndedRef.current = true;

    if (isRecording && mediaRecorder) {
      stopRecording();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    endInterview(id!);

    navigate("/interview-complete", {
      state: { autoSubmitted: isAutoSubmit, applicationId: id, reason },
    });
  }, [id, isRecording, mediaRecorder, navigate, stream, stopRecording]);

  // Manual end (button) confirms via dialog; automatic ends go straight through.
  const handleEndInterview = useCallback((isAutoSubmit = false, reason = "") => {
    if (isAutoSubmit) {
      doEndInterview(true, reason);
    } else {
      setShowEndConfirm(true);
    }
  }, [doEndInterview]);

  // Live transcript built from interviewer questions + candidate transcripts.
  const transcript = useMemo(() => {
    const entries: { role: "interviewer" | "candidate"; text: string }[] = [];
    for (const m of messages as any[]) {
      if (m?.type === "question" && typeof m.question === "string") {
        entries.push({ role: "interviewer", text: m.question });
      } else if (m?.type === "transcript" && typeof m.text === "string" && m.text.trim()) {
        entries.push({ role: m.role === "interviewer" ? "interviewer" : "candidate", text: m.text });
      }
    }
    return entries;
  }, [messages]);

  // Auto-scroll the transcript to the newest message.
  useEffect(() => {
    const el = transcriptContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [transcript]);

  // Backend signals the interview is over (time up / complete) -> end gracefully.
  useEffect(() => {
    if ((messages as any[]).some((m) => m?.type === "end")) {
      doEndInterview(true, "Interview complete");
    }
  }, [messages, doEndInterview]);

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
        }, 45000); // fallback only; audio.onended normally resets this sooner
        
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
      }
    }
    // IMPORTANT: this effect returns NO cleanup that pauses audio. It re-runs on
    // every new WS message (questions, transcripts, and the backend's echoed
    // "violation_recorded" acks from proctoring). A pausing cleanup here would
    // stop the currently-playing question the moment any such message arrived —
    // which is exactly why audio died on proctoring violations. Old audio is
    // stopped when a NEW audio message starts (see the cleanup block above), and
    // on unmount by the dedicated effect below.
  }, [messages]);

  // Stop any audio only when the interview room unmounts.
  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        try {
          audioElementRef.current.pause();
          audioElementRef.current.src = "";
        } catch (err) {
          console.error("Error stopping audio on unmount:", err);
        }
        audioElementRef.current = null;
      }
    };
  }, []);

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
          // ApiClient rejects with the response body, so the message is on
          // error.detail (fallback to axios-style error.response.data.detail).
          const detail = error?.detail || error?.response?.data?.detail;
          if (detail === "Interview already in progress") {
            console.log("Interview already in progress, continuing...");
            setInterviewStarted(true);
          } else {
            console.error("Error starting interview:", error);
            // Surface the reason immediately (e.g. AI rate-limited) instead of
            // hanging on the "Connecting" spinner.
            setStartError(
              detail || "Could not start the interview. Please try again in a few minutes."
            );
            return;
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

  // Timer effect — ends the interview automatically at zero (no blocking prompt).
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          console.log("Interview time ended, auto-submitting...");
          setTimeout(() => doEndInterview(true, "Time is up"), 0);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [doEndInterview]);

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
      } catch (err) {
        console.error("Error encoding audio:", err);
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

  // Derived UI state for the header status pill and timer colour.
  const StatusIcon = !isConnected ? WifiOff : isPlayingAudio ? Volume2 : isRecording ? Mic : Wifi;
  const statusLabel = !isConnected
    ? "Connecting…"
    : isPlayingAudio
    ? "Interviewer speaking"
    : isRecording
    ? "Recording…"
    : "Your turn";
  const statusTone = !isConnected
    ? "text-yellow-300"
    : isPlayingAudio
    ? "text-blue-300"
    : isRecording
    ? "text-red-300"
    : "text-green-300";
  const timerColor =
    timeRemaining <= 30 ? "text-red-400" : timeRemaining <= 120 ? "text-amber-400" : "text-blue-400";

  if (error || startError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 p-4 text-white">
        <div className="max-w-md rounded-lg bg-red-900/50 p-6 text-center">
          <p className="text-lg">
            {error ? "Failed to access camera and microphone" : "Couldn't start the interview"}
          </p>
          <p className="mt-2 text-sm text-red-300">{error || startError}</p>
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
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      {/* Header (sticky so the timer/status stay visible while scrolling) */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900 px-4 py-3">
        <div className="container mx-auto flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Recruiter.ai Interview</h1>
            <span className={`flex items-center gap-1.5 rounded-full bg-gray-800 px-3 py-1 text-sm font-medium ${statusTone}`}>
              <StatusIcon className="h-4 w-4" />
              {statusLabel}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {showTabWarning && (
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm">Tab switching detected</span>
              </div>
            )}
            <div className={`flex items-center gap-2 font-mono ${timerColor}`}>
              <Clock className="h-6 w-6" />
              <span className="text-3xl font-bold tabular-nums">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Wind-down banner in the final stretch */}
      {timeRemaining <= 120 && timeRemaining > 0 && (
        <div className="border-b border-amber-500/30 bg-amber-500/15 px-4 py-2 text-center text-sm text-amber-300">
          <AlertTriangle className="mr-1 inline h-4 w-4" />
          Less than {Math.ceil(timeRemaining / 60)} minute
          {Math.ceil(timeRemaining / 60) > 1 ? "s" : ""} left — the interviewer is wrapping up.
        </div>
      )}
      
      {/* Main content area (page scrolls normally so controls are always reachable) */}
      <div className="flex-1">
        <div className="container mx-auto py-3 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Video interview section */}
            <div className="lg:col-span-2 flex flex-col">
              {/* Video feeds in grid — bounded heights so controls stay on screen */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="flex flex-col">
                  <h2 className="text-lg font-medium mb-1">You</h2>
                  <div className="h-48 sm:h-56 md:h-64">
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
                  <div className="h-48 sm:h-56 md:h-64">
                    <VirtualInterviewer
                      isAnswering={isRecording}
                      serverQuestion={serverQuestion}
                    />
                  </div>
                </div>
              </div>

              {/* Interview Controls */}
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
                  <h2 className="mb-1 flex items-center gap-2 text-lg font-medium">
                    <MessageSquare className="h-5 w-5" /> Conversation
                  </h2>
                  <div
                    ref={transcriptContainerRef}
                    className="max-h-[42vh] space-y-2 overflow-y-auto rounded-lg bg-gray-800 p-3"
                  >
                    {transcript.length === 0 ? (
                      <p className="text-sm text-gray-400">The interview will begin shortly…</p>
                    ) : (
                      transcript.map((t, i) => (
                        <div
                          key={i}
                          className={`rounded-lg p-2 text-sm ${
                            t.role === "interviewer" ? "bg-blue-900/30" : "bg-gray-700/50"
                          }`}
                        >
                          <p className="mb-0.5 text-xs font-medium text-gray-400">
                            {t.role === "interviewer" ? "Interviewer" : "You"}
                          </p>
                          <p className="text-gray-100">{t.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

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

      <ConfirmDialog
        isOpen={showEndConfirm}
        onClose={() => setShowEndConfirm(false)}
        onConfirm={() => doEndInterview(false, "Ended by candidate")}
        title="End interview?"
        message="Are you sure you want to end the interview? It will be submitted for evaluation and can't be resumed."
        confirmText="End Interview"
        cancelText="Keep Going"
        variant="danger"
      />
    </div>
  );
}
