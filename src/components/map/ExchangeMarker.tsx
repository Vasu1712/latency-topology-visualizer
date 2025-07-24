'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Exchange } from '@/lib/types';
import { CLOUD_PROVIDERS } from '@/lib/constants';
import { useStore } from '@/store/useStore'; // Import the store

interface ExchangeMarkerProps {
  exchange: Exchange;
  position: THREE.Vector3;
}

const ExchangeMarker: React.FC<ExchangeMarkerProps> = ({ exchange, position }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { setHoveredCity } = useStore(); // Get the action from the store
  const color = useMemo(() => new THREE.Color(CLOUD_PROVIDERS[exchange.cloudProvider]?.color || '#ff4d4d'), [exchange.cloudProvider]);

  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 0, 1);
    const normal = position.clone().normalize();
    q.setFromUnitVectors(up, normal);
    return q;
  }, [position]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const elapsedTime = clock.getElapsedTime();
    groupRef.current.children.forEach((child, index) => {
      if (index > 0 && child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshBasicMaterial;
        const pulse = (Math.sin(elapsedTime * 1.5 - index * 0.5) + 1) / 2;
        material.opacity = pulse * 0.6;
      }
    });
  });


  return (
    <group
      ref={groupRef}
      position={position}
      quaternion={quaternion}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setHoveredCity(exchange.city);
      }}
      onPointerOut={() => {
        setHovered(false);
        setHoveredCity(null);
      }}
    >
      {/* Central solid dot */}
      <mesh>
        <circleGeometry args={[0.015, 32]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>

      {/* The four concentric rings, using torus for visibility from all angles */}
      {[...Array(4)].map((_, i) => (
        <mesh key={i}>
          <torusGeometry args={[0.03 * (i + 1), 0.002, 8, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            toneMapped={false}
          />
        </mesh>
      ))}
      
      {/* Tooltip that appears on hover */}
      {hovered && (
        <Html distanceFactor={10} zIndexRange={[100, 0]}>
          <div className="glass" style={{
            color: 'white',
            width: '50px',
            fontSize: '4px',
            padding: '4px',
            background: 'rgba(180, 180, 180, 0.15)',
            backdropFilter: 'blur(1px) saturate(180%)',
            borderRadius: '4px',
            pointerEvents: 'none',
            boxShadow: '0 8px 32px rgba(94, 94, 94, 0.2), inset 0 4px 20px rgba(160, 160, 160, 0.3)',
          }}>
            <strong>{exchange.name}</strong><br/>
            Cloud: {CLOUD_PROVIDERS[exchange.cloudProvider]?.name}<br/>
            Region: {exchange.region}
          </div>
        </Html>
      )}
    </group>
  );
};

export default ExchangeMarker;
