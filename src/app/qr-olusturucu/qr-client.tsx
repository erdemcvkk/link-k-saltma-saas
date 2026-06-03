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
const SPOTIFY_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#1DB954"/><path d="M74 37c-9.6-5.8-25.6-6.2-34.8-3.4-1.4.4-3-.4-3.4-1.8-.4-1.4.4-3 1.8-3.4 10.6-3.2 28.2-2.6 39.2 4 1.2.8 1.6 2.4 1 3.6-.8 1-2.4 1.4-3.8 1zm-1.8 12.4c-1 1.6-3 2.2-4.6 1.2-8-5-20.2-6.4-29.6-3.4-1.8.6-3.8-.4-4.4-2.2-.6-1.8.4-3.8 2.2-4.4 10.8-3.2 24.2-1.6 33.4 4 1.6 1 2.2 3 1.4 4.8zm-6.4 11.8c-.8 1.2-2.4 1.6-3.6 1-6.6-4-15-5-24.8-2.6-1.4.4-2.8-.6-3.2-2-.4-1.4.6-2.8 2-3.2 10.8-2.4 20.2-1.2 27.6 3.2 1.2.8 1.6 2.4 1.2 3.6z" fill="#000000"/></svg>`;

const YOUTUBE_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#FF0000"/><polygon points="40,30 70,50 40,70" fill="#FFFFFF"/></svg>`;

const WHATSAPP_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#25D366"/><path d="M50 14c-19.8 0-36 16.2-36 36 0 6.4 1.6 12.4 4.8 17.8L14 84l16.8-4.4c5.2 2.8 11 4.4 17.2 4.4 19.8 0 36-16.2 36-36S69.8 14 50 14zm21.4 51c-1 2.6-4.6 5-7.6 5.6-1.8.4-4.2.6-10.4-1.8-7.8-3.2-12.8-11.2-13.2-11.6-.4-.4-3.2-4.2-3.2-8 0-3.8 2-5.8 2.8-6.6.8-.8 1.6-1 2.2-1 .6 0 1 .2 1.4.2.4 0 1-.2 1.4.8.6 1 2 5 2.2 5.4.2.4.2.8 0 1.2-.2.4-.4.6-.6 1l-1 1.2c-.4.4-.8.8-.4 1.4.6 1 2.4 4 5 6.4 3.4 3 6.2 4 7.2 4.4 1 .4 1.6.4 2.2-.4.6-.8 2.8-3.2 3.4-4.4.6-1.2 1.2-1 2-.8.8.2 5 2.4 5.8 2.8.8.4 1.4.6 1.6 1 .2.4.2 2.4-.8 5z" fill="#FFFFFF"/></svg>`;

const TIKTOK_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#000000"/><path d="M56 24v30c0 6.6-5.4 12-12 12s-12-5.4-12-12 5.4-12 12-12c.8 0 1.8.2 2.6.4V34c-.8 0-1.8-.2-2.6-.2-11 0-20 9-20 20s9 20 20 20 20-9 20-20v-18c4.4 3.2 9.8 5 15.4 5v-8.6c-6.2-.2-11.6-4-13.4-8.4H56z" fill="#FFFFFF"/><path d="M56.6 24.6v30c0 6.6-5.4 12-12 12s-12-5.4-12-12 5.4-12 12-12c.8 0 1.8.2 2.6.4V34.6c-.8 0-1.8-.2-2.6-.2-11 0-20 9-20 20s9 20 20 20 20-9 20-20v-18c4.4 3.2 9.8 5 15.4 5v-8.6c-6.2-.2-11.6-4-13.4-8.4H56.6z" fill="#00f2fe" opacity="0.3"/></svg>`;

