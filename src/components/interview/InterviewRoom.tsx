import React, { useRef, useEffect, useState } from "react";
import { VideoPanel } from "./VideoPanel";
import { InterviewControls } from "./InterviewControls";
import { VirtualInterviewer } from "./VirtualInterviewer";
import { ProctoringWarnings } from "./ProctoringWarnings";
import { useVideoStream } from "../../hooks/useVideoStream";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, AlertTriangle } from "lucide-react";
import { useWebSocket } from "../../hooks/useWebSocket";
import api from "../../lib/api";

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

      if (latestMessage.type === "question" && latestMessage.question) {
        setServerQuestion(latestMessage.question);
      } else if (latestMessage.type === "audio" && latestMessage.audio_data) {
        try {
          const binary = atob(latestMessage.audio_data.audio_base64);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], {
            type: latestMessage.audio_data.content_type || "audio/ogg",
          });
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);

          audio.onended = () => URL.revokeObjectURL(url);
          audio.onerror = (e) => console.error("Audio playback error:", e);

          audio.play().catch((err) => {
            console.error("Failed to play audio:", err);
          });
        } catch (err) {
          console.error("Error processing audio data:", err);
        }
      }
    }
  }, [messages]);

  // Timer effect
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          handleTimeEnd();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

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

  // Auto-submit when time ends
  const handleTimeEnd = () => {
    console.log("Interview time ended, auto-submitting...");
    handleEndInterview(true);
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
        const base64Audio = btoa(reader.result as string);
        sendMessage({
          type: "response",
          response: base64Audio,
        });
        console.log("Audio sent successfully");
      } catch (err) {
        console.error("Error sending audio:", err);
      }
    };

    reader.onerror = (e) => {
      console.error("Error reading audio file:", e);
    };

    reader.readAsBinaryString(audioBlob);
  }

  function startRecording() {
    if (!stream || !window.MediaRecorder) {
      console.error(
        "Cannot start recording: stream or MediaRecorder unavailable"
      );
      return;
    }

    try {
      console.log("Starting audio recording...");
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        console.log("Recording stopped, processing audio...");
        if (audioChunksRef.current.length === 0) {
          console.warn("No audio data captured");
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        audioChunksRef.current = [];
        sendAudioToBackend(audioBlob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  }

  function stopRecording() {
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
    <div className="flex h-screen flex-col bg-gray-900">
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

      <div className="flex flex-1 p-6">
        {/* Main Content */}
        <div className="relative flex-1">
          {/* Virtual Interviewer (Main Focus) */}
          <VirtualInterviewer
            isAnswering={!isMuted}
            question={serverQuestion}
          />
          {/* Self View (Small Overlay) */}
          <div className="absolute bottom-4 right-4 w-72">
            <VideoPanel
              stream={stream}
              isMuted={isMuted}
              isVideoOn={isVideoOn}
              onToggleAudio={() => setIsMuted(!isMuted)}
              onToggleVideo={() => setIsVideoOn(!isVideoOn)}
            />
          </div>
          {/* Proctoring Warnings */}
          <div className="absolute bottom-4 left-4 right-80">
            <ProctoringWarnings />
          </div>
        </div>
      </div>
      <InterviewControls
        isMuted={isMuted}
        onToggleAudio={() => setIsMuted(!isMuted)}
        onEndInterview={() => handleEndInterview()}
        isRecording={isRecording}
        onToggleRecording={toggleRecording}
      />
    </div>
  );
}
