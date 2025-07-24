'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LATENCY_THRESHOLDS } from '@/lib/constants';

interface LatencyConnectionProps {
  sourcePosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  latency: number;
}

const LatencyConnection: React.FC<LatencyConnectionProps> = ({
  sourcePosition,
  targetPosition,
  latency,
}) => {
  const pulseRef = useRef<THREE.Mesh>(null);

  // Determine the connection's color based on the latency value
  const getLatencyColor = (latency: number): THREE.Color => {
    if (latency <= LATENCY_THRESHOLDS.low) return new THREE.Color('#0FF300'); // Green for low latency
    if (latency <= LATENCY_THRESHOLDS.medium) return new THREE.Color('#FFFF00'); // Yellow for medium latency
    return new THREE.Color('#FE4545'); // Red for high latency
  };

  const color = getLatencyColor(latency);

  // Create a curved path (an arc) for the connection to follow
  const curve = useMemo(() => {
    const midpoint = new THREE.Vector3().addVectors(sourcePosition, targetPosition).multiplyScalar(0.6);
    const distance = sourcePosition.distanceTo(targetPosition);

    // Make the arc higher for longer connections
    midpoint.normalize().multiplyScalar(sourcePosition.length() + distance * 0.25);

    return new THREE.QuadraticBezierCurve3(
      sourcePosition,
      midpoint,
      targetPosition
    );
  }, [sourcePosition, targetPosition]);

  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 64, 0.004, 8, false), [curve]);
  const points = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  // This hook animates the pulse effect on every frame
  useFrame(({ clock }) => {
    if (pulseRef.current) {
      // The progress value loops from 0 to 1, moving the pulse along the curve
      const progress = (clock.getElapsedTime() * 0.4) % 1;
      const point = curve.getPointAt(progress);
      pulseRef.current.position.copy(point);
    }
  });

  return (
    <group>
      {/* The static line representing the connection's path */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.4} 
            toneMapped={false} 
        />
      </mesh>

      {/* The animated sphere that represents the data pulse */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
      </mesh>
    </group>
  );
};

export default LatencyConnection;
