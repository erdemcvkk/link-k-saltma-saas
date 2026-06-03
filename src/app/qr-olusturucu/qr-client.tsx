"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { 
  ArrowLeft, Download, Info, LayoutGrid, Check, 
  Smartphone, Laptop, RefreshCw, Upload, Image as ImageIcon,
  Music, MessageCircle, Sliders, Palette, Type, ShieldCheck
} from "lucide-react";
import GlobalOverlayManager from "@/components/global-overlay-manager";

// Custom SVG components for icons not present/exported in local lucide-react version
const Chrome = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

// Logo SVG Strings for center QR Code
const SPOTIFY_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1ED760"/><path d="M17.503 17.268c-.146.239-.452.317-.692.171-1.89-1.155-4.269-1.415-7.072-.774-.27.06-.532-.109-.592-.378-.06-.27.11-.532.378-.593 3.036-.696 5.666-.398 7.785.897.239.146.317.452.193.678zm.979-2.178c-.187.306-.575.405-.882.217-2.155-1.321-5.438-1.704-7.983-.932-.357.106-.732-.095-.838-.452-.106-.357.095-.732.452-.838 2.906-.881 6.521-.454 8.987 1.063.306.188.405.575.217.882zm.084-2.268c-.227.318-.65.412-.967.193-2.456-1.758-6.208-2.023-9.143-1.106-.388.118-.795-.098-.913-.487-.118-.388.098-.795.487-.913 3.328-1.012 7.502-.693 10.491 1.256.318.226.412.65.193.967z" fill="#000000"/></svg>`;

const YOUTUBE_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="#FF0000"/><path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF"/></svg>`;

const WHATSAPP_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#25D366"/><path d="M12 3.5c-4.69 0-8.5 3.81-8.5 8.5 0 1.5.4 2.96 1.15 4.25L3.5 20.5l4.38-1.15c1.24.68 2.63 1.05 4.12 1.05 4.69 0 8.5-3.81 8.5-8.5S16.69 3.5 12 3.5zm5.19 11.23c-.22-.11-1.33-.66-1.54-.73-.21-.08-.36-.12-.51.11-.15.22-.58.73-.71.88-.13.15-.26.17-.48.06-.22-.11-.93-.34-1.78-1.1-.66-.59-1.1-1.31-1.23-1.53-.13-.22-.01-.34.1-.45.1-.1.22-.24.33-.36.11-.12.15-.2.22-.33.07-.13.04-.26-.02-.37-.06-.11-.51-1.23-.7-1.69-.19-.45-.38-.39-.51-.39-.13 0-.29-.01-.44-.01s-.39.06-.59.28c-.2.22-.77.75-.77 1.83s.79 2.12.9 2.27c.11.15 1.55 2.37 3.75 3.32.52.22.93.36 1.25.46.52.17.99.14 1.36.09.41-.06 1.33-.54 1.52-1.07.19-.53.19-.99.13-1.09-.06-.09-.22-.15-.44-.26z" fill="#FFFFFF"/></svg>`;

const TIKTOK_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#000000"/><g transform="translate(0.5, 0.5)"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.76-.59v7.35c0 3.32-2.68 6.01-6 6.01-3.32 0-6-2.69-6-6.01 0-3.32 2.68-6.01 6-6.01.43 0 .86.05 1.28.14v4.03c-.42-.14-.86-.23-1.28-.23-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2V.02z" fill="#25F4EE"/></g><g transform="translate(-0.5, -0.5)"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.76-.59v7.35c0 3.32-2.68 6.01-6 6.01-3.32 0-6-2.69-6-6.01 0-3.32 2.68-6.01 6-6.01.43 0 .86.05 1.28.14v4.03c-.42-.14-.86-.23-1.28-.23-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2V.02z" fill="#FE2C55"/></g><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.76-.59v7.35c0 3.32-2.68 6.01-6 6.01-3.32 0-6-2.69-6-6.01 0-3.32 2.68-6.01 6-6.01.43 0 .86.05 1.28.14v4.03c-.42-.14-.86-.23-1.28-.23-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2V.02z" fill="#FFFFFF"/></svg>`;

const LINKEDIN_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#0A66C2"/><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" fill="#FFFFFF"/></svg>`;

