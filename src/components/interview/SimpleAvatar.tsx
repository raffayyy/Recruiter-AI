import React, { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SimpleAvatar({ modelPath = "/models/interviewer.glb" }) {
  const [error, setError] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  
  // Load the model
  const { scene, nodes } = useGLTF(modelPath);
  
  // Simple rotation animation
  useFrame(() => {
    setRotation(prev => prev + 0.01);
  });
  
  // Log scene details for debugging
  useEffect(() => {
    if (scene) {
      console.log("Model loaded successfully", {
        sceneChildren: scene.children.length,
        childrenNames: scene.children.map(child => child.name)
      });
      
      // Log all meshes
      const meshes: THREE.Mesh[] = [];
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          meshes.push(object);
        }
      });
      
      console.log(`Found ${meshes.length} meshes in the model`);
    } else {
      setError("Failed to load model scene");
      console.error("Model scene is undefined");
    }
  }, [scene]);
  
  if (error) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }
  
  // Render a simple box if we don't have a scene yet
  if (!scene) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
    );
  }
  
  return (
    <group rotation={[0, rotation, 0]}>
      <primitive object={scene} scale={3} position={[0, -1, 0]} />
    </group>
  );
} 