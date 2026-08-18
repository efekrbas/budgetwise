'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = () => {
  const count = 120;
  const mesh = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color1 = new THREE.Color('#9333ea'); // Purple
    const color2 = new THREE.Color('#06b6d4'); // Cyan
    const color3 = new THREE.Color('#ec4899'); // Pink

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 2;

      const mixed = Math.random() > 0.5 ? color1.clone().lerp(color2, Math.random()) : color2.clone().lerp(color3, Math.random());
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.03;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.05;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const WavyGridPlane = () => {
  const mesh = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#9333ea') },
      uColor2: { value: new THREE.Color('#06b6d4') },
    }),
    []
  );

  useFrame((state) => {
    if (mesh.current) {
      const material = mesh.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime * 0.6;
      mesh.current.rotation.x = -Math.PI / 2.8;
      mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.08;
    }
  });

  return (
    <mesh ref={mesh} position={[0, -2.8, -4]}>
      <planeGeometry args={[26, 26, 60, 60]} />
      <shaderMaterial
        vertexShader={`
          varying vec2 vUv;
          varying float vElevation;
          uniform float uTime;
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float wave1 = sin(pos.x * 0.8 + uTime) * 0.35;
            float wave2 = cos(pos.y * 0.6 + uTime * 0.8) * 0.35;
            float wave3 = sin((pos.x + pos.y) * 0.5 + uTime * 0.5) * 0.2;
            
            pos.z += wave1 + wave2 + wave3;
            vElevation = pos.z;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          varying float vElevation;
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          void main() {
            float dist = distance(vUv, vec2(0.5));
            float alpha = 1.0 - smoothstep(0.1, 0.48, dist);
            
            vec3 color = mix(uColor1, uColor2, sin(vElevation * 2.0 + uTime) * 0.5 + 0.5);
            float glow = 0.4 + 0.6 * sin(uTime + vElevation * 3.0);
            
            gl_FragColor = vec4(color * glow, alpha * 0.35);
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
    <div className="fixed inset-0 z-[-1] bg-[#050508] overflow-hidden pointer-events-none">
      {/* Subtle radial ambient gradients */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[400px] bg-pink-600/10 rounded-full blur-[160px] pointer-events-none" />
      
      <Canvas dpr={[1, 1.5]} gl={{ powerPreference: 'high-performance', antialias: true }}>
        <ambientLight intensity={0.5} />
        <ParticleField />
        <WavyGridPlane />
      </Canvas>
    </div>
  );
}
