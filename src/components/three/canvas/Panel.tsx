interface ControlPanelProps {
  isPlaying: boolean;
  isCameraLocked: boolean;
  togglePlay: () => void;
  toggleCameraLock: () => void;
}

export function ControlPanel({ isPlaying, isCameraLocked, togglePlay, toggleCameraLock }: ControlPanelProps) {
  return (
    <div className="absolute top-5 right-5 bg-white/5 backdrop-blur-2xl p-5 rounded-lg">
      <button onClick={togglePlay} className="px-4 py-2 m-1 bg-black text-white border-none rounded-md">
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <br />
      <button onClick={toggleCameraLock} className="px-4 py-2 mt-2 bg-black text-white border-none rounded-md">
        {isCameraLocked ? 'Unlock Camera' : 'Lock Camera'}
      </button>
    </div>
  );
};

