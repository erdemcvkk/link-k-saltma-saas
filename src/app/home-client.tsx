"use client";

import React, { useState } from "react";
import Link from "next/link";
import CreatorCarousel from "@/components/creator-carousel";
import FeatureZigzag from "@/components/feature-zigzag";
import GlobalOverlayManager from "@/components/global-overlay-manager";
import { ArrowRight } from "lucide-react";

interface HomeClientProps {
  userId: string | null;
  siteTitle: string;
  siteLogo: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  creatorsData?: any[];
  featuresData?: any[];
}

export default function HomeClient({
  userId,
  siteTitle,
  siteLogo,
  heroTitle,
  heroHighlight,
  heroSubtitle,
  creatorsData = [],
  featuresData = [],
}: HomeClientProps) {
  const [usernameInput, setUsernameInput] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      window.location.href = `/sign-up?username=${encodeURIComponent(usernameInput.trim())}`;
    } else {
      window.location.href = `/sign-up`;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900 selection:bg-teal-100 selection:text-teal-900 font-sans">
      <GlobalOverlayManager />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
            {siteLogo ? (
              <img src={siteLogo} alt={siteTitle} className="h-8 w-auto object-contain" />
            ) : (
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                {siteTitle}
              </span>
            )}
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#creators" className="hover:text-slate-900 transition-colors">Creators</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center space-x-4">
            {userId ? (
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-bold text-slate-900 hover:text-teal-600 transition-colors hidden sm:block"
                >
                  Log In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
          {heroTitle} <br />
          <span className="text-teal-400 block mt-2">{heroHighlight}</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          {heroSubtitle}
        </p>

        <form onSubmit={handleCreate} className="max-w-md mx-auto flex flex-col sm:flex-row items-center p-2 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center flex-1 px-4 py-2 w-full">
            <span className="text-slate-400 font-medium whitespace-nowrap">link.saas/</span>
            <input 
              type="text" 
              placeholder="yourname"
              className="w-full bg-transparent border-none outline-none font-bold text-slate-900 placeholder:text-slate-300 ml-1"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full sm:w-auto mt-2 sm:mt-0 px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            Claim your link
          </button>
        </form>
      </section>

      {/* Creators Carousel */}
      <section id="creators" className="w-full">
        {creatorsData && creatorsData.length > 0 && (
          <CreatorCarousel creators={creatorsData} />
        )}
      </section>

      {/* Zigzag Features */}
      <section id="features" className="w-full">
        {featuresData && featuresData.length > 0 && (
          <FeatureZigzag features={featuresData} />
        )}
      </section>

      {/* Simple CTA Footer */}
      <section className="py-32 px-6 text-center bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Ready to grow your audience?
          </h2>
          <p className="text-slate-500 mb-8 max-w-lg mx-auto">
            Join thousands of creators using our platform to turn followers into fans, customers, and community.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-slate-900 text-white font-bold text-base hover:bg-slate-800 transition-colors shadow-sm"
          >
            <span>Get started for free</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* True Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 text-center text-sm text-slate-500 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            © {new Date().getFullYear()} {siteTitle}. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
