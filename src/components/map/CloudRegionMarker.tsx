'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

interface CloudRegionMarkerProps {
  position: THREE.Vector3;
  provider: 'aws' | 'gcp' | 'azure';
}

const CloudRegionMarker: React.FC<CloudRegionMarkerProps> = ({ position, provider }) => {
  // Define provider colors, ensuring a fallback
  const providerColors = {
    aws: '#ff9900',
    gcp: '#34a853',
    azure: '#3ccbf4',
  };

  const innerColor = useMemo(() => new THREE.Color(providerColors[provider] || '#ffffff'), [provider]);
  const outerColor = useMemo(() => new THREE.Color('#ffffff'), []);

  // This quaternion orients the flat marker to lie along the globe's surface
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 0, 1);
    const normal = position.clone().normalize();
    q.setFromUnitVectors(up, normal);
    return q;
  }, [position]);

  return (
    <group position={position} quaternion={quaternion}>
      {/* Outer white dot */}
      <mesh>
        <circleGeometry args={[0.025, 32]} />
        <meshBasicMaterial color={outerColor} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.001]}>
        <circleGeometry args={[0.012, 32]} />
        <meshBasicMaterial color={innerColor} toneMapped={false} />
      </mesh>
    </group>
  );
};

export default CloudRegionMarker;
