import { useRef, useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { WallProps } from "./Wall";

export interface FrameProps extends React.ComponentProps<"mesh"> {
    src: string;
    wall: WallProps; // Wall that picture frame is on
    side?: "front" | "back" | "left" | "right";
    u?: number; // U horizontal coordinate
    v?: number; // V vertical coordinate
    frames: FrameProps[]; // All frames in the scene
}

export function Frame({ ...props }: FrameProps) {
    const {
        src,
        wall,
        side = "front",
        u = 0,
        v = 0,
        frames,
    } = props;
    const { camera, raycaster, mouse } = useThree();

    const frameRef = useRef<THREE.Mesh | null>(null);
    const lightRef = useRef<THREE.SpotLight>(null);

    const [canMove, setCanMove] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(new THREE.Vector3());
    const [isHovered, setIsHovered] = useState(false);

    const detailPanel = document.getElementById("picture-details-panel");

    const [normal] = useTexture([src]);

    const DEFAULT_SCALE = new THREE.Vector3(1, 1, 0.1);

    const checkCollision = (newPosition: THREE.Vector3) => {
        for (const otherFrame of frames) {
            if (otherFrame !== props) {
                const dist = newPosition.distanceTo(new THREE.Vector3(...otherFrame.wall.position));
                if (dist < 1) {
                    return true;
                }
            }
        }
        return false;
    };

    const getWallPlane = () => {
        const wallPosition = new THREE.Vector3(...wall.position);
        const normal = new THREE.Vector3();

        switch (side) {
            case "front":
                normal.set(0, 0, 1);
                break;
            case "back":
                normal.set(0, 0, -1);
                break;
            case "left":
                normal.set(-1, 0, 0);
                break;
            case "right":
                normal.set(1, 0, 0);
                break;
        }

        const plane = new THREE.Plane(normal, -wallPosition.dot(normal));
        return plane;
    };

    const getPosition = (position: THREE.Vector3, scale: THREE.Vector3) => {
        const wallPosition = position.clone();
        const wallScale = scale.clone();

        const newPosition = new THREE.Vector3();

        switch (side) {
            case "front": // Plane xy
                newPosition.set(
                    THREE.MathUtils.clamp(wallPosition.x + wallScale.z / 2 + v, -(wallPosition.z + wallScale.z / 2), wallPosition.z + wallScale.z / 2),
                    wallPosition.y + wallScale.y + u,
                    wallPosition.z + wallScale.z
                );
                break;
            case "back": // Plane xy
                newPosition.set(
                    wallPosition.x - wallScale.x - v,
                    wallPosition.y + wallScale.y + u,
                    wallPosition.z + wallScale.z
                );
                break;
            case "left": // Plane yz
                newPosition.set(
                    wallPosition.x + wallScale.x,
                    wallPosition.y + wallScale.y + u,
                    wallPosition.z + wallScale.z + v
                );
                break;
            case "right": // Plane yz
                newPosition.set(
                    wallPosition.x + wallScale.x,
                    wallPosition.y + wallScale.y + u,
                    wallPosition.z - wallScale.z - v
                );
                break;
        }

        return newPosition;
    };

    useEffect(() => {
        setCurrentPosition(getPosition(new THREE.Vector3(...wall.position), new THREE.Vector3(...wall.scale)));
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === "m" && isHovered && !checkCollision(currentPosition)) {
                setCanMove((prev) => !prev);
            }
        };

        if (isHovered) {
            detailPanel!.style.display = "block";
        } else {
            detailPanel!.style.display = "none";
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isHovered]);

    useFrame(() => {
        if (canMove && frameRef.current) {
            const plane = getWallPlane();
            const intersection = new THREE.Vector3();

            raycaster.setFromCamera(mouse, camera);
            if (raycaster.ray.intersectPlane(plane, intersection)) {
                frameRef.current.position.copy(
                    new THREE.Vector3(
                        THREE.MathUtils.clamp(intersection.x, -(wall.position[0] + wall.scale[0] / 2), wall.position[0] + wall.scale[0] / 2),
                        THREE.MathUtils.clamp(intersection.y, -(wall.position[1] + wall.scale[1] / 2), wall.position[1] + wall.scale[1] / 2),
                        THREE.MathUtils.clamp(intersection.z + wall.scale[2], wall.position[2], wall.position[2] + wall.scale[2] * 2)
                    )
                );
            }
        } else if (frameRef.current) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(frameRef.current);
            setIsHovered(intersects.length > 0);

        }

        if (lightRef.current) {
            lightRef.current.target.position.set(...currentPosition.toArray());
            lightRef.current.target.updateMatrixWorld();
        }
    });

    return (
        <mesh
            ref={frameRef}
            scale={DEFAULT_SCALE}
            position={currentPosition}
        >
            <boxGeometry args={DEFAULT_SCALE.toArray()} />
            <meshStandardMaterial color={canMove ? "gray" : "lightblue"} />
            <meshStandardMaterial map={normal} />
        </mesh>
    );
}
