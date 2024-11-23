import { useThree, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function RaycasterHelper() {
    const { camera, mouse } = useThree();
    const raycaster = useRef(new THREE.Raycaster());
    const lineRef = useRef<THREE.Line>(null);

    useFrame(() => {
        raycaster.current.setFromCamera(mouse, camera);

        const origin = raycaster.current.ray.origin;
        const direction = raycaster.current.ray.direction.clone().multiplyScalar(10);

        if (lineRef.current) {
            const points = [origin, origin.clone().add(direction)];
            lineRef.current.geometry.setFromPoints(points);
        }
    });

    return (
        <line ref={lineRef as any}>
            <bufferGeometry />
            <lineBasicMaterial color="red" />
        </line>
    );
}