const GOOGLE_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.28 6.61l3.99 3.1C6.22 6.86 8.87 4.75 12 4.75z"/><path fill="#4285F4" d="M23.25 12c0-.81-.07-1.58-.21-2.33H12v4.51h6.32c-.27 1.46-1.1 2.69-2.34 3.52l3.63 2.81c2.13-1.97 3.64-4.87 3.64-8.51z"/><path fill="#FBBC05" d="M5.27 14.29c-.24-.73-.38-1.5-.38-2.29s.14-1.56.38-2.29L1.28 6.61C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.39l3.99-3.1z"/><path fill="#34A853" d="M12 24c3.24 0 5.97-1.07 7.96-2.91l-3.63-2.81c-1.01.68-2.31 1.08-4.33 1.08-3.13 0-5.78-2.11-6.73-5.01L1.28 17.45C3.25 21.31 7.31 24 12 24z"/></svg>`;

const STANDART_CENTER_SVG = "";

interface QrClientProps {
  userId: string | null;
  siteTitle: string;
  siteLogo: string;
}

type PlatformPreset = {
  id: string;
  name: string;
  defaultCta: string;
  defaultUrl: string;
  defaultTitle: string;
  defaultBusinessName: string;
  primaryColor: string;
  cardBg: string;
  textColor: string;
  qrColor: string;
  centerLogoSvg: string;
  topLogoRenderer: (color: string) => React.ReactNode;
};

