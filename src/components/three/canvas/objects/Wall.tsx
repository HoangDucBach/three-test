import { useTexture } from '@react-three/drei';
import { Instances, Instance } from '@react-three/drei';
import { useBox } from '@react-three/cannon';
import { TEXTURES } from '../../../../assets/textures/textures';

export interface WallProps extends React.ComponentProps<'mesh'> {
    position: [number, number, number];
    size: [number, number, number];
}
export function Wall({ position, size }: WallProps) {
    const [
        albedo,
        ao,
        height,
        metallic,
        normal,
        roughness,
    ] = useTexture([
        TEXTURES.WALL.albedo!.toString(),
        TEXTURES.WALL.ao!.toString(),
        TEXTURES.WALL.height!.toString(),
        TEXTURES.WALL.metallic!.toString(),
        TEXTURES.WALL.normal!.toString(),
        TEXTURES.WALL.roughness!.toString(),
    ]);

    const [ref] = useBox<any>(() => ({
        position,
        args: size,
        type: 'Static',
    }));

    return (
        <Instances limit={1000} ref={ref}>
            <boxGeometry args={size} />
            <meshStandardMaterial
                map={albedo}
                aoMap={ao}
                displacementMap={height}
                displacementScale={0}
                metalnessMap={metallic}
                metalness={0}
                normalMap={normal}
                roughnessMap={roughness}
                roughness={0.5}
            />
            <Instance position={position} scale={size} />
        </Instances>
    );
}
