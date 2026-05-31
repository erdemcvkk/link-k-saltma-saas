"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Music, Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
 title: string;
 url: string; // Direct audio path or base64 audio dataURL
 isDark?: boolean;
 boxStyle?: React.CSSProperties;
 className?: string;
}

export default function AudioPlayer({ title, url, isDark = true, boxStyle, className = "" }: AudioPlayerProps) {
 const [isPlaying, setIsPlaying] = useState(false);
 const [currentTime, setCurrentTime] = useState(0);
 const [duration, setDuration] = useState(0);
 const [isMuted, setIsMuted] = useState(false);
 
 const audioRef = useRef<HTMLAudioElement>(null);
 const progressBarRef = useRef<HTMLDivElement>(null);

 // Default demo audio beat loop if url is not provided or fails to load
 const fallbackBeat = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
 const audioSrc = url || fallbackBeat;

 useEffect(() => {
 const audio = audioRef.current;
 if (!audio) return;

 const updateTime = () => setCurrentTime(audio.currentTime);
 const updateDuration = () => setDuration(audio.duration || 0);
 const handleEnded = () => {
 setIsPlaying(false);
 setCurrentTime(0);
 };

 audio.addEventListener("timeupdate", updateTime);
 audio.addEventListener("loadedmetadata", updateDuration);
 audio.addEventListener("ended", handleEnded);

 return () => {
 audio.removeEventListener("timeupdate", updateTime);
 audio.removeEventListener("loadedmetadata", updateDuration);
 audio.removeEventListener("ended", handleEnded);
 };
 }, []);

 const handlePlayToggle = (e: React.MouseEvent) => {
 e.stopPropagation();
 const audio = audioRef.current;
 if (!audio) return;

 if (isPlaying) {
 audio.pause();
 setIsPlaying(false);
 } else {
 audio.play().then(() => {
 setIsPlaying(true);
 }).catch(e => {
 console.log("Audio play blocked locally: ", e);
 });
 }
 };

 const handleMuteToggle = (e: React.MouseEvent) => {
 e.stopPropagation();
 const audio = audioRef.current;
 if (!audio) return;
 audio.muted = !isMuted;
 setIsMuted(!isMuted);
 };

 const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
 e.stopPropagation();
 const audio = audioRef.current;
 const progress = progressBarRef.current;
 if (!audio || !progress || !duration) return;

 const rect = progress.getBoundingClientRect();
 const clickX = e.clientX - rect.left;
 const clickPercentage = clickX / rect.width;
 const targetTime = clickPercentage * duration;
 
 audio.currentTime = targetTime;
 setCurrentTime(targetTime);
 };

 // Helper to format time in MM:SS
 const formatTime = (secs: number) => {
 if (isNaN(secs)) return "00:00";
 const minutes = Math.floor(secs / 60);
 const seconds = Math.floor(secs % 60);
 return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
 };

 const progressPercent = duration ? (currentTime / duration) * 100 : 0;

 return (
 <div
 style={boxStyle}
 className={`w-full overflow-hidden transition-all duration-300 border p-4 select-none ${className}`}
 >
 <audio ref={audioRef} src={audioSrc} preload="metadata" />

 {/* Primary Row: Play Button + Text Details */}
 <div className="flex items-center gap-4">
 {/* Play/Pause Button */}
 <button
 type="button"
 onClick={handlePlayToggle}
 className="h-11 w-11 rounded-full bg-purple-600 border border-purple-400 text-white flex items-center justify-center shrink-0 hover:bg-purple-500 hover:scale-105 active:scale-95 transition-all shadow-md shadow-purple-500/10"
 >
 {isPlaying ? (
 <Pause className="h-5 w-5 text-white fill-white" />
 ) : (
 <Play className="h-5 w-5 text-white fill-white ml-0.5" />
 )}
 </button>

 {/* Dynamic Wave and Text */}
 <div className="flex-1 min-w-0 space-y-1">
 <div className="flex flex-wrap items-center justify-between gap-2">
 <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 flex items-center gap-1 truncate">
 <Music className="h-3.5 w-3.5" /> Ses / Demo Beat Oynatıcı
 </span>
 <div className="flex gap-0.5 items-end h-3 px-1 shrink-0">
 {/* Audio wave dynamic visualization mockup bars */}
 {[...Array(6)].map((_, i) => (
 <span
 key={i}
 className={`w-[2.5px] bg-purple-500 rounded-full transition-all duration-200 ${
 isPlaying ? "animate-bounce" : "h-[4px]"
 }`}
 style={{
 animationDelay: `${i * 0.1}s`,
 animationDuration: `${0.6 + i * 0.15}s`,
 height: isPlaying ? undefined : "4px"
 }}
 />
 ))}
 </div>
 </div>
 <h4 className="text-xs font-black text-zinc-200 truncate max-w-[200px]">
 {title}
 </h4>
 </div>
 </div>

 {/* Secondary Row: Timeline Seekable progress bar */}
 <div className="mt-4 space-y-1.5">
 <div
 ref={progressBarRef}
 onClick={handleProgressBarClick}
 className="w-full h-2 rounded-full bg-zinc-900 border border-zinc-800/80 overflow-hidden cursor-pointer relative"
 >
 <div
 className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
 style={{ width: `${progressPercent}%` }}
 />
 </div>

 {/* Time duration tags & Mute control */}
 <div className="flex flex-wrap items-center justify-between text-[9px] font-bold text-zinc-500">
 <span>{formatTime(currentTime)}</span>
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={handleMuteToggle}
 className="hover:text-zinc-300 transition-colors"
 >
 {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
 </button>
 <span>{formatTime(duration)}</span>
 </div>
 </div>
 </div>
 </div>
 );
}
