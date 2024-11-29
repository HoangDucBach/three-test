import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect } from 'react';

export function RaycasterHelper() {
    const { camera, pointer, scene, raycaster } = useThree();

    function onPointerMove(event: PointerEvent) {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    useEffect(() => {
        window.addEventListener('pointermove', onPointerMove);
        return () => {
            window.removeEventListener('pointermove', onPointerMove);
        };
    }, []);

    // useFrame(() => {
    //     raycaster.setFromCamera(pointer, camera);

    //     const intersects = raycaster.intersectObjects(scene.children);
    //     for (const intersect of intersects) {
    //         if (intersect.object instanceof THREE.Mesh) {
    //             const material = (intersect.object as THREE.Mesh).material as THREE.Material;
    //             if (material instanceof THREE.MeshBasicMaterial) {
    //                 material.color.set('red');
    //             }
    //         }
    //     }
    // });

    return (
        <group />
    );
}