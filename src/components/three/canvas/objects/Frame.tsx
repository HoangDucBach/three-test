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

let movingFrameRef: THREE.Mesh | null = null;

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

    const [canMove, setCanMove] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(new THREE.Vector3());
    const [isHovered, setIsHovered] = useState(false);

    const detailPanel = document.getElementById("picture-details-panel");

    const [normal] = useTexture([src]);

    const DEFAULT_SCALE = new THREE.Vector3(1, 1, 0.1);

    const checkCollision = (newPosition: THREE.Vector3) => {
        const currentBox = new THREE.Box3().setFromCenterAndSize(
            newPosition,
            DEFAULT_SCALE
        );

        for (const otherFrame of frames) {
            if (otherFrame !== props) {
                const otherBox = new THREE.Box3().setFromCenterAndSize(
                    getPosition(new THREE.Vector3(...otherFrame.wall.position), new THREE.Vector3(...otherFrame.wall.size)),
                    DEFAULT_SCALE
                );

                if (currentBox.intersectsBox(otherBox)) {
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

        const plane = new THREE.Plane();
        plane.setFromNormalAndCoplanarPoint(normal, wallPosition);

        return plane;
    };

    const getPosition = (position: THREE.Vector3, size: THREE.Vector3) => {
        const wallPosition = position.clone();
        const wallScale = size.clone();

        const newPosition = new THREE.Vector3();

        switch (side) {
            case "front": // Plane xy
                newPosition.set(
                    THREE.MathUtils.clamp(wallPosition.x + u, wallPosition.x - wallScale.x, wallPosition.x + wallScale.x),
                    THREE.MathUtils.clamp(wallPosition.y + v, wallPosition.y - wallScale.y, wallPosition.y + wallScale.y),
                    wallPosition.z + wallScale.z / 2
                );
                break;
        }

        return newPosition;
    };

    useEffect(() => {
        setCurrentPosition(getPosition(new THREE.Vector3(...wall.position), new THREE.Vector3(...wall.size)));
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === "m" && isHovered) {
                if (canMove) {
                    setCanMove(false);
                    movingFrameRef = null;
                } else if (!movingFrameRef) {
                    setCanMove(true);
                    movingFrameRef = frameRef.current;
                }
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
    }, [isHovered, canMove]);

    useFrame(() => {
        if (canMove && frameRef.current === movingFrameRef) {
            const plane = getWallPlane();
            const intersection = new THREE.Vector3();

            raycaster.setFromCamera(mouse, camera);
            if (raycaster.ray.intersectPlane(plane, intersection)) {
                const newPosition = new THREE.Vector3(
                    THREE.MathUtils.clamp(intersection.x, wall.position[0] - wall.size[0], wall.position[0] + wall.size[0]),
                    THREE.MathUtils.clamp(intersection.y, wall.position[1] - wall.size[1], wall.position[1] + wall.size[1]),
                    intersection.z + wall.size[2] / 2
                );

                if (!checkCollision(newPosition)) {
                    if (frameRef.current) {
                        frameRef.current.position.copy(newPosition);
                    }
                }
            }
        } else if (frameRef.current) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(frameRef.current);
            setIsHovered(intersects.length > 0);
        }
    });

    return (
        <mesh
            ref={frameRef}
            position={currentPosition}
        >
            <boxGeometry args={DEFAULT_SCALE.toArray()} />
            <meshStandardMaterial color={canMove ? "gray" : "lightblue"} />
            <meshStandardMaterial map={normal} />
        </mesh>
    );
}
