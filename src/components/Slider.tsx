import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface SliderItem {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
}

/**
 * Simple auto‑advancing carousel with scroll‑snap.
 * Uses CSS for layout and a small interval timer for autoplay.
 */
export default function Slider() {
  const [items, setItems] = useState<SliderItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch slider items from the API on mount
  useEffect(() => {
    fetch('/api/slider')
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(() => setItems([]));
  }, []);

  // Autoplay: move to next slide every 5 seconds
  useEffect(() => {
    if (!items.length) return;
    intervalRef.current = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = containerRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const newPos = scrollLeft + clientWidth;
        containerRef.current.scrollTo({
          left: newPos > maxScroll ? 0 : newPos,
          behavior: 'smooth',
        });
      }
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [items]);

  if (!items.length) return null;

  return (
    <div className="relative w-full overflow-hidden py-8">
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-none gap-4 px-4"
      >
        {items.map((item) => (
          <a
            key={item.id}
            href={item.link ?? '#'}
            className="snap-start flex-shrink-0 w-full max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-zinc-900 transition-transform hover:scale-[1.02]"
          >
            <div className="relative h-48 w-full">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                {item.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
