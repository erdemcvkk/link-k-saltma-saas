"use client";

import React from "react";
import Link from "next/link";

interface Creator {
 id: string;
 name: string;
 username: string;
 imageUrl: string;
}

interface CreatorCarouselProps {
 creators: Creator[];
}

export default function CreatorCarousel({ creators }: CreatorCarouselProps) {
 if (!creators || creators.length === 0) return null;

 // Duplicate the array to create a seamless infinite loop
 const displayCreators = [...creators, ...creators, ...creators];

 return (
 <div className="w-full overflow-hidden bg-white py-12 border-b border-gray-100">

 <div className="relative flex overflow-x-hidden group">
 <div className="animate-marquee flex whitespace-nowrap">
 {displayCreators.map((creator, idx) => (
 <Link 
 href={`/${creator.username}`}
 key={`${creator.id}-${idx}`} 
 className="flex flex-col items-center mx-6 group/item"
 >
 <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover/item:border-teal-400 transition-colors shadow-sm">
 <img 
 src={creator.imageUrl} 
 alt={creator.name} 
 className="w-full h-full object-cover"
 />
 </div>
 <h3 className="text-sm font-bold text-slate-900">{creator.name}</h3>
 <p className="text-xs text-slate-500">@{creator.username}</p>
 </Link>
 ))}
 </div>
 
 {/* Second identical div for seamless marquee */}
 <div className="animate-marquee flex whitespace-nowrap" aria-hidden="true">
 {displayCreators.map((creator, idx) => (
 <Link 
 href={`/${creator.username}`}
 key={`dup-${creator.id}-${idx}`} 
 className="flex flex-col items-center mx-6 group/item"
 >
 <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover/item:border-teal-400 transition-colors shadow-sm">
 <img 
 src={creator.imageUrl} 
 alt={creator.name} 
 className="w-full h-full object-cover"
 />
 </div>
 <h3 className="text-sm font-bold text-slate-900">{creator.name}</h3>
 <p className="text-xs text-slate-500">@{creator.username}</p>
 </Link>
 ))}
 </div>
 </div>
 </div>
 );
}
