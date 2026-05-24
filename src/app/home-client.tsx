"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CreatorCarousel from "@/components/creator-carousel";
import FeatureZigzag from "@/components/feature-zigzag";
import GlobalOverlayManager from "@/components/global-overlay-manager";
import { ArrowRight, Check, CheckCircle2 } from "lucide-react";

interface HomeClientProps {
  userId: string | null;
  siteTitle: string;
  siteLogo: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  creatorsData?: any[];
  featuresData?: any[];
  sliderItems?: any[];
  paymentLinkStarter?: string;
  paymentLinkCreator?: string;
  paymentLinkPro?: string;
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
  sliderItems = [],
  paymentLinkStarter = "",
  paymentLinkCreator = "",
  paymentLinkPro = "",
}: HomeClientProps) {
  const [usernameInput, setUsernameInput] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (sliderItems.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [sliderItems]);

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
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-left">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              {heroTitle} <br />
              <span className="text-teal-400 block mt-2">{heroHighlight}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed font-medium">
              {heroSubtitle}
            </p>

            <form onSubmit={handleCreate} className="max-w-md flex flex-col sm:flex-row items-center p-2 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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
          </div>

          {/* Hero Phone Mockup */}
          <div className="flex justify-center lg:justify-end relative">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-50 rounded-full blur-3xl opacity-50 -z-10" />
            
            {/* Phone Frame */}
            <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-900 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 z-20 rounded-b-3xl w-1/2 mx-auto" /> {/* Notch */}
              <div className="relative w-full h-full bg-white rounded-[2rem] overflow-hidden">
                {sliderItems.length > 0 ? (
                  sliderItems.map((item, idx) => (
                    <img 
                      key={item.id}
                      src={item.imageUrl}
                      alt={item.title}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-sm font-semibold p-6 text-center">
                    Görsel bulunamadı. Admin panelden slider resmi ekleyin.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Choose the plan that best fits your needs. Upgrade or downgrade at any time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* FREE TIER */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
              <div className="mb-6">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full">Free</span>
                <h3 className="text-4xl font-extrabold text-slate-900 mt-4">$0 <span className="text-base text-slate-500 font-medium">/ forever</span></h3>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                  <span>Basic link-in-bio</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                  <span>Standard themes</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                  <span>Standard analytics</span>
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="w-full py-3 px-4 rounded-xl border-2 border-slate-200 text-slate-900 font-bold text-center hover:border-slate-900 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* STARTER TIER */}
            <div className="bg-slate-900 rounded-3xl p-8 border-2 border-slate-900 shadow-xl flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-teal-400 text-teal-950 text-xs font-black uppercase tracking-widest rounded-full">
                Most Popular
              </div>
              <div className="mb-6 mt-2">
                <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-full">Starter</span>
                <h3 className="text-4xl font-extrabold text-white mt-4">$9 <span className="text-base text-slate-400 font-medium">/ month</span></h3>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 flex-shrink-0" />
                  <span>Premium themes & fonts</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 flex-shrink-0" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-400 flex-shrink-0" />
                  <span>Custom colors</span>
                </li>
              </ul>
              <a
                href={paymentLinkStarter || "#"}
                className="w-full py-3 px-4 rounded-xl bg-teal-400 text-teal-950 font-bold text-center hover:bg-teal-300 transition-colors"
              >
                Upgrade to Starter
              </a>
            </div>

            {/* CREATOR TIER */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col">
              <div className="mb-6">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full">Creator</span>
                <h3 className="text-4xl font-extrabold text-slate-900 mt-4">$29 <span className="text-base text-slate-500 font-medium">/ month</span></h3>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                  <span>All Starter features</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                  <span>E-commerce integrations</span>
                </li>
                <li className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                  <span>Remove platform branding</span>
                </li>
              </ul>
              <a
                href={paymentLinkCreator || "#"}
                className="w-full py-3 px-4 rounded-xl border-2 border-slate-200 text-slate-900 font-bold text-center hover:border-slate-900 transition-colors"
              >
                Upgrade to Creator
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA Footer */}
      <section className="py-24 px-6 text-center bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto bg-gray-50 rounded-3xl p-12 shadow-sm border border-gray-100">
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
