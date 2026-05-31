"use client";

import React from 'react';
import Image from 'next/image';
import { MediaItem } from '@/types/media';

/**
 * Card component that displays a media preview and delete button.
 */
export default function MediaCard({ item, onDelete }: { item: MediaItem; onDelete: (id: string) => void }) {
 const isImage = item.mimeType.startsWith('image/');
 const isVideo = item.mimeType.startsWith('video/');
 const isAudio = item.mimeType.startsWith('audio/');

 return (
 <div className="admin-card">
 {isImage && (
 <Image src={item.url} alt={item.filename} width={200} height={150} className="object-cover w-full h-40" />
 )}
 {isVideo && (
 <video src={item.url} controls className="w-full h-40 object-cover" />
 )}
 {isAudio && (
 <audio src={item.url} controls className="w-full" />
 )}
 <div className="p-2">
 <p className="text-sm truncate" title={item.filename}>{item.filename}</p>
 <button
 onClick={() => onDelete(item.id)}
 className="mt-1 w-full px-2 py-3 md:py-2.5 md:py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
 >
 Sil
 </button>
 </div>
 </div>
 );
}
