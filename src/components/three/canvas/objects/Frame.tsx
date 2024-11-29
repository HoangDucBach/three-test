import { useRef, useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useBox, usePointToPointConstraint, useSphere } from "@react-three/cannon";
import { useMousePick } from "../../hook/useMousePick";
import { CollisionFilterGroup } from "../../type";

interface FrameProps {
    position: [number, number, number];
}

export function Frame({ position }: FrameProps) {
    const { camera, raycaster } = useThree();

    const parentRef = useRef<THREE.Mesh>();

    const [ref, api] = useBox<THREE.Mesh>(() => ({
        mass: 1,
        type: "Static",
        position,
        collisionFilterGroup: CollisionFilterGroup.Picture
    }));


    const showClickMarkerRef = useRef(false);
    const isPickRef = useRef(false);

    const handleMouseClick = (event: MouseEvent) => {
        if (!ref.current) return;

        const intersection = raycaster.intersectObject(ref.current, true);

        if (intersection.length > 0) {
            // Nếu đang kéo và thả Frame
            if (isPickRef.current) {
                isPickRef.current = false; // Thả
            } else {
                isPickRef.current = true; // Cầm lên
            }
        }
    };

    useEffect(() => {
        if (ref.current) {
            parentRef.current = ref.current.parent as THREE.Mesh;
        }
    }, [ref.current]);

    useEffect(() => {
        window.addEventListener("click", handleMouseClick);
        return () => {
            window.removeEventListener("click", handleMouseClick);
        };
    }, []);

    useFrame(() => {
        if (!ref.current) return;
        if (!parentRef.current) return;

        const worldPosition = new THREE.Vector3();
        parentRef.current.getWorldPosition(worldPosition);

        const intersection = raycaster.intersectObject(ref.current, true);
        const distanceFromCamera = worldPosition.distanceTo(camera.position);

        if (intersection.length > 0 && distanceFromCamera < 3) {
            showClickMarkerRef.current = true;
        } else {
            showClickMarkerRef.current = false;
        }

        if (isPickRef.current) {
            // Tìm giao điểm giữa ray và các đối tượng có thể đặt
            const intersects = raycaster.intersectObject(ref.current, true);

            if (intersects.length > 0) {
                const point = intersects[0].point;

                api.position.set(point.x, point.y, point.z);
            }
        }
        api.position.subscribe((position) => {
            ref.current?.position.set(position[0], position[1], position[2]);
        });
    });

    return (
        <>
            <mesh ref={ref} castShadow>
                <boxGeometry args={[0.05, 1, 1]} />
                <meshPhysicalMaterial
                    color="white"
                    metalness={0.3}
                    roughness={0.4}
                />
            </mesh>
            {showClickMarkerRef.current && (
                <mesh position={position}>
                    <sphereGeometry args={[0.1, 32, 32]} />
                    <meshBasicMaterial color="red" />
                </mesh>
            )}
        </>
    );
}
