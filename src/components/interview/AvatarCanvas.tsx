import React, { Suspense, useEffect, Component } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import { InterviewerAvatar } from './InterviewerAvatar';
import * as THREE from 'three';
import { User } from 'lucide-react';

// Basic camera setup with minimal settings
function CameraSetup() {
  const { camera } = useThree();
  
  useEffect(() => {
    // Simple camera position
    camera.position.set(0, 2.4, -15);
    camera.lookAt(0, 1.3, 1);
    
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.updateProjectionMatrix();
    }
  }, [camera]);
  
  return null;
}

// Simple error boundary for 3D rendering
class ModelErrorBoundary extends Component<
  { children: React.ReactNode, isPlaying: boolean },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode, isPlaying: boolean }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Avatar rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="h-[300px] w-full rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center">
          <div className="flex flex-col items-center text-gray-300">
            <User size={80} className="mb-4 text-blue-300" />
            <p className="text-sm">Virtual Interviewer</p>
            {this.props.isPlaying && 
              <p className="mt-2 text-xs text-blue-300 animate-pulse">Speaking...</p>
            }
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface AvatarCanvasProps {
  isPlaying: boolean;
  modelPath: string;
  speaking: boolean;
}

// // Pre-load the model to avoid loading delays
// try {
//   useGLTF.preload('/models/interviewer.glb');
// } catch (error) {
//   console.warn("Failed to preload model:", error);
// }

export function AvatarCanvas({ isPlaying, modelPath, speaking = false }: AvatarCanvasProps) {
  // Debug speaking state
  useEffect(() => {
    console.log("speaking state in AvatarCanvas:", speaking);
  }, [speaking]);

  return (
    <ModelErrorBoundary isPlaying={isPlaying}>
      <div className="h-[300px] w-full rounded-xl overflow-hidden bg-gray-900">
        <Canvas
          shadows
          gl={{ antialias: true }}
          camera={{
            fov: 3,
            near: 0.1,
            far: 20,
            position: [0, 20, 5] 
          }}
        >
          <color attach="background" args={['#111']} />
          <ambientLight intensity={1.0} />
          <directionalLight position={[0, 0, 5]} intensity={1.5} castShadow />
          
          <CameraSetup />
          
          <Suspense fallback={null}>
            <InterviewerAvatar 
              isPlaying={isPlaying} 
              speaking={speaking}
              modelPath={modelPath}
              position={[0, 0, -5]}
              scale={0.5}
            />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
    </ModelErrorBoundary>
  );
} 
