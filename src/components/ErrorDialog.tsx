import { useEffect, useRef } from "react";
import { IconErrorX, IconClose } from "./Icons";
import { playError } from "../lib/sound";

interface ErrorDialogProps {
  title: string;
  message: string;
  onClose: () => void;
}

/** XP-style modal message box (critical stop). Plays the error ding on mount. */
function ErrorDialog({ title, message, onClose }: ErrorDialogProps) {
  const okRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    playError();
    // Focus OK a tick late: if an Enter keydown opened this dialog (Run box),
    // focusing synchronously would make the browser's default action deliver
    // a click to the OK button and close the dialog on the same keystroke.
    const focusTimer = setTimeout(() => okRef.current?.focus(), 0);
    return () => clearTimeout(focusTimer);
  }, []);

  useEffect(() => {
    const openedAt = performance.now();
    const onKey = (e: KeyboardEvent) => {
      // The keystroke that opened the dialog is still bubbling to window
      // when this listener attaches — ignore it.
      if (e.timeStamp <= openedAt) return;
      if (e.key === "Escape" || e.key === "Enter") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[99000] flex items-center justify-center" onClick={onClose}>
      <div
        className="window window-active flex flex-col w-[360px] max-w-[calc(100vw-20px)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="title-bar flex items-center justify-between select-none">
          <span className="truncate">{title}</span>
          <button
            onClick={onClose}
            className="title-bar-buttons flex items-center justify-center title-bar-close leading-none font-bold"
            aria-label="Close"
          >
            <IconClose />
          </button>
        </div>
        <div className="window-body bg-surface p-4 pt-5 flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <span className="shrink-0"><IconErrorX size={32} /></span>
            <p className="text-[11px] leading-[1.45] font-body pt-1">{message}</p>
          </div>
          <div className="flex justify-center">
            <button ref={okRef} className="xp-btn min-w-[75px]" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorDialog;
