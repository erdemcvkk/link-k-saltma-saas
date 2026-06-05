import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles, QrCode, Link as LinkIcon, BarChart3, ShoppingBag, Zap, Shield } from "lucide-react";
import { db } from "@/lib/db";

export default async function Page() {
  const settings = await db.globalSetting.findMany();
  const serializedSettings = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const loginBg = serializedSettings["login_bg"] || "/login-bg.png";
  const siteTitle = serializedSettings["site_title"] || "CREATOR.HUB";

  return (
    <div className="flex min-h-screen w-full bg-white text-slate-900">
      {/* Sol Bölüm: Tanıtım */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 xl:p-16 border-r border-slate-100"
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 30%, #e2e8f0 60%, #f1f5f9 80%, #f8fafc 100%)"
        }}
      >
        {/* Mesh gradient orbs */}
        <div className="absolute top-[-120px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-[0.07] pointer-events-none"
          style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }}
        />
        <div className="absolute bottom-[-60px] left-[-40px] w-[300px] h-[300px] rounded-full opacity-[0.05] pointer-events-none"
          style={{ background: "radial-gradient(circle, #ec4899 0%, transparent 70%)" }}
        />
        <div className="absolute top-[40%] left-[60%] w-[250px] h-[250px] rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: "radial-gradient(circle, #14b8a6 0%, transparent 70%)" }}
        />

        {/* Background Image overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.06] mix-blend-multiply"
          style={{ backgroundImage: `url('${loginBg}')` }}
        />

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center space-x-2.5 cursor-pointer group">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              {siteTitle}
            </span>
          </Link>
        </div>

        {/* Middle: Başlık ve Özellikler */}
        <div className="relative z-10 max-w-lg space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-[2.75rem] font-extrabold tracking-tight leading-[1.15] text-slate-900">
              İnternetteki{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-600">
                yeni eviniz.
              </span>
            </h1>
            <p className="text-slate-500 text-[15px] leading-relaxed font-medium max-w-md">
              Linklerinizi, dijital mağazanızı, trafik analizlerinizi ve logonuzu taşıyan dinamik QR kartlarınızı tek bir şık panelden yönetin.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-3 bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <LinkIcon className="h-4 w-4 text-indigo-500" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Biyo Linkleri</span>
                <span className="text-[10px] text-slate-400 font-medium">Sınırsız özelleştirme</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-9 w-9 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                <QrCode className="h-4 w-4 text-sky-500" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Logo QR Kart</span>
                <span className="text-[10px] text-slate-400 font-medium">Dinamik tasarım</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-9 w-9 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <ShoppingBag className="h-4 w-4 text-rose-500" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Dijital Mağaza</span>
                <span className="text-[10px] text-slate-400 font-medium">Anında satış</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                <BarChart3 className="h-4 w-4 text-violet-500" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Trafik Analizi</span>
                <span className="text-[10px] text-slate-400 font-medium">Gerçek zamanlı</span>
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2">
              {["bg-indigo-400", "bg-rose-400", "bg-amber-400", "bg-emerald-400"].map((bg, i) => (
                <div key={i} className={`h-8 w-8 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-sm`}>
                  {["E", "A", "S", "K"][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">500+ yaratıcı</p>
              <p className="text-[10px] text-slate-400 font-medium">platformumuzu tercih ediyor</p>
            </div>
          </div>
        </div>

        {/* Bottom: Footer */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} {siteTitle}. Tüm hakları saklıdır.
          </span>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
            <Shield className="h-3 w-3" />
            SSL ile korunmaktadır
          </div>
        </div>
      </div>

      {/* Sağ Bölüm: Clerk Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <SignIn
            appearance={{
              elements: {
                card: "bg-white border-none shadow-none text-slate-900 w-full",
                headerTitle: "text-slate-900 font-extrabold text-3xl text-center tracking-tight",
                headerSubtitle: "text-slate-500 text-center font-semibold text-sm mt-2",
                form: "hidden",
                dividerRow: "hidden",
                footerActionLink: "text-slate-900 hover:text-slate-700 font-bold underline decoration-slate-300 underline-offset-4",
                footerActionText: "text-slate-500 font-semibold text-sm",
                socialButtonsBlockButton: "border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-900 font-extrabold rounded-full py-3.5 flex justify-center items-center gap-3 transition-all duration-200 w-full cursor-pointer shadow-sm",
                socialButtonsBlockButtonText: "text-slate-900 font-extrabold text-sm",
                footer: "mt-6 text-center w-full",
              }
            }}
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
}
