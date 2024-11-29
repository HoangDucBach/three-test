import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Camera } from './components/three/canvas/Camera';
import { ControlPanel } from './components/three/canvas/Panel';
import { Control } from './components/three/canvas/Control';
import { Sky, Stats } from '@react-three/drei';
import { Wall } from './components/three/canvas/objects/Wall';
import { Physics, useBox } from '@react-three/cannon';
import { Frame } from './components/three/canvas/objects/Frame';
import { PICTURES } from './assets/pictures/pictures';
import { RaycasterHelper } from './components/three/helpers/utils/RaycasterHelper';
import { PictureDetailsPanel } from './components/ui/PictureDetailsPanel';
import * as THREE from 'three';
import { Ground } from './components/three/canvas/objects/Ground';
import { Light } from './components/three/canvas/Light';

const Obstacle = ({ position }: { position: [number, number, number] }) => {
  const [ref] = useBox<THREE.Mesh>(() => ({
    mass: 0,
    args: [1, 1, 1],
    position,
    type: 'Static',
    collisionFilterGroup: 2,
  }));

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial
        args={[{
          color: 'red',
          metalness: 0.05,
          roughness: 0.5,
          clearcoat: 1,
        }]}
      />
    </mesh>
  );
}

function generateRandomObstacles() {
  const obstacles = [];
  for (let i = 0; i < 10; i++) {
    obstacles.push(
      <Obstacle key={i} position={[Math.random() * 100, 0.5, Math.random() * 100]} />
    );
  }
  return obstacles;
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCameraLocked, setIsCameraLocked] = useState(false);
  const [currentImageShowing,] = useState(0);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleCameraLock = () => setIsCameraLocked(!isCameraLocked);

  return (
    <div className="relative">
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '10px',
          height: '10px',
          backgroundColor: 'red',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      ></div>
      <Canvas
        frameloop="demand"
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: 'black',
        }}
      >
        <Stats />
        <Camera />
        <Light />
        <Sky sunPosition={[100, 10, 100]} />
        <Physics>
          <Control />
          <Ground />
          {/* <gridHelper args={[100, 100]} position={[0, 0, 0]} /> */}
          <axesHelper args={[100]} />
          <RaycasterHelper />
          <Wall position={[1, 1, 0]} args={[5, 1, 0.5]} />
          <Wall position={[1, 1, 0]} args={[0.5, 1, 5]} />
          <Wall position={[1, 1, 5]} args={[5, 1, 0.5]} />
          <Wall position={[6, 1, 0]} args={[0.5, 1, 5]} >
            <Frame
              position={[0, 1, 0]}
            />
          </Wall>
        </Physics>
      </Canvas>
      <ControlPanel
        isPlaying={isPlaying}
        isCameraLocked={isCameraLocked}
        togglePlay={togglePlay}
        toggleCameraLock={toggleCameraLock}
      />
      <PictureDetailsPanel
        title={"Title" + currentImageShowing}
        description={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis viverra, enim a dapibus scelerisque, tortor ante venenatis ante, eu mattis ipsum neque nec metus."}
        src={PICTURES.PICTURE_1}
      />
    </div>
  );
}

export default App;
