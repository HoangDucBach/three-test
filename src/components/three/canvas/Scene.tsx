import { Canvas } from "@react-three/fiber";

interface SceneProps {
    children: React.ReactNode;
}

export function Scene({ children }: SceneProps) {
    return (
        <Canvas>
            {children}
        </Canvas>
    );
}