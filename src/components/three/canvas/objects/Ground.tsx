import * as THREE from "three";
import { usePlane } from "@react-three/cannon";
import { CollisionFilterGroup } from "../../type";
interface Props { }

export function Ground(props: Props) {
    const [ref] = usePlane<THREE.Mesh>(() => ({
        args: [100, 100],
        rotation: [-Math.PI / 2, 0, 0],
        type: "Static",
        collisionFilterGroup: CollisionFilterGroup.Ground,
    }));

    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[100, 100]}/>
            <shadowMaterial opacity={0} />
        </mesh>
    );
}