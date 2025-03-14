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

  onTrack(callback: (event: RTCTrackEvent) => void) {
    this.peerConnection.ontrack = callback;
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
  }, []);

  return connectionRef.current;
}