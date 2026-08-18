'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

const WavyPlane = () => {
  const mesh = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#9333ea') }, // purple-600
    }),
    []
  );

  useFrame((state) => {
    if (mesh.current) {
      const material = mesh.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      // Gentle rotation to make it feel alive
      mesh.current.rotation.x = -Math.PI / 2.5;
      mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <mesh ref={mesh} position={[0, -2, -5]}>
      <planeGeometry args={[20, 20, 64, 64]} />
      <shaderMaterial
        vertexShader={`
          varying vec2 vUv;
          uniform float uTime;
          void main() {
            vUv = uv;
            vec3 pos = position;
            // Wavy effect
            float noiseFreq = 2.0;
            float noiseAmp = 0.5;
            vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
            pos.z += sin(pos.x * 2.0 + uTime) * 0.3;
            pos.z += cos(pos.y * 2.0 + uTime) * 0.3;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColor;
          void main() {
            // Pulse based on time and uv
            float pulse = 0.5 + 0.5 * sin(uTime * 0.5 + vUv.x * 10.0 + vUv.y * 10.0);
            float alpha = 1.0 - smoothstep(0.0, 0.5, distance(vUv, vec2(0.5))); // fade edges
            gl_FragColor = vec4(uColor * pulse, alpha * 0.4);
          }
        `}
        uniforms={uniforms}
        transparent={true}
        wireframe={true}
      />
    </mesh>
  );
};

export default function Background3D() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#09090b] overflow-hidden pointer-events-none">
      <Canvas dpr={[1, 2]} gl={{ powerPreference: 'high-performance', antialias: false }}>
        <ambientLight intensity={0.2} />
        <WavyPlane />
      </Canvas>
    </div>
  );
}
