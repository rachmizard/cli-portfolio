import { useState, useEffect, useRef, useCallback } from "react";
import { useRecentlyPlayed } from "../useRecentlyPlayed";

// ── Visualizer bars count ──
const VIS_BARS = 19;

// ── Authentic Winamp 2.9 palette ──
const WA = {
  black: "#000000",
  chromeLight: "#c0c0c0",
  chromeMid: "#808080",
  chromeDark: "#3a3a3a",
  chromeDarker: "#1a1a1a",
  lcdGreen: "#00ff00",
  lcdGreenDim: "#008000",
  lcdGreenDark: "#004000",
  lcdBg: "#000000",
  btnFace: "#585858",
  btnHighlight: "#808080",
  btnShadow: "#2a2a2a",
  btnText: "#c0c0c0",
  sliderTrough: "#1a1a1a",
  sliderFill: "#00ff00",
  sliderThumb: "#808080",
  titlebarBg: "#3a3a3a",
  titlebarText: "#c0c0c0",
} as const;

// ── Component ──
function Winamp() {
  // Playlist sourced from Spotify recently-played (with curated fallback)
  const { tracks: playlist, status } = useRecentlyPlayed();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [visData, setVisData] = useState<number[]>(new Array(VIS_BARS).fill(0));
  const [seeking, setSeeking] = useState(false);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const isSetup = useRef(false);

  const currentTrack = playlist[currentIdx] ?? playlist[0];

  // Reset selection if the playlist changes (e.g. API tracks replace fallback)
  useEffect(() => {
    setCurrentIdx((i) => (i < playlist.length ? i : 0));
  }, [playlist]);

  // ── Audio setup ──
  const setupAudio = useCallback(() => {
    if (isSetup.current) return;
    const audio = audioRef.current;
    if (!audio) return;

    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.7;

    const source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(ctx.destination);

    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    sourceRef.current = source;
    isSetup.current = true;
  }, []);

  // ── Visualizer loop ──
  useEffect(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    const animate = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);
      // Map frequency bins to VIS_BARS bars
      const bars: number[] = [];
      const step = dataArray.length / VIS_BARS;
      for (let i = 0; i < VIS_BARS; i++) {
        const start = Math.floor(i * step);
        const end = Math.floor((i + 1) * step);
        let sum = 0;
        for (let j = start; j < end; j++) sum += dataArray[j];
        bars.push(sum / (end - start) / 255);
      }
      setVisData(bars);
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [currentIdx]); // re-run when track changes

  // ── Playback controls ──
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setupAudio();
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
    audio.play().catch(() => {});
    setPlaying(true);
  }, [setupAudio]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
    setCurrentTime(0);
  }, []);

  const next = useCallback(() => {
    setCurrentIdx((i) => {
      if (shuffle) {
        let next;
        do { next = Math.floor(Math.random() * playlist.length); }
        while (next === i && playlist.length > 1);
        return next;
      }
      return (i + 1) % playlist.length;
    });
  }, [shuffle, playlist.length]);

  const prev = useCallback(() => {
    setCurrentIdx((i) => (i - 1 + playlist.length) % playlist.length);
  }, [playlist.length]);

  // Auto-play when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setupAudio();
    audio.load();
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    }
  }, [currentIdx]); // eslint-disable-line

  // Time update
  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || seeking) return;
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration || 0);
  }, [seeking]);

  // Track ended
  const handleEnded = useCallback(() => {
    if (repeat) {
      const audio = audioRef.current;
      if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
    } else {
      next();
    }
  }, [repeat, next]);

  // Seek
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  }, [duration]);

  // Volume — HORIZONTAL slider (clientX-based)
  const handleVolume = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.volume = ratio;
    setVolume(ratio);
  }, []);

  // Format time
  const fmt = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const hasPreview = !!currentTrack?.previewUrl;

  // ── Spectrum bar color: green→yellow→red gradient ──
  const barColor = (v: number) => {
    if (v < 0.5) {
      // green to yellow
      const t = v / 0.5;
      const r = Math.round(t * 255);
      return `rgb(${r}, 255, 0)`;
    }
    // yellow to red
    const t = (v - 0.5) / 0.5;
    const g = Math.round((1 - t) * 255);
    return `rgb(255, ${g}, 0)`;
  };

  // ── Render ──
  return (
    <div className="wa-window flex flex-col h-full select-none font-body text-[11px]">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={hasPreview ? currentTrack.previewUrl : undefined}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={() => setPlaying(false)}
      />

      {/* ═══ TITLE BAR ═══ */}
      <div className="wa-titlebar flex items-center justify-between px-[4px] h-[16px] shrink-0">
        <span className="text-[#c0c0c0] text-[8px] font-bold tracking-[0.5px] font-body">WINAMP 2.91</span>
        <span className="text-[#00ff00] text-[8px] font-mono" style={{ textShadow: "0 0 4px #00ff00" }}>
          {status === "live" ? "● spotify" : status === "loading" ? "○ syncing…" : "-rachmizard-"}
        </span>
      </div>

      {/* ═══ DISPLAY ═══ */}
      <div className="wa-display mx-[2px] mt-[2px] p-[4px] flex flex-col gap-[1px] min-h-[68px]">
        {/* Large time + track info row */}
        <div className="flex justify-between items-baseline">
          <span className="wa-lcd-time text-[#00ff00] text-[18px] font-mono font-bold leading-none" style={{ textShadow: "0 0 6px #00ff00" }}>
            {hasPreview ? fmt(currentTime) : currentTrack.duration}
          </span>
          <span className="text-[#00ff00] text-[8px] font-mono truncate max-w-[55%] text-right" style={{ textShadow: "0 0 3px #008000" }}>
            {currentTrack.artist} — {currentTrack.title}
          </span>
        </div>
        {/* Bitrate + stereo */}
        <div className="text-[#00ff00] text-[7px] font-mono flex gap-2 mt-px">
          {hasPreview ? <span>128kbps</span> : <span style={{ color: "#008000" }}>no preview</span>}
          <span>44kHz</span>
          <span style={{ color: "#008000" }}>mono</span>
          <span style={{ textShadow: "0 0 4px #00ff00" }}>stereo</span>
        </div>
        {/* Visualizer */}
        <div className="flex items-end gap-px h-[24px] mt-px">
          {visData.map((v, i) => (
            <div
              key={i}
              className="flex-1 transition-all duration-[50ms] rounded-[1px]"
              style={{
                height: `${Math.max(2, v * 100)}%`,
                backgroundColor: barColor(v),
                opacity: 0.5 + v * 0.5,
              }}
            />
          ))}
        </div>
      </div>

      {/* ═══ SEEK BAR ═══ */}
      <div
        className="wa-seek mx-[2px] mt-[2px] h-[10px] flex items-center px-[2px] cursor-pointer"
        onClick={handleSeek}
      >
        <div className="flex-1 h-[4px] relative" style={{ backgroundColor: WA.sliderTrough }}>
          <div
            className="absolute left-0 top-0 bottom-0"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%`, backgroundColor: WA.lcdGreen }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[8px] h-[8px]"
            style={{
              left: `calc(${duration ? (currentTime / duration) * 100 : 0}% - 4px)`,
              backgroundColor: WA.sliderThumb,
              border: `1px solid ${WA.chromeLight}`,
            }}
          />
        </div>
      </div>

      {/* ═══ VOL / BAL (horizontal) ═══ */}
      <div className="flex items-center gap-[4px] mx-[2px] mt-[2px] h-[18px]">
        <span className="text-[#00ff00] text-[7px] font-mono w-[22px] shrink-0" style={{ textShadow: "0 0 3px #008000" }}>VOL</span>
        <div
          className="wa-hslider flex-1 h-[10px] cursor-pointer relative"
          onClick={handleVolume}
        >
          <div
            className="absolute top-0 bottom-0 left-0"
            style={{ width: `${volume * 100}%`, backgroundColor: WA.lcdGreen, opacity: 0.6 }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[6px] h-[10px]"
            style={{
              left: `calc(${volume * 100}% - 3px)`,
              backgroundColor: WA.sliderThumb,
              border: `1px solid ${WA.chromeLight}`,
            }}
          />
        </div>
        <span className="text-[#00ff00] text-[7px] font-mono w-[22px] shrink-0" style={{ textShadow: "0 0 3px #008000" }}>BAL</span>
        <div className="wa-hslider flex-1 h-[10px] relative">
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: "calc(50% - 1px)",
              width: "2px",
              backgroundColor: WA.lcdGreen,
              opacity: 0.4,
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[6px] h-[10px]"
            style={{
              left: "calc(50% - 3px)",
              backgroundColor: WA.sliderThumb,
              border: `1px solid ${WA.chromeLight}`,
            }}
          />
        </div>
      </div>

      {/* ═══ TRANSPORT + CONTROLS ═══ */}
      <div className="flex items-center gap-[1px] p-[3px_4px_2px_4px]">
        {/* Transport buttons */}
        <button onClick={prev} className="wa-btn" title="Previous Track">⏮</button>
        <button
          onClick={playing ? pause : play}
          className={`wa-btn ${playing ? "" : "wa-btn-play"}`}
          title={playing ? "Pause" : "Play"}
          disabled={!hasPreview}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <button onClick={stop} className="wa-btn" title="Stop" disabled={!hasPreview}>⏹</button>
        <button onClick={next} className="wa-btn" title="Next Track">⏭</button>
        <button onClick={stop} className="wa-btn wa-btn-eject text-[6px]" title="Eject">▲</button>

        <div className="flex-1" />

        {/* Shuffle / Repeat */}
        <button
          onClick={() => setShuffle((s) => !s)}
          className={`wa-btn wa-btn-shf text-[7px] w-[28px] ${shuffle ? "wa-toggle-on" : ""}`}
          title="Shuffle"
        >
          SHF
        </button>
        <button
          onClick={() => setRepeat((r) => !r)}
          className={`wa-btn wa-btn-rep text-[7px] w-[28px] ml-[2px] ${repeat ? "wa-toggle-on" : ""}`}
          title="Repeat"
        >
          REP
        </button>
      </div>

      {/* ═══ EQUALIZER ═══ */}
      <div className="wa-eq-section">
        <div className="wa-titlebar flex items-center px-[4px] h-[14px] text-[#c0c0c0] text-[8px] font-bold">
          EQUALIZER
        </div>
        <div className="flex gap-[2px] p-[4px_6px] items-end h-[72px]">
          {[60, 170, 310, 600, "1K", "3K", "6K", "12K", "14K", "16K"].map((hz, i) => {
            const heights = [60, 45, 75, 50, 65, 55, 70, 48, 58, 40];
            const h = heights[i];
            return (
              <div key={i} className="flex flex-col items-center gap-px flex-1 h-full justify-end">
                <div className="wa-eq-slider relative" style={{ height: "48px" }}>
                  <div
                    className="absolute bottom-0 left-px right-px"
                    style={{ height: `${h}%`, backgroundColor: WA.lcdGreen, opacity: 0.4 }}
                  />
                  <div
                    className="absolute left-0 right-0 h-[3px]"
                    style={{
                      bottom: `calc(${h}% - 1.5px)`,
                      backgroundColor: WA.sliderThumb,
                      border: `1px solid ${WA.chromeLight}`,
                    }}
                  />
                </div>
                <span className="text-[#00ff00] text-[6px] font-mono">{hz}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-[4px] mx-[6px] mb-[4px]">
          <button className="wa-pl-btn">Presets</button>
          <span className="text-[#00ff00] text-[7px] font-mono" style={{ textShadow: "0 0 3px #008000" }}>Rock</span>
        </div>
      </div>

      {/* ═══ PLAYLIST ═══ */}
      <div className="wa-pl-section flex-1 flex flex-col min-h-0">
        <div className="wa-titlebar flex items-center px-[4px] h-[14px] text-[#c0c0c0] text-[8px] font-bold shrink-0">
          PLAYLIST
        </div>
        <div className="wa-pl-list wa-scrollbar flex-1 overflow-y-auto mx-[2px] my-[2px] p-[2px] font-mono text-[8px] text-[#00ff00]">
          {playlist.map((track, i) => (
            <div
              key={track.id}
              onClick={() => { setCurrentIdx(i); setPlaying(false); }}
              onDoubleClick={() => { if (track.spotifyUrl) window.open(track.spotifyUrl, "_blank"); }}
              title={track.spotifyUrl ? "Double-click to open in Spotify" : undefined}
              className={`wa-pl-row px-[4px] py-px whitespace-nowrap cursor-pointer ${
                i === currentIdx
                  ? "wa-pl-active"
                  : "wa-pl-row-inactive"
              }`}
            >
              {String(i + 1).padStart(2, " ")}. {track.artist} — {track.title}
              <span className="float-right ml-2">{track.duration}</span>
            </div>
          ))}
        </div>
        <div className="text-[#00ff00] text-[8px] text-right px-[6px] pb-[2px] font-mono" style={{ textShadow: "0 0 3px #008000" }}>
          {playlist.length} tracks — {status === "live" ? "recently played on Spotify" : "curated"}
        </div>
        <div className="flex gap-[3px] p-[2px_3px_3px_3px]">
          <button className="wa-pl-btn">+ Add</button>
          <button className="wa-pl-btn">– Rem</button>
          <button className="wa-pl-btn">Sel</button>
          <button className="wa-pl-btn">Misc</button>
          <button className="wa-pl-btn ml-auto">List</button>
        </div>
      </div>
    </div>
  );
}

export default Winamp;