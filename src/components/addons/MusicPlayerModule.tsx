"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ListMusic, 
  X, 
  Maximize2, 
  Minimize2,
  Disc,
  ArrowLeft,
  MoreHorizontal
} from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  durationSeconds?: number;
  durationString?: string;
}

interface MusicPlayerModuleProps {
  avatarUrl?: string;
  username?: string;
  bio?: string;
  title?: string;
  desc?: string;
  config?: any;
  previewMode?: boolean;
}

export default function MusicPlayerModule({
  avatarUrl = "",
  username = "",
  bio = "",
  title = "",
  desc = "",
  config = {},
  previewMode = false
}: MusicPlayerModuleProps) {
  // Extract custom configuration options
  const initialVolume = typeof config.initialVolume === "number" ? config.initialVolume : 0.8;
  const autoplay = !!config.autoplay;
  const loop = config.loop !== undefined ? !!config.loop : true;
  const vinylSpeed = config.vinylSpeed || "normal";
  const themeType = config.themeType || "light";
  const accentColor = config.accentColor || "#22c55e";
  const showHeader = config.showHeader !== undefined ? !!config.showHeader : true;

  // Process tracks (either multi-track playlist or fallback to single track fields)
  const allTracks: Track[] = React.useMemo(() => {
    if (config.tracks && Array.isArray(config.tracks) && config.tracks.length > 0) {
      return config.tracks.map((t: any, index: number) => ({
        id: `track-${index}`,
        title: t.trackName || `Track ${index + 1}`,
        artist: t.artistName || "Unknown Artist",
        coverUrl: t.albumCoverUrl || config.coverImage || avatarUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
        audioUrl: t.trackUrl || "",
        durationSeconds: 180,
        durationString: t.trackDuration || "3:00"
      }));
    }

    return [{
      id: "main",
      title: config.trackTitle || "Gece Yağmuru",
      artist: config.artistName || "DJ Yağmur",
      coverUrl: config.coverImage || avatarUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
      audioUrl: config.audioUrl || "",
      durationSeconds: 180,
      durationString: "3:00"
    }];
  }, [config, avatarUrl]);

  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const activeTrack = allTracks[activeTrackIndex] || allTracks[0];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [showTrackList, setShowTrackList] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  
  // Audio reactive wave state for visualizer
  const [reactiveHeights, setReactiveHeights] = useState<number[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Initialize visualizer heights
  const TOTAL_BARS = 32;
  useEffect(() => {
    // Generate organic wave heights
    const initial = Array.from({ length: TOTAL_BARS }, (_, i) => {
      const ratio = i / (TOTAL_BARS - 1);
      const sineVal = Math.sin(ratio * Math.PI);
      return Math.max(15, 15 + sineVal * 35 + Math.random() * 20);
    });
    setReactiveHeights(initial);
  }, []);

  // Sync volume with configuration and user choice
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Load new track when selected track changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current && activeTrack?.audioUrl) {
      audioRef.current.src = activeTrack.audioUrl;
      audioRef.current.load();
      if (autoplay && !previewMode) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log("Autoplay blocked:", err));
      }
    }
  }, [activeTrackIndex, activeTrack?.audioUrl, autoplay, previewMode]);

  // Handle animate loop for audio visual reactive heights
  useEffect(() => {
    if (isPlaying) {
      const updateReactiveWave = () => {
        setReactiveHeights((prev) =>
          prev.map((h, i) => {
            const indexFactor = Math.sin((i / TOTAL_BARS) * Math.PI);
            const targetHeight = Math.max(
              12,
              20 + indexFactor * 45 + Math.sin(Date.now() * 0.006 + i * 0.4) * 15 + (Math.random() * 8 - 4)
            );
            return h + (targetHeight - h) * 0.15;
          })
        );
        animationFrameId.current = requestAnimationFrame(updateReactiveWave);
      };
      animationFrameId.current = requestAnimationFrame(updateReactiveWave);
    } else {
      const calmWave = () => {
        setReactiveHeights((prev) =>
          prev.map((h, i) => {
            const indexFactor = Math.sin((i / TOTAL_BARS) * Math.PI);
            const targetHeight = Math.max(10, 15 + indexFactor * 25 + Math.sin(i * 0.5) * 5);
            return h + (targetHeight - h) * 0.1;
          })
        );
      };
      calmWave();
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current || !activeTrack?.audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Audio play failed:", err);
          // Fallback simulation in case URL is dead/blocked
          setIsPlaying(true);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || activeTrack.durationSeconds || 180);
    }
  };

  const handleAudioEnded = () => {
    if (loop) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
      // Auto advance track if in list
      if (allTracks.length > 1) {
        setActiveTrackIndex((prev) => (prev + 1) % allTracks.length);
      }
    }
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercent = clickX / width;
    const newTime = clickPercent * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getRotationClass = () => {
    if (!isPlaying || vinylSpeed === "paused") return "";
    switch (vinylSpeed) {
      case "slow":
        return "animate-[spin_40s_linear_infinite]";
      case "fast":
        return "animate-[spin_8s_linear_infinite]";
      case "normal":
      default:
        return "animate-[spin_18s_linear_infinite]";
    }
  };

  const progressPercent = (currentTime / duration) * 100;

  const getThemeClasses = () => {
    switch (themeType) {
      case "dark":
        return {
          card: "bg-neutral-900 border border-neutral-800 text-neutral-100 shadow-2xl shadow-black/60",
          textHeader: "text-neutral-400",
          textTitle: "text-white font-medium",
          textSub: "text-neutral-400",
          discOverlay: "from-black/90 to-black/40",
          inactiveWave: "bg-neutral-800/60",
          trackItem: "hover:bg-neutral-800 text-neutral-300 hover:text-white",
          trackItemActive: "bg-neutral-800/80 text-white",
          secondaryBtn: "bg-neutral-800 hover:bg-neutral-700 text-neutral-200",
        };
      case "glass":
        return {
          card: "bg-white/80 backdrop-blur-xl border border-white/40 text-neutral-800 shadow-xl shadow-neutral-100/20",
          textHeader: "text-neutral-500",
          textTitle: "text-neutral-800 font-semibold",
          textSub: "text-neutral-500",
          discOverlay: "from-neutral-900/40 to-neutral-900/10",
          inactiveWave: "bg-neutral-300/40",
          trackItem: "hover:bg-white/60 text-neutral-700 hover:text-neutral-900",
          trackItemActive: "bg-white/100 text-neutral-900 border border-neutral-200/50",
          secondaryBtn: "bg-white/60 hover:bg-white/80 text-neutral-700",
        };
      case "neon":
        return {
          card: "bg-zinc-950 border-2 border-green-500/30 text-zinc-100 shadow-[0_0_35px_-5px_rgba(34,197,94,0.15)]",
          textHeader: "text-green-500/70 uppercase tracking-widest text-[10px] font-mono",
          textTitle: "text-white font-bold tracking-tight font-display",
          textSub: "text-zinc-500 font-mono text-[11px]",
          discOverlay: "from-black/80 to-black/30",
          inactiveWave: "bg-zinc-800",
          trackItem: "hover:bg-zinc-900 text-zinc-400 hover:text-green-400",
          trackItemActive: "bg-emerald-950/40 text-green-400 border border-green-500/20",
          secondaryBtn: "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-green-500/30",
        };
      case "light":
      default:
        return {
          card: "bg-white text-neutral-800 shadow-2xl shadow-neutral-200/50 border border-neutral-100",
          textHeader: "text-neutral-600 font-semibold",
          textTitle: "text-neutral-900 font-semibold",
          textSub: "text-neutral-500",
          discOverlay: "from-transparent to-neutral-100/10",
          inactiveWave: "bg-neutral-100",
          trackItem: "hover:bg-neutral-50 text-neutral-700 hover:text-neutral-900",
          trackItemActive: "bg-neutral-100/80 text-neutral-900",
          secondaryBtn: "bg-neutral-100 hover:bg-neutral-200 text-neutral-700",
        };
    }
  };

  const themeStyles = getThemeClasses();

  return (
    <div 
      className={`relative w-full h-full max-w-[390px] mx-auto overflow-hidden rounded-[40px] px-8 pt-7 pb-8 flex flex-col justify-between select-none transition-all ${themeStyles.card}`}
      id="muzik-calar-addon"
    >
      {/* Hidden dynamic HTML Audio */}
      {activeTrack?.audioUrl && (
        <audio
          ref={audioRef}
          src={activeTrack.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
        />
      )}

      {/* Decorative side widgets */}
      <div className="absolute left-[-22px] top-1/2 -translate-y-1/2 w-6 h-28 bg-neutral-100 dark:bg-neutral-800/40 rounded-r-3xl flex items-center justify-end pr-1 pointer-events-none opacity-40">
        <div className="w-1.5 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
      </div>
      <div className="absolute right-[-22px] top-1/2 -translate-y-1/2 w-6 h-28 bg-neutral-100 dark:bg-neutral-800/40 rounded-l-3xl flex items-center justify-start pl-1 pointer-events-none opacity-40">
        <div className="w-1.5 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
      </div>

      {/* 1. Header (Now Playing) */}
      {showHeader && (
        <div className="flex items-center justify-between w-full mb-3" id="player-header">
          <button 
            type="button"
            onClick={() => setShowTrackList(true)}
            className="p-2 -ml-2 transition-transform active:scale-95 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white cursor-pointer border-0 bg-transparent"
            title="Şarkı Listesi"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className={`text-[13px] font-sans font-medium tracking-tight truncate ${themeStyles.textHeader}`}>
            {themeType === "neon" ? "● SYSTEM LIVE-DECK" : "Now playing"}
          </span>
          <button 
            type="button"
            onClick={() => setShowTrackList(!showTrackList)}
            className="p-2 -mr-2 transition-transform active:scale-95 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white cursor-pointer border-0 bg-transparent"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 2. Visual Spinning Vinyl Disc */}
      <div className="flex-1 flex items-center justify-center my-4 relative group" id="player-vinyl-disk">
        <div className="relative w-[220px] h-[220px] md:w-[235px] md:h-[235px] rounded-full p-2 flex items-center justify-center bg-neutral-900/5 dark:bg-black/40 shadow-inner animate-fade-in">
          
          {/* Main Album / Vinyl Body with rotation */}
          <div 
            className={`relative w-full h-full rounded-full overflow-hidden shadow-2xl transition-transform duration-700 ${getRotationClass()}`}
            style={{ 
              background: `radial-gradient(circle, #1c1c1c 0%, #111111 60%, #080808 100%)`,
              boxShadow: "0 10px 30px -5px rgba(0,0,0,0.4)"
            }}
          >
            {/* Grooves */}
            <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#606060" strokeWidth="0.1" />
              <circle cx="50" cy="50" r="41" fill="none" stroke="#505050" strokeWidth="0.1" />
              <circle cx="50" cy="50" r="36" fill="none" stroke="#404040" strokeWidth="0.12" />
              <circle cx="50" cy="50" r="31" fill="none" stroke="#404040" strokeWidth="0.12" />
              <circle cx="50" cy="50" r="26" fill="none" stroke="#505050" strokeWidth="0.1" />
              <circle cx="50" cy="50" r="21" fill="none" stroke="#606060" strokeWidth="0.1" />
            </svg>

            {/* Glowing Decorative Spirals */}
            <div className="absolute inset-0 rounded-full overflow-hidden opacity-90 mix-blend-screen pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                <circle 
                  cx="100" 
                  cy="100" 
                  r="78" 
                  stroke={accentColor} 
                  strokeWidth="0.8" 
                  strokeDasharray="4,6,15,4,2,8" 
                  className="opacity-60"
                />
                <circle 
                  cx="100" 
                  cy="100" 
                  r="68" 
                  stroke={accentColor} 
                  strokeWidth="1.2" 
                  strokeDasharray="12,8,22,6,10,12" 
                  className="opacity-75"
                />
                <circle 
                  cx="100" 
                  cy="100" 
                  r="58" 
                  stroke={accentColor} 
                  strokeWidth="2.2" 
                  strokeDasharray="40,24,15,8" 
                  className="opacity-90"
                />
                <circle 
                  cx="100" 
                  cy="100" 
                  r="48" 
                  stroke={accentColor} 
                  strokeWidth="1.5" 
                  strokeDasharray="18,12" 
                  className="opacity-45"
                />
              </svg>
            </div>

            {/* Album Cover Central Label */}
            <div className="absolute inset-[35%] rounded-full overflow-hidden bg-neutral-950 border-[3px] border-neutral-900 shadow-xl">
              <img 
                src={activeTrack?.coverUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80"} 
                alt={activeTrack?.title || "Album Cover"} 
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors" />
            </div>
          </div>

          {/* Central Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            className="absolute z-20 w-[60px] h-[60px] md:w-[65px] md:h-[65px] rounded-full bg-white select-none text-neutral-950 flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.22)] border-2 border-white/50 cursor-pointer hover:scale-105 active:scale-95 transition-all"
            id="play-pause-vinyl-button"
            title={isPlaying ? "Durdur" : "Başlat"}
          >
            {isPlaying ? (
              <div className="flex items-center gap-1">
                <div className="w-[4px] h-5 bg-neutral-900 rounded-full animate-bounce [animation-duration:1s]" />
                <div className="w-[4px] h-5 bg-neutral-900 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                <div className="w-[4px] h-5 bg-neutral-900 rounded-full animate-bounce [animation-duration:1.1s] [animation-delay:0.4s]" />
              </div>
            ) : (
              <Play className="w-6 h-6 fill-neutral-900 text-neutral-900 ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* 3. Text Section (Title & Subtitle) */}
      <div className="text-center mt-3 mb-4 select-text animate-fade-in" id="player-track-info">
        <h2 className={`text-[21px] md:text-[23px] font-sans font-extrabold tracking-tight truncate px-4 leading-tight ${themeStyles.textTitle}`}>
          {activeTrack?.title || "Bilinmeyen Şarkı"}
        </h2>
        <p className={`text-[12px] md:text-[13px] font-sans font-medium tracking-wide mt-1.5 opacity-80 ${themeStyles.textSub}`}>
          {activeTrack?.artist || "Bilinmeyen Sanatçı"}
        </p>
      </div>

      {/* 4. Animated Waveform Player */}
      <div className="w-full select-none" id="player-visual-waveform">
        <div 
          onClick={handleWaveformClick}
          className="h-14 w-full flex items-center justify-between gap-[3px] px-1 cursor-pointer overflow-hidden rounded-xl relative group"
        >
          {hoverIndex !== null && (
            <div 
              className="absolute bottom-full mb-1.5 px-2 py-0.5 bg-neutral-900 text-white rounded text-[10px] font-mono pointer-events-none shadow z-25"
              style={{ left: `calc(${(hoverIndex / TOTAL_BARS) * 100}% - 16px)` }}
            >
              {formatTime((hoverIndex / TOTAL_BARS) * duration)}
            </div>
          )}

          {reactiveHeights.map((h, i) => {
            const barProgress = (i / TOTAL_BARS) * 100;
            const isCompleted = barProgress <= progressPercent;

            return (
              <div
                key={i}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                className="flex-1 flex flex-col justify-center h-full transition-all duration-150"
              >
                <span 
                  style={{
                    height: `${h / 2}px`,
                    backgroundColor: isCompleted ? accentColor : undefined,
                  }}
                  className={`w-full rounded-t-sm transition-colors duration-300 ${!isCompleted ? themeStyles.inactiveWave : ""}`}
                />
                <span 
                   style={{
                     height: `${h / 2}px`,
                     backgroundColor: isCompleted ? accentColor : undefined,
                   }}
                   className={`w-full rounded-b-sm opacity-65 transition-colors duration-300 transform scale-y-75 pb-0.5 ${!isCompleted ? themeStyles.inactiveWave : ""}`}
                />
              </div>
            );
          })}
        </div>

        {/* Timestamps */}
        <div className="flex items-center justify-center font-mono text-[11px] mt-2.5 text-neutral-400 dark:text-neutral-500 font-medium" id="waveform-timestamps">
          <span className="tabular-nums" style={{ color: accentColor }}>{formatTime(currentTime)}</span>
          <span className="mx-2 text-neutral-300 dark:text-neutral-800">|</span>
          <span className="tabular-nums">{activeTrack?.durationString || formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume slider row */}
      <div className="mt-4 flex items-center justify-between gap-2 px-1 text-neutral-400">
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer border-0 bg-transparent text-inherit"
          title={isMuted ? "Sesi Aç" : "Sesi Kapat"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Volume range slider */}
        <div className="flex-1 max-w-[120px] flex items-center px-1">
          <input 
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg cursor-pointer appearance-none outline-none"
            style={{ accentColor: accentColor }}
          />
        </div>

        {/* Queue / Tracks Selector */}
        <button
          type="button"
          onClick={() => setShowTrackList(true)}
          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 text-xs text-neutral-500 cursor-pointer border-0 bg-transparent"
          title="Şarkı Listesi"
        >
          <ListMusic className="w-4 h-4" />
          <span className="font-sans font-medium hover:underline">Sıra</span>
        </button>
      </div>

      {/* Playlist Drawer */}
      <div 
        className={`absolute z-35 inset-x-0 bottom-0 h-[80%] rounded-t-[30px] p-6 shadow-2xl flex flex-col justify-between transition-all duration-300 transform ${
          showTrackList 
            ? "translate-y-0 opacity-100 visible" 
            : "translate-y-full opacity-0 invisible"
        } ${
          themeType === "dark" || themeType === "neon" ? "bg-neutral-900/98 backdrop-blur-md border-t border-neutral-800" : "bg-white/98 backdrop-blur-md border-t border-neutral-200"
        }`}
      >
        <div className="w-full flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b pb-3 border-neutral-100 dark:border-neutral-800">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-inherit">
              <ListMusic className="w-4 h-4" style={{ color: accentColor }} />
              Müzik Listesi
            </h3>
            <button 
              type="button"
              onClick={() => setShowTrackList(false)}
              className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer border-0 bg-transparent"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {allTracks.map((t, idx) => {
              const isActive = idx === activeTrackIndex;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTrackIndex(idx);
                    setShowTrackList(false);
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer border-0 bg-transparent ${
                    isActive ? themeStyles.trackItemActive : themeStyles.trackItem
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-150 relative">
                    <img src={t.coverUrl} className="w-full h-full object-cover" alt={t.title} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold truncate flex items-center gap-1.5 text-inherit">
                      {t.title}
                      {isActive && isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />}
                    </h4>
                    <p className="text-[10px] opacity-70 truncate mt-0.5 text-inherit">{t.artist}</p>
                  </div>
                  <span className="text-[10px] font-mono opacity-80 pl-2 text-inherit">{t.durationString}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-150 dark:border-neutral-850">
          <button
            type="button"
            onClick={() => setShowTrackList(false)}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-center transition-all bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-inherit cursor-pointer border-0"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
