import { usePersonControls } from '../hook/usePersonControls';
import { PointerLockControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { useBox } from '@react-three/cannon';
import { CollisionFilterGroup } from '../type';

export function Control() {
    const { forward, backward, left, right, sprint } = usePersonControls();
    const { camera, gl } = useThree();

    const [ref, api] = useBox<THREE.Mesh>(
        () => ({
            mass: 1,
            position: [0, 1, 0],
            type: 'Dynamic',
            args: [0.5, 1, 0.5],
            collisionFilterGroup: CollisionFilterGroup.Default,
            collisionFilterMask: CollisionFilterGroup.Wall | CollisionFilterGroup.Ground,
        }),
    );
    const controlsRef = useRef<any>(null);

    const movementSpeed = 3;

    // Sử dụng Vector3 để lưu trữ tốc độ di chuyển và hướng
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();

    useEffect(() => {
        // Đảm bảo khi bắt đầu game sẽ tự động kích hoạt Pointer Lock
        const handlePointerLock = () => {
            if (!document.pointerLockElement) {
                gl.domElement.requestPointerLock();
            }
        };

        document.addEventListener('click', handlePointerLock);

        return () => {
            document.removeEventListener('click', handlePointerLock);
        };
    }, [gl]);

    useFrame(() => {
        if (!ref.current) return;

        const cameraDirection = new THREE.Vector3();
        const cameraRight = new THREE.Vector3();
        const cameraDirectionXZ = new THREE.Vector3();
        const perpendicularCameraDirectionXZ = new THREE.Vector3();

        camera.getWorldDirection(cameraDirection);
        camera.getWorldDirection(cameraRight).cross(cameraDirection);
        cameraDirectionXZ.copy(cameraDirection).setY(0).normalize();
        perpendicularCameraDirectionXZ.copy(cameraDirectionXZ).applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);

        if (direction.length() > 0) direction.normalize();
        direction.set(cameraDirectionXZ.x, 0, cameraDirectionXZ.z).normalize();

        if (forward) velocity.set(movementSpeed * direction.x, 0, movementSpeed * direction.z);
        if (backward) velocity.set(-movementSpeed * direction.x, 0, -movementSpeed * direction.z);
        if (left) velocity.set(movementSpeed * perpendicularCameraDirectionXZ.x, 0, movementSpeed * perpendicularCameraDirectionXZ.z);
        if (right) velocity.set(-movementSpeed * perpendicularCameraDirectionXZ.x, 0, -movementSpeed * perpendicularCameraDirectionXZ.z);


        camera.position.setY(1);

        api.velocity.set(velocity.x, velocity.y, velocity.z);
        api.rotation.copy(camera.rotation);
        api.position.subscribe((position) => {
            ref.current?.position.set(position[0], position[1], position[2]);
            camera.position.set(position[0], position[1], position[2]);
        });
    });

    return (
        <>
            <mesh ref={ref} />
            <PointerLockControls
                ref={controlsRef}
                args={[camera, gl.domElement]}
            />
        </>
    );
}
