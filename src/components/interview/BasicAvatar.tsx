import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Simple animated head made of basic shapes
function Head() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Simple animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime()) * 0.3;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="white" />
        
        {/* Pupil */}
        <mesh position={[0, 0, 0.12]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </mesh>
      
      <mesh position={[-0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="white" />
        
        {/* Pupil */}
        <mesh position={[0, 0, 0.12]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </mesh>
      
      {/* Mouth */}
      <mesh position={[0, -0.2, 0.8]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.1]} />
        <meshStandardMaterial color="#ff9999" />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 0, 1]}>
        <coneGeometry args={[0.1, 0.2, 16]} />
        <meshStandardMaterial color="#ffcba4" />
      </mesh>
    </group>
  );
}

interface BasicAvatarProps {
  isPlaying?: boolean;
}

export function BasicAvatar({ isPlaying = false }: BasicAvatarProps) {
  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden bg-gray-900 relative">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <spotLight position={[0, 0, 5]} intensity={0.8} angle={0.4} penumbra={1} />
        
        <Head />
        
        {/* Add controls for easy debugging */}
        <OrbitControls />
        
        {/* Debug helpers */}
        {/* <axesHelper scale={5} /> */}
        {/* <gridHelper args={[10, 10]} /> */}
      </Canvas>
      
      {/* Status indicator */}
      {isPlaying && (
        <div className="absolute bottom-2 left-2 right-2 bg-blue-900/50 text-white text-xs p-1 rounded">
          Speaking...
        </div>
      )}
    </div>
  );
} 