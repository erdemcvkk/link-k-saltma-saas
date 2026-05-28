const fs = require('fs');
const file = 'src/components/addons/addon-config-modal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Switch from headless UI or standard input type checkbox for the toggle
// I will use a simple checkbox toggle for isActive

const importsToAdd = `
import StorefrontPreview from "@/components/storefront-preview";
`;
content = content.replace('import { toast } from "react-hot-toast";', ''); // Ensure toast is gone
if(!content.includes('import StorefrontPreview')) {
    content = content.replace('import React,', importsToAdd + '\\nimport React,');
}

const componentTop = `
export default function AddonConfigModal({ addon, products = [], onClose, lang }: AddonConfigModalProps) {
  const [isPending, startTransition] = useTransition();
  const [configData, setConfigData] = useState<any>(() => {
    try { return addon.config ? JSON.parse(addon.config) : {}; } catch { return {}; }
  });
  const [isActive, setIsActive] = useState<boolean>(addon.isActive);
`;

const handleSave = `
  const handleSave = () => {
    startTransition(async () => {
      try {
        await saveAddonConfig(addon.id, JSON.stringify(configData), isActive);
        alert(lang === "tr" ? "Ayarlar başarıyla kaydedildi!" : "Settings saved!");
      } catch (err: any) {
        alert(err.message || "Error");
      }
    });
  };
`;

const renderPreview = `
  const renderLivePreview = () => {
    switch (addon.addonType) {
      case "MINI_STORE":
        return (
          <div className="w-full h-full bg-[#f8f9fa] overflow-hidden">
            <StorefrontPreview 
              theme={configData.theme || "classic"} 
              products={products.map(p => ({
                id: p.id,
                title: p.title,
                type: p.type,
                price: p.price.toString(),
                imageUrl: p.fileUrl,
                description: p.description || ""
              }))}
              storeTitle={configData.storeTitle || "Mağazam"}
            />
          </div>
        );
      case "PORTFOLIO":
      case "FAQ":
      case "BOOKING":
      case "NEWSLETTER":
      case "QA":
      case "DONATION":
      case "COUNTDOWN":
      case "MAP":
      case "WHATSAPP":
        return (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-500 flex items-center justify-center">
              {icon}
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800">{configData.title || configData.storeTitle || addon.addonType}</h3>
              <p className="text-xs text-slate-500 max-w-xs">{JSON.stringify(configData)}</p>
            </div>
            <p className="text-[10px] text-zinc-400 mt-10 uppercase tracking-widest font-bold">Canlı Önizleme Yakında</p>
          </div>
        );
      default:
        return <div className="text-sm text-zinc-500">Preview not available</div>;
    }
  };
`;

const newRender = `
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/80 backdrop-blur-sm">
      <div className="relative w-full max-w-[1300px] h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header (Top Bar) */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-white shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
              {icon}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {title} {lang === "tr" ? "Ayarları" : "Settings"}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {lang === "tr" ? "Gerçek zamanlı eklenti düzenleyicisi" : "Real-time addon editor"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Status Toggle */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-100">
              <span className={\`text-xs font-bold \${isActive ? 'text-emerald-600' : 'text-zinc-400'}\`}>
                {isActive ? (lang === "tr" ? "Yayında" : "Published") : (lang === "tr" ? "Taslak" : "Draft")}
              </span>
              <button 
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors \${isActive ? 'bg-emerald-500' : 'bg-zinc-300'}\`}
              >
                <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${isActive ? 'translate-x-6' : 'translate-x-1'}\`} />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl hover:bg-zinc-100 text-zinc-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {lang === "tr" ? "Kaydet & Kapat" : "Save & Close"}
            </button>
          </div>
        </div>

        {/* Split Screen Body */}
        <div className="flex flex-1 overflow-hidden bg-zinc-50/50">
          
          {/* Left Panel: Editor Form */}
          <div className="w-full lg:w-[45%] h-full overflow-y-auto p-6 bg-white border-r border-zinc-100 custom-scrollbar">
            <div className="max-w-md mx-auto space-y-2">
              {renderFields()}
            </div>
          </div>

          {/* Right Panel: Live Mockup Preview */}
          <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full" />
            </div>
            
            {/* iPhone Mockup Frame */}
            <div className="relative w-[340px] h-[700px] bg-black rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.15)] border-[8px] border-black flex flex-col overflow-hidden z-10 shrink-0">
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
                <div className="w-32 h-6 bg-black rounded-b-2xl" />
              </div>
              
              {/* Screen Content */}
              <div className="flex-1 w-full bg-white overflow-y-auto custom-scrollbar relative">
                {renderLivePreview()}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
`;

// Replace everything from export default ... to the end, then we will use string manipulation to stitch it properly.
// A safer way is to just generate the entire file since it's only ~400 lines and we are changing the core layout.

// I'll execute a rewrite strategy: read the file, extract renderFields (the switch statement), and rebuild.
`
