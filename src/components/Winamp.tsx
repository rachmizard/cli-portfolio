import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ──
interface Track {
  id: string;
  artist: string;
  title: string;
  duration: string;
  previewUrl: string;
  album?: string;
}

// ── Demo tracks with Spotify preview URLs ──
const DEMO_TRACKS: Track[] = [
  {
    id: "1",
    artist: "Daft Punk",
    title: "Something About Us",
    duration: "3:52",
    previewUrl: "https://p.scdn.co/mp3-preview/4c94b54f75076a19b0c2d4778e1e2a1a0ebf5e9b",
    album: "Discovery",
  },
  {
    id: "2",
    artist: "Tame Impala",
    title: "The Less I Know The Better",
    duration: "3:38",
    previewUrl: "https://p.scdn.co/mp3-preview/9f48ae5d747ad3c3bc0ea6d8c4bf60f4542a1e1e",
    album: "Currents",
  },
  {
    id: "3",
    artist: "Mac DeMarco",
    title: "Chamber of Reflection",
    duration: "3:52",
    previewUrl: "https://p.scdn.co/mp3-preview/30c4b1b23b68523b38bb2a25b1e2b0245d7391da",
    album: "Salad Days",
  },
  {
    id: "4",
    artist: "Gorillaz",
    title: "On Melancholy Hill",
    duration: "3:53",
    previewUrl: "https://p.scdn.co/mp3-preview/c8b6c5a1e5c2e5b8b8b8b8b8b8b8b8b8b8b8b8b8",
    album: "Plastic Beach",
  },
  {
    id: "5",
    artist: "MGMT",
    title: "Electric Feel",
    duration: "3:49",
    previewUrl: "https://p.scdn.co/mp3-preview/d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4",
    album: "Oracular Spectacular",
  },
  {
    id: "6",
    artist: "The Strokes",
    title: "Reptilia",
    duration: "3:41",
    previewUrl: "",
    album: "Room on Fire",
  },
  {
    id: "7",
    artist: "Arctic Monkeys",
    title: "Do I Wanna Know?",
    duration: "4:33",
    previewUrl: "",
    album: "AM",
  },
  {
    id: "8",
    artist: "Tame Impala",
    title: "Let It Happen",
    duration: "7:47",
    previewUrl: "",
    album: "Currents",
  },
];

// ── Visualizer bars count ──
const VIS_BARS = 19;

