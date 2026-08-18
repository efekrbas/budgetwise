'use client';

import React, { useRef, useMemo, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = memo(() => {
  const count = 100;
  const mesh = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color1 = new THREE.Color('#9333ea');
    const color2 = new THREE.Color('#06b6d4');
    const color3 = new THREE.Color('#ec4899');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;

      const mixed = Math.random() > 0.5 ? color1.clone().lerp(color2, Math.random()) : color2.clone().lerp(color3, Math.random());
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.015) * 0.04;
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
        size={0.07}
        vertexColors
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
});
ParticleField.displayName = "ParticleField";

const WavyGridPlane = memo(() => {
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
      material.uniforms.uTime.value = state.clock.elapsedTime * 0.5;
      mesh.current.rotation.x = -Math.PI / 2.8;
      mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.06;
    }
  });

  return (
    <mesh ref={mesh} position={[0, -2.8, -4]}>
      <planeGeometry args={[26, 26, 48, 48]} />
      <shaderMaterial
        vertexShader={`
          varying vec2 vUv;
          varying float vElevation;
          uniform float uTime;
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float wave1 = sin(pos.x * 0.7 + uTime) * 0.3;
            float wave2 = cos(pos.y * 0.5 + uTime * 0.7) * 0.3;
            
            pos.z += wave1 + wave2;
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
            float alpha = 1.0 - smoothstep(0.12, 0.48, dist);
            
            vec3 color = mix(uColor1, uColor2, sin(vElevation * 2.0 + uTime) * 0.5 + 0.5);
            float glow = 0.4 + 0.5 * sin(uTime + vElevation * 2.5);
            
            gl_FragColor = vec4(color * glow, alpha * 0.3);
          }
        `}
        uniforms={uniforms}
        transparent={true}
        wireframe={true}
      />
    </mesh>
  );
});
WavyGridPlane.displayName = "WavyGridPlane";

function Background3D() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#050508] overflow-hidden pointer-events-none">
      {/* Subtle radial ambient gradients */}
      <div className="absolute top-[-10%] left-[20%] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      
      <Canvas 
        dpr={[1, 1.25]} 
        gl={{ powerPreference: 'high-performance', antialias: false }}
        camera={{ position: [0, 0, 5], fov: 60 }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
        <WavyGridPlane />
      </Canvas>
    </div>
  );
}

export default memo(Background3D);
