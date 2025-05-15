import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

// Rotating box component
function RotatingBox() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.01);
    }, 16); // roughly 60fps
    
    return () => clearInterval(interval);
  }, []);

  return (
    <mesh rotation={[0, rotation, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

// Error boundary for rendering issues
function ErrorMessage() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)',
      color: 'red',
      padding: '20px',
      textAlign: 'center'
    }}>
      <p>Error rendering 3D scene</p>
    </div>
  );
}

// A very simple Three.js scene with just a box
export function TestThreeJs() {
  const [hasRendered, setHasRendered] = useState(false);
  const [renderError, setRenderError] = useState<Error | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    // Check if THREE is properly imported
    console.log("Three.js version:", THREE.REVISION);
    
    // Check if WebGL is supported
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        throw new Error('WebGL not supported');
      }
      
      console.log("WebGL is supported");
    } catch (err) {
      console.error("WebGL error:", err);
      setRenderError(err as Error);
      setErrorMessage(err instanceof Error ? err.message : String(err));
    }
  }, []);

  // Error handler for Canvas
  const handleCanvasError = (event: any) => {
    console.error("Canvas error event:", event);
    setErrorMessage(`Canvas error: ${event.toString()}`);
    // Create an Error object to maintain consistency with other error handling
    setRenderError(new Error(event.toString()));
  };

  return (
    <div style={{ width: '100%', height: '300px', background: '#1a1a2e', position: 'relative' }}>
      {renderError ? (
        <ErrorMessage />
      ) : (
        <Suspense fallback={<div style={{color: 'white', padding: '20px'}}>Loading...</div>}>
          <Canvas
            onCreated={() => {
              console.log("Canvas created successfully");
              setHasRendered(true);
            }}
            onError={handleCanvasError}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <RotatingBox />
          </Canvas>
        </Suspense>
      )}
      
      {/* Debug info overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '4px 8px',
        fontSize: '10px',
        fontFamily: 'monospace'
      }}>
        {hasRendered ? "✅ Canvas rendered" : "⚠️ Canvas not rendered yet"}
        {errorMessage && <div style={{color: 'red'}}>Error: {errorMessage}</div>}
      </div>
    </div>
  );
} 