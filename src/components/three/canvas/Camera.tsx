interface CameraProps extends React.ComponentProps<'perspectiveCamera'> {
    position?: [number, number, number];
    fov?: number;
    near?: number;
    far?: number;
    aspect?: number;
}

export function Camera({
    position = [0, 10, 0],
    rotation = [0, 0, 0],
    fov = 75,
    near = 0.1,
    far = 1000,
    aspect = window.innerWidth / window.innerHeight,
    ...props
}: CameraProps) {

    return (
        <perspectiveCamera
            position={position}
            fov={fov}
            near={near}
            far={far}
            aspect={aspect}
            {...props}
        />
    );
};
