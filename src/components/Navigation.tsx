"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface NavigationProps {
  userId?: string | null;
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export default function Navigation({ userId, isMobile = false, onLinkClick }: NavigationProps) {
  const navLinks = [
    { label: "Analizler", url: "/#analytics" },
    { label: "Fiyatlandırma", url: "/#pricing" },
    { label: "Şablonlar", url: "/sablonlar" },
    { label: "Eklentiler", url: "/eklentiler", badge: "Yeni", badgeColor: "bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:text-rose-450" },
    { label: "QR Oluşturucu", url: "/qr-olusturucu", badge: "Ücretsiz", badgeColor: "bg-cyan-100 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400" },
    { label: "Özel Tasarlat", url: "/ozel-tasarim", badge: "Tasarım", badgeColor: "bg-violet-100 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400" },
  ];

  if (isMobile) {
    return (
      <div className="w-full space-y-6">
        <nav className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.url}
              onClick={onLinkClick}
              className="text-base font-semibold text-slate-700 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-between"
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${link.badgeColor}`}>
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-100 dark:border-slate-900 pt-6 flex flex-col space-y-3">
          {userId ? (
            <>
              <Link
                href="/dashboard"
                onClick={onLinkClick}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-bold text-sm"
              >
                Yönetim Paneli
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex justify-center pt-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                onClick={onLinkClick}
                className="w-full text-center py-3 rounded-full border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300"
              >
                Giriş Yap
              </Link>
              <Link
                href="/sign-in"
                onClick={onLinkClick}
                className="w-full text-center py-3 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-bold text-sm"
              >
                Hemen Başla
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Navigation Links */}
      <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-650 dark:text-slate-400">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.url}
            className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
          >
            {link.label}
            {link.badge && (
              <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${link.badgeColor}`}>
                {link.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Desktop Action Buttons */}
      <div className="hidden lg:flex items-center space-x-4">
        {userId ? (
          <>
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-bold text-sm hover:opacity-90 transition-opacity shadow-sm"
            >
              <span>Yönetim Paneli</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <>
            <Link
              href="/sign-in"
              className="text-sm font-bold text-slate-900 dark:text-white hover:text-cyan-600 transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/sign-in"
              className="px-5 py-2.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black font-bold text-sm hover:opacity-90 transition-opacity shadow-sm"
            >
              Hemen Başla
            </Link>
          </>
        )}
      </div>
    </>
  );
}
