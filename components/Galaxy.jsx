// // components/Galaxy.jsx - Luxury subtle particles
// import React, { useRef, useMemo } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// const Galaxy = ({ isLight = false }) => {
//   const pointsRef = useRef();

//   const config = isLight
//     ? {
//         count: 8000,
//         radius: 12,
//         branches: 4,
//         spin: 0.5,
//         randomness: 0.5,
//         randomnessPower: 4,
//         insideColor: '#444444',   // Soft dark gray
//         outsideColor: '#111111',  // Deep black
//         size: 0.01,
//         rotationSpeed: 0.015,
//       }
//     : {
//         count: 12000,
//         radius: 12,
//         branches: 6,
//         spin: 0.8,
//         randomness: 0.4,
//         randomnessPower: 4,
//         insideColor: '#ffd700',   // Subtle gold glow
//         outsideColor: '#c0c0c0',  // Silver/white
//         size: 0.015,
//         rotationSpeed: 0.02,
//       };

//   const { positions, colors } = useMemo(() => {
//     const { count, radius, branches, spin, randomness, randomnessPower, insideColor, outsideColor } = config;

//     const positions = new Float32Array(count * 3);
//     const colors = new Float32Array(count * 3);

//     const colorInside = new THREE.Color(insideColor);
//     const colorOutside = new THREE.Color(outsideColor);

//     for (let i = 0; i < count; i++) {
//       const i3 = i * 3;
//       const r = Math.random() * radius;
//       const spinAngle = r * spin;
//       const branchAngle = ((i % branches) / branches) * Math.PI * 2;

//       const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
//       const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
//       const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

//       positions[i3]     = Math.cos(branchAngle + spinAngle) * r + randomX;
//       positions[i3 + 1] = randomY;
//       positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

//       const mixedColor = colorInside.clone().lerp(colorOutside, r / radius);
//       colors[i3]     = mixedColor.r;
//       colors[i3 + 1] = mixedColor.g;
//       colors[i3 + 2] = mixedColor.b;
//     }

//     return { positions, colors };
//   }, [config]);

//   useFrame((state, delta) => {
//     if (pointsRef.current) {
//       pointsRef.current.rotation.y += config.rotationSpeed * delta;
//     }
//   });

//   return (
//     <points ref={pointsRef}>
//       <bufferGeometry>
//         <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
//         <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
//       </bufferGeometry>
//       <pointsMaterial
//         size={config.size}
//         sizeAttenuation={true}
//         depthWrite={false}
//         blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
//         vertexColors={true}
//         transparent={true}
//         opacity={isLight ? 0.4 : 0.8}
//         toneMapped={!isLight}
//       />
//     </points>
//   );
// };

// export default Galaxy;

// components/Galaxy.jsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Galaxy = ({ isLight = false }) => {
  const pointsRef = useRef();

  const config = isLight
    ? {
        count: 10000,
        radius: 12,
        branches: 5,
        spin: 0.6,
        randomness: 0.5,
        randomnessPower: 4,
        insideColor: '#2d2d2d',
        outsideColor: '#0f0f0f',
        size: 0.012,
        rotationSpeed: 0.015,
      }
    : {
        count: 15000,
        radius: 12,
        branches: 6,
        spin: 0.9,
        randomness: 0.35,
        randomnessPower: 3.8,
        insideColor: '#f5d5a0',   // Soft luxury gold
        outsideColor: '#e0e0e0',  // Platinum silver
        size: 0.018,
        rotationSpeed: 0.025,
      };

  const { positions, colors } = useMemo(() => {
    const { count, radius, branches, spin, randomness, randomnessPower, insideColor, outsideColor } = config;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorInside = new THREE.Color(insideColor);
    const colorOutside = new THREE.Color(outsideColor);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = Math.random() * radius;
      const spinAngle = r * spin;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;

      const rx = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      const ry = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      const rz = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

      positions[i3]     = Math.cos(branchAngle + spinAngle) * r + rx;
      positions[i3 + 1] = ry;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + rz;

      const mixed = colorInside.clone().lerp(colorOutside, r / radius);
      colors[i3]     = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;
    }

    return { positions, colors };
  }, [config]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += config.rotationSpeed * delta;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={config.size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
        vertexColors={true}
        transparent={true}
        opacity={isLight ? 0.5 : 0.8}
        toneMapped={!isLight}
      />
    </points>
  );
};

export default Galaxy;