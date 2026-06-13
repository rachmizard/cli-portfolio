import { useState, useEffect, useRef, useCallback } from "react";

// ── Classic Minesweeper palette (Win95/XP control gray #c0c0c0 family) ──
const MS = {
  bg: "#c0c0c0",
  light: "#ffffff",
  mid: "#c0c0c0",
  dark: "#808080",
  darker: "#7b7b7b",
  black: "#000000",
  ledRed: "#ff0000",
  ledBg: "#000000",
  // Number colors (authentic Minesweeper)
  num1: "#0000ff",
  num2: "#008000",
  num3: "#ff0000",
  num4: "#000080",
  num5: "#800000",
  num6: "#008080",
  num7: "#000000",
  num8: "#808080",
  // Mine hit background
  mineHit: "#ff0000",
} as const;

// ── Types ──
type Mark = "none" | "flag" | "question";
type GameStatus = "idle" | "playing" | "won" | "lost";

interface Cell {
  mine: boolean;
  revealed: boolean;
  mark: Mark;
  adjacent: number;
}

interface Difficulty {
  label: string;
  cols: number;
  rows: number;
  mines: number;
}

const DIFFICULTIES: Record<string, Difficulty> = {
  beginner: { label: "Beginner", cols: 9, rows: 9, mines: 10 },
  intermediate: { label: "Intermediate", cols: 16, rows: 16, mines: 40 },
  expert: { label: "Expert", cols: 30, rows: 16, mines: 99 },
};

const NUMBER_COLORS: Record<number, string> = {
  1: MS.num1,
  2: MS.num2,
  3: MS.num3,
  4: MS.num4,
  5: MS.num5,
  6: MS.num6,
  7: MS.num7,
  8: MS.num8,
};

// ── Helpers ──
function createEmptyBoard(cols: number, rows: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, (): Cell => ({
      mine: false,
      revealed: false,
      mark: "none",
      adjacent: 0,
    }))
  );
}

function placeMines(
  board: Cell[][],
  cols: number,
  rows: number,
  mineCount: number,
  safeRow: number,
  safeCol: number
): Cell[][] {
  const next = board.map((row) => row.map((cell) => ({ ...cell })));
  const safeCells = new Set<string>();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = safeRow + dr;
      const c = safeCol + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        safeCells.add(`${r},${c}`);
      }
    }
  }

  let placed = 0;
  while (placed < mineCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (next[r][c].mine || safeCells.has(`${r},${c}`)) continue;
    next[r][c].mine = true;
    placed++;
  }

  // Calculate adjacency
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (next[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && next[nr][nc].mine) {
            count++;
          }
        }
      }
      next[r][c].adjacent = count;
    }
  }

  return next;
}

function floodFill(board: Cell[][], startRow: number, startCol: number): Cell[][] {
  const next = board.map((row) => row.map((cell) => ({ ...cell })));
  const stack: [number, number][] = [[startRow, startCol]];
  const rows = next.length;
  const cols = next[0].length;

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
    if (next[r][c].revealed || next[r][c].mark === "flag") continue;
    next[r][c].revealed = true;
    if (next[r][c].adjacent === 0 && !next[r][c].mine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !next[nr][nc].revealed) {
            stack.push([nr, nc]);
          }
        }
      }
    }
  }

  return next;
}

function checkWin(board: Cell[][]): boolean {
  return board.every((row) =>
    row.every((cell) => cell.mine || cell.revealed)
  );
}

function formatLed(value: number): string {
  const clamped = Math.max(-99, Math.min(999, value));
  if (clamped < 0) {
    return `-${String(Math.abs(clamped)).padStart(2, "0")}`;
  }
  return String(clamped).padStart(3, "0");
}

