import { useEffect } from "react";
import { IconXPFlag } from "./Icons";

interface BootScreenProps {
  onComplete: () => void;
}

/** XP boot screen — black bg, logo, animated progress blocks */
function BootScreen({ onComplete }: BootScreenProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, 4200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100000] bg-black flex flex-col items-center justify-center select-none">
      <div className="flex flex-col items-center gap-8">
        {/* XP four-color flag + wordmark */}
        <div className="flex items-center gap-3">
          <IconXPFlag size={64} />
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
