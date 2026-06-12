import { useEffect } from "react";

interface SmadavScreenProps {
  onComplete: () => void;
}

/** Smadav 2015 splash — green gradient, logo, loading bar. Shown after boot, before desktop. */
function SmadavScreen({ onComplete }: SmadavScreenProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, 3200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center select-none pointer-events-none">
      <div className="flex flex-col items-center pointer-events-auto">
      {/* Floating Smadav splash card — overlays desktop, no fullscreen bg */}
      <div
        className="relative px-10 py-7 rounded-md"
        style={{
          background: "linear-gradient(180deg, #2fae4d 0%, #1c8a39 50%, #0f6a28 100%)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.3)",
          border: "1px solid #0c5a22",
        }}
      >
        <div className="flex items-end gap-2">
          {/* SmadAV wordmark */}
          <div className="flex items-center leading-none">
            <span className="smadav-word">Smad</span>
            {/* The "A" rendered as an upward arrow */}
            <span className="relative inline-flex flex-col items-center mx-[1px]" style={{ width: "0.62em" }}>
              <svg width="40" height="56" viewBox="0 0 40 56" className="drop-shadow">
                <polygon points="20,2 38,40 26,40 26,54 14,54 14,40 2,40" fill="#1c8a39" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="smadav-word">V</span>
          </div>

          {/* 2015 / Rev block */}
          <div className="flex flex-col items-start leading-none -mb-1 ml-1">
            <span className="font-bold italic text-[28px]" style={{ color: "#f6e03a", textShadow: "1px 1px 1px rgba(0,0,0,0.4)" }}>2015</span>
            <span className="font-bold italic text-[14px]" style={{ color: "#ff3b3b", textShadow: "1px 1px 1px rgba(0,0,0,0.3)" }}>Rev. 10.0</span>
          </div>
        </div>

        {/* Tagline bar */}
        <div className="mt-3 -mx-10 -mb-7 px-10 py-1"
          style={{ background: "linear-gradient(180deg, #0f6a28 0%, #074d1b 100%)" }}>
          <span className="italic font-bold text-white text-[15px] drop-shadow">Antivirus USB &amp; Proteksi Tambahan</span>
        </div>
      </div>

      {/* Loading bar */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="boot-progress" style={{ borderColor: "#0c5a22" }}>
          <div className="boot-progress-blocks smadav-blocks" />
        </div>
        <span className="text-white/90 text-[12px] font-body">Loading Smadav...</span>
      </div>
      </div>
    </div>
  );
}

export default SmadavScreen;