const LINKEDIN_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="16" fill="#0077B5"/><path d="M30 38H18v36h12V38zm-6-6c3.8 0 6-2.4 6-5.6-.2-3.2-2.2-5.6-6-5.6-3.6 0-6 2.4-6 5.6S20.4 32 24 32zm50 21.4c0-12-6.4-17.4-14.8-17.4-6.8 0-9.8 3.8-11.4 6.4v-5.4H30v36h12V58c0-1 .2-2.2.4-3 1-2 2.6-4.2 5.8-4.2 4 0 5.8 3.2 5.8 7.8v19.4h12V53.4z" fill="#FFFFFF"/></svg>`;

const GOOGLE_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#ffffff"/><path d="M50 44v12h18c-1.5 5-5.5 8.5-11 9.5-6.5 1-13-2-16-7.5s-2-12.5 3-17.5c4-4 9.5-5.5 15-4.5 4.5.8 8.5 3.5 11 7.2l9-9C74 29 67.5 24 60 24c-14.5 0-26 11.5-26 26s11.5 26 26 26c13.5 0 24.5-10 26-23v-9H50z" fill="#4285F4"/></svg>`;

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
    <g transform="translate(-25, -25) scale(1)">
      <circle cx="25" cy="25" r="23" fill="#1DB954" />
      <path d="M37 18.5c-4.8-2.9-12.8-3.1-17.4-1.7-.7.2-1.5-.2-1.7-.9-.2-.7.2-1.5.9-1.7 5.3-1.6 14.1-1.3 19.6 2 .6.4.8 1.2.5 1.8-.4.5-1.2.7-1.9.5zm-.9 6.2c-.5.8-1.5 1.1-2.3.6-4-2.5-10.1-3.2-14.8-1.7-.9.3-1.9-.2-2.2-1.1-.3-.9.2-1.9 1.1-2.2 5.4-1.6 12.1-.8 16.7 2 .8.5 1.1 1.5.5 2.4zm-3.2 5.9c-.4.6-1.2.8-1.8.5-3.3-2-7.5-2.5-12.4-1.3-.7.2-1.4-.3-1.6-1-.2-.7.3-1.4 1-1.6 5.4-1.2 10.1-.6 13.8 1.6.6.4.8 1.2.5 1.8z" fill="#000000" />
    </g>
  );

  const renderYoutubeLogo = (color: string) => (
    <g transform="translate(-25, -25) scale(1)">
      <rect x="0" y="7" width="50" height="36" rx="10" fill="#FF0000" />
      <polygon points="20,17 34,25 20,33" fill="#FFFFFF" />
    </g>
  );

  const renderWhatsappLogo = (color: string) => (
    <g transform="translate(-25, -25) scale(1)">
      <circle cx="25" cy="25" r="23" fill="#25D366" />
      <path d="M25 7c-9.9 0-18 8.1-18 18 0 3.2.8 6.2 2.4 8.9L7 42l8.4-2.2c2.6 1.4 5.5 2.2 8.6 2.2 9.9 0 18-8.1 18-18S34.9 7 25 7zm10.7 25.5c-.5 1.3-2.3 2.5-3.8 2.8-.9.2-2.1.3-5.2-.9-3.9-1.6-6.4-5.6-6.6-5.8-.2-.2-1.6-2.1-1.6-4 0-1.9 1-2.9 1.4-3.3.4-.4.8-.5 1.1-.5.3 0 .5.1.7.1.2 0 .5-.1.7.4.3.5 1 2.5 1.1 2.7.1.2.1.4 0 .6-.1.2-.2.3-.3.5l-.5.6c-.2.2-.4.4-.2.7.3.5 1.2 2 2.5 3.2 1.7 1.5 3.1 2 3.6 2.2.5.2.8.2 1.1-.2.3-.4 1.4-1.6 1.7-2.2.3-.6.6-.5 1-.4.4.1 2.5 1.2 2.9 1.4.4.2.7.3.8.5.1.2.1 1.2-.4 2.5z" fill="#FFFFFF" />
    </g>
  );

  const renderTiktokLogo = (color: string) => (
    <g transform="translate(-25, -25) scale(1.1)">
      <circle cx="25" cy="25" r="21" fill="#000000" />
      <path d="M28 12v15c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.4 0 .9.1 1.3.2V17c-.4 0-.9-.1-1.3-.1-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10V18c2.2 1.6 4.9 2.5 7.7 2.5v-4.3c-3.1-.1-5.8-2-6.7-4.2H28z" fill="#FFFFFF" />
      <path d="M28.3 12.3v15c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.4 0 .9.1 1.3.2V17.3c-.4 0-.9-.1-1.3-.1-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10V18.3c2.2 1.6 4.9 2.5 7.7 2.5v-4.3c-3.1-.1-5.8-2-6.7-4.2H28.3z" fill="#00f2fe" opacity="0.3" />
    </g>
  );

  const renderLinkedinLogo = (color: string) => (
    <g transform="translate(-25, -25) scale(1)">
      <rect x="3" y="3" width="44" height="44" rx="8" fill="#0077B5" />
      <path d="M15 19H9v18h6V19zm-3-3c1.9 0 3-1.2 3-2.8-.1-1.6-1.1-2.8-3-2.8-1.8 0-3 1.2-3 2.8S10 16 12 16zm25 10.7c0-6-3.2-8.7-7.4-8.7-3.4 0-4.9 1.9-5.7 3.2v-2.7h-6v18h6v-10c0-.5.1-1.1.2-1.5.4-1 1.3-2.1 2.9-2.1 2 0 2.9 1.6 2.9 3.9v9.7h6v-10.5z" fill="#FFFFFF" />
    </g>
  );

  const renderGoogleLogo = (color: string) => (
    <g transform="translate(-25, -25) scale(1)">
      <circle cx="25" cy="25" r="23" fill="#ffffff" />
      <path d="M25 22.2v5.6h8.4c-.7 2.3-2.6 3.9-5.1 4.4-3 .5-6-.9-7.4-3.5S20 23 22.3 20.7c1.9-1.9 4.4-2.5 7-2.1 2 .4 3.9 1.6 5.1 3.3l4.2-4.2C36.1 15 33.1 12.8 29.7 12.7c-6.6 0-11.9 5.3-11.9 11.9s5.3 11.9 11.9 11.9c6.2 0 11.2-4.6 11.9-10.5v-4.1H25z" fill="#4285F4"/>
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
