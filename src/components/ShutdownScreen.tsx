import { useEffect, useState } from "react";

interface ShutdownScreenProps {
  onComplete: () => void;
}

/** XP "Windows is shutting down..." → black "safe to turn off" fallback */
function ShutdownScreen({ onComplete }: ShutdownScreenProps) {
  const [phase, setPhase] = useState<"shutting" | "off">("shutting");

  useEffect(() => {
    const audio = new Audio("/xp-shutdown.mp3");
    audio.play().catch(() => {});

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
          <svg width="56" height="56" viewBox="0 0 24 24" className="drop-shadow-lg">
            <g transform="rotate(-8 12 11)">
              <rect x="1" y="2" width="10.5" height="8" rx="1" fill="#f24f4f" />
              <rect x="12.5" y="2" width="11" height="8" rx="1" fill="#6fbf3f" />
              <rect x="1" y="11" width="10.5" height="9" rx="1" fill="#3b8fe0" />
              <rect x="12.5" y="11" width="11" height="9" rx="1" fill="#f6c23e" />
            </g>
          </svg>
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
