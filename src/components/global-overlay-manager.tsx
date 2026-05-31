"use client";

import React, { useState, useEffect } from "react";
import { Cookie, MapPin, Globe, Sun, Moon, X, Check, ShieldAlert } from "lucide-react";

interface OverlayManagerProps {
  onStateChange?: (state: { lang: "tr" | "en"; theme: "dark" | "light" }) => void;
}

export default function GlobalOverlayManager({ onStateChange }: OverlayManagerProps) {
  const [lang, setLang] = useState<"tr" | "en">("tr");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showLocationToast, setShowLocationToast] = useState(false);
  const [loadingGeo, setLoadingGeo] = useState(false);

  useEffect(() => {
    // 1. Force light theme
    setTheme("light");
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");

    // 2. Load language preference or auto-detect by IP
    const storedLang = localStorage.getItem("lang") as "tr" | "en" | null;
    if (storedLang) {
      setLang(storedLang);
      if (onStateChange) onStateChange({ lang: storedLang, theme: "light" });
    } else {
      setLang("tr");
      localStorage.setItem("lang", "tr");
      if (onStateChange) onStateChange({ lang: "tr", theme: "light" });
    }

    // 3. Show Cookie Banner if not accepted/rejected yet
    const cookieConsent = localStorage.getItem("cookie_consent");
    if (!cookieConsent) {
      setTimeout(() => setShowCookieBanner(true), 1200);
    }

    // 4. Show Location Permission Prompt if not answered yet
    const locPermission = localStorage.getItem("location_permission");
    if (!locPermission) {
      setTimeout(() => setShowLocationToast(true), 2500);
    }
  }, []);

  // Update parents whenever internal theme/lang changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange({ lang, theme: "light" });
    }
  }, [lang]);



  const handleToggleLang = (selectedLang: "tr" | "en") => {
    setLang(selectedLang);
    localStorage.setItem("lang", selectedLang);
  };

  // Cookie Actions
  const handleCookieConsent = (level: "all" | "required" | "none") => {
    localStorage.setItem("cookie_consent", level);
    setShowCookieBanner(false);
  };

  // Geolocation Request Actions
  const handleRequestLocation = () => {
    setLoadingGeo(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          localStorage.setItem("location_permission", "granted");
          localStorage.setItem(
            "user_coords",
            JSON.stringify({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            })
          );
          setLoadingGeo(false);
          setShowLocationToast(false);
          // Trigger a custom notification glow or log
          alert(
            lang === "tr"
              ? "📍 Konum başarıyla alındı! Yakındaki üreticiler listelenebilir."
              : "📍 Location successfully received! Nearby creators can now be tailored."
          );
        },
        (error) => {
          console.warn("Geolocation permission denied:", error);
          localStorage.setItem("location_permission", "denied");
          setLoadingGeo(false);
          setShowLocationToast(false);
        }
      );
    } else {
      localStorage.setItem("location_permission", "unsupported");
      setLoadingGeo(false);
      setShowLocationToast(false);
    }
  };

  const handleDenyLocation = () => {
    localStorage.setItem("location_permission", "denied");
    setShowLocationToast(false);
  };

  return (
    <>
      {/* 1. Dynamic Floating Switchers Panel (Bottom-Left) */}
      <div className="fixed bottom-6 left-6 z-[9999] flex items-center space-x-2 p-1.5 rounded-full bg-white/90 border border-zinc-200 backdrop-blur-lg shadow-xl animate-fade-in">
        {/* Language Toggler */}
        <button
          onClick={() => handleToggleLang(lang === "tr" ? "en" : "tr")}
          className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider transition-all duration-300 hover:bg-zinc-100 flex items-center gap-1.5 text-zinc-700"
          title="Toggle Language / Dil Değiştir"
        >
          <Globe className="h-3 w-3 text-teal-400" />
          <span>{lang === "tr" ? "TR" : "EN"}</span>
        </button>
      </div>

      {/* 2. Location Permission Toast Alert (Top-Right Popup) */}
      {showLocationToast && (
        <div className="fixed top-24 right-6 z-[9999] max-w-sm p-5 rounded-2xl bg-white border border-teal-500/20 text-zinc-800 backdrop-blur-xl shadow-[0_10px_40px_rgba(45,212,191,0.15)] transition-all animate-slide-in">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-500">
              <MapPin className="h-5 w-5 animate-bounce" />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-extrabold text-sm tracking-wide">
                {lang === "tr" ? "📍 Konum İzni Gerekli" : "📍 Location Access"}
              </h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                {lang === "tr"
                  ? "Size en yakın üreticileri listelemek için konum izni vermek ister misiniz?"
                  : "Would you like to grant location access to discover nearby creators?"}
              </p>
            </div>
            <button
              onClick={handleDenyLocation}
              className="text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-zinc-100">
            <button
              onClick={handleDenyLocation}
              className="px-3.5 py-1.5 rounded-lg text-[10px] font-bold text-zinc-400 hover:text-white transition-colors"
            >
              {lang === "tr" ? "Reddet" : "Deny"}
            </button>
            <button
              onClick={handleRequestLocation}
              disabled={loadingGeo}
              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50"
            >
              {loadingGeo ? (
                <span>...</span>
              ) : (
                <>
                  <Check className="h-3 w-3" />
                  <span>{lang === "tr" ? "İzin Ver & Onayla" : "Allow & Approve"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 3. Bottom Cookie Consent Banner Panel */}
      {showCookieBanner && (
        <div className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-lg z-[9998] p-6 rounded-2xl bg-white border border-zinc-200 text-zinc-800 backdrop-blur-xl shadow-2xl transition-all duration-500 animate-slide-up">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-500 shrink-0">
              <Cookie className="h-6 w-6 text-teal-500" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm tracking-wide text-zinc-900">
                {lang === "tr" ? "🍪 Çerez Tercihleri" : "🍪 Cookie Consent"}
              </h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                {lang === "tr"
                  ? "Sitemizdeki deneyiminizi optimize etmek ve analitik trafik raporları sunmak için çerezleri kullanıyoruz."
                  : "We use cookies to optimize platform metrics and deliver accurate analytical graphs."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-5 pt-4 border-t border-zinc-100">
            <button
              onClick={() => handleCookieConsent("none")}
              className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold transition-all text-center"
            >
              {lang === "tr" ? "Tümünü Reddet" : "Reject All"}
            </button>

            <button
              onClick={() => handleCookieConsent("required")}
              className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold transition-all text-center"
            >
              {lang === "tr" ? "Gerekli Olanlar" : "Required Only"}
            </button>

            <button
              onClick={() => handleCookieConsent("all")}
              className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black transition-all text-center shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            >
              {lang === "tr" ? "Tümünü Kabul Et" : "Accept All"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