// ── Smiley SVG faces ──
function SmileyNormal() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#ffff00" stroke="#000" strokeWidth="1.5" />
      <circle cx="8.5" cy="9" r="1.8" fill="#000" />
      <circle cx="15.5" cy="9" r="1.8" fill="#000" />
      <path d="M7 14.5 Q12 19 17 14.5" stroke="#000" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function SmileySurprised() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#ffff00" stroke="#000" strokeWidth="1.5" />
      <circle cx="8.5" cy="9" r="2" fill="#000" />
      <circle cx="15.5" cy="9" r="2" fill="#000" />
      <ellipse cx="12" cy="16.5" rx="3" ry="2.5" fill="#000" />
    </svg>
  );
}

function SmileyDead() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#ffff00" stroke="#000" strokeWidth="1.5" />
      <line x1="6" y1="7" x2="11" y2="11" stroke="#000" strokeWidth="1.8" />
      <line x1="11" y1="7" x2="6" y2="11" stroke="#000" strokeWidth="1.8" />
      <line x1="13" y1="7" x2="18" y2="11" stroke="#000" strokeWidth="1.8" />
      <line x1="18" y1="7" x2="13" y2="11" stroke="#000" strokeWidth="1.8" />
      <ellipse cx="12" cy="17" rx="3" ry="2" fill="#000" />
    </svg>
  );
}

function SmileyCool() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#ffff00" stroke="#000" strokeWidth="1.5" />
      {/* Sunglasses */}
      <rect x="4" y="7.5" width="7" height="4" rx="1" fill="#000" />
      <rect x="13" y="7.5" width="7" height="4" rx="1" fill="#000" />
      <line x1="11" y1="9" x2="13" y2="9" stroke="#000" strokeWidth="1.2" />
      <line x1="4" y1="9" x2="2" y2="8" stroke="#000" strokeWidth="1.2" />
      <line x1="20" y1="9" x2="22" y2="8" stroke="#000" strokeWidth="1.2" />
      <path d="M7 15 Q12 19 17 15" stroke="#000" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// ── Mine SVG ──
function MineIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true">
      <circle cx="8" cy="8" r="5" fill="#000" />
      <line x1="8" y1="1" x2="8" y2="15" stroke="#000" strokeWidth="1.5" />
      <line x1="1" y1="8" x2="15" y2="8" stroke="#000" strokeWidth="1.5" />
      <line x1="3.5" y1="3.5" x2="12.5" y2="12.5" stroke="#000" strokeWidth="1.2" />
      <line x1="12.5" y1="3.5" x2="3.5" y2="12.5" stroke="#000" strokeWidth="1.2" />
      <circle cx="6" cy="6" r="1.5" fill="#fff" />
    </svg>
  );
}

// ── Flag SVG ──
function FlagIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true">
      <polygon points="3,2 12,5 3,8" fill="#ff0000" />
      <line x1="3" y1="2" x2="3" y2="14" stroke="#000" strokeWidth="1.5" />
      <line x1="1" y1="14" x2="5" y2="14" stroke="#000" strokeWidth="1.5" />
    </svg>
  );
}

// ── Wrong mine (X overlay) ──
function WrongMineIcon({ size = 14 }: { size?: number }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: size, height: size }}>
      <MineIcon size={size} />
      <svg
        viewBox="0 0 16 16"
        width={size}
        height={size}
        style={{ position: "absolute", top: 0, left: 0 }}
        aria-hidden="true"
      >
        <line x1="2" y1="2" x2="14" y2="14" stroke="#ff0000" strokeWidth="2.5" />
        <line x1="14" y1="2" x2="2" y2="14" stroke="#ff0000" strokeWidth="2.5" />
      </svg>
    </span>
  );
}

// ── LED display component ──
function LedDisplay({ value }: { value: string }) {
  return (
    <div
      style={{
        background: MS.ledBg,
        color: MS.ledRed,
        fontFamily: '"Courier Prime", "Courier New", monospace',
        fontSize: "22px",
        fontWeight: 700,
        lineHeight: 1,
        padding: "2px 4px",
        minWidth: "44px",
        textAlign: "right",
        letterSpacing: "2px",
        textShadow: `0 0 6px ${MS.ledRed}`,
        border: `1px solid ${MS.dark}`,
        boxShadow: `inset 1px 1px 0 ${MS.darker}`,
      }}
    >
      {value}
    </div>
  );
}

