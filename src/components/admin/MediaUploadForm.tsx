"use client";

import React, { useRef, useState, DragEvent } from 'react';

/**
 * Drag‑and‑drop + file selector upload form.
 * Uses admin CSS classes for styling.
 */
export default function MediaUploadForm({ onUploadSuccess }: { onUploadSuccess: () => void }) {
 const fileInputRef = useRef<HTMLInputElement>(null);
 const [dragActive, setDragActive] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const handleFiles = async (files: FileList) => {
 const file = files[0];
 if (!file) return;
 const formData = new FormData();
 formData.append('file', file);
 try {
 const res = await fetch('/api/media', {
 method: 'POST',
 body: formData,
 });
 if (!res.ok) throw new Error('Upload failed');
 setError(null);
 onUploadSuccess();
 } catch (e: any) {
 setError(e.message);
 }
 };

 const handleDrop = (e: DragEvent<HTMLDivElement>) => {
 e.preventDefault();
 e.stopPropagation();
 setDragActive(false);
 if (e.dataTransfer.files && e.dataTransfer.files.length) {
 handleFiles(e.dataTransfer.files);
 }
 };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 if (e.target.files) {
 handleFiles(e.target.files);
 }
 };

 return (
 <div
 className={`upload-form ${dragActive ? 'drag-active' : ''}`}
 onDragOver={(e) => {
 e.preventDefault();
 setDragActive(true);
 }}
 onDragLeave={(e) => {
 e.preventDefault();
 setDragActive(false);
 }}
 onDrop={handleDrop}
 >
 <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
 Dosyayı sürükle bırak veya tıkla seç
 </p>
 <button
 type="button"
 onClick={() => fileInputRef.current?.click()}
 className="btn-primary"
 >
 Dosya Seç
 </button>
 <input
 type="file"
 ref={fileInputRef}
 className="hidden"
 onChange={handleChange}
 accept="image/*,video/*,audio/*"
 />
 {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
 </div>
 );

}
