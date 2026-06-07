"use client";

import React, { useState, useEffect, useRef } from "react";
import { Music, Play, Pause, Clock, MessageCircle, Image, Star, ArrowLeft, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, MoreHorizontal, Laptop, Sliders, Rewind, FastForward, Share2, Airplay, SlidersHorizontal, Heart } from "lucide-react";

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

function getCompactMediaEmbed(url: string, accentColor?: string) {
  if (!url) return null;
  const trimmed = url.trim();

  // Spotify
  const spotifyMatch = trimmed.match(/open\.spotify\.com\/(?:[a-zA-Z0-9_-]+\/)?(track|album|playlist|episode)\/([a-zA-Z0-9]+)/i);
  if (spotifyMatch) {
    return (
      <iframe
        src={"https://open.spotify.com/embed/" + spotifyMatch[1] + "/" + spotifyMatch[2] + "?utm_source=generator&theme=0"}
        width="100%"
        height="80"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl border-0"
      />
    );
  }

  // SoundCloud
  if (trimmed.includes("soundcloud.com/")) {
    const encodedUrl = encodeURIComponent(trimmed);
    return (
      <iframe
        width="100%"
        height="80"
        scrolling="no"
        frameBorder="0"
        allow="autoplay"
        src={"https://w.soundcloud.com/player/?url=" + encodedUrl + "&color=" + (accentColor ? accentColor.replace("#", "%23") : "%23ff5500") + "&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false"}
        className="rounded-xl border-0"
      />
    );
  }

  // Apple Music
  const appleMusicMatch = trimmed.match(/music\.apple\.com\/([a-z]{2})\/(?:album|playlist)\/(?:[^/]+\/)?([a-zA-Z0-9.]+)/i);
  if (appleMusicMatch) {
    return (
      <iframe
        allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
        frameBorder="0"
        height="80"
        width="100%"
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
        src={"https://embed.music.apple.com/" + appleMusicMatch[1] + "/album/" + appleMusicMatch[2]}
        className="rounded-xl border-0"
      />
    );
  }

  // YouTube
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (ytMatch) {
    return (
      <iframe
        src={"https://www.youtube.com/embed/" + ytMatch[1]}
        width="100%"
        height="80"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-xl border-0"
      />
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
          trackUrl: config.trackUrl || config.audioUrl || "",
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
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // ── VIDEO STATES ──
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // ── PORTFOLIO GALLERY STATES ──
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Reset track index if tracks array changes length
  useEffect(() => {
    setCurrentTrackIndex(0);
    setIsPlaying(false);
  }, [tracks.length]);

  const activeTrack = tracks[currentTrackIndex] || tracks[0] || {};
  const url = (activeTrack.trackUrl || "").trim();
  const isDirectAudio = /\.(mp3|wav|ogg|m4a|aac|flac)(\?.*)?$/i.test(url) || url.startsWith("/api/media/") || url.startsWith("data:audio/");
  
  // ── SPOTIFY / DIRECT AUDIO RESOLVING ──
  const [resolvedAudioUrl, setResolvedAudioUrl] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  useEffect(() => {
    const resolveTrack = async () => {
      if (!url) {
        setResolvedAudioUrl(null);
        return;
      }

      const isSpotify = /open\.spotify\.com\/(?:[a-zA-Z0-9_-]+\/)?track\/([a-zA-Z0-9]+)/i.test(url);
      const isDirect = /\.(mp3|wav|ogg|m4a|aac|flac)(\?.*)?$/i.test(url) || url.startsWith("/api/media/") || url.startsWith("data:audio/");

      if (isDirect) {
        setResolvedAudioUrl(url);
      } else if (isSpotify) {
        setIsLoadingAudio(true);
        try {
          const res = await fetch(`/api/spotify-preview?url=${encodeURIComponent(url)}`);
          const data = await res.json();
          if (data.success && data.previewUrl) {
            setResolvedAudioUrl(data.previewUrl);
          } else {
            setResolvedAudioUrl(null);
          }
        } catch (e) {
          console.error("Error resolving Spotify track preview:", e);
          setResolvedAudioUrl(null);
        } finally {
          setIsLoadingAudio(false);
        }
      } else {
        setResolvedAudioUrl(null);
      }
    };

    resolveTrack();
  }, [url]);

  const hasAudioUrl = resolvedAudioUrl || (isDirectAudio ? url : null);

  const isEmbeddable = /open\.spotify\.com|youtube\.com|youtu\.be|soundcloud\.com|music\.apple\.com/i.test(url);
  const mediaEmbed = !isDirectAudio ? getMediaEmbed(url, config.accentColor, isPlaying, () => setIsPlaying(false)) : null;
  const compactMediaEmbed = !isDirectAudio ? getCompactMediaEmbed(url, config.accentColor) : null;

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
    if (hasAudioUrl || !isPlaying) return;

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
  }, [isPlaying, hasAudioUrl]);

  // ── AUDIO PLAYBACK SYNC ──
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && hasAudioUrl) {
      audioRef.current.play().catch((err) => {
        console.error("Audio playback error:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, hasAudioUrl]);

  // Handle URL change
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [hasAudioUrl]);

  const handlePlayPause = () => {
    if (!url) return;
    setIsPlaying(!isPlaying);
  };



  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickRatio = clickX / width;
    const newTime = clickRatio * (duration || 225);
    
    if (hasAudioUrl && audioRef.current) {
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
      case "AUDIO_PLAYER":
        containerClass = "w-full bg-zinc-900/40 rounded-xl p-2 max-h-48 overflow-y-auto no-scrollbar";
        itemClass = "flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-800/60 cursor-pointer transition-colors";
        activeItemClass = "bg-zinc-800 border-l-4 border-indigo-400";
        textClass = "text-xs font-bold text-white truncate";
        subtextClass = "text-[10px] text-zinc-400 truncate";
        durationClass = "text-[10px] text-zinc-500 font-mono ml-auto";
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



    case "MUSIC_PODCAST":
      return (
        <div 
          className="w-full h-full min-h-[580px] flex flex-col justify-between p-6 text-white relative z-0 select-none overflow-hidden rounded-[2rem] shadow-2xl"
          style={{ background: "radial-gradient(circle at 50% 30%, #d47e1d 0%, #613306 60%, #170d02 100%)" }}
        >
          {hasAudioUrl && (
            <audio
              ref={audioRef}
              src={hasAudioUrl}
              onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
              onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
              onEnded={() => setIsPlaying(false)}
            />
          )}

          {/* Spotify Branding Logo */}
          <div className="flex items-center justify-center gap-2 mt-4 opacity-90">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#1DB954]" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.075-.336.135-.668.47-.743 3.856-.88 7.15-.506 9.822 1.13.295.178.387.563.205.858zm1.225-2.72c-.227.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.077-1.182-.413.125-.85-.107-.975-.52-.125-.413.107-.85.52-.975 3.667-1.112 8.24-.57 11.346 1.343.366.227.485.707.26 1.074zm.106-2.833C14.384 8.71 8.563 8.52 5.175 9.548c-.513.155-1.053-.137-1.208-.65-.155-.514.137-1.054.65-1.208 3.882-1.178 10.314-.955 14.373 1.453.46.273.61.867.337 1.328-.273.46-.867.61-1.328.337z"/>
            </svg>
            <span className="text-white text-base font-bold tracking-tight">Spotify</span>
          </div>

          {/* 3D Cover Flow Carousel */}
          <div className="relative w-full h-64 flex items-center justify-center my-6" style={{ perspective: "1000px" }}>
            {tracks.map((t: any, idx: number) => {
              const offset = idx - currentTrackIndex;
              const absOffset = Math.abs(offset);
              
              if (absOffset > 2) return null;
              
              const scale = 1 - absOffset * 0.2;
              const rotateY = offset * -25;
              const translateX = offset * 45;
              const translateZ = absOffset * -60;
              const zIndex = 10 - absOffset;
              
              const isActive = idx === currentTrackIndex;
              
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`absolute w-44 h-44 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex: zIndex,
                    transformStyle: "preserve-3d",
                    boxShadow: isActive ? "0 20px 35px -5px rgba(0,0,0,0.6), 0 0 25px 2px rgba(255,255,255,0.1)" : "0 5px 15px -3px rgba(0,0,0,0.5)",
                    border: isActive ? "2px solid rgba(255,255,255,0.45)" : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <img
                    src={t.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80"}
                    className="w-full h-full object-cover"
                    alt="Cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-3 pt-6 flex flex-col justify-end text-left h-2/3">
                    <span className="text-white text-xs font-black truncate leading-tight">{t.artistName || (config.lang === "tr" ? "Bilinmeyen Sanatçı" : "Unknown Artist")}</span>
                    <span className="text-zinc-300 text-[9px] font-medium truncate mt-0.5">{t.trackName || (config.lang === "tr" ? "Bilinmeyen Parça" : "Unknown Track")}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Track Metadata */}
          <div className="flex flex-col items-center justify-center w-full mb-4">
            <div className="text-center min-h-[48px] px-4">
              <h3 className="text-base font-extrabold text-white tracking-wide truncate max-w-[280px] mx-auto">
                {activeTrack.artistName || (config.lang === "tr" ? "Bilinmeyen Sanatçı" : "Unknown Artist")}
              </h3>
              <p className="text-xs text-zinc-300 truncate max-w-[280px] mx-auto mt-0.5">
                {activeTrack.trackName || (config.lang === "tr" ? "Bilinmeyen Parça" : "Unknown Track")}
              </p>
            </div>
          </div>

          {/* Glassmorphic Player Controls Bar */}
          <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full py-2.5 px-4 flex items-center justify-between shadow-2xl relative z-10 mt-auto">
            {/* Left Controls: Prev (Rewind), Play/Pause, Next (FastForward) */}
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
                  setCurrentTrackIndex(prevIdx);
                  setIsPlaying(false);
                }}
                className="hover:scale-110 text-white/80 hover:text-white transition-all cursor-pointer bg-transparent border-0 outline-none p-0 flex items-center"
              >
                <Rewind size={18} className="fill-current" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg cursor-pointer bg-transparent border-0 outline-none"
              >
                {isPlaying ? (
                  <Pause size={14} className="fill-black text-black" />
                ) : (
                  <Play size={14} className="fill-black text-black ml-0.5" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const nextIdx = (currentTrackIndex + 1) % tracks.length;
                  setCurrentTrackIndex(nextIdx);
                  setIsPlaying(false);
                }}
                className="hover:scale-110 text-white/80 hover:text-white transition-all cursor-pointer bg-transparent border-0 outline-none p-0 flex items-center"
              >
                <FastForward size={18} className="fill-current" />
              </button>
            </div>

            {/* Center: Mini Status Pill */}
            <div className="flex-1 flex justify-center px-3">
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  if (url && !isDirectAudio) {
                    window.open(url, "_blank", "noopener,noreferrer");
                  }
                }}
                title={url && !isDirectAudio ? (config.lang === "tr" ? "Spotify'da Aç" : "Open on Spotify") : undefined}
                className={`w-full max-w-[240px] bg-black/60 border border-white/10 rounded-2xl px-3 py-1.5 flex items-center gap-3 relative overflow-hidden h-11 transition-all ${url && !isDirectAudio ? "cursor-pointer hover:bg-black/80" : ""}`}
              >
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                  <img
                    src={activeTrack.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&q=80"}
                    className="w-full h-full object-cover"
                    alt="mini cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
                  <span className="text-[10px] font-bold text-white truncate leading-tight">
                    {activeTrack.artistName || (config.lang === "tr" ? "Sanatçı" : "Artist")}
                  </span>
                  <span className="text-[8px] text-zinc-400 truncate leading-none mt-0.5">
                    {activeTrack.trackName || (config.lang === "tr" ? "Şarkı" : "Track")}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 shrink-0">
                  {isPlaying ? (
                    <div className="flex items-end gap-[2px] h-3 pr-1">
                      <span className="w-[1.5px] bg-[#1DB954] rounded-full animate-bounce h-2" style={{ animationDuration: '0.6s' }}></span>
                      <span className="w-[1.5px] bg-[#1DB954] rounded-full animate-bounce h-3" style={{ animationDuration: '0.8s', animationDelay: '0.1s' }}></span>
                      <span className="w-[1.5px] bg-[#1DB954] rounded-full animate-bounce h-1.5" style={{ animationDuration: '0.5s', animationDelay: '0.2s' }}></span>
                    </div>
                  ) : (
                    <div className="flex items-end gap-[2px] h-3 pr-1 opacity-50">
                      <span className="w-[1.5px] bg-[#1DB954] rounded-full h-1"></span>
                      <span className="w-[1.5px] bg-[#1DB954] rounded-full h-2"></span>
                      <span className="w-[1.5px] bg-[#1DB954] rounded-full h-1"></span>
                    </div>
                  )}
                  <MoreHorizontal size={12} className="text-zinc-400 cursor-pointer hover:text-white" />
                </div>
              </div>
            </div>

            {/* Right Controls: Laptop, ListMusic, Volume */}
            <div className="flex items-center gap-3 text-white/75 shrink-0">
              <button className="hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer bg-transparent border-0 outline-none p-0 flex items-center">
                <Laptop size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaylistOpen(!isPlaylistOpen);
                }}
                className={`p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer bg-transparent border-0 outline-none p-0 flex items-center ${isPlaylistOpen ? "text-[#1DB954] bg-white/10" : "hover:text-white"}`}
              >
                <ListMusic size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer bg-transparent border-0 outline-none p-0 flex items-center"
              >
                {isMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} />}
              </button>
            </div>
          </div>

          {/* Playlist Drawer/Panel */}
          {isPlaylistOpen && (
            <div className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 mt-3 space-y-2 max-h-44 overflow-y-auto no-scrollbar animate-slideUp">
              <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                {config.lang === "tr" ? "Çalma Listesi" : "Playlist"} ({tracks.length})
              </div>
              <div className="space-y-1">
                {tracks.map((t: any, idx: number) => {
                  const isActive = idx === currentTrackIndex;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setCurrentTrackIndex(idx);
                        setIsPlaying(false);
                      }}
                      className={`flex items-center gap-2.5 p-1.5 rounded-lg cursor-pointer transition-colors ${isActive ? "bg-white/15" : "hover:bg-white/5"}`}
                    >
                      <div className="w-6 h-6 rounded overflow-hidden shrink-0 bg-zinc-800 relative">
                        <img src={t.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=50&q=80"} className="w-full h-full object-cover" />
                        {isActive && isPlaying && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="w-1 bg-[#1DB954] h-2 rounded-full animate-pulse mx-0.5"></span>
                            <span className="w-1 bg-[#1DB954] h-3 rounded-full animate-pulse mx-0.5" style={{ animationDelay: '0.15s' }}></span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10px] font-bold truncate ${isActive ? "text-[#1DB954]" : "text-white"}`}>{t.trackName || "Unknown Track"}</div>
                        <div className="text-[8px] text-zinc-400 truncate mt-0.5">{t.artistName || "Unknown Artist"}</div>
                      </div>
                      <div className="text-[8px] text-zinc-500 font-mono">{t.trackDuration || "3:45"}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );

    case "PORTFOLIO_GALLERY":
      {
        const galleryImages = Array.isArray(config.galleryImages) && config.galleryImages.length > 0
          ? config.galleryImages
          : [
              config.galleryImage1,
              config.galleryImage2,
              config.galleryImage3,
              config.galleryImage4
            ].filter(Boolean);

        const effectiveGalleryImages = galleryImages.length > 0 ? galleryImages : [
          "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=200&q=80",
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80",
          "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&q=80",
          "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&q=80"
        ];

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
              {effectiveGalleryImages.map((imgUrl: string, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="aspect-square bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-1.5 overflow-hidden shadow-sm cursor-pointer hover:scale-[1.03] hover:shadow-md active:scale-95 transition-all duration-300"
                >
                  <img
                    src={imgUrl}
                    className="w-full h-full object-cover rounded-lg"
                    alt={`Gallery ${idx + 1}`}
                  />
                </div>
              ))}
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

            {/* Premium Fullscreen Lightbox Modal */}
            {lightboxIndex !== null && effectiveGalleryImages[lightboxIndex] && (
              <div 
                className="fixed inset-0 bg-black/95 backdrop-blur-md z-[200] flex flex-col justify-between items-center py-6 px-4 animate-in fade-in duration-200"
                onClick={() => setLightboxIndex(null)}
              >
                {/* Top Bar */}
                <div className="w-full flex justify-between items-center px-4 max-w-2xl z-10">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    {lightboxIndex + 1} / {effectiveGalleryImages.length}
                  </span>
                  <button
                    onClick={() => setLightboxIndex(null)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border-0 outline-none"
                  >
                    <span className="text-xl leading-none">✕</span>
                  </button>
                </div>

                {/* Center Image and Navigations */}
                <div className="flex items-center justify-between w-full max-w-4xl flex-1 px-2 relative" onClick={(e) => e.stopPropagation()}>
                  {/* Left Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((lightboxIndex - 1 + effectiveGalleryImages.length) % effectiveGalleryImages.length);
                    }}
                    className="absolute left-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 cursor-pointer border-0 outline-none"
                  >
                    <span className="text-lg font-bold">◀</span>
                  </button>

                  {/* Image Container */}
                  <div className="w-full h-full max-h-[70vh] flex items-center justify-center px-8">
                    <img
                      src={effectiveGalleryImages[lightboxIndex]}
                      alt={`Gallery view ${lightboxIndex + 1}`}
                      className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200"
                    />
                  </div>

                  {/* Right Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((lightboxIndex + 1) % effectiveGalleryImages.length);
                    }}
                    className="absolute right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 cursor-pointer border-0 outline-none"
                  >
                    <span className="text-lg font-bold">▶</span>
                  </button>
                </div>

                {/* Bottom Bar */}
                <div className="h-6"></div>
              </div>
            )}
          </div>
        );
      }

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

    case "PREMIUM_VIDEO":
      {
        const videoUrl = (activeVideo.videoUrl || "").trim();
        const hasValidEmbed =
          videoUrl &&
          (/youtube\.com|youtu\.be/i.test(videoUrl) || /\.(mp4|webm|mov)(\?.*)?$/i.test(videoUrl));

        const bgColor = config.backgroundColor || "#000000";
        // Calculate contrast colors
        const hex = bgColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16) || 0;
        const g = parseInt(hex.substr(2, 2), 16) || 0;
        const b = parseInt(hex.substr(4, 2), 16) || 0;
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        const isLight = yiq >= 128;

        const textColor = isLight ? "text-zinc-900" : "text-white";
        const descColor = isLight ? "text-zinc-650" : "text-zinc-400";
        const borderClass = isLight ? "border-zinc-200" : "border-white/5";
        const listHeaderColor = isLight ? "text-zinc-500" : "text-zinc-400";
        const listBorderColor = isLight ? "border-zinc-200" : "border-zinc-800/50";
        const listItemBg = isLight ? "bg-white border-zinc-200 hover:bg-zinc-50" : "bg-zinc-900/50 border-white/5 hover:bg-zinc-800/80";
        const buttonBgColor = isLight ? "bg-zinc-900 text-white hover:bg-zinc-800" : "bg-white text-black hover:bg-zinc-200";
        const buttonShadow = isLight ? "shadow-[0_4px_14px_rgba(0,0,0,0.15)]" : "shadow-[0_0_30px_rgba(255,255,255,0.2)]";

        return (
          <div className="w-full min-h-screen flex justify-center p-4 transition-colors duration-350" style={{ backgroundColor: bgColor }}>
            <div className="w-full max-w-2xl rounded-[2rem] shadow-2xl flex flex-col items-center transition-colors duration-350" style={{ backgroundColor: bgColor }}>
              {/* 16:9 Media Player Area */}
              <div className="w-full aspect-video rounded-3xl bg-zinc-900 mt-8 relative shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden group border border-white/5 animate-all duration-300">
                {isVideoPlaying && hasValidEmbed ? (
                  <div className="w-full h-full relative">
                    {renderVideoPlayer()}
                    <button
                      onClick={() => setIsVideoPlaying(false)}
                      className="absolute top-4 left-4 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white text-xs font-bold border border-white/10 z-20 flex items-center gap-1 shadow-md cursor-pointer"
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
                <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-3 ${textColor}`}>
                  {activeVideo.title || "UI/UX Masterclass Bölüm 1"}
                </h1>
                <p className={`text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-10 ${descColor}`}>
                  {activeVideo.description || "Tasarım sistemleri ve ileri düzey prototipleme tekniklerini keşfedin."}
                </p>

                {activeVideo.actionUrl && (
                  <a
                    href={activeVideo.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full max-w-sm mx-auto py-5 rounded-2xl font-extrabold text-lg transition-all mb-8 ${buttonBgColor} ${buttonShadow}`}
                  >
                    {activeVideo.buttonText || "Tamamını İzle"}
                  </a>
                )}
              </div>

              {/* Videos Playlist */}
              {videos.length > 1 && (
                <div className={`w-full mt-2 px-4 pb-8 text-left border-t pt-6 ${listBorderColor}`}>
                  <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 px-1 ${listHeaderColor}`}>
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
                          className={`flex gap-4 p-3 rounded-2xl border cursor-pointer transition-all ${listItemBg} ${
                            isActive ? (isLight ? "border-zinc-800 shadow-sm" : "border-white") : borderClass
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
                            <h4 className={`text-sm font-bold truncate ${textColor}`}>{v.title || (config.lang === "tr" ? "Başlıksız Video" : "Untitled Video")}</h4>
                            <p className={`text-xs line-clamp-1 mt-0.5 ${descColor}`}>{v.description || "..."}</p>
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

    case "AUDIO_PLAYER": {
      const accent = config.accentColor || "#3b82f6";
      return (
        <div className="w-full h-full bg-white flex flex-col justify-between text-slate-800 rounded-3xl overflow-hidden relative shadow-lg">
          {url && (
            <audio
              ref={audioRef}
              src={url}
              onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
              onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
              onEnded={() => setIsPlaying(false)}
            />
          )}

          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {config.lang === "tr" ? "Şimdi Çalınıyor" : "Now Playing"}
            </span>
            <div className="flex items-center gap-3 text-slate-400">
              <Laptop size={16} className="cursor-pointer hover:text-slate-600 transition-colors" />
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="bg-transparent border-0 outline-none p-0 cursor-pointer text-inherit"
              >
                {isMuted ? (
                  <VolumeX size={16} className="text-red-500 transition-colors" />
                ) : (
                  <Volume2 size={16} className="hover:text-slate-600 transition-colors" />
                )}
              </button>
            </div>
          </div>

          {/* Vinyl / Cover Art Section */}
          <div className="flex-1 flex flex-col items-center justify-center py-6 px-8 relative">
            <div className="relative w-40 h-40 rounded-full bg-zinc-950 flex items-center justify-center shadow-2xl border-4 border-zinc-900 group">
              <div className="absolute inset-3 rounded-full border border-zinc-800/40"></div>
              <div className="absolute inset-6 rounded-full border border-zinc-800/40"></div>
              <div className="absolute inset-9 rounded-full border border-zinc-800/40"></div>
              
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-0.5 z-10 shadow-inner">
                <div className="w-3.5 h-3.5 rounded-full bg-zinc-900"></div>
              </div>
              
              <img
                src={activeTrack.albumCoverUrl || avatarUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80"}
                className={`absolute inset-0 w-full h-full object-cover rounded-full pointer-events-none transition-transform duration-500 ${
                  isPlaying ? "animate-[spin_8s_linear_infinite]" : "opacity-90"
                }`}
                alt="vinyl record"
              />

              <div className="absolute inset-0 flex items-center justify-center z-20">
                <button
                  onClick={handlePlayPause}
                  className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-zinc-900 flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer border-0"
                >
                  {isPlaying ? (
                    <Pause size={20} className="fill-zinc-900" />
                  ) : (
                    <Play size={20} className="ml-1 fill-zinc-900" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-center mt-6 w-full max-w-[240px]">
              <h4 className="text-sm font-extrabold text-slate-800 truncate">
                {activeTrack.trackName || (config.lang === "tr" ? "Bilinmeyen Parça" : "Unknown Track")}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">
                {activeTrack.artistName || (config.lang === "tr" ? "Bilinmeyen Sanatçı" : "Unknown Artist")}
              </p>
            </div>
          </div>

          {/* Timeline & Controls */}
          <div className="px-6 pb-6">
            <div className="space-y-1">
              <div className="relative w-full flex items-center group">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCurrentTime(val);
                    if (audioRef.current) audioRef.current.currentTime = val;
                  }}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer outline-none focus:outline-none transition-all"
                  style={{
                    background: `linear-gradient(to right, ${accent} ${progressPercent}%, #e5e7eb ${progressPercent}%)`,
                  }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 font-mono font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{activeTrack.trackDuration || formatTime(duration) || "3:45"}</span>
              </div>
            </div>
          </div>

          {/* Bottom Dark Footer Bar */}
          <div className="bg-zinc-900 px-6 py-4 flex justify-between items-center text-zinc-400">
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.loop = !audioRef.current.loop;
                  const loopBtn = document.getElementById("audio-player-loop");
                  if (loopBtn) {
                    if (audioRef.current.loop) {
                      loopBtn.classList.add("text-indigo-400");
                    } else {
                      loopBtn.classList.remove("text-indigo-400");
                    }
                  }
                }
              }}
              id="audio-player-loop"
              className="bg-transparent border-0 outline-none p-0 cursor-pointer text-inherit hover:text-white transition-colors"
              title={config.lang === "tr" ? "Tekrarla" : "Repeat"}
            >
              <Clock size={16} />
            </button>

            <button
              onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
              className={`bg-transparent border-0 outline-none p-0 cursor-pointer text-inherit hover:text-white transition-colors ${
                isPlaylistOpen ? "text-indigo-400" : ""
              }`}
              title={config.lang === "tr" ? "Çalma Listesi" : "Playlist"}
            >
              <ListMusic size={16} />
            </button>

            <button
              onClick={() => {
                const heartBtn = document.getElementById("audio-player-heart");
                if (heartBtn) {
                  heartBtn.classList.toggle("text-red-500");
                  heartBtn.classList.toggle("fill-red-500");
                }
              }}
              id="audio-player-heart"
              className="bg-transparent border-0 outline-none p-0 cursor-pointer text-inherit hover:text-white transition-colors"
              title={config.lang === "tr" ? "Beğen" : "Like"}
            >
              <Heart size={16} />
            </button>
          </div>

          {isPlaylistOpen && (
            <div className="absolute inset-x-0 bottom-[52px] bg-zinc-900/95 border-t border-zinc-800 p-4 max-h-56 overflow-y-auto z-30 transition-all duration-300">
              {renderPlaylist("AUDIO_PLAYER")}
            </div>
          )}
        </div>
      );
    }

    default:
      return null;
    }
  };

  return renderContent();
}
