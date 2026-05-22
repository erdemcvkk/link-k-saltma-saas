"use client";
import MediaLibrary from '@/components/admin/MediaLibrary';

/**
 * Admin Media Library page – renders MediaLibrary component.
 * Assumes middleware (or other auth) protects this route.
 */
export default function AdminMediaPage() {
  return <MediaLibrary />;
}
