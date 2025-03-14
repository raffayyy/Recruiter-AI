import React, { useRef, useEffect, useState } from "react";
import { VideoPanel } from "./VideoPanel";
import { InterviewControls } from "./InterviewControls";
import { VirtualInterviewer } from "./VirtualInterviewer";
import { ProctoringWarnings } from "./ProctoringWarnings";
import { useVideoStream } from "../../hooks/useVideoStream";
import { useNavigate, useParams } from "react-router-dom";
import { useApplications } from "../../hooks/useApplications";
import api from "../../lib/api";

export function InterviewRoom() {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(true); // Start muted by default
  const [isVideoOn, setIsVideoOn] = useState(true);
  const { stream, error } = useVideoStream();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isRecording, setIsRecording] = useState(false);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const [serverQuestion, setServerQuestion] = useState("");
  const { id } = useParams();
  let runOnce = useRef(0);
  const startInterview = async (id: string) => {
    try {
      const response = await api.applications.createInterview(id);
      return response.status;
    } catch (error) {
      console.error("Error starting interview:", error);
    }
  };
  useEffect(() => {
    if (runOnce.current < 1) {
      const initInterview = async () => {
        const response = await startInterview(id!);
        if (response !== "success") {
          console.error("Failed to start interview");
          navigate("/dashboard");
          return;
        }

        const newSocket = new WebSocket(
          `wss://96f9-2400-adc5-123-a700-8056-37a-e256-83e9.ngrok-free.app/interview/ws/${id}`
        );
        newSocket.onopen = () => console.log("Connected to WS server.");
        setSocket(newSocket);
      };
      runOnce.current += 1;

      initInterview();

      return () => {
        if (socket) {
          socket.close();
        }
      };
    }
  }, []); // Empty dependency array ensures the effect runs only once

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "question" && data.question) {
        setServerQuestion(data.question);
      } else if (data.type === "audio" && data.audio_data) {
        const binary = atob(data.audio_data.audio_base64);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([array], { type: data.audio_data.content_type });
        const url = URL.createObjectURL(blob);
        new Audio(url).play();
      }
    };
  }, [socket]);

  function sendAudioToBackend(audioBlob: Blob) {
    if (!socket) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = btoa(reader.result as string);
      socket.send(JSON.stringify({ type: "response", response: base64Audio }));
    };
    reader.readAsBinaryString(audioBlob);
  }

  function startRecording() {
    if (!stream || !window.MediaRecorder) return;
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      audioChunksRef.current = [];
      sendAudioToBackend(audioBlob);
    };
    recorder.start();
    setMediaRecorder(recorder);
  }

  function stopRecording() {
    mediaRecorder?.stop();
    setMediaRecorder(null);
  }

  function toggleRecording() {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
    setIsRecording(!isRecording);
  }

  const handleEndInterview = () => {
    if (confirm("Are you sure you want to end the interview?")) {
      stream?.getTracks().forEach((track) => track.stop());
      navigate("/dashboard");
    }
  };

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 p-4 text-white">
        <div className="rounded-lg bg-red-900/50 p-6 text-center">
          <p className="text-lg">Failed to access camera and microphone</p>
          <p className="mt-2 text-sm text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-900">
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
            {" "}
            <ProctoringWarnings />{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <InterviewControls
        isMuted={isMuted}
        onToggleAudio={() => setIsMuted(!isMuted)}
        onEndInterview={handleEndInterview}
        isRecording={isRecording}
        onToggleRecording={toggleRecording}
      />
    </div>
  );
}
