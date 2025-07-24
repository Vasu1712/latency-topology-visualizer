'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { CloudRegion as CloudRegionType } from '@/lib/types';
import { CLOUD_PROVIDERS } from '@/lib/constants';

interface CloudRegionProps {
  region: CloudRegionType;
  position: THREE.Vector3;
}

const CloudRegion: React.FC<CloudRegionProps> = ({ region, position }) => {
  const regionRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const provider = CLOUD_PROVIDERS[region.provider];

  useFrame((state, delta) => {
    if (regionRef.current) {
      regionRef.current.rotation.y += delta * 0.5;
      const scale = hovered ? 1.1 : 1;
      regionRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <group ref={regionRef} position={position}>
      {/* Main region sphere */}
      <Sphere
        args={[0.05, 12, 12]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={provider.color}
          transparent
          opacity={0.7}
          emissive={provider.color}
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Orbital rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.06, 0.08, 16]} />
        <meshBasicMaterial
          color={provider.color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh rotation={[0, 0, Math.PI / 4]}>
        <ringGeometry args={[0.07, 0.09, 16]} />
        <meshBasicMaterial
          color={provider.color}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Info popup */}
      {hovered && (
        <Html distanceFactor={8}>
          <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg min-w-[180px] transform -translate-x-1/2 -translate-y-full mb-4">
            <h3 className="font-bold text-sm">{region.name}</h3>
            <p className="text-xs text-gray-300">Provider: {provider.name}</p>
            <p className="text-xs text-gray-300">Code: {region.code}</p>
            <p className="text-xs text-gray-300">Servers: {region.serverCount}</p>
            <div className="flex items-center mt-2">
              <div 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: provider.color }}
              />
              <span className="text-xs">Active Region</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

export default CloudRegion;
