import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useHelper } from '@react-three/drei';
import { PointLightHelper, SpotLightHelper } from 'three';

interface LightProps extends React.ComponentProps<'group'> {
    ambientLightIntensity?: number;
    directionalLightPosition?: [number, number, number];
    directionalLightIntensity?: number;
    pointLightPosition?: [number, number, number];
    pointLightIntensity?: number;
    spotLightPosition?: [number, number, number];
    spotLightIntensity?: number;
    spotLightAngle?: number;
}

export function Light({
    ambientLightIntensity = 1,
    directionalLightPosition = [0, 5, 0],
    directionalLightIntensity = 1,
    pointLightPosition = [0, 5, 0],
    pointLightIntensity = 1,
    spotLightPosition = [0, 100, 0],
    spotLightIntensity = 1,
    spotLightAngle = Math.PI / 4,
}: LightProps) {
    const directionalLightRef = useRef<any>(null);
    const pointLightRef = useRef<any>(null);
    const spotLightRef = useRef<any>(null);
    useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'red');
    useHelper(pointLightRef, PointLightHelper, 1, 'blue');
    useHelper(spotLightRef, SpotLightHelper, 'green');

    return (
        <>
            <ambientLight intensity={ambientLightIntensity} />

            {/* <directionalLight
                ref={directionalLightRef}
                position={directionalLightPosition}
                intensity={directionalLightIntensity}
            /> */}
            <pointLight
                ref={pointLightRef}
                position={pointLightPosition}
                intensity={pointLightIntensity}
            />
            <spotLight
                ref={spotLightRef}
                position={spotLightPosition}
                color={'blue'}
                intensity={spotLightIntensity}
                distance={100}
            />
        </>
    );
};
