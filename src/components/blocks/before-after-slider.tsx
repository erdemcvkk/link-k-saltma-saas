"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sliders } from "lucide-react";

interface BeforeAfterSliderProps {
 title: string;
 beforeImage: string; // Base64 dataURL or direct web link
 afterImage: string; // Base64 dataURL or direct web link
 isDark?: boolean;
 boxStyle?: React.CSSProperties;
 className?: string;
}

export default function BeforeAfterSlider({
 title,
 beforeImage,
 afterImage,
 isDark = true,
 boxStyle,
 className = ""
}: BeforeAfterSliderProps) {
 const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100 percentage
 const [isDragging, setIsDragging] = useState(false);
 const containerRef = useRef<HTMLDivElement>(null);

 const handleMove = (clientX: number) => {
 if (!containerRef.current) return;
 const rect = containerRef.current.getBoundingClientRect();
 const x = clientX - rect.left;
 const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
 setSliderPosition(percentage);
 };

 const handleMouseMove = (e: React.MouseEvent) => {
 if (!isDragging) return;
 handleMove(e.clientX);
 };

 const handleTouchMove = (e: React.TouchEvent) => {
 if (!isDragging) return;
 if (e.touches[0]) {
 handleMove(e.touches[0].clientX);
 }
 };

 // Mouse up event listener globally to ensure smooth drop transitions
 useEffect(() => {
 const handleMouseUp = () => setIsDragging(false);
 window.addEventListener("mouseup", handleMouseUp);
 window.addEventListener("touchend", handleMouseUp);
 
 return () => {
 window.removeEventListener("mouseup", handleMouseUp);
 window.removeEventListener("touchend", handleMouseUp);
 };
 }, []);

 // Simple fallbacks if no image provided
 const fallbackBefore = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop";
 const fallbackAfter = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop";

 const imgBefore = beforeImage || fallbackBefore;
 const imgAfter = afterImage || fallbackAfter;

 return (
 <div
 style={boxStyle}
 className={`w-full overflow-hidden transition-all duration-300 border flex flex-col justify-between p-3 select-none ${className}`}
 >
 {/* Label Title banner */}
 <div className="flex flex-wrap items-center justify-between mb-2">
 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1">
 <Sliders className="h-3 w-3 animate-pulse" /> Karşılaştırma Vitrini
 </span>
 <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Sürükleyin</span>
 </div>

 <h4 className="text-xs font-black text-zinc-200 mb-2.5 truncate max-w-[260px]">
 {title}
 </h4>

 {/* Primary Comparative Slider Canvas viewport */}
 <div
 ref={containerRef}
 onMouseMove={handleMouseMove}
 onTouchMove={handleTouchMove}
 onMouseDown={() => setIsDragging(true)}
 onTouchStart={() => setIsDragging(true)}
 className="relative w-full aspect-video bg-zinc-950 rounded-lg overflow-hidden cursor-ew-resize border border-zinc-900"
 >
 {/* BEFORE IMAGE (Bottom base layer) */}
 <img
 src={imgBefore}
 alt="Before style"
 className="absolute inset-0 w-full h-full object-cover pointer-events-none"
 />
 <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur border border-white/10 text-[8px] font-black text-white uppercase select-none">
 ÖNCE (BEFORE)
 </div>

 {/* AFTER IMAGE (Top overlapping clipped layer) */}
 <div
 className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
 style={{ width: `${sliderPosition}%` }}
 >
 <img
 src={imgAfter}
 alt="After style"
 className="absolute inset-0 w-full h-full object-cover pointer-events-none max-w-none"
 style={{ width: containerRef.current?.getBoundingClientRect().width }}
 />
 </div>
 <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-md bg-purple-600/70 backdrop-blur border border-purple-400/25 text-[8px] font-black text-white uppercase select-none">
 SONRA (AFTER)
 </div>

 {/* CENTER SLIDER DRAG BAR SPLITTER HANDLE */}
 <div
 className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_8px_rgba(0,0,0,0.5)]"
 style={{ left: `${sliderPosition}%` }}
 >
 <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-white text-zinc-950 border-2 border-zinc-900 shadow-2xl flex items-center justify-center pointer-events-none">
 <Sliders className="h-3.5 w-3.5 rotate-90" />
 </div>
 </div>
 </div>
 </div>
 );
}
