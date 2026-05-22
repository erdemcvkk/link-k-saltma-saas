"use client";

import React, { useEffect, useState } from 'react';
import MediaCard from '@/components/admin/MediaCard';
import MediaUploadForm from '@/components/admin/MediaUploadForm';
import { MediaItem } from '@/types/media';

/**
 * Displays a grid of media items with upload capability.
 * Handles fetching, deleting and re‑loading of the gallery.
 */
export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      if (!res.ok) throw new Error('Failed to load media');
      const data: MediaItem[] = await res.json();
      setMedia(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await fetchMedia();
    } catch (e: any) {
      alert(e.message);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-zinc-800 dark:text-zinc-200">Medya Kütüphanesi</h1>
      <MediaUploadForm onUploadSuccess={fetchMedia} />
      {loading && <p className="mt-4 text-zinc-600 dark:text-zinc-400">Yükleniyor...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {media.map(item => (
          <MediaCard key={item.id} item={item} onDelete={handleDelete} />
        ))}
      </div>
    </section>
  );

}
