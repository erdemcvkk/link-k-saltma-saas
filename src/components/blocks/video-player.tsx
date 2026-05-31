"use client";

import React, { useState } from "react";
import { Play, Maximize2, Minimize2, Video } from "lucide-react";

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837z" />
    <polygon points="9.545 15.568 15.818 12 9.545 8.432" fill="white" />
  </svg>
);

interface VideoPlayerProps {
  title: string;
  url: string;
  isDark?: boolean;
  boxStyle?: React.CSSProperties;
  className?: string;
}

export default function VideoPlayer({ title, url, isDark = true, boxStyle, className = "" }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTheater, setIsTheater] = useState(false);

  // Helper to extract YouTube video ID
  const getYouTubeEmbedUrl = (videoUrl: string) => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = videoUrl.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
      }
    } catch (e) {}
    return null;
  };

  // Helper to extract Vimeo video ID
  const getVimeoEmbedUrl = (videoUrl: string) => {
    try {
      const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
      const match = videoUrl.match(regExp);
      if (match && match[1]) {
        return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
      }
    } catch (e) {}
    return null;
  };

  const ytUrl = getYouTubeEmbedUrl(url);
  const vimeoUrl = getVimeoEmbedUrl(url);
  const isEmbed = ytUrl || vimeoUrl;

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleTheaterToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTheater(!isTheater);
  };

  return (
    <>
      {/* Video Block Card container */}
      <div
        style={boxStyle}
        className={`w-full overflow-hidden transition-all duration-300 border ${
          isTheater ? "relative z-40 ring-4 ring-purple-500/25" : ""
        } ${className}`}
      >
        {!isPlaying ? (
          /* Thumbnail preview state before playing */
          <div 
            onClick={handlePlayToggle}
            className="group relative w-full aspect-video bg-zinc-950 cursor-pointer flex flex-col items-center justify-center p-4 select-none"
          >
            {/* Background absolute dark glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
            
            {/* Simulated cover thumbnail style */}
            <div className="absolute inset-0 bg-cover bg-center opacity-65 blur-[1px] group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400&auto=format&fit=crop')` }}
            />

            {/* Glowing Custom Play Button Overlay */}
            <div className="relative z-20 h-14 w-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-purple-600 group-hover:border-purple-400 group-hover:shadow-purple-500/40 transition-all duration-300">
              <Play className="h-6 w-6 text-white fill-white ml-0.5" />
            </div>

            {/* Title Text */}
            <div className="relative z-20 mt-3 text-center">
              <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase flex items-center justify-center gap-1">
                {ytUrl ? <YoutubeIcon className="h-3.5 w-3.5 text-red-600" /> : <Video className="h-3.5 w-3.5" />}
                Sinematik Gösterim
              </span>
              <h4 className="text-xs font-black text-white drop-shadow-md mt-1 truncate max-w-[240px]">
                {title}
              </h4>
            </div>
          </div>
        ) : (
          /* Playing player component state */
          <div className="relative w-full aspect-video bg-black flex flex-col justify-between">
            {isEmbed ? (
              <iframe
                src={ytUrl || vimeoUrl || ""}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            )}

            {/* Custom Overlay control bar */}
            <div className="absolute bottom-2 right-2 z-30 flex items-center gap-2">
              <button
                type="button"
                onClick={handleTheaterToggle}
                className="p-2 rounded-lg bg-black/60 backdrop-blur border border-white/10 text-white hover:bg-black/90 transition-all"
                title={isTheater ? "Tiyatro Modundan Çık" : "Tiyatro Modu"}
              >
                {isTheater ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                onClick={handlePlayToggle}
                className="px-3 py-3 md:py-2.5 md:py-1.5 rounded-lg bg-purple-600 border border-purple-400 text-[10px] font-black uppercase text-white hover:bg-purple-500 transition-all shadow-md shadow-purple-500/10"
              >
                Kapat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating backdrop blur overlay when in Theater mode */}
      {isTheater && (
        <div 
          onClick={() => setIsTheater(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-lg z-30 transition-all duration-300 cursor-zoom-out"
        />
      )}
    </>
  );
}
