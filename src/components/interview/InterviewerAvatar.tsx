import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib'


interface InterviewerAvatarProps {
  isPlaying: boolean;
  speaking: boolean;
  modelPath: string;
  scale?: number;
  position?: [number, number, number];
}

export function InterviewerAvatar({
  isPlaying,
  speaking = false,
  modelPath,
  scale = 1,
  position = [0, 0, 0]
}: InterviewerAvatarProps) {
  const group = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  // Load the GLTF file and get animations
  // const { nodes, materials, scene, animations } = useGLTF(modelPath);
  const { nodes, materials, animations } = useGLTF('/models/interviewer.glb') as GLTFResult
  const { actions, names } = useAnimations<GLTFActions>(animations, group)
  // const { actions, names, mixer } = useAnimations(animations, group);

  // Mark model as loaded when animations are available
  // useEffect(() => {
  //   if (names && names.length > 0) {
  //     setModelLoaded(true);
  //   }
  // }, [names]);

  // Basic model setup
  useEffect(() => {
    if (group.current) {
      // Set the model's position
      group.current.position.set(position[0], position[1], position[2]);
      
      // Rotate to face the camera
      group.current.rotation.set(0, Math.PI, 0);
    }
  }, [position]);

  // Add this effect to track speaking changes
  useEffect(() => {
    console.log("speaking state in InterviewerAvatar:", speaking);
  }, [speaking]);

  useEffect(() => {
    if (!actions) return;
  
    // Use type casting to handle TypeScript errors
    const actionMap = actions as unknown as Record<string, THREE.AnimationAction>;
    
    // Find the blink and talk animations with better error handling
    let blink: THREE.AnimationAction | undefined;
    let talk: THREE.AnimationAction | undefined;
    
    try {
      // Try to find animations by exact name first
      if ('Rig|Eyes blinking' in actionMap) {
        blink = actionMap['Rig|Eyes blinking'];
      } else if (names && names.length > 0) {
        // Find by pattern in names array
        const blinkName = names.find(n => typeof n === 'string' && n.toLowerCase().includes('blink'));
        if (blinkName && typeof blinkName === 'string' && blinkName in actionMap) {
          blink = actionMap[blinkName];
        }
      }
      
      if ('Rig|cycle talking' in actionMap) {
        talk = actionMap['Rig|cycle talking'];
      } else if (names && names.length > 0) {
        // Find by pattern in names array
        const talkName = names.find(n => typeof n === 'string' && n.toLowerCase().includes('talk'));
        if (talkName && typeof talkName === 'string' && talkName in actionMap) {
          talk = actionMap[talkName];
        }
      }
      
      // Fallback if specific animations aren't found
      if (!blink || !talk) {
        console.warn("Couldn't find specific animations, using fallbacks");
        const animKeys = Object.keys(actionMap);
        if (animKeys.length >= 2) {
          blink = blink || actionMap[animKeys[0]];
          talk = talk || actionMap[animKeys[1]];
        } else if (animKeys.length === 1) {
          blink = talk = actionMap[animKeys[0]];
        }
      }
    } catch (error) {
      console.error("Error finding animations:", error);
    }
  
    if (!blink || !talk) {
      console.error("Failed to find animations");
      return;
    }
  
    console.log("Animation state changed - isPlaying:", speaking);
    console.log("Available animations:", names);
    
    try {
      if (speaking) {
        // When audio starts playing, fade out blink and fade in talk
        console.log("Starting talking animation");
        blink.fadeOut(0.25);
        talk
          .reset()
          .setLoop(THREE.LoopRepeat, Infinity)
          .fadeIn(0.25)
          .play();
      } else {
        // When audio stops playing, fade out talk and fade in blink
        console.log("Starting blinking animation");
        talk.fadeOut(0.25);
        blink
          .reset()
          .setLoop(THREE.LoopPingPong, Infinity)
          .fadeIn(0.25)
          .play();
      }
    } catch (error) {
      console.error("Error playing animations:", error);
    }
    
    // Cleanup function to handle component unmount or isPlaying changes
    return () => {
      try {
        if (talk) talk.stop();
        if (blink) blink.stop();
      } catch (error) {
        console.error("Error stopping animations:", error);
      }
    };
  }, [speaking, actions, names]);


  type GLTFResult = GLTF & {
    nodes: {
      Object_79: THREE.SkinnedMesh
      Object_81: THREE.SkinnedMesh
      Object_83: THREE.SkinnedMesh
      _rootJoint: THREE.Bone
    }
    materials: {
      business_suit_man: THREE.MeshStandardMaterial
    }
  }
  
  type ActionName =
    | 'Rig|idle'
    | 'Rig|cycle_talking'
    | 'Rig|Eyes blinking'
    | 'Rig|jump'
    | 'Rig|phonemes  - A-I'
    | 'Rig|phonemes  - C-G-D-K-N-S-T'
    | 'Rig|phonemes  - closed'
    | 'Rig|phonemes  - E'
    | 'Rig|phonemes  - F-V-D-Th'
    | 'Rig|phonemes  - I-D-Th'
    | 'Rig|phonemes  - M-P-B'
    | 'Rig|phonemes  - O'
    | 'Rig|phonemes  - Q'
    | 'Rig|phonemes  - stand'
    | 'Rig|phonemes  - U'
    | 'Rig|run'
    | 'Rig|sitting_end'
    | 'Rig|sitting_idle'
    | 'Rig|sitting_start'
    | 'Rig|Static_Pose'
    | 'Rig|step_left'
    | 'Rig|step_right'
    | 'Rig|turning_left'
    | 'Rig|turning_right'
    | 'Rig|walk'
  type GLTFActions = Record<ActionName, THREE.AnimationAction>

  return (
    // <group ref={group} position={position} scale={[scale, scale, scale]}>
    //   <primitive object={model}  />
    // </group>

    
        <group ref={group} dispose={null}>
          <group name="Sketchfab_Scene">
            <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]} scale={0.01}>
              <group name="6faae247636341e9b36c6699f702b94ffbx" rotation={[Math.PI / 2, 0, 0]}>
                <group name="Object_2">
                  <group name="RootNode">
                    <group name="Rig" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                      <group name="Object_5">
                        <primitive object={nodes._rootJoint} />
                        <skinnedMesh
                          name="Object_79"
                          geometry={nodes.Object_79.geometry}
                          material={materials.business_suit_man}
                          skeleton={nodes.Object_79.skeleton}
                        />
                        <skinnedMesh
                          name="Object_81"
                          geometry={nodes.Object_81.geometry}
                          material={materials.business_suit_man}
                          skeleton={nodes.Object_81.skeleton}
                        />
                        <skinnedMesh
                          name="Object_83"
                          geometry={nodes.Object_83.geometry}
                          material={materials.business_suit_man}
                          skeleton={nodes.Object_83.skeleton}
                        />
                        <group name="Object_78" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                        <group
                          name="Object_80"
                          position={[-0.011, 169.474, 7.083]}
                          rotation={[-Math.PI / 2, 0, 0]}
                          scale={100}
                        />
                        <group
                          name="Object_82"
                          position={[0.012, 170.333, 0.37]}
                          rotation={[-Math.PI / 2, 0, 0]}
                          scale={100}
                        />
                      </group>
                    </group>
                    <group name="Business_Male_Suit" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                    <group
                      name="Business_Man_Internal_aParts"
                      position={[-0.011, 169.474, 7.083]}
                      rotation={[-Math.PI / 2, 0, 0]}
                      scale={100}
                    />
                    <group
                      name="Business_Man_Body"
                      position={[0.012, 170.333, 0.37]}
                      rotation={[-Math.PI / 2, 0, 0]}
                      scale={100}
                    />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      )
    }
    
    useGLTF.preload('/models/interviewer.glb')
