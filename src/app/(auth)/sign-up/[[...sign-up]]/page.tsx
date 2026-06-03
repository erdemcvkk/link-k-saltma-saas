import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import { Sparkles, QrCode, Link as LinkIcon, BarChart3, ShoppingBag } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full bg-black text-white">
      {/* Left side: Visual Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 border-r border-zinc-900">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-lighten"
          style={{ backgroundImage: "url('/login-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Sparkles className="h-5 w-5 text-slate-900 font-extrabold" />
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              CREATOR.HUB
            </span>
          </Link>
        </div>

        {/* Middle: Feature highlights card */}
        <div className="relative z-10 max-w-md space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            İnternetteki <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">yeni eviniz.</span>
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Linklerinizi, dijital mağazanızı, trafik analizlerinizi ve logonuzu taşıyan dinamik QR kartlarınızı tek bir şık panelden yönetin.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center space-x-2 bg-zinc-950/60 backdrop-blur border border-zinc-900 rounded-xl p-3">
              <LinkIcon className="h-4 w-4 text-teal-400" />
              <span className="text-xs font-semibold text-zinc-300">Biyo Linkleri</span>
            </div>
            <div className="flex items-center space-x-2 bg-zinc-950/60 backdrop-blur border border-zinc-900 rounded-xl p-3">
              <QrCode className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-semibold text-zinc-300">Logo QR Kart</span>
            </div>
            <div className="flex items-center space-x-2 bg-zinc-950/60 backdrop-blur border border-zinc-900 rounded-xl p-3">
              <ShoppingBag className="h-4 w-4 text-pink-400" />
              <span className="text-xs font-semibold text-zinc-300">Dijital Mağaza</span>
            </div>
            <div className="flex items-center space-x-2 bg-zinc-950/60 backdrop-blur border border-zinc-900 rounded-xl p-3">
              <BarChart3 className="h-4 w-4 text-violet-400" />
              <span className="text-xs font-semibold text-zinc-300">Trafik Analizi</span>
            </div>
          </div>
        </div>

        {/* Bottom: Footer */}
        <div className="relative z-10 text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} CREATOR.HUB. Tüm hakları saklıdır.
        </div>
      </div>

      {/* Right side: Clerk Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-zinc-950/20">
        <SignUp 
          appearance={{
            baseTheme: dark,
            elements: {
              card: "bg-zinc-950 border border-zinc-900 shadow-2xl",
              headerTitle: "text-white font-extrabold",
              headerSubtitle: "text-zinc-400",
              formButtonPrimary: "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-900 font-extrabold shadow-lg shadow-teal-500/20",
              footerActionLink: "text-teal-400 hover:text-teal-300",
              formFieldLabel: "text-zinc-300",
              formFieldInput: "bg-zinc-900 border-zinc-800 text-white focus:border-teal-500 focus:ring-teal-500/20",
              dividerLine: "bg-zinc-800",
              dividerText: "text-zinc-500",
              socialButtonsBlockButton: "border-zinc-800 hover:bg-zinc-900 text-white",
              socialButtonsBlockButtonText: "text-white",
            }
          }}
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}
