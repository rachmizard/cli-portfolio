import { useEffect } from "react";

interface BootScreenProps {
  onComplete: () => void;
}

/** XP boot screen — black bg, logo, animated progress blocks */
function BootScreen({ onComplete }: BootScreenProps) {
  useEffect(() => {
    const audio = new Audio("/xp-startup.mp3");
    audio.play().catch(() => {});

    const t = setTimeout(onComplete, 4200);
    return () => {
      clearTimeout(t);
      audio.pause();
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100000] bg-black flex flex-col items-center justify-center select-none">
      <div className="flex flex-col items-center gap-8">
        {/* XP four-color flag + wordmark */}
        <div className="flex items-center gap-3">
          <svg width="64" height="64" viewBox="0 0 24 24" className="drop-shadow-lg">
            <g transform="rotate(-8 12 11)">
              <rect x="1" y="2" width="10.5" height="8" rx="1" fill="#f24f4f" />
              <rect x="12.5" y="2" width="11" height="8" rx="1" fill="#6fbf3f" />
              <rect x="1" y="11" width="10.5" height="9" rx="1" fill="#3b8fe0" />
              <rect x="12.5" y="11" width="11" height="9" rx="1" fill="#f6c23e" />
            </g>
          </svg>
          <div className="leading-none">
            <div className="text-white text-[15px] font-body">Microsoft</div>
            <div className="text-white text-[40px] font-bold font-body italic -mt-1">
              Windows<span className="text-[18px] align-super not-italic">xp</span>
            </div>
          </div>
        </div>

        {/* Progress bar — sliding blocks */}
        <div className="boot-progress">
          <div className="boot-progress-blocks" />
        </div>
      </div>

      {/* Bottom branding */}
      <div className="absolute bottom-10 right-12 text-right">
        <div className="text-white text-[13px] font-body">Microsoft<sup className="text-[8px]">®</sup></div>
        <div className="text-[#cfcfcf] text-[10px] font-body">Copyright © Rachmizard Corporation</div>
      </div>
    </div>
  );
}

export default BootScreen;
