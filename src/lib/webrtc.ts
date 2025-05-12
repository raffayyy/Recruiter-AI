import { useEffect, useRef } from 'react';

export class WebRTCConnection {
  private peerConnection: RTCPeerConnection;
  private dataChannel: RTCDataChannel | null = null;
  
  constructor(configuration: RTCConfiguration) {
    this.peerConnection = new RTCPeerConnection(configuration);
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  async handleAnswer(answer: RTCSessionDescriptionInit) {
    await this.peerConnection.setRemoteDescription(answer);
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    await this.peerConnection.addIceCandidate(candidate);
  }

  // Event listener methods
  onTrack(callback: (event: RTCTrackEvent) => void) {
    this.peerConnection.ontrack = callback;
  }

  onIceConnectionStateChange(callback: () => void) {
    this.peerConnection.oniceconnectionstatechange = callback;
  }

  onIceCandidateError(callback: (event: Event) => void) {
    this.peerConnection.onicecandidateerror = callback;
  }

  // Getter for ICE connection state
  get iceConnectionState(): RTCIceConnectionState {
    return this.peerConnection.iceConnectionState;
  }

  addTrack(track: MediaStreamTrack, stream: MediaStream) {
    this.peerConnection.addTrack(track, stream);
  }

  close() {
    this.peerConnection.getSenders().forEach((sender) => {
      sender.track?.stop();
    });
    this.peerConnection.close();
  }
}

export function useWebRTC(configuration: RTCConfiguration) {
  const connectionRef = useRef<WebRTCConnection | null>(null);

  useEffect(() => {
    connectionRef.current = new WebRTCConnection(configuration);

    return () => {
      if (connectionRef.current) {
        connectionRef.current.close();
      }
    };
  }, [configuration]);

  return connectionRef.current;
}