'use client';

import React, { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useStore } from '@/store/useStore';
import ExchangeMarker from './ExchangeMarker';
import LatencyConnection from './LatencyConnection';
import { cloudRegionsData } from '@/data/cloudRegion';
import CloudRegionMarker from './CloudRegionMarker';

const latLngToVector3 = (lat: number, lon: number, radius = 2) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

const Earth: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, '//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg');
  const { isStarted } = useStore();

  useEffect(() => {
    if (isStarted && earthRef.current) {
      earthRef.current.rotation.set(0, 0, 0);
    }
  }, [isStarted]);

  useFrame((state, delta) => {
    if (earthRef.current && !isStarted) {
      earthRef.current.rotation.y += delta * 0.075;
    }
  });

  return (
    <Sphere ref={earthRef} args={[2, 64, 64]}>
      <meshStandardMaterial map={texture} />
    </Sphere>
  );
};

const CameraController: React.FC<{ target: THREE.Vector3 | null }> = ({ target }) => {
    const { camera, controls } = useThree() as { camera: THREE.PerspectiveCamera, controls: any };
    const { isStarted } = useStore();
    const [isAnimating, setIsAnimating] = useState(false);

    const animationTarget = useMemo(() => {
      if (!target) return null;

      const cameraPos = target.clone().multiplyScalar(2.5).add(new THREE.Vector3(0, 0.5, 0));
      return { position: cameraPos, lookAt: target };
    }, [target]);
  
    useEffect(() => {
      if (isStarted && animationTarget) {
        setIsAnimating(true);
      }
    }, [isStarted, animationTarget]);
  
    useFrame((state, delta) => {
      if (isAnimating && animationTarget) {
        camera.position.lerp(animationTarget.position, delta * 1.0);

        if (controls && controls.target) {
          controls.target.lerp(animationTarget.lookAt, delta * 1.0);
        }

        if (camera.position.distanceTo(animationTarget.position) < 0.1) {
          setIsAnimating(false);
          if (controls && controls.target) {
            controls.target.copy(animationTarget.lookAt);
          }
        }
      }
    });
  
    return null;
  };

const WorldMap3D: React.FC = () => {
  const { exchanges, isStarted, visibility } = useStore();
  const globeRadius=2;
  const orbitTarget = isStarted ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(-2.5, 0, 0);
  const lightIntensity = isStarted ? 3 : 4;
  const firstExchangeTarget = useMemo(() => {
    if (exchanges.length > 0) {
      return latLngToVector3(exchanges[0].position[0], exchanges[0].position[1]);
    }
    return null;
  }, [exchanges]);

  const latencyConnections = useMemo(() => {
    if (!isStarted || exchanges.length === 0 || cloudRegionsData.length === 0) {
      return [];
    }

    return exchanges.slice(0, 4).map((exchange, index) => {
        const cloudRegion = cloudRegionsData[index % cloudRegionsData.length];
        return {
            id: `conn-${exchange.id}-${cloudRegion.id}`,
            source: exchange,
            target: cloudRegion,
            latency: 10 + Math.random() * 200,
        }
    });
  }, [isStarted, exchanges]);

  return (
    <Canvas camera={{ position: [-5, 0, 8], fov: 50 }}>
      <ambientLight intensity={lightIntensity} />
      <directionalLight position={[10, 10, 5]} intensity={lightIntensity} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      
            <Suspense fallback={null}>
        <Earth />
        <CameraController target={firstExchangeTarget} />

        {isStarted && visibility.showExchanges &&
          exchanges.map((exchange) => {
            const position = latLngToVector3(exchange.position[0], exchange.position[1], globeRadius + 0.01);
            return (
              <ExchangeMarker
                key={exchange.id}
                exchange={exchange}
                position={position}
              />
            );
          })}

        {isStarted && visibility.showRegions &&
          cloudRegionsData.map((region) => {
            const position = latLngToVector3(region.position[0], region.position[1], globeRadius + 0.01);
            return (
              <CloudRegionMarker
                key={region.id}
                position={position}
                provider={region.provider as 'aws' | 'gcp' | 'azure'}
              />
            );
          })}

        {isStarted && visibility.showConnections &&
          latencyConnections.map((conn) => {
            const sourcePos = latLngToVector3(conn.source.position[0], conn.source.position[1], globeRadius + 0.01);
            const targetPos = latLngToVector3(conn.target.position[0], conn.target.position[1], globeRadius + 0.01);
            return (
              <LatencyConnection
                key={conn.id}
                sourcePosition={sourcePos}
                targetPosition={targetPos}
                latency={conn.latency}
              />
            );
          })}
      </Suspense>
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        enableZoom={true}
        enableRotate={true}
        enablePan={true}
        minDistance={2.5}
        maxDistance={15}
        target={orbitTarget}
      />
    </Canvas>
  );
};

export default WorldMap3D;