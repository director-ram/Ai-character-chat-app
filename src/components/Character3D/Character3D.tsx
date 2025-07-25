import React, { useRef, useEffect } from 'react';
import { View, Platform } from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { Character } from '../../types';

interface Character3DProps {
  character: Character;
  isAnimating: boolean;
  onInteraction?: () => void;
}

const AnimatedCharacter: React.FC<{ character: Character; isAnimating: boolean }> = ({ 
  character, 
  isAnimating 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      
      // Gentle rotation
      meshRef.current.rotation.y += 0.01;
      
      // Breathing effect when animating (speaking)
      if (isAnimating) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.05;
        meshRef.current.scale.setScalar(scale);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += 0.02;
      ringRef.current.rotation.x += 0.01;
    }
  });

  const primaryColor = new THREE.Color(character.theme.primary);
  const secondaryColor = new THREE.Color(character.theme.secondary);
  const accentColor = new THREE.Color(character.theme.accent);

  return (
    <group>
      {/* Main character sphere */}
      <Sphere ref={meshRef} args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={primaryColor}
          transparent
          opacity={0.8}
          roughness={0.3}
          metalness={0.2}
        />
      </Sphere>

      {/* Floating particles around character */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Box
          key={i}
          args={[0.1, 0.1, 0.1]}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 2,
            Math.sin((i / 8) * Math.PI * 2) * 0.5,
            Math.sin((i / 8) * Math.PI * 2) * 2,
          ]}
        >
          <meshStandardMaterial color={secondaryColor} />
        </Box>
      ))}

      {/* Animated ring */}
      <Torus ref={ringRef} args={[1.5, 0.1, 16, 100]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={accentColor}
          transparent
          opacity={0.6}
          wireframe
        />
      </Torus>

      {/* Character name floating above - only show on native platforms */}
      {Platform.OS !== 'web' && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.3}
          color={character.theme.textPrimary}
          anchorX="center"
          anchorY="middle"
        >
          {character.name}
        </Text>
      )}
    </group>
  );
};

const Character3D: React.FC<Character3DProps> = ({ character, isAnimating, onInteraction }) => {
  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ flex: 1 }}
        onCreated={(state) => {
          state.scene.background = null; // Transparent background
        }}
        gl={{
          antialias: true,
          alpha: true,
          ...(Platform.OS === 'web' && {
            powerPreference: 'high-performance',
            preserveDrawingBuffer: true,
          }),
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight
          position={[-10, -10, -10]}
          angle={0.15}
          penumbra={1}
          intensity={0.5}
          color={character.theme.primary}
        />
        
        <AnimatedCharacter character={character} isAnimating={isAnimating} />
      </Canvas>
    </View>
  );
};

export default Character3D;
