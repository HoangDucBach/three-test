import { PointerLockControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ControlProps extends React.ComponentProps<typeof PointerLockControls> {
    wallPositions?: [number, number, number][];
}

export function Control({ wallPositions }: ControlProps) {
    const { camera, gl } = useThree();
    const controlsRef = useRef<any>(null);

    const moveSpeed = 5;
    const verticalSpeed = 5;

    const keys = useRef({
        w: false,
        a: false,
        s: false,
        d: false,
        " ": false,
        shift: false,
    });

    const checkCollision = (newPosition: THREE.Vector3) => {
        if (!wallPositions) return false;

        const ray = new THREE.Raycaster(camera.position, newPosition.clone().sub(camera.position).normalize(), 0, 1);

        // Map các wallPositions thành mesh và kiểm tra va chạm
        const walls = wallPositions.map((position) => {
            const geometry = new THREE.BoxGeometry(1, 1, 1); // Tạo geometry phù hợp
            const material = new THREE.MeshBasicMaterial({ visible: false }); // Chỉ cần collision, không cần hiển thị
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...position);
            return mesh;
        });

        // Kiểm tra va chạm
        const intersects = ray.intersectObjects(walls);
        return intersects.length > 0;
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase() as keyof typeof keys.current;
            if (key in keys.current) {
                keys.current[key] = true;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase() as keyof typeof keys.current;
            if (key in keys.current) {
                keys.current[key] = false;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    useFrame((_, deltaTime) => {
        if (!controlsRef.current?.isLocked) return;

        const moveDistance = moveSpeed * deltaTime;
        const verticalDistance = verticalSpeed * deltaTime;

        const newPosition = camera.position.clone();

        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();

        if (keys.current.w) newPosition.add(direction.multiplyScalar(moveDistance));
        if (keys.current.s) newPosition.sub(direction.multiplyScalar(moveDistance));
        if (keys.current.a) newPosition.sub(direction.cross(camera.up).multiplyScalar(moveDistance));
        if (keys.current.d) newPosition.add(direction.cross(camera.up).multiplyScalar(moveDistance));

        if (keys.current[" "]) newPosition.y += verticalDistance;
        if (keys.current.shift) newPosition.y -= verticalDistance;

        camera.position.copy(newPosition);

        if (!checkCollision(newPosition)) {
            camera.position.copy(newPosition);
        }
    });

    useEffect(() => {
        const handleUnlock = () => {
            controlsRef.current?.lock();
        };

        controlsRef.current?.addEventListener("unlock", handleUnlock);

        return () => {
            controlsRef.current?.removeEventListener("unlock", handleUnlock);
        };
    }, []);

    return (
        <>
            <PointerLockControls ref={controlsRef} args={[camera, gl.domElement]} />
        </>
    );
}
