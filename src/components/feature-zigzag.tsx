"use client";

import React from "react";
import { CheckCircle2, Component, Layout, MousePointerClick, BarChart3, Target, Globe, Smartphone, Zap } from "lucide-react";

type IconType = "layout" | "click" | "chart" | "globe" | "zap" | "smartphone" | "target" | "component" | "check";

interface FeatureBlock {
  id: string;
  title: string;
  highlightWords?: string;
  description: string;
  imageUrl: string;
  listItems: { text: string; icon: IconType }[];
}

interface FeatureZigzagProps {
  features: FeatureBlock[];
}

export default function FeatureZigzag({ features }: FeatureZigzagProps) {
  if (!features || features.length === 0) return null;

  const getIcon = (type: IconType) => {
    switch (type) {
      case "layout": return <Layout className="h-5 w-5 text-teal-500" />;
      case "click": return <MousePointerClick className="h-5 w-5 text-teal-500" />;
      case "chart": return <BarChart3 className="h-5 w-5 text-teal-500" />;
      case "globe": return <Globe className="h-5 w-5 text-teal-500" />;
      case "zap": return <Zap className="h-5 w-5 text-teal-500" />;
      case "smartphone": return <Smartphone className="h-5 w-5 text-teal-500" />;
      case "target": return <Target className="h-5 w-5 text-teal-500" />;
      case "component": return <Component className="h-5 w-5 text-teal-500" />;
      default: return <CheckCircle2 className="h-5 w-5 text-teal-500" />;
    }
  };

  return (
    <div className="w-full bg-white py-24">
      <div className="max-w-6xl mx-auto px-6 space-y-32">
        {features.map((feature, index) => {
          const isEven = index % 2 === 0;

          return (
            <div 
              key={feature.id} 
              className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 ${!isEven ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Text Content */}
              <div className="flex-1 space-y-8">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-bold uppercase tracking-wider mb-2">
                  <SparklesIcon className="h-3.5 w-3.5" />
                  <span>Feature 0{index + 1}</span>
                </div>
                <h2 className="text-2xl md:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  {feature.title.split(feature.highlightWords || 'MISSING').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && feature.highlightWords && (
                        <span className="text-teal-400 block">{feature.highlightWords}</span>
                      )}
                    </React.Fragment>
                  ))}
                  {!feature.highlightWords && feature.title}
                </h2>
                <p className="text-lg text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {feature.listItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {getIcon(item.icon)}
                      <span className="text-sm font-semibold text-slate-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image/Mockup */}
              <div className="flex-1 relative">
                {/* Decorative blob behind image */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-50 rounded-full blur-3xl opacity-50 -z-10`} />
                
                <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 bg-white">
                  <img 
                    src={feature.imageUrl} 
                    alt={feature.title} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
