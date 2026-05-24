"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Wifi, Battery, Signal } from 'lucide-react';

interface SliderItem {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
}

interface PhoneSliderProps {
  isDark?: boolean;
  initialItems?: SliderItem[];
}

/**
 * Premium phone mockup slider carousel.
 * Displays slider items inside a realistic phone frame with autoplay.
 */
export default function Slider({ isDark = true, initialItems = [] }: PhoneSliderProps) {
  const [items, setItems] = useState<SliderItem[]>(initialItems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialItems.length > 0) return; // Skip fetch if SSR provided items
    fetch('/api/slider')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      })
      .catch(() => setItems([]));
  }, [initialItems]);

  // Autoplay
  useEffect(() => {
    if (items.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [items]);

  const goTo = (index: number) => {
    setCurrentIndex(index);
    // Reset autoplay timer
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);
  };

  const prev = () => goTo(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
  const next = () => goTo((currentIndex + 1) % items.length);

  if (!items.length) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-10">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest mb-4 ${
            isDark ? "bg-purple-950/30 border-purple-500/30 text-purple-400" : "bg-purple-50 border-purple-200 text-purple-600"
          }`}>
            📱 Mobil Önizleme
          </span>
          <h2 className={`text-2xl md:text-4xl font-black tracking-tight ${
            isDark ? "text-white" : "text-zinc-900"
          }`}>
            Linkleriniz Böyle Görünecek
          </h2>
          <p className={`text-sm mt-2 max-w-md mx-auto ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
            Oluşturduğunuz profil sayfası mobil cihazlarda mükemmel şekilde sergilenir
          </p>
        </div>

        {/* Phone + Controls Container */}
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {/* Previous Button */}
          {items.length > 1 && (
            <button
              onClick={prev}
              className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full border transition-all cursor-pointer ${
                isDark 
                  ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]" 
                  : "bg-white border-zinc-200 text-zinc-400 hover:text-zinc-800 hover:border-purple-300 shadow-sm"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Phone Mockup */}
          <div className="relative">
            {/* Ambient Glow */}
            <div className={`absolute -inset-8 rounded-[4rem] blur-3xl pointer-events-none transition-opacity ${
              isDark ? "bg-purple-600/10 opacity-100" : "bg-purple-400/5 opacity-60"
            }`} />

            {/* Phone Frame */}
            <div className={`relative w-[280px] sm:w-[300px] rounded-[3rem] p-[3px] transition-all duration-500 ${
              isDark 
                ? "bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(168,85,247,0.1)]" 
                : "bg-gradient-to-b from-zinc-200 via-zinc-300 to-zinc-400 shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            }`}>
              <div className={`relative rounded-[2.8rem] overflow-hidden ${
                isDark ? "bg-black" : "bg-white"
              }`}>
                {/* Status Bar */}
                <div className={`relative z-20 flex items-center justify-between px-7 pt-3 pb-1 ${
                  isDark ? "text-white" : "text-zinc-900"
                }`}>
                  <span className="text-[10px] font-semibold">9:41</span>
                  <div className="flex items-center gap-1">
                    <Signal className="h-2.5 w-2.5" />
                    <Wifi className="h-2.5 w-2.5" />
                    <Battery className="h-3 w-3" />
                  </div>
                </div>

                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30">
                  <div className={`w-[100px] h-[28px] rounded-b-2xl ${
                    isDark ? "bg-black" : "bg-zinc-900"
                  }`}>
                    <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-700 ring-1 ring-zinc-600" />
                  </div>
                </div>

                {/* Screen Content – Image */}
                <div className="relative aspect-[9/17] overflow-hidden">
                  {currentItem.link ? (
                    <a href={currentItem.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                      <Image
                        src={currentItem.imageUrl}
                        alt={currentItem.title}
                        fill
                        className="object-cover transition-all duration-700"
                        sizes="300px"
                        priority
                      />
                    </a>
                  ) : (
                    <Image
                      src={currentItem.imageUrl}
                      alt={currentItem.title}
                      fill
                      className="object-cover transition-all duration-700"
                      sizes="300px"
                      priority
                    />
                  )}

                  {/* Bottom Gradient Overlay for Title */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                  
                  {/* Title Overlay */}
                  {currentItem.title && (
                    <div className="absolute bottom-4 left-0 right-0 text-center z-10 px-4">
                      <p className="text-white text-xs font-bold drop-shadow-lg truncate">
                        {currentItem.title}
                      </p>
                    </div>
                  )}
                </div>

                {/* Home Indicator */}
                <div className={`flex justify-center py-2 ${isDark ? "bg-black" : "bg-white"}`}>
                  <div className={`w-28 h-1 rounded-full ${isDark ? "bg-zinc-700" : "bg-zinc-300"}`} />
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-wider whitespace-nowrap z-20 ${
              isDark 
                ? "bg-zinc-950 border-purple-500/30 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)]" 
                : "bg-white border-purple-200 text-purple-600 shadow-md"
            }`}>
              {items.length > 1 ? `${currentIndex + 1} / ${items.length}` : "Live Preview"}
            </div>
          </div>

          {/* Next Button */}
          {items.length > 1 && (
            <button
              onClick={next}
              className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full border transition-all cursor-pointer ${
                isDark 
                  ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]" 
                  : "bg-white border-zinc-200 text-zinc-400 hover:text-zinc-800 hover:border-purple-300 shadow-sm"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Dot Indicators */}
        {items.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? `w-6 h-2 ${isDark ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "bg-purple-500"}`
                    : `w-2 h-2 ${isDark ? "bg-zinc-700 hover:bg-zinc-600" : "bg-zinc-300 hover:bg-zinc-400"}`
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