export default function QrClient({ userId, siteTitle, siteLogo }: QrClientProps) {
  // Brand Logo Renderers for top of card
  const renderSpotifyLogo = (color: string) => (
    <g transform="scale(2.5) translate(-12, -12)">
      <circle cx="12" cy="12" r="12" fill="#1ED760" />
      <path d="M17.503 17.268c-.146.239-.452.317-.692.171-1.89-1.155-4.269-1.415-7.072-.774-.27.06-.532-.109-.592-.378-.06-.27.11-.532.378-.593 3.036-.696 5.666-.398 7.785.897.239.146.317.452.193.678zm.979-2.178c-.187.306-.575.405-.882.217-2.155-1.321-5.438-1.704-7.983-.932-.357.106-.732-.095-.838-.452-.106-.357.095-.732.452-.838 2.906-.881 6.521-.454 8.987 1.063.306.188.405.575.217.882zm.084-2.268c-.227.318-.65.412-.967.193-2.456-1.758-6.208-2.023-9.143-1.106-.388.118-.795-.098-.913-.487-.118-.388.098-.795.487-.913 3.328-1.012 7.502-.693 10.491 1.256.318.226.412.65.193.967z" fill="#000000" />
    </g>
  );

  const renderYoutubeLogo = (color: string) => (
    <g transform="scale(2.5) translate(-12, -12)">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="#FF0000" />
      <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
    </g>
  );

  const renderWhatsappLogo = (color: string) => (
    <g transform="scale(2.5) translate(-12, -12)">
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path d="M12 3.5c-4.69 0-8.5 3.81-8.5 8.5 0 1.5.4 2.96 1.15 4.25L3.5 20.5l4.38-1.15c1.24.68 2.63 1.05 4.12 1.05 4.69 0 8.5-3.81 8.5-8.5S16.69 3.5 12 3.5zm5.19 11.23c-.22-.11-1.33-.66-1.54-.73-.21-.08-.36-.12-.51.11-.15.22-.58.73-.71.88-.13.15-.26.17-.48.06-.22-.11-.93-.34-1.78-1.1-.66-.59-1.1-1.31-1.23-1.53-.13-.22-.01-.34.1-.45.1-.1.22-.24.33-.36.11-.12.15-.2.22-.33.07-.13.04-.26-.02-.37-.06-.11-.51-1.23-.7-1.69-.19-.45-.38-.39-.51-.39-.13 0-.29-.01-.44-.01s-.39.06-.59.28c-.2.22-.77.75-.77 1.83s.79 2.12.9 2.27c.11.15 1.55 2.37 3.75 3.32.52.22.93.36 1.25.46.52.17.99.14 1.36.09.41-.06 1.33-.54 1.52-1.07.19-.53.19-.99.13-1.09-.06-.09-.22-.15-.44-.26z" fill="#FFFFFF" />
    </g>
  );

  const renderTiktokLogo = (color: string) => (
    <g transform="scale(2.5) translate(-12, -12)">
      <circle cx="12" cy="12" r="12" fill="#000000" />
      <g transform="translate(0.5, 0.5)">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.76-.59v7.35c0 3.32-2.68 6.01-6 6.01-3.32 0-6-2.69-6-6.01 0-3.32 2.68-6.01 6-6.01.43 0 .86.05 1.28.14v4.03c-.42-.14-.86-.23-1.28-.23-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2V.02z" fill="#25F4EE" />
      </g>
      <g transform="translate(-0.5, -0.5)">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.76-.59v7.35c0 3.32-2.68 6.01-6 6.01-3.32 0-6-2.69-6-6.01 0-3.32 2.68-6.01 6-6.01.43 0 .86.05 1.28.14v4.03c-.42-.14-.86-.23-1.28-.23-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2V.02z" fill="#FE2C55" />
      </g>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.76-.59v7.35c0 3.32-2.68 6.01-6 6.01-3.32 0-6-2.69-6-6.01 0-3.32 2.68-6.01 6-6.01.43 0 .86.05 1.28.14v4.03c-.42-.14-.86-.23-1.28-.23-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2V.02z" fill="#FFFFFF" />
    </g>
  );

  const renderLinkedinLogo = (color: string) => (
    <g transform="scale(2.5) translate(-12, -12)">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" fill="#FFFFFF" />
    </g>
  );

  const renderGoogleLogo = (color: string) => (
    <g transform="scale(2.5) translate(-12, -12)">
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.28 6.61l3.99 3.1C6.22 6.86 8.87 4.75 12 4.75z"/>
      <path fill="#4285F4" d="M23.25 12c0-.81-.07-1.58-.21-2.33H12v4.51h6.32c-.27 1.46-1.1 2.69-2.34 3.52l3.63 2.81c2.13-1.97 3.64-4.87 3.64-8.51z"/>
      <path fill="#FBBC05" d="M5.27 14.29c-.24-.73-.38-1.5-.38-2.29s.14-1.56.38-2.29L1.28 6.61C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.39l3.99-3.1z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.97-1.07 7.96-2.91l-3.63-2.81c-1.01.68-2.31 1.08-4.33 1.08-3.13 0-5.78-2.11-6.73-5.01L1.28 17.45C3.25 21.31 7.31 24 12 24z"/>
    </g>
  );

  const renderDefaultLogo = (color: string) => (
    <g transform="translate(-25, -25) scale(1)">
      <circle cx="25" cy="25" r="23" fill={color} />
      <path d="M15 15h6v6h-6v-6zm0 14h6v6h-6v-6zm14-14h6v6h-6v-6zm0 14h6v6h-6v-6zM21 21h8v8h-8v-8zm1 1v6h6v-6h-6z" fill="#FFFFFF" />
    </g>
  );

  const presets: PlatformPreset[] = [
    {
      id: "google",
      name: "Google Review",
      defaultCta: "Google'da Değerlendir",
      defaultUrl: "https://g.page/r/your-business-link",
      defaultTitle: "review us on Google",
      defaultBusinessName: "MİSAFİR AĞIRLAMA LTD.",
      primaryColor: "#4285F4",
      cardBg: "#f8fafc",
      textColor: "#334155",
      qrColor: "#1e293b",
      centerLogoSvg: GOOGLE_CENTER_SVG,
      topLogoRenderer: renderGoogleLogo
    },
    {
      id: "spotify",
      name: "Spotify",
      defaultCta: "Spotify'da Takip Et",
      defaultUrl: "https://open.spotify.com/artist/your-artist-id",
      defaultTitle: "listen on Spotify",
      defaultBusinessName: "KREATÖR ÇALMA LİSTESİ",
      primaryColor: "#1DB954",
      cardBg: "#0c0a09",
      textColor: "#ffffff",
      qrColor: "#ffffff",
      centerLogoSvg: SPOTIFY_CENTER_SVG,
      topLogoRenderer: renderSpotifyLogo
    },
    {
      id: "youtube",
      name: "YouTube",
      defaultCta: "Kanalıma Abone Ol",
      defaultUrl: "https://youtube.com/@your-channel",
      defaultTitle: "subscribe on YouTube",
      defaultBusinessName: "DİJİTAL İÇERİK ATÖLYESİ",
      primaryColor: "#FF0000",
      cardBg: "#ffffff",
      textColor: "#0f172a",
      qrColor: "#0f172a",
      centerLogoSvg: YOUTUBE_CENTER_SVG,
      topLogoRenderer: renderYoutubeLogo
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      defaultCta: "WhatsApp'tan Mesaj Gönder",
      defaultUrl: "https://wa.me/905000000000",
      defaultTitle: "chat on WhatsApp",
      defaultBusinessName: "DESTEK HATTI",
      primaryColor: "#25D366",
      cardBg: "#f0fdf4",
      textColor: "#166534",
      qrColor: "#14532d",
      centerLogoSvg: WHATSAPP_CENTER_SVG,
      topLogoRenderer: renderWhatsappLogo
    },
    {
      id: "tiktok",
      name: "TikTok",
      defaultCta: "TikTok'ta Takip Et",
      defaultUrl: "https://tiktok.com/@your-profile",
      defaultTitle: "follow on TikTok",
      defaultBusinessName: "EĞLENCE ATÖLYESİ",
      primaryColor: "#000000",
      cardBg: "#09090b",
      textColor: "#ffffff",
      qrColor: "#ffffff",
      centerLogoSvg: TIKTOK_CENTER_SVG,
      topLogoRenderer: renderTiktokLogo
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      defaultCta: "LinkedIn'de Bağlantı Kur",
      defaultUrl: "https://linkedin.com/in/your-profile",
      defaultTitle: "connect on LinkedIn",
      defaultBusinessName: "PROFESYONEL AĞ",
      primaryColor: "#0077B5",
      cardBg: "#f0f9ff",
      textColor: "#0369a1",
      qrColor: "#0c4a6e",
      centerLogoSvg: LINKEDIN_CENTER_SVG,
      topLogoRenderer: renderLinkedinLogo
    },
    {
      id: "standart",
      name: "Standart QR",
      defaultCta: "Bağlantıyı Tara",
      defaultUrl: "https://link.saas",
      defaultTitle: "scan to visit",
      defaultBusinessName: "ŞİRKETİMİZ",
      primaryColor: "#09090b",
      cardBg: "#ffffff",
      textColor: "#0f172a",
      qrColor: "#000000",
      centerLogoSvg: STANDART_CENTER_SVG,
      topLogoRenderer: renderDefaultLogo
    }
  ];

  // State definitions
  const [selectedPreset, setSelectedPreset] = useState<PlatformPreset>(presets[0]);
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">("vertical");
  const [targetUrl, setTargetUrl] = useState(presets[0].defaultUrl);
  const [ctaText, setCtaText] = useState(presets[0].defaultCta);
  const [titleText, setTitleText] = useState(presets[0].defaultTitle);
  const [businessName, setBusinessName] = useState(presets[0].defaultBusinessName);
  
  // Customization States
  const [customColorsEnabled, setCustomColorsEnabled] = useState(false);
  const [cardBg, setCardBg] = useState(presets[0].cardBg);
  const [textColor, setTextColor] = useState(presets[0].textColor);
  const [qrColor, setQrColor] = useState(presets[0].qrColor);
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  // Synchronize state when switching preset
  const handlePresetSelect = (preset: PlatformPreset) => {
    setSelectedPreset(preset);
    setTargetUrl(preset.defaultUrl);
    setCtaText(preset.defaultCta);
    setTitleText(preset.defaultTitle);
    setBusinessName(preset.defaultBusinessName);
    
    // Automatically apply theme color if custom overrides are off
    if (!customColorsEnabled) {
      setCardBg(preset.cardBg);
      setTextColor(preset.textColor);
      setQrColor(preset.qrColor);
    }
  };

  const handleCustomColorReset = () => {
    setCardBg(selectedPreset.cardBg);
    setTextColor(selectedPreset.textColor);
    setQrColor(selectedPreset.qrColor);
    setCustomColorsEnabled(false);
  };

  // Image Upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getSvgLogoUrl = (svgContent: string) => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
  };

  // Canvas-based download handler
  const handleDownload = (format: "png" | "jpeg" | "svg") => {
    const svgEl = document.getElementById("qr-card-svg") as SVGElement | null;
    if (!svgEl) return;

    // Serialize SVG element
    const svgString = new XMLSerializer().serializeToString(svgEl);

    if (format === "svg") {
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedPreset.id}_qr_card.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // 3x multiplier for ultra-crisp high-res output
      const scale = 3;
      const width = orientation === "vertical" ? 400 : 640;
      const height = orientation === "vertical" ? 640 : 400;

      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // High-fidelity scaling context settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const img = new Image();
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = format === "png"
            ? canvas.toDataURL("image/png")
            : canvas.toDataURL("image/jpeg", 0.95);

          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${selectedPreset.id}_qr_card.${format}`;
          link.click();
          URL.revokeObjectURL(url);
        };
        img.src = url;
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <GlobalOverlayManager />

      {/* Main navigation header matching home page layout */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all">
            <ArrowLeft className="h-5 w-5 text-zinc-400" />
            <span className="text-xl font-black tracking-tight text-white">Ana Sayfa</span>
          </Link>
          <div className="flex items-center space-x-4">
            {userId ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold text-xs md:text-sm transition-all"
              >
                Yönetim Paneli
              </Link>
            ) : (
              <Link
                href="/sign-up"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-blue to-light-blue text-white font-bold text-xs md:text-sm transition-all"
              >
                Hemen Üye Ol
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Grid container with modern dark aesthetics */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1.5 rounded-full bg-neon-blue/10 text-neon-blue font-bold text-xs tracking-wider uppercase">
            Ücretsiz Akıllı Araç
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-4 tracking-tight leading-tight">
            Markalı QR Kart <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-light-blue">Tasarlayıcı</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-400 font-medium mt-3 leading-relaxed">
            Sosyal medya, mesajlaşma ve web siteniz için ortasında logo bulunan yüksek kaliteli QR kartlar oluşturun ve dikey/yatay olarak indirin.
          </p>
        </div>

        {/* Platform preset tabs with glowing micro-animations */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-4xl mx-auto">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className={`px-4 py-3 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedPreset.id === preset.id
                  ? "bg-gradient-to-r from-neon-blue to-light-blue text-white shadow-lg shadow-neon-blue/15"
                  : "bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white"
              }`}
            >
              {preset.id === "google" && <Chrome className="h-3.5 w-3.5" />}
              {preset.id === "spotify" && <Music className="h-3.5 w-3.5" />}
              {preset.id === "youtube" && <Youtube className="h-3.5 w-3.5" />}
              {preset.id === "whatsapp" && <MessageCircle className="h-3.5 w-3.5" />}
              {preset.id === "tiktok" && <Music className="h-3.5 w-3.5" />}
              {preset.id === "linkedin" && <Linkedin className="h-3.5 w-3.5" />}
              {preset.id === "standart" && <LayoutGrid className="h-3.5 w-3.5" />}
              {preset.name}
            </button>
          ))}
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-6 bg-zinc-950 p-6 md:p-8 rounded-[2.5rem] border border-zinc-900 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-zinc-900 pb-4">
              <Sliders className="h-5 w-5 text-neon-blue" />
              Tasarım Ayarları
            </h2>

            {/* URL/Target Input */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">Hedef Bağlantı (URL)</label>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="Örn: https://youtube.com/@kanaliniz"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-sm text-white transition-all"
              />
            </div>

            {/* Form Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Call to action */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">Alt Başlık (CTA)</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Örn: YouTube'da Abone Ol"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-sm text-white transition-all"
                />
              </div>

              {/* Title Text */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">Üst Slogan</label>
                <input
                  type="text"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  placeholder="Örn: subscribe on YouTube"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-sm text-white transition-all"
                />
              </div>
            </div>

            {/* Business name */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">Firma / Kanal Adı</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Örn: BUSINESS NAME"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-sm text-white transition-all"
              />
            </div>

            {/* Layout direction toggle */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">Kart Yönü</label>
              <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => setOrientation("vertical")}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    orientation === "vertical" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Smartphone className="h-4 w-4" /> Dikey (Vertical)
                </button>
                <button
                  onClick={() => setOrientation("horizontal")}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    orientation === "horizontal" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Laptop className="h-4 w-4" /> Yatay (Horizontal)
                </button>
              </div>
            </div>

            {/* Custom colors selector */}
            <div className="space-y-4 border-t border-zinc-900 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <Palette className="h-4 w-4 text-neon-blue" />
                  Renk Özelleştirme
                </h3>
                {customColorsEnabled ? (
                  <button
                    onClick={handleCustomColorReset}
                    className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Sıfırla
                  </button>
                ) : (
                  <button
                    onClick={() => setCustomColorsEnabled(true)}
                    className="text-xs text-neon-blue hover:underline cursor-pointer"
                  >
                    Düzenle
                  </button>
                )}
              </div>

              {customColorsEnabled && (
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Kart Arkaplanı</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={cardBg}
                        onChange={(e) => setCardBg(e.target.value)}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <span className="text-[10px] font-mono">{cardBg}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Metin Rengi</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <span className="text-[10px] font-mono">{textColor}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">QR Kod Rengi</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <span className="text-[10px] font-mono">{qrColor}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Logo Upload */}
            <div className="space-y-4 border-t border-zinc-900 pt-6">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <Upload className="h-4 w-4 text-neon-blue" />
                Özel Logo Yükle
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    id="logo-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="px-4 py-3 rounded-xl border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <ImageIcon className="h-4 w-4 text-zinc-400" />
                    Resim Seç
                  </label>
                </div>
                {customLogo && (
                  <div className="flex items-center gap-2">
                    <img src={customLogo} alt="Uploaded logo" className="h-10 w-10 object-contain rounded bg-white p-1" />
                    <button
                      onClick={() => setCustomLogo(null)}
                      className="text-xs text-rose-500 hover:underline cursor-pointer"
                    >
                      Kaldır
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Live Preview & Downloads */}
          <div className="lg:col-span-6 flex flex-col items-center gap-8">
            {/* Real SVG Card Node */}
            <div className="bg-zinc-950 p-6 md:p-8 rounded-[2.5rem] border border-zinc-900 w-full flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-neon-blue/5 via-transparent to-transparent opacity-50" />
              
              {/* Actual render element */}
              <div className="relative z-10 shadow-2xl rounded-3xl overflow-hidden bg-white max-w-full">
                {orientation === "vertical" ? (
                  <svg
                    id="qr-card-svg"
                    width="400"
                    height="640"
                    viewBox="0 0 400 640"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ background: cardBg, transition: "background-color 0.3s" }}
                  >
                    {/* Rounded corner card background */}
                    <rect width="400" height="640" rx="30" fill={cardBg} />

                    {/* Logo Top */}
                    <g transform="translate(200, 110)">
                      {customLogo ? (
                        <image href={customLogo} x="-40" y="-40" width="80" height="80" preserveAspectRatio="xMidYMid meet" />
                      ) : (
                        selectedPreset.topLogoRenderer(selectedPreset.primaryColor)
                      )}
                    </g>

                    {/* Title */}
                    <text
                      x="200"
                      y="210"
                      textAnchor="middle"
                      fill={textColor}
                      style={{
                        fontFamily: "'Outfit', 'Inter', sans-serif",
                        fontWeight: 900,
                        fontSize: "20px",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {titleText}
                    </text>

                    {/* Call to action */}
                    <text
                      x="200"
                      y="245"
                      textAnchor="middle"
                      fill={textColor}
                      opacity="0.8"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "30px",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {ctaText}
                    </text>

                    {/* Embedded QR Code (represented by custom React SVG component render) */}
                    <g transform="translate(100, 310)">
                      <rect width="200" height="200" rx="20" fill={cardBg} opacity="0.9" />
                      <foreignObject width="200" height="200" x="0" y="0">
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyItems: "center" }}>
                          <QRCodeSVG
                            value={targetUrl || "https://link.saas"}
                            size={200}
                            bgColor={cardBg}
                            fgColor={qrColor}
                            level="H"
                            imageSettings={
                              (customLogo || selectedPreset.centerLogoSvg)
                                ? {
                                    src: customLogo || getSvgLogoUrl(selectedPreset.centerLogoSvg),
                                    x: undefined,
                                    y: undefined,
                                    height: 44,
                                    width: 44,
                                    excavate: true,
                                  }
                                : undefined
                            }
                          />
                        </div>
                      </foreignObject>
                    </g>

                    {/* Business Name Footer */}
                    <text
                      x="200"
                      y="575"
                      textAnchor="middle"
                      fill={textColor}
                      opacity="0.6"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 800,
                        fontSize: "15px",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {businessName}
                    </text>
                  </svg>
                ) : (
                  <svg
                    id="qr-card-svg"
                    width="640"
                    height="400"
                    viewBox="0 0 640 400"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ background: cardBg, transition: "background-color 0.3s" }}
                  >
                    <rect width="640" height="400" rx="30" fill={cardBg} />

                    {/* Left details grid */}
                    <g transform="translate(60, 0)">
                      {/* Logo Top */}
                      <g transform="translate(50, 110)">
                        {customLogo ? (
                          <image href={customLogo} x="-40" y="-40" width="80" height="80" preserveAspectRatio="xMidYMid meet" />
                        ) : (
                          selectedPreset.topLogoRenderer(selectedPreset.primaryColor)
                        )}
                      </g>

                      {/* Title */}
                      <text
                        x="0"
                        y="200"
                        textAnchor="start"
                        fill={textColor}
                        style={{
                          fontFamily: "'Outfit', 'Inter', sans-serif",
                          fontWeight: 900,
                          fontSize: "20px",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {titleText}
                      </text>

                      {/* Call to action */}
                      <text
                        x="0"
                        y="245"
                        textAnchor="start"
                        fill={textColor}
                        opacity="0.8"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 700,
                          fontSize: "30px",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {ctaText}
                      </text>

                      {/* Business Name Footer */}
                      <text
                        x="0"
                        y="330"
                        textAnchor="start"
                        fill={textColor}
                        opacity="0.6"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 800,
                          fontSize: "14px",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {businessName}
                      </text>
                    </g>

                    {/* Right Embedded QR Code */}
                    <g transform="translate(370, 100)">
                      <rect width="200" height="200" rx="20" fill={cardBg} opacity="0.9" />
                      <foreignObject width="200" height="200" x="0" y="0">
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyItems: "center" }}>
                          <QRCodeSVG
                            value={targetUrl || "https://link.saas"}
                            size={200}
                            bgColor={cardBg}
                            fgColor={qrColor}
                            level="H"
                            imageSettings={
                              (customLogo || selectedPreset.centerLogoSvg)
                                ? {
                                    src: customLogo || getSvgLogoUrl(selectedPreset.centerLogoSvg),
                                    x: undefined,
                                    y: undefined,
                                    height: 44,
                                    width: 44,
                                    excavate: true,
                                  }
                                : undefined
                            }
                          />
                        </div>
                      </foreignObject>
                    </g>
                  </svg>
                )}
              </div>
            </div>

            {/* Download Buttons Panel with glows */}
            <div className="w-full space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-1.5 justify-center">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Kartı Yüksek Çözünürlükte İndir
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleDownload("png")}
                  className="px-6 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-extrabold tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1"
                >
                  <Download className="h-4.5 w-4.5 text-neon-blue" />
                  PNG İNDİR
                </button>
                <button
                  onClick={() => handleDownload("jpeg")}
                  className="px-6 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-extrabold tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1"
                >
                  <Download className="h-4.5 w-4.5 text-neon-blue" />
                  JPEG İNDİR
                </button>
                <button
                  onClick={() => handleDownload("svg")}
                  className="px-6 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-extrabold tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1"
                >
                  <Download className="h-4.5 w-4.5 text-neon-blue" />
                  SVG İNDİR
                </button>
              </div>
              <p className="text-[10px] text-zinc-500 font-medium text-center">
                * PNG ve JPEG formatları, baskı ve paylaşım kalitesi için 3 kat (3x) yüksek çözünürlükte dışa aktarılır.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
