import fs from 'fs';
const path = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add SignOutButton import
if (!content.includes('SignOutButton')) {
  content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { SignOutButton } from "@clerk/nextjs";');
}

// 2. Add X icon import if missing
if (!content.includes('X,')) {
  content = content.replace('import {', 'import {\n  X,');
}

// 3. Add useState and useEffect imports if missing
if (!content.includes('useEffect')) {
  content = content.replace('useTransition, useMemo, useRef', 'useEffect, useTransition, useMemo, useRef');
}

// 4. Insert state and effect logic inside DashboardClient
const stateLogic = `
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  useEffect(() => {
    if (initialUser.plan === "FREE") {
      const timer = setInterval(() => {
        setShowUpgradePrompt(true);
        setTimeout(() => setShowUpgradePrompt(false), 15000);
      }, 60000 * 3); // Every 3 minutes
      
      const initialTimer = setTimeout(() => {
        setShowUpgradePrompt(true);
        setTimeout(() => setShowUpgradePrompt(false), 15000);
      }, 5000); // First time after 5 seconds

      return () => {
        clearInterval(timer);
        clearTimeout(initialTimer);
      };
    }
  }, [initialUser.plan]);
`;

if (!content.includes('showUpgradePrompt')) {
  content = content.replace('const [activeTab, setActiveTab] = useState<"editor"', stateLogic + '\n  const [activeTab, setActiveTab] = useState<"editor"');
}

// 5. Add Logout Button in Header
const logoutButtonHtml = `
          {/* Logout Button */}
          <SignOutButton>
            <button
              className={\`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all \${
                isDark
                  ? "bg-red-950/20 border-red-900 hover:bg-red-900/40 text-red-400"
                  : "bg-red-50 border-red-200 hover:bg-red-100 text-red-600 shadow-sm"
              }\`}
            >
              <span>{lang === "tr" ? "Çıkış Yap" : "Sign Out"}</span>
            </button>
          </SignOutButton>
`;
if (!content.includes('SignOutButton>')) {
  content = content.replace('<span>{t.liveSite}</span>\n              <ExternalLink className="h-3 w-3" />\n            </a>\n          )}', '<span>{t.liveSite}</span>\n              <ExternalLink className="h-3 w-3" />\n            </a>\n          )}\n' + logoutButtonHtml);
}

// 6. Add the fixed upgrade prompt component right before the closing </div> of the main return
const promptHtml = `
      {/* Upgrade Prompt */}
      {showUpgradePrompt && (
        <div className="fixed bottom-4 right-4 z-[9999] p-5 bg-purple-600 text-white rounded-2xl shadow-2xl max-w-sm flex flex-col gap-2 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
            <h4 className="font-bold">{lang === "tr" ? "Premium'a Yükselt" : "Upgrade to Premium"}</h4>
          </div>
          <p className="text-sm opacity-90 leading-relaxed">
            {lang === "tr" 
              ? "Daha fazla arka plan, özel temalar ve etkileşimli bloklar için planınızı yükseltin!" 
              : "Upgrade your plan for more backgrounds, custom themes, and interactive blocks!"}
          </p>
          <Link href="/dashboard/billing" className="mt-2 bg-white text-purple-600 px-4 py-2 rounded-xl text-sm font-bold text-center hover:bg-zinc-100 transition-colors">
            {lang === "tr" ? "Planları İncele" : "View Plans"}
          </Link>
          <button onClick={() => setShowUpgradePrompt(false)} className="absolute top-3 right-3 opacity-60 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
`;
if (!content.includes('showUpgradePrompt &&')) {
  content = content.replace('<GlobalOverlayManager />', '<GlobalOverlayManager />\n' + promptHtml);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Modifications applied successfully.');
