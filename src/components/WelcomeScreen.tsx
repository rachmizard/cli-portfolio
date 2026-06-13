import { useEffect } from "react";
import { playSound } from "../lib/sound";

interface WelcomeScreenProps {
  onComplete: () => void;
}

function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  useEffect(() => {
    const audio = playSound("/xp-startup.mp3");
    const t = setTimeout(onComplete, 3200);
    return () => {
      clearTimeout(t);
      audio.pause();
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100000] xp-welcome flex flex-col items-center justify-center select-none">
      <div className="w-full max-w-[640px] flex flex-col items-center">
        <div className="xp-welcome-rule" />
        <span className="xp-welcome-text my-7">welcome</span>
        <div className="xp-welcome-rule" />
      </div>
      <div className="absolute bottom-10 left-12 flex items-center gap-3">
        <div className="xp-welcome-spinner" />
        <span className="text-white text-[14px] font-body">loading your personal settings...</span>
      </div>
    </div>
  );
}

export default WelcomeScreen;
