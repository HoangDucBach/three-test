import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Light } from './components/three/canvas/Light';
import { Camera } from './components/three/canvas/Camera';
import { ControlPanel } from './components/three/canvas/Panel';
import { Control } from './components/three/canvas/Control';
import { Stats } from '@react-three/drei';
import { Wall } from './components/three/canvas/objects/Wall';
import { Physics } from '@react-three/cannon';
import { Frame, FrameProps } from './components/three/canvas/objects/Frame';
import { PICTURES } from './assets/pictures/pictures';
import { RaycasterHelper } from './components/three/helpers/utils/RaycasterHelper';
import { PictureDetailsPanel } from './components/ui/PictureDetailsPanel';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCameraLocked, setIsCameraLocked] = useState(false);
  const [currentImageShowing,] = useState(0);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleCameraLock = () => setIsCameraLocked(!isCameraLocked);

  const walls: {
    position: [number, number, number];
    size: [number, number, number];
  }[] = [
      {
        position: [0, 0, 1],
        size: [4, 4, 1],
      },
    ];

  const frames: FrameProps[] = [
    {
      src: PICTURES.PICTURE_1,
      wall: walls[0],
      frames: [],
    },
    {
      src: PICTURES.PICTURE_2,
      wall: walls[0],
      frames: [],
    },
    {
      src: PICTURES.PICTURE_3,
      wall: walls[0],
      frames: [],
    },
  ];

  return (
    <div className="relative">
      <Canvas
        frameloop="demand"
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: 'black',
        }}
      >
        <Stats />
        <Light />
        <Camera />
        <Physics>
          <gridHelper args={[100, 100]} position={[0, 0, 0]} />
          <axesHelper args={[100]} />
          <RaycasterHelper />
          <Wall position={walls[0].position} size={walls[0].size} />
          <Frame
            src={frames[0].src}
            wall={frames[0].wall}
            side="front"
            u={2}
            v={0}
            frames={frames} 
          />

          <Frame
            src={frames[1].src}
            wall={frames[1].wall}
            side="front"
            u={-5}
            v={0}
            frames={frames}
          />

          {/* <Frame
            src={frames[2].src}
            wall={frames[2].wall}
            side="front"
            u={0}
            v={-10}
            frames={frames}
          /> */}
          <Control
            isLocked={isCameraLocked}
            wallPositions={walls.map((wall) => wall.position)}
          />
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
