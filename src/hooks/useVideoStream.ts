import { useState, useEffect, useCallback } from 'react';

export function useVideoStream() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<{
    audio: 'granted' | 'denied' | 'prompt' | 'unknown';
    video: 'granted' | 'denied' | 'prompt' | 'unknown';
  }>({
    audio: 'unknown',
    video: 'unknown'
  });

  // Function to check permissions
  const checkPermissions = useCallback(async () => {
    if (!navigator.permissions || !navigator.permissions.query) {
      console.log('Permissions API not supported by this browser');
      return;
    }

    try {
      // Check microphone permission
      const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setPermissionStatus(prev => ({ ...prev, audio: micPermission.state as any }));
      
      // Listen for changes
      micPermission.onchange = () => {
        console.log('Microphone permission changed:', micPermission.state);
        setPermissionStatus(prev => ({ ...prev, audio: micPermission.state as any }));
      };

      // Check camera permission
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setPermissionStatus(prev => ({ ...prev, video: cameraPermission.state as any }));
      
      // Listen for changes
      cameraPermission.onchange = () => {
        console.log('Camera permission changed:', cameraPermission.state);
        setPermissionStatus(prev => ({ ...prev, video: cameraPermission.state as any }));
      };

      console.log('Permission status:', { 
        microphone: micPermission.state, 
        camera: cameraPermission.state 
      });
    } catch (err) {
      console.error('Error checking permissions:', err);
    }
  }, []);

  // Setup stream with improved error handling
  const setupStream = useCallback(async () => {
    try {
      console.log('Requesting media devices...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Check that we got both audio and video tracks
      const audioTracks = mediaStream.getAudioTracks();
      const videoTracks = mediaStream.getVideoTracks();
      
      console.log('Media tracks:', { 
        audio: audioTracks.map(t => ({ 
          label: t.label, 
          enabled: t.enabled, 
          muted: t.muted, 
          readyState: t.readyState 
        })),
        video: videoTracks.map(t => ({ 
          label: t.label, 
          enabled: t.enabled, 
          muted: t.muted, 
          readyState: t.readyState 
        }))
      });

      if (audioTracks.length === 0) {
        console.warn('No audio tracks in the media stream!');
      }
      
      if (videoTracks.length === 0) {
        console.warn('No video tracks in the media stream!');
      }

      setStream(mediaStream);
      
      // Update permission status after successful getUserMedia
      checkPermissions();

    } catch (err: any) {
      let errorMessage = 'Failed to access camera and microphone. Please ensure you have granted the necessary permissions.';
      
      // Provide more helpful error messages based on the error name
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Permission to access camera and microphone was denied. Please allow access in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera or microphone found. Please connect these devices and try again.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Could not access your camera or microphone. They might be in use by another application.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Your camera or microphone does not meet the required constraints.';
      } else if (err.name === 'TypeError') {
        errorMessage = 'No camera and microphone permissions were requested.';
      }
      
      setError(`${errorMessage} (${err.name})`);
      console.error('Media stream error:', err);
    }
  }, [checkPermissions]);

  useEffect(() => {
    // First check permissions, then setup stream
    checkPermissions().then(() => {
      setupStream();
    });

    // Cleanup function
    return () => {
      if (stream) {
        console.log('Stopping all media tracks');
        stream.getTracks().forEach(track => {
          console.log(`Stopping track: ${track.kind} (${track.label})`);
          track.stop();
        });
      }
    };
  }, [setupStream, checkPermissions]);

  return { stream, error, permissionStatus };
}