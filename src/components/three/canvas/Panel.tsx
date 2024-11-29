interface ControlPanelProps {
  isPlaying: boolean;
  isCameraLocked: boolean;
  togglePlay: () => void;
  toggleCameraLock: () => void;
}

export function ControlPanel({ isPlaying, isCameraLocked, togglePlay, toggleCameraLock }: ControlPanelProps) {
  return (
    <div className="absolute top-5 right-5 bg-white/5 backdrop-blur-2xl p-5 rounded-lg">

    </div>
  );
};

