import { useState, useRef } from "react";
import { WALLPAPERS, resolveCss, type WallpaperValue } from "../wallpapers";

interface DisplayPropertiesProps {
  current: WallpaperValue;
  onApply: (v: WallpaperValue) => void;
  onClose: () => void;
}

function DisplayProperties({ current, onApply, onClose }: DisplayPropertiesProps) {
  const [draft, setDraft] = useState<WallpaperValue>(current);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const selectedId = draft.kind === "builtin" ? draft.id : "__custom__";

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDraft({ kind: "custom", dataUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const apply = () => onApply(draft);
  const ok = () => { onApply(draft); onClose(); };

  return (
    <div className="flex flex-col h-full font-body text-[11px] bg-surface p-3 select-none">
      {/* Tab strip */}
      <div className="flex gap-1 mb-2 border-b border-outline-variant">
        {["Themes", "Desktop", "Screen Saver", "Appearance", "Settings"].map((t) => (
          <button
            key={t}
            className={`px-2 py-1 text-[11px] -mb-px border border-b-0 rounded-t ${
              t === "Desktop"
                ? "bg-surface border-outline-variant font-bold"
                : "bg-surface-container-highest border-transparent text-outline"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Monitor preview */}
      <div className="flex flex-col items-center mb-3">
        <div className="bevel-in bg-[#5a6a7a] p-3 rounded">
          <div
            className="w-[150px] h-[110px] border-2 border-[#1a1a1a]"
            style={{ background: resolveCss(draft) }}
          />
          <div className="h-[10px] bg-[#3a3a3a] rounded-b mx-auto w-[60px] -mb-1 mt-1" />
        </div>
      </div>

      {/* Background label + list */}
      <div className="mb-1 text-on-surface">Background:</div>
      <div className="flex-1 bevel-in bg-white overflow-y-auto min-h-[80px]">
        {WALLPAPERS.map((w) => (
          <button
            key={w.id}
            onClick={() => setDraft({ kind: "builtin", id: w.id })}
            className={`flex items-center gap-2 w-full text-left px-2 py-[3px] ${
              selectedId === w.id ? "bg-primary text-on-primary" : "hover:bg-surface-container-low"
            }`}
          >
            <span className="w-5 h-4 border border-outline shrink-0" style={{ background: w.css }} />
            <span>{w.name}</span>
          </button>
        ))}
        {draft.kind === "custom" && (
          <div className="flex items-center gap-2 w-full px-2 py-[3px] bg-primary text-on-primary">
            <span className="w-5 h-4 border border-outline shrink-0" style={{ background: resolveCss(draft) }} />
            <span>(Custom image)</span>
          </div>
        )}
      </div>

      {/* Browse */}
      <div className="flex justify-end mt-2">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <button onClick={() => fileRef.current?.click()} className="bevel-out-thin bg-surface px-3 py-[3px]">
          Browse...
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-outline-variant">
        <button onClick={ok} className="bevel-out-thin bg-surface px-4 py-[3px] min-w-[70px]">OK</button>
        <button onClick={onClose} className="bevel-out-thin bg-surface px-4 py-[3px] min-w-[70px]">Cancel</button>
        <button onClick={apply} className="bevel-out-thin bg-surface px-3 py-[3px] min-w-[60px]">Apply</button>
      </div>
    </div>
  );
}

export default DisplayProperties;
