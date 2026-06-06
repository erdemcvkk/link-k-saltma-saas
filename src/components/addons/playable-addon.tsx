"use client";

import React, { useState, useEffect, useRef } from "react";
import { Music, Play, Pause, Clock, MessageCircle, Image, Star, ArrowLeft } from "lucide-react";

function getMediaEmbed(url: string, accentColor?: string, playing?: boolean, onClose?: () => void) {
  if (!url) return null;
  const trimmed = url.trim();
  
  // Spotify track/album/playlist/episode — always show widget (no autoplay support)
  const spotifyMatch = trimmed.match(/open\.spotify\.com\/(?:[a-zA-Z0-9_-]+\/)?(track|album|playlist|episode)\/([a-zA-Z0-9]+)/i);
  if (spotifyMatch) {
    return (
      <div className="w-full rounded-xl overflow-hidden shadow-lg my-2">
        <iframe
          src={"https://open.spotify.com/embed/" + spotifyMatch[1] + "/" + spotifyMatch[2] + "?utm_source=generator&theme=0"}
          width="100%"
          height={spotifyMatch[1] === "track" || spotifyMatch[1] === "episode" ? 152 : 352}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-xl"
        />  
      </div>
    );
  }
  
  // YouTube, SoundCloud, Apple Music — only show embed when user clicks play (with autoplay)
  if (!playing) return null;

  const closeButton = onClose ? (
    <button
      onClick={(e) => { e.stopPropagation(); onClose(); }}
      className="absolute top-2 right-2 z-20 px-2.5 py-1.5 bg-black/80 hover:bg-black text-white text-[10px] font-bold rounded-lg border border-white/20 backdrop-blur-sm cursor-pointer flex items-center gap-1.5 shadow-lg transition-all"
    >
      ✕ Kapat
    </button>
  ) : null;
  
  // YouTube
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (ytMatch) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg my-2 relative">
        {closeButton}
        <iframe
          src={"https://www.youtube.com/embed/" + ytMatch[1] + "?autoplay=1"}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-xl"
        />
      </div>
    );
  }
  
  // SoundCloud
  if (trimmed.includes("soundcloud.com/")) {
    const encodedUrl = encodeURIComponent(trimmed);
    return (
      <div className="w-full rounded-xl overflow-hidden shadow-lg my-2 relative">
        {closeButton}
        <iframe
          width="100%"
          height={166}
          scrolling="no"
          frameBorder="0"
          allow="autoplay"
          src={"https://w.soundcloud.com/player/?url=" + encodedUrl + "&color=" + (accentColor ? accentColor.replace("#", "%23") : "%23ff5500") + "&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"}
          className="rounded-xl"
        />
      </div>
    );
  }
  
  // Apple Music
  const appleMusicMatch = trimmed.match(/music\.apple\.com\/([a-z]{2})\/(?:album|playlist)\/(?:[^/]+\/)?([a-zA-Z0-9.]+)/i);
  if (appleMusicMatch) {
    return (
      <div className="w-full rounded-xl overflow-hidden shadow-lg my-2 relative">
        {closeButton}
        <iframe
          allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
          frameBorder="0"
          height={175}
          width="100%"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
          src={"https://embed.music.apple.com/" + appleMusicMatch[1] + "/album/" + appleMusicMatch[2]}
          className="rounded-xl"
        />
      </div>
    );
  }

  return null;
}

interface PlayableAddonProps {
  type: string;
  avatarUrl: string;
  username: string;
  bio: string;
  title: string;
  desc: string;
  config: any;
}