// ── Component ──
function Winamp() {
  // State
  const [playlist] = useState<Track[]>(DEMO_TRACKS);
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

  const currentTrack = playlist[currentIdx];

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

  // Volume
  const handleVolume = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = 1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
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

  // ── Render ──
  return (
    <div className="flex flex-col h-full bg-[#1a1a2e] select-none font-body text-[11px]">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={hasPreview ? currentTrack.previewUrl : undefined}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={() => setPlaying(false)}
      />

      {/* ═══ TITLE BAR ═══ */}
      <div className="wa-titlebar-small flex items-center justify-between px-[3px] h-[14px] bg-gradient-to-b from-[#3a3a5e] to-[#1a1a2e] border-b border-[#0a0a1e] shrink-0">
        <span className="text-[#a0a0c0] text-[8px] font-bold tracking-[0.5px]">WINAMP 2.91</span>
        <span className="text-[#20ff60] text-[8px] font-mono">-rachmizard-</span>
      </div>

      {/* ═══ DISPLAY ═══ */}
      <div className="mx-[3px] mt-[3px] bg-[#0a0a12] border border-[#3a3a5e] p-[3px_4px] flex flex-col gap-[2px] min-h-[67px]">
        {/* Track info */}
        <div className="flex justify-between items-center">
          <span className="text-[#20ff60] text-[9px] font-mono font-bold tracking-[0.5px] truncate max-w-[160px]">
            {currentTrack.artist} — {currentTrack.title}
          </span>
          <span className="text-[#20ff60] text-[8px] font-mono min-w-[55px] text-right">
            {fmt(currentTime)} / {hasPreview ? fmt(duration || 0) : currentTrack.duration}
          </span>
        </div>
        {/* Bitrate + stereo */}
        <div className="text-[#20ff60] text-[7px] font-mono flex gap-2">
          {hasPreview ? <span>128 kbps</span> : <span>no preview</span>}
          <span>44 kHz</span>
          <span className="opacity-40">mono</span>
          <span className="drop-shadow-[0_0_3px_#20ff60]">stereo</span>
        </div>
        {/* Visualizer */}
        <div className="flex items-end gap-px h-[24px] mt-px">
          {visData.map((v, i) => (
            <div
              key={i}
              className="flex-1 transition-all duration-[50ms]"
              style={{
                height: `${Math.max(2, v * 100)}%`,
                backgroundColor: v > 0.7 ? "#ff4040" : "#20ff60",
                opacity: 0.4 + v * 0.6,
              }}
            />
          ))}
        </div>
      </div>

      {/* ═══ SEEK BAR ═══ */}
      <div
        className="mx-[3px] mt-[2px] h-[11px] bg-[#1a1a2e] border border-[#3a3a5e] flex items-center px-[2px] cursor-pointer"
        onClick={handleSeek}
      >
        <div className="flex-1 h-[5px] bg-[#2a2a3e] relative">
          <div
            className="absolute left-0 top-0 bottom-0 bg-[#20ff60]"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-[#3a3a5e] border border-[#6a6a8e]"
            style={{ left: `calc(${duration ? (currentTime / duration) * 100 : 0}% - 5px)` }}
          />
        </div>
      </div>

      {/* ═══ TRANSPORT + CONTROLS ═══ */}
      <div className="flex items-center gap-0 p-[2px_3px_3px_3px] bg-[#1a1a2e]">
        {/* Transport buttons */}
        <div className="flex gap-[2px] mr-[4px]">
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
        </div>

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

        {/* Volume + Balance sliders */}
        <div className="flex gap-[6px] ml-auto items-center">
          <div className="flex flex-col items-center gap-0">
            <span className="text-[#20ff60] text-[6px] font-mono mb-px">VOL</span>
            <div
              className="w-[12px] h-[38px] bg-[#0a0a12] border border-[#3a3a5e] relative cursor-pointer"
              onClick={handleVolume}
            >
              <div
                className="absolute bottom-0 left-px right-px bg-[#20ff60] opacity-60"
                style={{ height: `${volume * 100}%` }}
              />
              <div
                className="absolute left-0 right-0 h-[4px] bg-[#3a3a5e] border border-[#6a6a8e]"
                style={{ bottom: `calc(${volume * 100}% - 2px)` }}
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-0">
            <span className="text-[#20ff60] text-[6px] font-mono mb-px">BAL</span>
            <div className="w-[12px] h-[38px] bg-[#0a0a12] border border-[#3a3a5e] relative cursor-default">
              <div className="absolute bottom-0 left-px right-px bg-[#20ff60] opacity-40" style={{ height: "50%" }} />
              <div className="absolute left-0 right-0 h-[4px] bg-[#3a3a5e] border border-[#6a6a8e]" style={{ bottom: "calc(50% - 2px)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ EQUALIZER ═══ */}
      <div className="border-t border-[#3a3a5e] mt-[1px]">
        <div className="wa-titlebar-small flex items-center px-[3px] h-[14px] bg-gradient-to-b from-[#3a3a5e] to-[#1a1a2e] text-[#a0a0c0] text-[8px] font-bold">
          EQUALIZER
        </div>
        <div className="flex gap-[2px] p-[4px_6px] items-end h-[72px]">
          {[60, 170, 310, 600, "1K", "3K", "6K", "12K", "14K", "16K"].map((hz, i) => {
            const heights = [60, 45, 75, 50, 65, 55, 70, 48, 58, 40];
            const h = heights[i];
            return (
              <div key={i} className="flex flex-col items-center gap-px flex-1 h-full justify-end">
                <div className="w-[12px] h-[48px] bg-[#0a0a12] border border-[#3a3a5e] relative">
                  <div className="absolute bottom-0 left-px right-px bg-[#20ff60] opacity-40" style={{ height: `${h}%` }} />
                  <div className="absolute left-0 right-0 h-[3px] bg-[#3a3a5e] border border-[#6a6a8e]" style={{ bottom: `calc(${h}% - 1.5px)` }} />
                </div>
                <span className="text-[#20ff60] text-[6px] font-mono">{hz}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-[4px] mx-[6px] mb-[4px]">
          <button className="h-[16px] px-[6px] bg-[#2a2a4e] border border-[#5a5a7e] text-[#20ff60] text-[7px] cursor-pointer">Presets</button>
          <span className="text-[#20ff60] text-[7px]">Rock</span>
        </div>
      </div>

      {/* ═══ PLAYLIST ═══ */}
      <div className="border-t border-[#3a3a5e] flex-1 flex flex-col min-h-0">
        <div className="wa-titlebar-small flex items-center px-[3px] h-[14px] bg-gradient-to-b from-[#3a3a5e] to-[#1a1a2e] text-[#a0a0c0] text-[8px] font-bold shrink-0">
          PLAYLIST
        </div>
        <div className="flex-1 overflow-y-auto bg-[#0a0a12] mx-[3px] my-[2px] border border-[#3a3a5e] p-[2px] font-mono text-[8px] text-[#20ff60] wa-scrollbar">
          {playlist.map((track, i) => (
            <div
              key={track.id}
              onClick={() => { setCurrentIdx(i); setPlaying(false); }}
              className={`px-[4px] py-px whitespace-nowrap cursor-pointer ${
                i === currentIdx
                  ? "bg-[#20ff60] text-[#0a0a12]"
                  : "hover:bg-[#1a3a1e]"
              }`}
            >
              {String(i + 1).padStart(2, " ")}. {track.artist} — {track.title}
              <span className="float-right ml-2">{track.duration}</span>
            </div>
          ))}
        </div>
        <div className="text-[#20ff60] text-[8px] text-right px-[6px] pb-[2px] font-mono">
          {playlist.length} tracks — {currentTrack.duration} total (preview)
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
export { DEMO_TRACKS };
