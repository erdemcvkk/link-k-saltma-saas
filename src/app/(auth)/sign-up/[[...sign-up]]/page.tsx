import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles, QrCode, Link as LinkIcon, BarChart3, ShoppingBag } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full bg-white text-slate-900">
      {/* Left side: Visual Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 border-r border-slate-100 bg-slate-50">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.08] mix-blend-multiply"
          style={{ backgroundImage: "url('/login-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50/80 via-transparent to-transparent" />
        
        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-white font-extrabold" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              CREATOR.HUB
            </span>
          </Link>
        </div>

        {/* Middle: Feature highlights card */}
        <div className="relative z-10 max-w-md space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-slate-900">
            İnternetteki <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-light-blue">yeni eviniz.</span>
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            Linklerinizi, dijital mağazanızı, trafik analizlerinizi ve logonuzu taşıyan dinamik QR kartlarınızı tek bir şık panelden yönetin.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center space-x-2 bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
              <LinkIcon className="h-4 w-4 text-neon-blue" />
              <span className="text-xs font-bold text-slate-700">Biyo Linkleri</span>
            </div>
            <div className="flex items-center space-x-2 bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
              <QrCode className="h-4 w-4 text-light-blue" />
              <span className="text-xs font-bold text-slate-700">Logo QR Kart</span>
            </div>
            <div className="flex items-center space-x-2 bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
              <ShoppingBag className="h-4 w-4 text-rose-500" />
              <span className="text-xs font-bold text-slate-700">Dijital Mağaza</span>
            </div>
            <div className="flex items-center space-x-2 bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
              <BarChart3 className="h-4 w-4 text-indigo-500" />
              <span className="text-xs font-bold text-slate-700">Trafik Analizi</span>
            </div>
          </div>
        </div>

        {/* Bottom: Footer */}
        <div className="relative z-10 text-xs text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} CREATOR.HUB. Tüm hakları saklıdır.
        </div>
      </div>

      {/* Right side: Clerk Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <SignUp 
            appearance={{
              elements: {
                card: "bg-white border-none shadow-none text-slate-900 w-full",
                headerTitle: "text-slate-900 font-extrabold text-3xl text-center tracking-tight",
                headerSubtitle: "text-slate-500 text-center font-semibold text-sm mt-2",
                form: "hidden", // Hide Email/Password form fields
                dividerRow: "hidden", // Hide "or" divider row
                footerActionLink: "text-slate-900 hover:text-slate-700 font-bold underline decoration-slate-300 underline-offset-4",
                footerActionText: "text-slate-500 font-semibold text-sm",
                socialButtonsBlockButton: "border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-900 font-extrabold rounded-full py-3.5 flex justify-center items-center gap-3 transition-all duration-200 w-full cursor-pointer shadow-sm",
                socialButtonsBlockButtonText: "text-slate-900 font-extrabold text-sm",
                footer: "mt-6 text-center w-full",
              }
            }}
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
}
