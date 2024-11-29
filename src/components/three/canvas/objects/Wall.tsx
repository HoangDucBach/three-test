import { useRef } from "react";
import { useBox } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TEXTURES } from "../../../../assets/textures/textures";
import { CollisionFilterGroup } from "../../type";


interface WallProps {
    position: [number, number, number];
    args: [number, number, number];
    children?: React.ReactNode;
}

export function Wall({ position, args, children }: WallProps) {
    const [ref] = useBox<THREE.Mesh>(() => ({
        mass: 0,
        args,
        position: [position[0], args[1] / 2, position[2]],
        type: "Static",
        collisionFilterGroup: CollisionFilterGroup.Wall,
    }));

    const [
        albedoMap,
        aoMap,
        displacementMap,
        metallicMap,
        normalMap,
        roughnessMap
    ] = useLoader(THREE.TextureLoader, [
        TEXTURES.WALL.albedo!.toString(),
        TEXTURES.WALL.ao!.toString(),
        TEXTURES.WALL.height!.toString(),
        TEXTURES.WALL.metallic!.toString(),
        TEXTURES.WALL.normal!.toString(),
        TEXTURES.WALL.roughness!.toString(),
    ]);

    return (
        <mesh ref={ref} castShadow receiveShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial
                map={albedoMap}
                displacementMap={displacementMap}
                displacementScale={0}
                metalnessMap={metallicMap}
                metalness={0.5}
                normalMap={normalMap}
                roughnessMap={roughnessMap}
                roughness={0.5}
                lightMap={aoMap}
                lightMapIntensity={1}
            />
            {children}
        </mesh>
    );
}