export default function PlayableAddon({
  type,
  avatarUrl,
  username,
  bio,
  title,
  desc,
  config = {},
}: PlayableAddonProps) {
  // ── TRACKS DATA PARSING ──
  const tracks = Array.isArray(config.tracks) && config.tracks.length > 0 
    ? config.tracks 
    : [
        {
          trackUrl: config.trackUrl || "",
          trackName: config.trackName || title,
          artistName: config.artistName || desc,
          albumCoverUrl: config.albumCoverUrl || "",
          trackDuration: config.trackDuration || "3:45"
        }
      ];

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // ── AUDIO STATES (declared early so mediaEmbed can reference isPlaying) ──
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── VIDEO STATES ──
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Reset track index if tracks array changes length
  useEffect(() => {
    setCurrentTrackIndex(0);
    setIsPlaying(false);
  }, [tracks.length]);

  const activeTrack = tracks[currentTrackIndex] || tracks[0] || {};
  const url = (activeTrack.trackUrl || "").trim();
  const isDirectAudio = /\.(mp3|wav|ogg|m4a|aac|flac)(\?.*)?$/i.test(url);
  const isEmbeddable = /open\.spotify\.com|youtube\.com|youtu\.be|soundcloud\.com|music\.apple\.com/i.test(url);
  const mediaEmbed = !isDirectAudio ? getMediaEmbed(url, config.accentColor, isPlaying, () => setIsPlaying(false)) : null;

  // ── VIDEOS DATA PARSING ──
  const videos = Array.isArray(config.videos) && config.videos.length > 0 
    ? config.videos 
    : [
        {
          videoUrl: config.videoUrl || "",
          coverUrl: config.coverUrl || "",
          title: config.title || title,
          description: config.description || desc,
          actionUrl: config.actionUrl || "",
          buttonText: config.buttonText || "Tamamını İzle"
        }
      ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Reset video index if videos array changes length
  useEffect(() => {
    setCurrentVideoIndex(0);
    setIsVideoPlaying(false);
  }, [videos.length]);

  const activeVideo = videos[currentVideoIndex] || videos[0] || {};

  // ── COUNTDOWN STATE ──
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // ── COUNTDOWN TIMER LOGIC ──
  useEffect(() => {
    if (type !== "COUNTDOWN_LAUNCH") return;

    const calculateTime = () => {
      const now = new Date();
      const target = config.targetDate ? new Date(config.targetDate) : new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      const diff = Math.max(0, target.getTime() - now.getTime());

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [type, config.targetDate]);

  // ── EXTERNAL AUDIO PROGRESS SIMULATOR ──
  useEffect(() => {
    if (isDirectAudio || !isPlaying) return;

    const mockDuration = 225; // 3:45
    setDuration(mockDuration);

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= mockDuration) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isDirectAudio]);

  // ── AUDIO PLAYBACK SYNC ──
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && isDirectAudio) {
      audioRef.current.play().catch((err) => {
        console.error("Audio playback error:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isDirectAudio, url]);

  // Handle URL change
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [url]);

  const handlePlayPause = () => {
    if (!url) return;
    setIsPlaying(!isPlaying);
  };

  // Video play handler (for FUTURE_WAVE, CINEMATIC_THEATER)
  const handleVideoPlayPause = () => {
    const videoUrl = (activeVideo.videoUrl || '').trim();
    if (!videoUrl) return;
    setIsPlaying(!isPlaying);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickRatio = clickX / width;
    const newTime = clickRatio * (duration || 225);
    
    if (isDirectAudio && audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Progress calculations
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  // Render function helper for play button inside theme
  const renderThemePlayButton = (accentColor = "#22c55e", sizeClass = "w-12 h-12", iconSize = 18) => {
    const showPause = isPlaying;
    return (
      <button
        onClick={handlePlayPause}
        className={`${sizeClass} rounded-full flex items-center justify-center text-black border-0 shadow-lg cursor-pointer transition-transform active:scale-95 shrink-0`}
        style={{ backgroundColor: accentColor }}
      >
        {showPause ? (
          <Pause size={iconSize} className="fill-black" />
        ) : (
          <Play size={iconSize} className="ml-0.5 fill-black" />
        )}
      </button>
    );
  };

  // Render actual video component for PREMIUM_VIDEO inline play
  const renderVideoPlayer = () => {
    const videoUrl = (activeVideo.videoUrl || "").trim();
    if (!videoUrl) return null;

    // YouTube (handles watch?v=, embed/, shorts/, v/, music.youtube.com, youtu.be/)
    const ytMatch = videoUrl.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    if (ytMatch) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full object-cover"
        />
      );
    }

    // Direct video file
    if (/\.(mp4|webm|mov)(\?.*)?$/i.test(videoUrl)) {
      return (
        <video controls autoPlay className="w-full h-full object-cover">
          <source src={videoUrl} />
          Tarayıcınız video oynatmayı desteklemiyor.
        </video>
      );
    }

    return null;
  };

  const renderPlaylist = (themeType: string) => {
    if (tracks.length <= 1) return null;

    let containerClass = "";
    let itemClass = "";
    let activeItemClass = "";
    let textClass = "";
    let subtextClass = "";
    let durationClass = "";

    switch (themeType) {
      case "SPOTIFY_CLASSIC":
        containerClass = "mt-4 bg-zinc-900 border border-zinc-850 rounded-2xl p-3 max-h-48 overflow-y-auto no-scrollbar";
        itemClass = "flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-800/60 cursor-pointer transition-colors";
        activeItemClass = "bg-zinc-800 border-l-4 border-green-500";
        textClass = "text-xs font-bold text-white truncate";
        subtextClass = "text-[10px] text-zinc-400 truncate";
        durationClass = "text-[10px] text-zinc-500 font-mono ml-auto";
        break;
      case "VINYL_RETRO":
        containerClass = "mt-4 bg-stone-950/80 border border-stone-850 rounded-2xl p-3 max-h-48 overflow-y-auto no-scrollbar";
        itemClass = "flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-900/60 cursor-pointer transition-colors";
        activeItemClass = "bg-stone-900 border-l-4 border-orange-400";
        textClass = "text-xs font-bold text-stone-200 truncate";
        subtextClass = "text-[10px] text-stone-500 truncate";
        durationClass = "text-[10px] text-stone-600 font-mono ml-auto";
        break;
      case "GLASS_AUDIO":
        containerClass = "mt-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 max-h-48 overflow-y-auto no-scrollbar";
        itemClass = "flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors";
        activeItemClass = "bg-white/20 border-l-4 border-white";
        textClass = "text-xs font-bold text-white truncate";
        subtextClass = "text-[10px] text-purple-100/70 truncate";
        durationClass = "text-[10px] text-purple-200 font-mono ml-auto";
        break;
      case "NEON_CYBERPUNK":
        containerClass = "mt-4 bg-black border border-pink-500/30 rounded-none p-3 max-h-48 overflow-y-auto no-scrollbar";
        itemClass = "flex items-center gap-3 p-2.5 border border-transparent hover:border-cyan-400/30 hover:bg-zinc-950 cursor-pointer transition-all";
        activeItemClass = "border-cyan-400 bg-zinc-950/80";
        textClass = "text-xs font-black uppercase tracking-wider text-cyan-400 truncate";
        subtextClass = "text-[9px] uppercase tracking-wide text-pink-400 truncate";
        durationClass = "text-[9px] text-cyan-500/80 font-mono ml-auto";
        break;
      case "MINIMAL_LIGHT_AUDIO":
        containerClass = "mt-4 bg-white border border-slate-200 rounded-2xl p-3 max-h-48 overflow-y-auto no-scrollbar shadow-sm";
        itemClass = "flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors";
        activeItemClass = "bg-slate-100 border-l-4 border-slate-700";
        textClass = "text-xs font-bold text-slate-800 truncate";
        subtextClass = "text-[10px] text-slate-500 truncate";
        durationClass = "text-[10px] text-slate-400 font-mono ml-auto";
        break;
      case "MUSIC_PODCAST":
        containerClass = "mt-4 bg-purple-950/40 backdrop-blur-sm border border-purple-500/25 rounded-2xl p-3 max-h-48 overflow-y-auto no-scrollbar";
        itemClass = "flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-900/30 cursor-pointer transition-colors";
        activeItemClass = "bg-purple-900/50 border-l-4 border-pink-500";
        textClass = "text-xs font-bold text-white truncate";
        subtextClass = "text-[10px] text-purple-300 truncate";
        durationClass = "text-[10px] text-purple-400 font-mono ml-auto";
        break;
      case "RETRO_CASSETTE":
        containerClass = "mt-4 bg-stone-900/60 border border-amber-900/30 rounded-xl p-3 max-h-48 overflow-y-auto no-scrollbar";
        itemClass = "flex items-center gap-3 p-2.5 rounded-lg hover:bg-stone-800/40 cursor-pointer transition-colors";
        activeItemClass = "bg-[#2e1d1b] border-l-4 border-amber-500";
        textClass = "text-xs font-bold text-amber-100 truncate";
        subtextClass = "text-[10px] text-amber-500/80 truncate";
        durationClass = "text-[10px] text-amber-600 font-mono ml-auto";
        break;
      case "MINIMAL_DARK_AUDIO":
        containerClass = "mt-4 bg-black border border-zinc-900 rounded-none p-3 max-h-48 overflow-y-auto no-scrollbar";
        itemClass = "flex items-center gap-3 p-2.5 border border-transparent hover:border-zinc-800 cursor-pointer transition-all";
        activeItemClass = "bg-zinc-950 border border-white";
        textClass = "text-xs font-medium text-white truncate";
        subtextClass = "text-[10px] text-zinc-500 truncate";
        durationClass = "text-[10px] text-zinc-400 font-mono ml-auto";
        break;
      case "VINTAGE_RADIO":
        containerClass = "mt-4 bg-[#1c0f0d] border border-amber-900/20 rounded-xl p-3 max-h-48 overflow-y-auto no-scrollbar";
        itemClass = "flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#2c1a17]/45 cursor-pointer transition-colors";
        activeItemClass = "bg-[#2c1a17] border-l-4 border-amber-600";
        textClass = "text-xs font-bold text-amber-100/90 truncate";
        subtextClass = "text-[10px] text-amber-600/70 truncate";
        durationClass = "text-[10px] text-amber-700 font-mono ml-auto";
        break;
      default:
        containerClass = "mt-4 bg-zinc-900 rounded-2xl p-3 max-h-48 overflow-y-auto";
        itemClass = "flex items-center gap-3 p-2 hover:bg-zinc-800 cursor-pointer";
        activeItemClass = "bg-zinc-800";
        textClass = "text-xs text-white truncate";
        subtextClass = "text-[10px] text-zinc-400 truncate";
        durationClass = "text-[10px] text-zinc-500 ml-auto";
    }

    return (
      <div className={containerClass}>
        <div className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-60 px-1 text-inherit">
          {config.lang === "tr" ? "Çalma Listesi" : "Playlist"} ({tracks.length})
        </div>
        <div className="space-y-1.5">
          {tracks.map((t: any, idx: number) => {
            const isActive = idx === currentTrackIndex;
            return (
              <div
                key={idx}
                onClick={() => {
                  setCurrentTrackIndex(idx);
                  setIsPlaying(false);
                }}
                className={`${itemClass} ${isActive ? activeItemClass : ""}`}
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-850 overflow-hidden flex-shrink-0 relative">
                  <img
                    src={t.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&q=80"}
                    className="w-full h-full object-cover"
                    alt="cover"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Play size={10} className="fill-white text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={textClass}>{t.trackName || (config.lang === "tr" ? "Bilinmeyen Parça" : "Unknown Track")}</div>
                  <div className={subtextClass}>{t.artistName || (config.lang === "tr" ? "Bilinmeyen Sanatçı" : "Unknown Artist")}</div>
                </div>
                <div className={durationClass}>{t.trackDuration || "3:45"}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── SWITCH RENDER BY TYPE ──
  const renderContent = () => {
    switch (type) {
      case "SPOTIFY_CLASSIC":
      return (
        <div className="w-full h-full bg-zinc-950 flex flex-col p-6 text-white relative z-0">
          {isDirectAudio && (
            <audio
              ref={audioRef}
              src={url}
              onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
              onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
              onEnded={() => setIsPlaying(false)}
            />
          )}

          <div className="flex flex-col items-center mt-8 mb-6">
            <div className="w-20 h-20 bg-zinc-850 rounded-xl overflow-hidden border border-zinc-800 shadow-xl">
              <img
                src={activeTrack.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80"}
                className="w-full h-full object-cover"
                alt="Cover"
              />
            </div>
            <span className="text-sm font-bold mt-3 text-white">{username}</span>
            <p className="text-xs text-green-500 font-bold mt-1">{bio}</p>
          </div>

          {mediaEmbed ? (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <h4 className="text-sm font-bold text-white truncate max-w-full">{activeTrack.trackName || title}</h4>
                <p className="text-[10px] text-zinc-400 mt-1 truncate max-w-full">{activeTrack.artistName || desc}</p>
              </div>
              {mediaEmbed}
            </div>
          ) : (
            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white truncate max-w-[180px]">{activeTrack.trackName || title}</h4>
                  <p className="text-[10px] text-zinc-400 truncate max-w-[180px]">{activeTrack.artistName || desc}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-green-500 text-lg cursor-pointer hover:opacity-85 select-none" onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; }}>⏮</span>
                  {renderThemePlayButton(config.accentColor || "#22c55e", "w-12 h-12", 18)}
                  <span className="text-green-500 text-lg cursor-pointer hover:opacity-85 select-none" onClick={() => { if (audioRef.current) audioRef.current.currentTime = audioRef.current.duration; }}>⏭</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden cursor-pointer relative" onClick={handleTimelineClick}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: config.accentColor || "#22c55e",
                    }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{activeTrack.trackDuration || formatTime(duration) || "3:45"}</span>
                </div>
              </div>
              {url && !isDirectAudio && (
                <div className="text-center pt-2">
                  <button
                    onClick={handlePlayPause}
                    className="text-xs text-green-500 hover:underline font-bold"
                  >
                    Bağlantıyı Aç ↗
                  </button>
                </div>
              )}
            </div>
          )}
          {renderPlaylist("SPOTIFY_CLASSIC")}
        </div>
      );

    case "VINYL_RETRO":
      return (
        <div className="w-full h-full bg-stone-900 flex flex-col p-6 text-orange-400 relative z-0">
          {isDirectAudio && (
            <audio
              ref={audioRef}
              src={url}
              onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
              onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
              onEnded={() => setIsPlaying(false)}
            />
          )}

          <div className="flex flex-col items-center mt-8 mb-4">
            <span className="text-sm font-bold text-stone-200">{username}</span>
            <p className="text-xs text-orange-400/70 mt-1">{bio}</p>
          </div>

          <div className="flex justify-center my-4">
            <div
              className={`w-28 h-28 rounded-full bg-zinc-950 border-4 border-black flex items-center justify-center relative shadow-2xl transition-transform duration-500 ${
                isPlaying ? "animate-[spin_6s_linear_infinite]" : ""
              }`}
            >
              <div className="absolute inset-2 rounded-full border border-stone-800/60"></div>
              <div className="absolute inset-5 rounded-full border border-stone-800/60"></div>
              <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center p-0.5 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-stone-900"></div>
              </div>
              <img
                src={activeTrack.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&q=80"}
                className="absolute inset-0 w-full h-full object-cover rounded-full opacity-20 pointer-events-none"
                alt="vinyl center"
              />
            </div>
          </div>

          <div className="bg-stone-950/85 rounded-2xl p-4 border border-stone-800 text-center space-y-3 mt-auto">
            <h4 className="text-xs font-bold text-stone-300 truncate max-w-full">{activeTrack.trackName || title}</h4>
            <p className="text-[10px] text-stone-500 truncate max-w-full">{activeTrack.artistName || desc}</p>

            {mediaEmbed ? mediaEmbed : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-6 text-orange-400">
                  <span className="text-sm cursor-pointer select-none hover:opacity-85" onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; }}>⏮</span>
                  {renderThemePlayButton(config.accentColor || "#f97316", "w-10 h-10", 14)}
                  <span className="text-sm cursor-pointer select-none hover:opacity-85" onClick={() => { if (audioRef.current) audioRef.current.currentTime = audioRef.current.duration; }}>⏭</span>
                </div>
                {isDirectAudio && (
                  <div className="space-y-1">
                    <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden cursor-pointer relative" onClick={handleTimelineClick}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${progressPercent}%`,
                          backgroundColor: config.accentColor || "#f97316",
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-stone-600 font-mono">
                      <span>{formatTime(currentTime)}</span>
                      <span>{activeTrack.trackDuration || formatTime(duration) || "3:45"}</span>
                    </div>
                  </div>
                )}
                {url && !isDirectAudio && (
                  <button
                    onClick={handlePlayPause}
                    className="text-[10px] text-orange-400 hover:underline font-bold"
                  >
                    Bağlantıyı Aç ↗
                  </button>
                )}
              </div>
            )}
          </div>
          {renderPlaylist("VINYL_RETRO")}
        </div>
      );

    case "GLASS_AUDIO":
      return (
        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400 flex flex-col p-6 text-white relative z-0">
          {isDirectAudio && (
            <audio
              ref={audioRef}
              src={url}
              onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
              onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
              onEnded={() => setIsPlaying(false)}
            />
          )}

          <div className="flex flex-col items-center mt-8 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full overflow-hidden border border-white/20 shadow-lg">
              <img
                src={activeTrack.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&q=80"}
                className="w-full h-full object-cover"
                alt="Cover"
              />
            </div>
            <span className="text-sm font-bold mt-3 text-white">{username}</span>
          </div>

          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 mt-2 space-y-4 shadow-xl">
            <div className="text-center">
              <h4 className="text-sm font-extrabold text-white truncate max-w-full">{activeTrack.trackName || title}</h4>
              <p className="text-[10px] text-purple-100/80 mt-1 truncate max-w-full">{activeTrack.artistName || desc}</p>
            </div>

            {mediaEmbed ? mediaEmbed : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-6 text-white pt-2">
                  <span className="text-sm cursor-pointer select-none hover:opacity-85" onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; }}>⏮</span>
                  {renderThemePlayButton("#ffffff", "w-11 h-11", 16)}
                  <span className="text-sm cursor-pointer select-none hover:opacity-85" onClick={() => { if (audioRef.current) audioRef.current.currentTime = audioRef.current.duration; }}>⏭</span>
                </div>
                {isDirectAudio && (
                  <div className="space-y-1">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer relative" onClick={handleTimelineClick}>
                      <div
                        className="h-full bg-white rounded-full"
                        style={{
                          width: `${progressPercent}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-purple-150 font-mono">
                      <span>{formatTime(currentTime)}</span>
                      <span>{activeTrack.trackDuration || formatTime(duration) || "3:45"}</span>
                    </div>
                  </div>
                )}
                {url && !isDirectAudio && (
                  <div className="text-center">
                    <button
                      onClick={handlePlayPause}
                      className="text-[10px] text-white hover:underline font-bold"
                    >
                      Bağlantıyı Aç ↗
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {renderPlaylist("GLASS_AUDIO")}
        </div>
      );

    case "NEON_CYBERPUNK":
      return (
        <div className="w-full h-full bg-black flex flex-col p-6 text-white relative z-0">
          {isDirectAudio && (
            <audio
              ref={audioRef}
              src={url}
              onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
              onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
              onEnded={() => setIsPlaying(false)}
            />
          )}

          <div className="flex flex-col items-center mt-8 mb-6">
            <div className={`w-20 h-20 bg-zinc-900 rounded-none overflow-hidden border transition-all duration-300 ${
              isPlaying ? "border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]" : "border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.5)]"
            }`}>
              <img
                src={activeTrack.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=200&q=80"}
                className="w-full h-full object-cover"
                alt="Cover"
              />
            </div>
            <span className="text-xs font-black mt-3 uppercase tracking-widest text-pink-500">{username}</span>
          </div>

          <div className={`bg-black border rounded-none p-4 mt-2 space-y-4 transition-all duration-300 ${
            isPlaying ? "border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.5)]" : "border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.4)]"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400 truncate max-w-[170px]">
                  {activeTrack.trackName || title}
                </h4>
                <p className="text-[9px] text-pink-400 uppercase mt-1 truncate max-w-[170px]">
                  {activeTrack.artistName || desc}
                </p>
              </div>

              {!mediaEmbed && renderThemePlayButton(config.accentColor || "#ec4899", "w-10 h-10 rounded-none", 12)}
            </div>

            {mediaEmbed ? mediaEmbed : (
              <div className="space-y-2">
                <div className="w-full h-0.5 bg-zinc-900 relative cursor-pointer" onClick={handleTimelineClick}>
                  <div
                    className="absolute left-0 top-0 h-full shadow-[0_0_8px_#22d3ee]"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: config.accentColor || "#22d3ee",
                    }}
                  />
                </div>
                {isDirectAudio && (
                  <div className="flex justify-between text-[8px] text-zinc-500 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{activeTrack.trackDuration || formatTime(duration) || "3:45"}</span>
                  </div>
                )}
                {url && !isDirectAudio && (
                  <button
                    onClick={handlePlayPause}
                    className="text-[9px] text-pink-500 uppercase tracking-widest font-black hover:underline"
                  >
                    LINK_OPEN_STATION ↗
                  </button>
                )}
              </div>
            )}
          </div>
          {renderPlaylist("NEON_CYBERPUNK")}
        </div>
      );

    case "MINIMAL_LIGHT_AUDIO":
      return (
        <div className="w-full h-full bg-slate-50 flex flex-col p-6 text-slate-800 relative z-0">
          {isDirectAudio && (
            <audio
              ref={audioRef}
              src={url}
              onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
              onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
              onEnded={() => setIsPlaying(false)}
            />
          )}

          <div className="flex flex-col items-center mt-8 mb-6">
            <div className="w-20 h-20 bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <img
                src={activeTrack.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1516280440503-66f837ce5b97?w=200&q=80"}
                className="w-full h-full object-cover"
                alt="Cover"
              />
            </div>
            <span className="text-sm font-bold mt-3 text-slate-800">{username}</span>
            <p className="text-xs text-slate-500 mt-1">{bio}</p>
          </div>

          <div className="bg-white shadow-sm border border-slate-150 rounded-xl p-4 mt-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-800 truncate max-w-[180px]">
                  {activeTrack.trackName || title}
                </h4>
                <p className="text-[10px] text-slate-500 mt-1 truncate max-w-[180px]">
                  {activeTrack.artistName || desc}
                </p>
              </div>

              {!mediaEmbed && renderThemePlayButton(config.accentColor || "#1e293b", "w-10 h-10", 14)}
            </div>

            {mediaEmbed ? mediaEmbed : (
              <div className="space-y-2">
                <div className="w-full h-0.5 bg-slate-100 rounded-full overflow-hidden cursor-pointer relative" onClick={handleTimelineClick}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: config.accentColor || "#64748b",
                    }}
                  />
                </div>
                {isDirectAudio && (
                  <div className="flex justify-between text-[8px] text-slate-400 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{activeTrack.trackDuration || formatTime(duration) || "3:45"}</span>
                  </div>
                )}
                {url && !isDirectAudio && (
                  <button
                    onClick={handlePlayPause}
                    className="text-[10px] text-slate-600 font-bold hover:underline"
                  >
                    Bağlantıyı Aç ↗
                  </button>
                )}
              </div>
            )}
          </div>
          {renderPlaylist("MINIMAL_LIGHT_AUDIO")}
        </div>
      );

    case "MUSIC_PODCAST":
      return (
        <div className="w-full h-full bg-gradient-to-br from-purple-900 to-indigo-950 flex flex-col p-6 text-white relative z-0">
          {isDirectAudio && (
            <audio
              ref={audioRef}
              src={url}
              onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
              onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
              onEnded={() => setIsPlaying(false)}
            />
          )}

          <div className="flex flex-col items-center mt-8 mb-6">
            <div className="w-20 h-20 bg-zinc-800 rounded-t-full rounded-b-xl overflow-hidden border border-purple-500/30">
              <img
                src={activeTrack.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80"}
                className="w-full h-full object-cover"
                alt="Cover"
              />
            </div>
            <span className="text-sm font-bold mt-3 text-purple-300">{username}</span>
            <p className="text-xs text-purple-200/60 mt-1">{bio}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 mt-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white truncate max-w-[170px]">{activeTrack.trackName || title}</h4>
                <p className="text-xs text-purple-300 mt-1 truncate max-w-[170px]">{activeTrack.artistName || desc}</p>
              </div>

              {!mediaEmbed && renderThemePlayButton(config.accentColor || "#ec4899", "w-12 h-12", 18)}
            </div>

            {mediaEmbed ? mediaEmbed : (
              <div className="space-y-3">
                {isDirectAudio && (
                  <div className="space-y-1">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer relative" onClick={handleTimelineClick}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${progressPercent}%`,
                          backgroundColor: config.accentColor || "#ec4899",
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-purple-300/60 font-mono">
                      <span>{formatTime(currentTime)}</span>
                      <span>{activeTrack.trackDuration || formatTime(duration) || "3:45"}</span>
                    </div>
                  </div>
                )}

                {/* Animated waves while playing */}
                <div className="flex items-end gap-1.5 justify-center h-10 pt-2">
                  <div
                    className={`w-1.5 bg-pink-500 rounded-full transition-all duration-300 ${
                      isPlaying ? "h-6 animate-pulse" : "h-3"
                    }`}
                    style={{ animationDuration: "0.6s", backgroundColor: config.accentColor || "#ec4899" }}
                  />
                  <div
                    className={`w-1.5 bg-pink-500 rounded-full transition-all duration-300 ${
                      isPlaying ? "h-10 animate-pulse" : "h-4"
                    }`}
                    style={{ animationDuration: "0.9s", animationDelay: "0.15s", backgroundColor: config.accentColor || "#ec4899" }}
                  />
                  <div
                    className={`w-1.5 bg-pink-500 rounded-full transition-all duration-300 ${
                      isPlaying ? "h-7 animate-pulse" : "h-3"
                    }`}
                    style={{ animationDuration: "0.7s", animationDelay: "0.3s", backgroundColor: config.accentColor || "#ec4899" }}
                  />
                  <div
                    className={`w-1.5 bg-pink-500 rounded-full transition-all duration-300 ${
                      isPlaying ? "h-11 animate-pulse" : "h-5"
                    }`}
                    style={{ animationDuration: "0.8s", animationDelay: "0.1s", backgroundColor: config.accentColor || "#ec4899" }}
                  />
                  <div
                    className={`w-1.5 bg-pink-500 rounded-full transition-all duration-300 ${
                      isPlaying ? "h-5 animate-pulse" : "h-2"
                    }`}
                    style={{ animationDuration: "0.5s", animationDelay: "0.4s", backgroundColor: config.accentColor || "#ec4899" }}
                  />
                </div>

                {url && !isDirectAudio && (
                  <div className="text-center pt-1">
                    <button
                      onClick={handlePlayPause}
                      className="text-[10px] text-pink-400 font-bold hover:underline"
                    >
                      Bağlantıyı Aç ↗
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {renderPlaylist("MUSIC_PODCAST")}
        </div>
      );

    case "PORTFOLIO_GALLERY":
      return (
        <div className="w-full h-full bg-slate-50 flex flex-col p-6 text-slate-800 relative z-0">
          <div className="flex flex-col items-center mt-8 mb-6">
            <div className="w-20 h-20 bg-zinc-200 rounded-none border border-slate-300 overflow-hidden">
              <img
                src={avatarUrl || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80"}
                className="w-full h-full object-cover"
                alt="Avatar"
              />
            </div>
            <span className="text-sm font-bold mt-3 text-slate-700">{username}</span>
            <p className="text-xs text-slate-500 mt-1">{bio}</p>
          </div>

          <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">{title}</h3>
          <p className="text-xs text-slate-500 mb-4 px-1">{desc}</p>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm">
              <img
                src={config.galleryImage1 || "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=200&q=80"}
                className="w-full h-full object-cover rounded-lg"
                alt="Gallery 1"
              />
            </div>
            <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm">
              <img
                src={config.galleryImage2 || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80"}
                className="w-full h-full object-cover rounded-lg"
                alt="Gallery 2"
              />
            </div>
            <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm">
              <img
                src={config.galleryImage3 || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&q=80"}
                className="w-full h-full object-cover rounded-lg"
                alt="Gallery 3"
              />
            </div>
            <div className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm">
              <img
                src={config.galleryImage4 || "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&q=80"}
                className="w-full h-full object-cover rounded-lg"
                alt="Gallery 4"
              />
            </div>
          </div>

          {(config.behanceUrl || config.dribbbleUrl || config.websiteUrl) && (
            <div className="flex items-center justify-center gap-3 mt-6">
              {config.behanceUrl && (
                <a
                  href={config.behanceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Behance
                </a>
              )}
              {config.dribbbleUrl && (
                <a
                  href={config.dribbbleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Dribbble
                </a>
              )}
              {config.websiteUrl && (
                <a
                  href={config.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Website
                </a>
              )}
            </div>
          )}
        </div>
      );

    case "COUNTDOWN_LAUNCH":
      {
        const pad = (n: number) => n.toString().padStart(2, "0");
        return (
          <div className="w-full h-full bg-orange-500 flex flex-col p-6 text-black relative z-0">
            <div className="flex flex-col items-center mt-8 mb-6">
              <div className="w-20 h-20 bg-zinc-950 rounded-tl-3xl rounded-br-3xl overflow-hidden border border-black/20">
                <img
                  src={avatarUrl || "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80"}
                  className="w-full h-full object-cover"
                  alt="Avatar"
                />
              </div>
              <span className="text-sm font-black mt-3 uppercase tracking-wide">{username}</span>
              <p className="text-xs text-zinc-900/75 font-semibold mt-1">{bio}</p>
            </div>

            <div className="bg-black text-white rounded-3xl p-5 mt-2 border border-black/10 text-center space-y-4 shadow-lg">
              <h4 className="text-xs font-black uppercase tracking-widest text-orange-500">{title}</h4>
              <p className="text-[10px] text-zinc-400">{desc}</p>
              <div className="flex items-center justify-center gap-2">
                {timeLeft.days > 0 && (
                  <>
                    <div className="bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">
                      <span className="text-base font-black font-mono text-white">{pad(timeLeft.days)}</span>
                      <span className="block text-[8px] text-zinc-500 mt-0.5">GÜN</span>
                    </div>
                    <span className="text-zinc-600 font-bold">:</span>
                  </>
                )}
                <div className="bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">
                  <span className="text-base font-black font-mono text-white">{pad(timeLeft.hours)}</span>
                  <span className="block text-[8px] text-zinc-500 mt-0.5">SAAT</span>
                </div>
                <span className="text-zinc-600 font-bold">:</span>
                <div className="bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">
                  <span className="text-base font-black font-mono text-white">{pad(timeLeft.minutes)}</span>
                  <span className="block text-[8px] text-zinc-500 mt-0.5">DAK</span>
                </div>
                <span className="text-zinc-600 font-bold">:</span>
                <div className="bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">
                  <span className="text-base font-black font-mono text-white">{pad(timeLeft.seconds)}</span>
                  <span className="block text-[8px] text-zinc-500 mt-0.5">SN</span>
                </div>
              </div>
              {config.buttonUrl && config.buttonText && (
                <a
                  href={config.buttonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-6 py-2.5 bg-orange-500 text-black text-xs font-black uppercase tracking-wider rounded-full hover:bg-orange-400 transition-colors"
                >
                  {config.buttonText}
                </a>
              )}
            </div>
          </div>
        );
      }

    case "TESTIMONIALS":
      {
        const testimonials =
          config.testimonials && config.testimonials.length > 0
            ? config.testimonials
            : [
                {
                  name: "Elif Y.",
                  text: desc,
                  rating: 5,
                  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
                },
              ];
        return (
          <div className="w-full h-full bg-teal-50 flex flex-col p-6 text-zinc-800 relative z-0">
            <div className="flex flex-col items-center mt-8 mb-6">
              <div className="w-20 h-20 bg-zinc-200 rounded-2xl overflow-hidden border border-teal-200">
                <img
                  src={avatarUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80"}
                  className="w-full h-full object-cover"
                  alt="Avatar"
                />
              </div>
              <span className="text-sm font-bold mt-3 text-teal-800">{username}</span>
              <p className="text-xs text-teal-600 mt-1">{bio}</p>
            </div>

            <div className="space-y-3">
              {testimonials.map((t: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm space-y-3">
                  <div className="flex gap-0.5 text-yellow-400 text-sm">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className={s <= (t.rating || 5) ? "text-yellow-400" : "text-zinc-200"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-zinc-600 italic leading-relaxed">"{t.text || "Harika bir hizmet!"}"</p>
                  <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
                    <div className="w-6 h-6 rounded-full bg-zinc-300 overflow-hidden">
                      {t.avatarUrl ? (
                        <img src={t.avatarUrl} className="w-full h-full object-cover" alt="avatar" />
                      ) : (
                        <div className="w-full h-full bg-teal-200"></div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-700">{t.name || "Anonim"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

    case "PREMIUM_VIDEO":
      {
        const videoUrl = (activeVideo.videoUrl || "").trim();
        const hasValidEmbed =
          videoUrl &&
          (/youtube\.com|youtu\.be/i.test(videoUrl) || /\.(mp4|webm|mov)(\?.*)?$/i.test(videoUrl));

        return (
          <div className="w-full min-h-screen bg-black flex justify-center p-4">
            <div className="w-full max-w-2xl bg-black rounded-[2rem] shadow-2xl flex flex-col items-center">
              {/* 16:9 Media Player Area */}
              <div className="w-full aspect-video rounded-3xl bg-zinc-900 mt-8 relative shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden group border border-white/5 animate-all duration-300">
                {isVideoPlaying && hasValidEmbed ? (
                  <div className="w-full h-full relative">
                    {renderVideoPlayer()}
                    <button
                      onClick={() => setIsVideoPlaying(false)}
                      className="absolute top-4 left-4 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white text-xs font-bold border border-white/10 z-20 flex items-center gap-1 shadow-md"
                    >
                      <ArrowLeft size={12} /> {config.lang === "tr" ? "Kapat" : "Close"}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Cover Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-700"
                      style={{
                        backgroundImage: `url('${
                          activeVideo.coverUrl ||
                          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80"
                        }')`,
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Play Button */}
                    <button
                      onClick={() => {
                        if (hasValidEmbed) {
                          setIsVideoPlaying(true);
                        } else if (videoUrl) {
                          // Fallback to new tab for un-embeddable video links
                          window.open(videoUrl, "_blank", "noopener,noreferrer");
                        }
                      }}
                      className="absolute inset-0 flex items-center justify-center z-10 bg-transparent border-0 outline-none cursor-pointer"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-white/30 hover:scale-110 transition-all">
                        <span className="text-xl md:text-3xl sm:text-4xl ml-2">▶</span>
                      </div>
                    </button>
                  </>
                )}
              </div>

              {/* Text Content */}
              <div className="flex flex-col mt-8 w-full px-4 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                  {activeVideo.title || "UI/UX Masterclass Bölüm 1"}
                </h1>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-10">
                  {activeVideo.description || "Tasarım sistemleri ve ileri düzey prototipleme tekniklerini keşfedin."}
                </p>

                {activeVideo.actionUrl && (
                  <a
                    href={activeVideo.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full max-w-sm mx-auto py-5 rounded-2xl bg-white text-black font-extrabold text-lg hover:bg-zinc-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-8"
                  >
                    {activeVideo.buttonText || "Tamamını İzle"}
                  </a>
                )}
              </div>

              {/* Videos Playlist */}
              {videos.length > 1 && (
                <div className="w-full mt-2 px-4 pb-8 text-left border-t border-zinc-800/50 pt-6">
                  <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">
                    {config.lang === "tr" ? "Diğer Bölümler / Videolar" : "More Videos / Episodes"} ({videos.length})
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
                    {videos.map((v: any, idx: number) => {
                      const isActive = idx === currentVideoIndex;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setCurrentVideoIndex(idx);
                            setIsVideoPlaying(false);
                          }}
                          className={`flex gap-4 p-3 rounded-2xl bg-zinc-900/50 border hover:bg-zinc-800/80 cursor-pointer transition-all ${
                            isActive ? "border-white" : "border-white/5"
                          }`}
                        >
                          <div className="w-24 aspect-video rounded-xl bg-zinc-800 overflow-hidden flex-shrink-0 relative">
                            {v.coverUrl ? (
                              <img src={v.coverUrl} className="w-full h-full object-cover" alt="video cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-500 text-lg">▶</div>
                            )}
                            {isActive && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold">
                                {config.lang === "tr" ? "Oynatılıyor" : "Playing"}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="text-sm font-bold text-white truncate">{v.title || (config.lang === "tr" ? "Başlıksız Video" : "Untitled Video")}</h4>
                            <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{v.description || "..."}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }

    case "RETRO_CASSETTE":
      return (
        <div className="w-full h-full bg-[#1b1210] flex flex-col p-6 text-amber-500 relative z-0">
          {isDirectAudio && (
            <audio
              ref={audioRef}
              src={url}
              onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
              onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
              onEnded={() => setIsPlaying(false)}
            />
          )}

          <div className="flex flex-col items-center mt-8 mb-4">
            <span className="text-sm font-bold text-amber-100">{username}</span>
            <p className="text-xs text-amber-500/60 mt-1">{bio}</p>
          </div>

          <div className="bg-[#2e1d1b] border-2 border-amber-900/40 rounded-2xl p-4 my-4 shadow-inner relative">
            <div className="w-full h-24 bg-amber-100/5 border border-amber-900/20 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[8px] font-mono text-amber-400">
                <span>SIDE A</span>
                <span>NR SYSTEM</span>
              </div>
              
              <div className="flex gap-16 justify-center my-1 relative z-10">
                <div className={`w-8 h-8 rounded-full bg-stone-950 border-2 border-amber-900/40 flex items-center justify-center ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                  <div className="w-2.5 h-2.5 bg-amber-900/30 rounded-full border border-amber-900/60"></div>
                </div>
                <div className={`w-8 h-8 rounded-full bg-stone-950 border-2 border-amber-900/40 flex items-center justify-center ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                  <div className="w-2.5 h-2.5 bg-amber-900/30 rounded-full border border-amber-900/60"></div>
                </div>
              </div>

              <div className="text-center text-[9px] font-mono text-amber-300 truncate">
                {activeTrack.trackName || title}
              </div>
            </div>
          </div>

          <div className="bg-[#241715] rounded-2xl p-4 border border-amber-900/25 text-center space-y-3 mt-auto">
            {mediaEmbed ? mediaEmbed : (
              <>
                <div className="flex items-center justify-center gap-6 text-amber-500">
                  <span className="text-sm cursor-pointer select-none hover:opacity-85" onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; }}>⏮</span>
                  {renderThemePlayButton(config.accentColor || "#d97706", "w-10 h-10", 14)}
                  <span className="text-sm cursor-pointer select-none hover:opacity-85" onClick={() => { if (audioRef.current) audioRef.current.currentTime = activeTrack.trackDuration || 225; }}>⏭</span>
                </div>

                {isDirectAudio && (
                  <div className="space-y-1">
                    <div className="w-full h-1 bg-amber-955 rounded-full overflow-hidden cursor-pointer relative" onClick={handleTimelineClick}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${progressPercent}%`,
                          backgroundColor: config.accentColor || "#d97706",
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-amber-600/80 font-mono">
                      <span>{formatTime(currentTime)}</span>
                      <span>{activeTrack.trackDuration || formatTime(duration) || "3:45"}</span>
                    </div>
                  </div>
                )}
                {url && !isDirectAudio && (
                  <button onClick={handlePlayPause} className="text-[10px] text-amber-400 hover:underline font-bold bg-transparent border-0 cursor-pointer">
                    Bağlantıyı Aç ↗
                  </button>
                )}
              </>
            )}
          </div>
          {renderPlaylist("RETRO_CASSETTE")}
        </div>
      );

    case "MINIMAL_DARK_AUDIO":
      return (
        <div className="w-full h-full bg-black flex flex-col p-6 text-white border border-zinc-900 relative z-0">
          {isDirectAudio && (
            <audio
              ref={audioRef}
              src={url}
              onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
              onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
              onEnded={() => setIsPlaying(false)}
            />
          )}

          <div className="flex flex-col items-center mt-8 mb-6">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">{username}</span>
          </div>

          <div className="w-full border-t border-b border-zinc-900 py-6 my-4 space-y-4">
            <div className="text-center space-y-1">
              <h4 className="text-sm font-light text-white tracking-wide truncate max-w-full">{activeTrack.trackName || title}</h4>
              <p className="text-[10px] text-zinc-500 truncate max-w-full">{activeTrack.artistName || desc}</p>
            </div>

            {mediaEmbed ? mediaEmbed : (
              <div className="flex items-center justify-center gap-8 text-white">
                <span className="text-xs font-mono cursor-pointer select-none hover:text-zinc-400" onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; }}>PREV</span>
                {renderThemePlayButton("#ffffff", "w-12 h-12 bg-white text-black border border-white hover:bg-black hover:text-white transition-all", 16)}
                <span className="text-xs font-mono cursor-pointer select-none hover:text-zinc-400" onClick={() => { if (audioRef.current) audioRef.current.currentTime = activeTrack.trackDuration || 225; }}>NEXT</span>
              </div>
            )}
          </div>

          <div className="mt-auto space-y-3">
            {isDirectAudio && (
              <div className="space-y-1.5">
                <div className="w-full h-0.5 bg-zinc-900 overflow-hidden cursor-pointer relative" onClick={handleTimelineClick}>
                  <div
                    className="h-full"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>
                <div className="flex justify-between text-[8px] text-zinc-500 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{activeTrack.trackDuration || formatTime(duration) || "3:45"}</span>
                </div>
              </div>
            )}
            {url && !isDirectAudio && !mediaEmbed && (
              <button onClick={handlePlayPause} className="text-[10px] text-zinc-400 hover:text-white uppercase font-mono tracking-wider bg-transparent border-0 cursor-pointer">
                Open External Link ↗
              </button>
            )}
          </div>
          {renderPlaylist("MINIMAL_DARK_AUDIO")}
        </div>
      );

    case "VINTAGE_RADIO":
      return (
        <div className="w-full h-full bg-[#2c1a17] flex flex-col p-6 text-amber-600 border-4 border-[#170e0d] rounded-3xl relative z-0">
          {isDirectAudio && (
            <audio
              ref={audioRef}
              src={url}
              onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
              onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
              onEnded={() => setIsPlaying(false)}
            />
          )}

          <div className="flex flex-col items-center mt-6 mb-2">
            <span className="text-xs font-serif italic text-amber-100">{username}</span>
          </div>

          <div className="bg-[#1c0f0d] border border-amber-900/35 rounded-2xl p-4 my-3 flex flex-col gap-3 shadow-inner">
            <div className="w-full bg-[#120807] border border-amber-950 rounded-xl p-2.5 text-center shadow-inner relative overflow-hidden">
              <div className="text-[8px] text-amber-500/70 font-mono tracking-widest uppercase">FM STEREO TUNER</div>
              
              <div className="h-8 w-full relative flex items-center justify-center mt-1 overflow-hidden">
                <div className="absolute inset-x-0 h-0.5 bg-amber-950"></div>
                <div className="absolute w-0.5 h-6 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,1)]" style={{ left: isPlaying ? '60%' : '35%', transition: 'all 2s ease' }}></div>
                <div className="flex justify-between w-full px-2 text-[7px] text-amber-600/50 font-mono">
                  <span>88</span><span>92</span><span>98</span><span>104</span><span>108</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-xs font-bold text-amber-100/90 truncate max-w-full">{activeTrack.trackName || title}</h4>
              <p className="text-[10px] text-amber-600/70 truncate max-w-full">{activeTrack.artistName || desc}</p>
            </div>
          </div>

          <div className="bg-[#1c0f0d] rounded-2xl p-4 border border-amber-900/20 text-center space-y-3 mt-auto">
            {mediaEmbed ? mediaEmbed : (
              <>
                <div className="flex items-center justify-center gap-6">
                  <span className="text-sm cursor-pointer select-none text-amber-600 hover:text-amber-500" onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; }}>⏮</span>
                  {renderThemePlayButton(config.accentColor || "#d97706", "w-10 h-10", 14)}
                  <span className="text-sm cursor-pointer select-none text-amber-600 hover:text-amber-500" onClick={() => { if (audioRef.current) audioRef.current.currentTime = audioRef.current.duration; }}>⏭</span>
                </div>

                {isDirectAudio && (
                  <div className="space-y-1">
                    <div className="w-full h-1 bg-[#120807] rounded-full overflow-hidden cursor-pointer relative" onClick={handleTimelineClick}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${progressPercent}%`,
                          backgroundColor: config.accentColor || "#d97706",
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-amber-700/80 font-mono">
                      <span>{formatTime(currentTime)}</span>
                      <span>{activeTrack.trackDuration || formatTime(duration) || "3:45"}</span>
                    </div>
                  </div>
                )}
                {url && !isDirectAudio && (
                  <button onClick={handlePlayPause} className="text-[10px] text-amber-500 hover:underline bg-transparent border-0 cursor-pointer">
                    Radyoyu Aç ↗
                  </button>
                )}
              </>
            )}
          </div>
          {renderPlaylist("VINTAGE_RADIO")}
        </div>
      );

    case "FUTURE_WAVE":
      {
        const videoUrl = (activeVideo.videoUrl || "").trim();
        const hasValidEmbed =
          videoUrl &&
          (/youtube\.com|youtu\.be/i.test(videoUrl) || /\.(mp4|webm|mov)(\?.*)?$/i.test(videoUrl));

        return (
          <div className="w-full h-full bg-black flex flex-col p-6 text-pink-500 relative z-0 overflow-hidden shadow-[inset_0_0_40px_rgba(236,72,153,0.1)]">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(236,72,153,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(236,72,153,0.05)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            
            <div className="flex flex-col items-center mt-6 mb-4 relative z-10">
              <span className="text-xs font-black uppercase tracking-widest text-cyan-400">{username}</span>
            </div>

            <div className="w-full aspect-video rounded-xl bg-zinc-950 mt-2 relative border border-pink-500/30 overflow-hidden group shadow-[0_0_20px_rgba(236,72,153,0.2)] animate-all duration-300">
              {isPlaying && hasValidEmbed ? (
                <div className="w-full h-full relative">
                  {renderVideoPlayer()}
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="absolute top-2 left-2 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white text-[10px] font-bold border border-white/10 z-20 flex items-center gap-1 shadow-md cursor-pointer"
                  >
                    <ArrowLeft size={10} /> {config.lang === "tr" ? "Kapat" : "Close"}
                  </button>
                </div>
              ) : (
                <>
                  <img src={activeVideo.coverUrl || "/placeholder.png"} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Video cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <button onClick={handleVideoPlayPause} className="w-14 h-14 rounded-none bg-pink-500 flex items-center justify-center text-black border-2 border-cyan-400 shadow-[0_0_15px_rgba(236,72,153,0.8)] hover:scale-105 transition-all cursor-pointer">
                      <span className="text-lg ml-0.5">▶</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          <div className="flex flex-col mt-6 flex-1 relative z-10">
            <h4 className="text-base font-black uppercase tracking-wider text-cyan-400">{activeVideo.title || title}</h4>
            <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">{activeVideo.description || desc}</p>
            
            {activeVideo.actionUrl && (
              <a href={activeVideo.actionUrl} target="_blank" rel="noopener noreferrer" className="w-full text-center py-3.5 bg-pink-500 text-black font-black uppercase text-xs tracking-widest border border-cyan-400 shadow-[0_0_10px_rgba(236,72,153,0.5)] hover:bg-cyan-400 transition-all mt-6">
                {activeVideo.buttonText || "Watch Now"}
              </a>
            )}

            {videos.length > 1 && (
              <div className="mt-6 border-t border-zinc-900 pt-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-3 block">Playlist ({videos.length})</span>
                <div className="space-y-2 max-h-44 overflow-y-auto no-scrollbar">
                  {videos.map((v: any, idx: number) => {
                    const isVActive = idx === currentVideoIndex;
                    return (
                      <div key={idx} onClick={() => { setCurrentVideoIndex(idx); setIsPlaying(false); }} className={`flex items-center gap-3 p-2 border cursor-pointer transition-all ${isVActive ? 'border-pink-500 bg-zinc-950' : 'border-zinc-900 hover:border-pink-500/30'}`}>
                        <div className="w-10 h-7 bg-zinc-800 flex-shrink-0 overflow-hidden relative">
                          <img src={v.coverUrl || "/placeholder.png"} className="w-full h-full object-cover" alt="thumb" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-white truncate">{v.title || "Untitled Video"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    case "CINEMATIC_THEATER":
      {
        const videoUrl = (activeVideo.videoUrl || "").trim();
        const hasValidEmbed =
          videoUrl &&
          (/youtube\.com|youtu\.be/i.test(videoUrl) || /\.(mp4|webm|mov)(\?.*)?$/i.test(videoUrl));

        return (
          <div className="w-full h-full bg-[#080808] flex flex-col p-6 text-zinc-100 relative z-0">
            <div className="flex flex-col items-center mt-6 mb-4">
              <span className="text-xs font-serif uppercase tracking-widest text-zinc-500">{username}</span>
            </div>

            <div className="w-full aspect-video rounded-xl bg-zinc-950 mt-2 relative overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.8)] border border-zinc-850 animate-all duration-300">
              {isPlaying && hasValidEmbed ? (
                <div className="w-full h-full relative">
                  {renderVideoPlayer()}
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="absolute top-2 left-2 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white text-[10px] font-bold border border-white/10 z-25 flex items-center gap-1 shadow-md cursor-pointer"
                  >
                    <ArrowLeft size={10} /> {config.lang === "tr" ? "Kapat" : "Close"}
                  </button>
                </div>
              ) : (
                <>
                  <img src={activeVideo.coverUrl || "/placeholder.png"} className="absolute inset-0 w-full h-full object-cover opacity-70" alt="Video cover" />
                  <div className="absolute left-0 inset-y-0 w-4 bg-gradient-to-r from-red-950 to-red-800 border-r border-red-900/50 shadow-lg z-10"></div>
                  <div className="absolute right-0 inset-y-0 w-4 bg-gradient-to-l from-red-950 to-red-800 border-l border-red-900/50 shadow-lg z-10"></div>

                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <button onClick={handleVideoPlayPause} className="w-16 h-16 rounded-full bg-red-700/80 backdrop-blur-sm flex items-center justify-center text-white border border-red-500/50 shadow-2xl hover:bg-red-650 hover:scale-105 transition-all cursor-pointer">
                      <span className="text-xl ml-1">▶</span>
                    </button>
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-full bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none" />
                </>
              )}
            </div>

          <div className="flex flex-col mt-6 flex-1">
            <h4 className="text-base font-serif italic text-zinc-200">{activeVideo.title || title}</h4>
            <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed">{activeVideo.description || desc}</p>
            
            {activeVideo.actionUrl && (
              <a href={activeVideo.actionUrl} target="_blank" rel="noopener noreferrer" className="w-full text-center py-3.5 bg-red-700 hover:bg-red-650 text-white font-serif text-xs tracking-wider rounded-xl transition-all mt-6 shadow-[0_4px_12px_rgba(185,28,28,0.3)]">
                {activeVideo.buttonText || "Watch Film"}
              </a>
            )}

            {videos.length > 1 && (
              <div className="mt-6 border-t border-zinc-900 pt-4">
                <span className="text-[10px] font-bold text-zinc-400 mb-3 block">Playlist ({videos.length})</span>
                <div className="space-y-2 max-h-44 overflow-y-auto no-scrollbar">
                  {videos.map((v: any, idx: number) => {
                    const isVActive = idx === currentVideoIndex;
                    return (
                      <div key={idx} onClick={() => { setCurrentVideoIndex(idx); setIsPlaying(false); }} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${isVActive ? 'bg-zinc-900 border border-zinc-800' : 'bg-transparent border border-transparent hover:bg-zinc-900/45'}`}>
                        <div className="w-12 h-8 bg-zinc-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                          <img src={v.coverUrl || "/placeholder.png"} className="w-full h-full object-cover" alt="thumb" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-zinc-300 truncate">{v.title || "Untitled Video"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    default:
      return null;
    }
  };

  return renderContent();
}