// ── Main component ──
function Minesweeper() {
  const [difficulty, setDifficulty] = useState<string>("beginner");
  const [board, setBoard] = useState<Cell[][]>(() => {
    const d = DIFFICULTIES.beginner;
    return createEmptyBoard(d.cols, d.rows);
  });
  const [status, setStatus] = useState<GameStatus>("idle");
  const [timer, setTimer] = useState(0);
  const [minesPlaced, setMinesPlaced] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const diff = DIFFICULTIES[difficulty];

  // ── Timer ──
  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTimer((t) => Math.min(t + 1, 999));
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Close menu on outside click ──
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // ── Global mouseup to reset surprised face ──
  useEffect(() => {
    const handler = () => setMouseDown(false);
    document.addEventListener("mouseup", handler);
    return () => document.removeEventListener("mouseup", handler);
  }, []);

  // ── New game ──
  const newGame = useCallback(
    (diffKey?: string) => {
      const key = diffKey ?? difficulty;
      const d = DIFFICULTIES[key];
      setBoard(createEmptyBoard(d.cols, d.rows));
      setStatus("idle");
      setTimer(0);
      setMinesPlaced(false);
      stopTimer();
      if (diffKey && diffKey !== difficulty) {
        setDifficulty(diffKey);
      }
      setMenuOpen(false);
    },
    [difficulty, stopTimer]
  );

  // ── Flag count ──
  const flagCount = board.flat().filter((c) => c.mark === "flag").length;
  const mineDisplay = diff.mines - flagCount;

  // ── Right click (flag/question) ──
  const handleMark = useCallback(
    (row: number, col: number) => {
      if (status === "won" || status === "lost") return;
      const cell = board[row][col];
      if (cell.revealed) return;

      const next = board.map((r) => r.map((c) => ({ ...c })));
      const marks: Mark[] = ["none", "flag", "question"];
      const currentIdx = marks.indexOf(cell.mark);
      next[row][col].mark = marks[(currentIdx + 1) % 3];
      setBoard(next);
    },
    [board, status]
  );

  // ── Chord (middle click / both buttons) ──
  const handleChord = useCallback(
    (row: number, col: number) => {
      if (status !== "playing") return;
      const cell = board[row][col];
      if (!cell.revealed || cell.adjacent === 0) return;

      // Count adjacent flags
      let flagCount = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = row + dr;
          const nc = col + dc;
          if (nr >= 0 && nr < diff.rows && nc >= 0 && nc < diff.cols) {
            if (board[nr][nc].mark === "flag") flagCount++;
          }
        }
      }

      if (flagCount !== cell.adjacent) return;

      // Reveal all unflagged neighbors
      let nextBoard = board.map((r) => r.map((c) => ({ ...c })));
      let hitMine = false;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = row + dr;
          const nc = col + dc;
          if (nr >= 0 && nr < diff.rows && nc >= 0 && nc < diff.cols) {
            const neighbor = nextBoard[nr][nc];
            if (!neighbor.revealed && neighbor.mark !== "flag") {
              if (neighbor.mine) {
                hitMine = true;
              } else {
                nextBoard = floodFill(nextBoard, nr, nc);
              }
            }
          }
        }
      }

      if (hitMine) {
        for (let r = 0; r < diff.rows; r++) {
          for (let c = 0; c < diff.cols; c++) {
            if (nextBoard[r][c].mine) {
              nextBoard[r][c].revealed = true;
            }
          }
        }
        setBoard(nextBoard);
        setStatus("lost");
        stopTimer();
        return;
      }

      if (checkWin(nextBoard)) {
        for (let r = 0; r < diff.rows; r++) {
          for (let c = 0; c < diff.cols; c++) {
            if (nextBoard[r][c].mine && nextBoard[r][c].mark !== "flag") {
              nextBoard[r][c].mark = "flag";
            }
          }
        }
        setBoard(nextBoard);
        setStatus("won");
        stopTimer();
        return;
      }

      setBoard(nextBoard);
    },
    [board, status, diff, stopTimer]
  );

  // ── Smiley ──
  const smiley =
    status === "won" ? <SmileyCool /> :
    status === "lost" ? <SmileyDead /> :
    mouseDown ? <SmileySurprised /> :
    <SmileyNormal />;

  // ── Determine the "hit" mine cell (the one player clicked) ──
  // We track this implicitly: on loss, the first mine that was revealed by the player
  // is the one that wasn't revealed before. Since we reveal all mines on loss,
  // we need to know which one was the trigger. We'll use a ref for this.
  const hitMineRef = useRef<[number, number] | null>(null);

  // Override handleReveal to track hit mine
  const handleRevealTracked = useCallback(
    (row: number, col: number) => {
      if (status === "won" || status === "lost") return;
      const cell = board[row][col];
      if (cell.revealed || cell.mark === "flag") return;

      let nextBoard = board.map((r) => r.map((c) => ({ ...c })));

      if (!minesPlaced) {
        nextBoard = placeMines(nextBoard, diff.cols, diff.rows, diff.mines, row, col);
        setMinesPlaced(true);
        setStatus("playing");
        startTimer();
      }

      if (nextBoard[row][col].mine) {
        hitMineRef.current = [row, col];
        for (let r = 0; r < diff.rows; r++) {
          for (let c = 0; c < diff.cols; c++) {
            if (nextBoard[r][c].mine) {
              nextBoard[r][c].revealed = true;
            }
          }
        }
        setBoard(nextBoard);
        setStatus("lost");
        stopTimer();
        return;
      }

      nextBoard = floodFill(nextBoard, row, col);

      if (checkWin(nextBoard)) {
        for (let r = 0; r < diff.rows; r++) {
          for (let c = 0; c < diff.cols; c++) {
            if (nextBoard[r][c].mine && nextBoard[r][c].mark !== "flag") {
              nextBoard[r][c].mark = "flag";
            }
          }
        }
        setBoard(nextBoard);
        setStatus("won");
        stopTimer();
        return;
      }

      setBoard(nextBoard);
    },
    [board, status, minesPlaced, diff, startTimer, stopTimer]
  );

  // ── Render ──
  return (
    <div
      className="flex flex-col h-full select-none font-body"
      style={{ background: MS.bg, color: MS.black }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* ═══ MENU BAR ═══ */}
      <div
        className="flex items-center px-[2px] shrink-0"
        style={{
          background: MS.bg,
          borderBottom: `1px solid ${MS.dark}`,
          fontSize: "12px",
        }}
      >
        <div ref={menuRef} className="relative">
          <button
            className="px-[6px] py-[1px] hover:bg-[#000080] hover:text-white focus:bg-[#000080] focus:text-white"
            style={{ background: menuOpen ? "#000080" : undefined, color: menuOpen ? "#fff" : undefined }}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Game menu"
            aria-expanded={menuOpen}
          >
            Game
          </button>
          {menuOpen && (
            <div
              className="absolute top-full left-0 z-50"
              style={{
                background: MS.bg,
                border: `2px outset ${MS.light}`,
                boxShadow: `2px 2px 4px rgba(0,0,0,0.3)`,
                minWidth: "160px",
              }}
            >
              {(["beginner", "intermediate", "expert"] as const).map((key) => (
                <button
                  key={key}
                  className="flex items-center gap-2 w-full text-left px-[20px] py-[3px] hover:bg-[#000080] hover:text-white"
                  style={{ fontSize: "12px" }}
                  onClick={() => newGame(key)}
                >
                  <span style={{ width: "12px", display: "inline-block" }}>
                    {difficulty === key ? "●" : ""}
                  </span>
                  {DIFFICULTIES[key].label}
                </button>
              ))}
              <div style={{ borderTop: `1px solid ${MS.dark}`, borderBottom: `1px solid ${MS.light}`, margin: "2px 0" }} />
              <button
                className="w-full text-left px-[20px] py-[3px] hover:bg-[#000080] hover:text-white"
                style={{ fontSize: "12px" }}
                onClick={() => newGame()}
              >
                New
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ STATUS PANEL ═══ */}
      <div
        className="flex items-center justify-between px-[6px] py-[4px] shrink-0 mx-[6px] mt-[6px]"
        style={{
          background: MS.bg,
          border: `3px solid`,
          borderColor: `${MS.dark} ${MS.light} ${MS.light} ${MS.dark}`,
          boxShadow: `inset 1px 1px 0 ${MS.darker}`,
        }}
      >
        <LedDisplay value={formatLed(mineDisplay)} />
        <button
          className="flex items-center justify-center"
          style={{
            width: "28px",
            height: "28px",
            background: MS.bg,
            border: `2px solid`,
            borderColor: `${MS.light} ${MS.dark} ${MS.dark} ${MS.light}`,
            cursor: "pointer",
            padding: 0,
          }}
          onClick={() => newGame()}
          onMouseDown={() => setMouseDown(true)}
          aria-label="New game"
        >
          {smiley}
        </button>
        <LedDisplay value={formatLed(timer)} />
      </div>

      {/* ═══ BOARD ═══ */}
      <div
        className="flex-1 overflow-auto mx-[6px] my-[6px]"
        style={{ background: MS.bg }}
      >
        <div
          style={{
            display: "inline-grid",
            gridTemplateColumns: `repeat(${diff.cols}, 16px)`,
            border: `3px solid`,
            borderColor: `${MS.dark} ${MS.light} ${MS.light} ${MS.dark}`,
            boxShadow: `inset 1px 1px 0 ${MS.darker}`,
            padding: "2px",
            background: MS.bg,
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isHitMine =
                status === "lost" &&
                hitMineRef.current &&
                hitMineRef.current[0] === r &&
                hitMineRef.current[1] === c;

              const isWrongFlag =
                status === "lost" &&
                cell.mark === "flag" &&
                !cell.mine;

              return (
                <button
                  key={`${r}-${c}`}
                  className="flex items-center justify-center"
                  style={{
                    width: "16px",
                    height: "16px",
                    fontSize: "10px",
                    fontWeight: 700,
                    lineHeight: 1,
                    fontFamily: '"Tahoma", "Segoe UI", sans-serif',
                    padding: 0,
                    margin: 0,
                    background: cell.revealed
                      ? isHitMine
                        ? MS.mineHit
                        : MS.bg
                      : MS.bg,
                    border: cell.revealed
                      ? `1px solid ${MS.dark}`
                      : `2px solid`,
                    borderColor: cell.revealed
                      ? undefined
                      : `${MS.light} ${MS.dark} ${MS.dark} ${MS.light}`,
                    cursor: cell.revealed ? "default" : "pointer",
                    ...(cell.revealed && !cell.mine && cell.adjacent > 0
                      ? { color: NUMBER_COLORS[cell.adjacent] }
                      : {}),
                  }}
                  onClick={() => handleRevealTracked(r, c)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleMark(r, c);
                  }}
                  onMouseDown={(e) => {
                    if (e.button === 0 && !cell.revealed) setMouseDown(true);
                  }}
                  onDoubleClick={() => handleChord(r, c)}
                  aria-label={
                    cell.revealed
                      ? cell.mine
                        ? "Mine"
                        : cell.adjacent > 0
                          ? `${cell.adjacent} adjacent mines`
                          : "Empty"
                      : cell.mark === "flag"
                        ? "Flagged"
                        : cell.mark === "question"
                          ? "Question mark"
                          : "Unrevealed"
                  }
                >
                  {cell.revealed ? (
                    cell.mine ? (
                      <MineIcon size={12} />
                    ) : cell.adjacent > 0 ? (
                      cell.adjacent
                    ) : null
                  ) : isWrongFlag ? (
                    <WrongMineIcon size={12} />
                  ) : cell.mark === "flag" ? (
                    <FlagIcon size={12} />
                  ) : cell.mark === "question" ? (
                    <span style={{ color: MS.black, fontWeight: 700, fontSize: "11px" }}>?</span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Minesweeper;