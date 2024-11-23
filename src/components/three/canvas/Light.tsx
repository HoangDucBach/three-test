import React from 'react';

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
    directionalLightPosition = [5, 10, 5],
    directionalLightIntensity = 1,
    pointLightPosition = [0, 5, 0],
    pointLightIntensity = 1,
    spotLightPosition = [0, 10, 0],
    spotLightIntensity = 1,
    spotLightAngle = Math.PI / 4,
}: LightProps) {
    return (
        <>
            <ambientLight intensity={ambientLightIntensity} />

            <directionalLight
                position={directionalLightPosition}
                intensity={directionalLightIntensity}
                castShadow
            />

            <pointLight
                position={pointLightPosition}
                intensity={pointLightIntensity}
                castShadow
            />

            <spotLight
                position={spotLightPosition}
                intensity={spotLightIntensity}
                angle={spotLightAngle}
                castShadow
            />
        </>
    );
};
