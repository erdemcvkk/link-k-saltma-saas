"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Navigation from "./Navigation";

interface GlobalHeaderProps {
  siteLogo?: string;
  siteTitle?: string;
  userId?: string | null;
}

export default function GlobalHeader({ siteLogo, siteTitle, userId }: GlobalHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        header {
          position: sticky !important;
          top: 0 !important;
          z-index: 1000 !important;
          background: white !important;
          width: 100% !important;
          border-bottom: 1px solid rgba(0,0,0,0.05) !important;
        }
        .dark header {
          background: #090a0f !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
      `}} />

      <header className="transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
            <img src={siteLogo || "/clinkor-logo.png"} alt={siteTitle || "Clinkor"} className="h-8 w-auto object-contain" />
          </Link>

          {/* Navigation & Action Buttons */}
          <Navigation userId={userId} />

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 w-full px-6 py-6 shadow-xl absolute left-0 top-20 z-50">
            <Navigation userId={userId} isMobile={true} onLinkClick={handleLinkClick} />
          </div>
        )}
      </header>
    </>
  );
}

