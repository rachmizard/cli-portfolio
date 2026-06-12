import { useEffect, useState } from "react";
import { IconXPFlag } from "./Icons";
import { playSound } from "../lib/sound";

interface ShutdownScreenProps {
  onComplete: () => void;
}

/** XP "Windows is shutting down..." → black "safe to turn off" fallback */
function ShutdownScreen({ onComplete }: ShutdownScreenProps) {
  const [phase, setPhase] = useState<"shutting" | "off">("shutting");

  useEffect(() => {
    const audio = playSound("/xp-shutdown.mp3");

    const finish = () => {
      // try to close the tab — only works if opened by script, otherwise blocked
      window.close();
      // if still here, show the classic "safe to turn off" screen
      setPhase("off");
      onComplete();
    };

    const t = setTimeout(finish, 3400);
    return () => {
      clearTimeout(t);
      audio.pause();
    };
  }, [onComplete]);

  if (phase === "off") {
    return (
      <div className="fixed inset-0 z-[100000] bg-black flex items-center justify-center select-none">
        <p className="text-[#f5a623] text-[20px] font-body tracking-wide text-center px-4">
          It&apos;s now safe to turn off your computer.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100000] flex flex-col items-center justify-center select-none"
      style={{ background: "linear-gradient(180deg, #5a7fc4 0%, #3a5a96 55%, #2e4a82 100%)" }}>
      <div className="flex flex-col items-center gap-6">
        {/* XP four-color flag + wordmark */}
        <div className="flex items-center gap-3">
          <IconXPFlag size={56} />
          <div className="leading-none">
            <div className="text-white text-[13px] font-body">Microsoft</div>
            <div className="text-white text-[34px] font-bold font-body italic -mt-1">
              Windows<span className="text-[16px] align-super not-italic">xp</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-white text-[15px] font-body">
          <span className="shutdown-spinner" />
          <span>Windows is shutting down...</span>
        </div>
      </div>
    </div>
  );
}

export default ShutdownScreen;
