"use client";

import { useState, useTransition, useMemo, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  createQrCode,
  deleteQrCode
} from "@/app/actions";
import {
  Globe,
  FileText,
  List,
  User,
  Briefcase,
  Play,
  Image,
  MessageCircle,
  Music,
  Utensils,
  Smartphone,
  Percent,
  Wifi,
  Trash2,
  Lock,
  Plus,
  ArrowRight,
  Download,
  Copy,
  QrCode,
  Settings
} from "lucide-react";
import { useDashboard } from "../dashboard-context";

interface QrCodeItem {
  id: string;
  name: string;
  type: string;
  value: string;
  fgColor: string;
  bgColor: string;
  logoUrl: string | null;
  createdAt: string;
}

interface QrClientProps {
  initialQrCodes: QrCodeItem[];
}

export default function QrClient({ initialQrCodes }: QrClientProps) {
  const {
    user,
    lang,
    isPremium,
    triggerUpgradeModal,
    setSuccessMsg,
    setErrorMsg,
    isPending,
    startTransition
  } = useDashboard();

  const username = user.username || "";
  const initialUser = user;

  // States
  const [qrCodes, setQrCodes] = useState<QrCodeItem[]>(initialQrCodes);
  const qrRef = useRef<HTMLDivElement>(null);

  // Form states
  const [qrMode, setQrMode] = useState<"catalog" | "create">("catalog");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [qrName, setQrName] = useState("");
  const [qrValueText, setQrValueText] = useState("");

  // QR Code Styles State
  const [qrFgColor, setQrFgColor] = useState("#a855f7");
  const [qrBgColor, setQrBgColor] = useState("#000000");
  const [qrDownloadSize, setQrDownloadSize] = useState(1000);
  const [qrIncludeLogo, setQrIncludeLogo] = useState(false);
  const [qrLogoFile, setQrLogoFile] = useState<string | null>(null);

  // Wifi inputs
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState<"WEP" | "WPA" | "nopass">("WPA");

  // WhatsApp inputs
  const [whatsAppPhone, setWhatsAppPhone] = useState("");
  const [whatsAppMessage, setWhatsAppMessage] = useState("");

  // vCard inputs
  const [vCardName, setVCardName] = useState("");
  const [vCardPhone, setVCardPhone] = useState("");
  const [vCardEmail, setVCardEmail] = useState("");
  const [vCardOrg, setVCardOrg] = useState("");
  const [vCardTitle, setVCardTitle] = useState("");
  const [vCardUrl, setVCardUrl] = useState("");

  const computedQrValue = useMemo(() => {
    if (!selectedTemplate) return "https://clinkor.com/" + username;
    
    switch (selectedTemplate) {
      case "WIFI":
        return "WIFI:S:" + wifiSsid + ";T:" + wifiEncryption + ";P:" + wifiPassword + ";;";
      case "WHATSAPP":
        return "https://wa.me/" + whatsAppPhone.replace(/\s+/g, "") + "?text=" + encodeURIComponent(whatsAppMessage);
      case "VCARD":
        return "BEGIN:VCARD\nVERSION:3.0\nN:" + vCardName + "\nORG:" + vCardOrg + "\nTITLE:" + vCardTitle + "\nTEL:" + vCardPhone + "\nEMAIL:" + vCardEmail + "\nURL=" + (vCardUrl || "https://clinkor.com/" + username) + "\nEND:VCARD";
      default:
        return qrValueText || "https://clinkor.com/" + username;
    }
  }, [selectedTemplate, wifiSsid, wifiPassword, wifiEncryption, whatsAppPhone, whatsAppMessage, vCardName, vCardOrg, vCardTitle, vCardPhone, vCardEmail, vCardUrl, qrValueText, username]);

  // Handlers
  const handleCreateQr = async () => {
    if (!qrName.trim()) {
      alert(lang === "tr" ? "Lütfen QR koduna bir isim verin." : "Please name your QR code.");
      return;
    }

    startTransition(async () => {
      try {
        const newQr = await createQrCode(
          initialUser.id,
          qrName,
          selectedTemplate!,
          computedQrValue,
          isPremium ? qrFgColor : "#000000",
          isPremium ? qrBgColor : "#ffffff",
          qrIncludeLogo && isPremium ? (qrLogoFile || "watermark") : undefined
        );
        
        // Update local QRs state
        setQrCodes((prev) => [
          {
            id: newQr.id,
            name: newQr.name,
            type: newQr.type,
            value: newQr.value,
            fgColor: newQr.fgColor,
            bgColor: newQr.bgColor,
            logoUrl: newQr.logoUrl,
            createdAt: newQr.createdAt.toISOString(),
          },
          ...prev
        ]);
        setSuccessMsg(lang === "tr" ? "QR Kod başarıyla oluşturuldu!" : "QR Code successfully generated!");
        
        // Reset states
        setQrMode("catalog");
        setSelectedTemplate(null);
        setQrName("");
        setQrValueText("");
        setWifiSsid("");
        setWifiPassword("");
        setWhatsAppPhone("");
        setWhatsAppMessage("");
        setVCardName("");
        setVCardPhone("");
        setVCardEmail("");
        setVCardOrg("");
        setVCardTitle("");
        setVCardUrl("");
      } catch (err: any) {
        setErrorMsg(err.message || "An error occurred.");
      }
    });
  };

  const handleDeleteQr = async (qrId: string) => {
    if (!confirm(lang === "tr" ? "Bu QR kodunu silmek istediğinizden emin misiniz?" : "Are you sure you want to delete this QR code?")) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteQrCode(initialUser.id, qrId);
        setQrCodes((prev) => prev.filter((q) => q.id !== qrId));
        setSuccessMsg(lang === "tr" ? "QR Kod silindi." : "QR Code deleted.");
      } catch (err: any) {
        setErrorMsg(err.message || "An error occurred.");
      }
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setQrLogoFile(event.target.result as string);
          setQrIncludeLogo(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setQrLogoFile(null);
    setQrIncludeLogo(false);
  };

  const handleDownloadPNG = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);
    
    const image = new window.Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = qrDownloadSize;
      canvas.height = qrDownloadSize;
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = isPremium ? qrBgColor : "#ffffff";
        context.fillRect(0, 0, qrDownloadSize, qrDownloadSize);
        context.drawImage(image, 0, 0, qrDownloadSize, qrDownloadSize);
        const pngURL = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngURL;
        downloadLink.download = `qr-code-${username || "profile"}-${qrDownloadSize}x${qrDownloadSize}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };
    image.src = blobURL;
  };

  const handleDownloadSVG = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = blobURL;
    downloadLink.download = `qr-code-${username || "profile"}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const t = {
    qrTitle: lang === "tr" ? "Dinamik QR Kod Oluşturucu" : "Dynamic QR Code Generator",
    qrDesc: lang === "tr" ? "Kreatör profilinize yönlendiriren yüksek çözünürlüklü dynamic QR kodları tasarlayın." : "Design custom interactive QR codes pointing directly to your creative hub.",
    qrColors: lang === "tr" ? "Renk Seçimi & Özelleştirme" : "QR Color Settings & Branding",
    qrFg: lang === "tr" ? "QR Kod Rengi" : "QR Foreground Color",
    qrBg: lang === "tr" ? "QR Arka Plan Rengi" : "QR Background Color",
  };

  const QR_TEMPLATES = [
    { id: "WEBSITE", name: lang === "tr" ? "İnternet sitesi" : "Website", desc: lang === "tr" ? "Herhangi bir web sitesi URL'sine bağlantı" : "Link to any website URL", icon: Globe, tier: "FREE" },
    { id: "PDF", name: "PDF", desc: lang === "tr" ? "PDF göster" : "Display a PDF", icon: FileText, tier: "CREATOR" },
    { id: "LINK_LIST", name: lang === "tr" ? "Bağlantıların Listesi" : "Link List", desc: lang === "tr" ? "Birden fazla bağlantı paylaşın" : "Share multiple links", icon: List, tier: "CREATOR" },
    { id: "VCARD", name: "vCard", desc: lang === "tr" ? "Elektronik kartvizitinizi paylaşın" : "Share contact vCard", icon: User, tier: "STARTER" },
    { id: "BUSINESS", name: lang === "tr" ? "İşletme" : "Business", desc: lang === "tr" ? "İşletmenizle ilgili bilgileri paylaşın" : "Share business info", icon: Briefcase, tier: "CREATOR" },
    { id: "VIDEO", name: "Video", desc: lang === "tr" ? "Bir video göster" : "Display a video", icon: Play, tier: "STARTER" },
    { id: "IMAGES", name: lang === "tr" ? "Görseller" : "Images", desc: lang === "tr" ? "Birden fazla görsel paylaşın" : "Share multiple images", icon: Image, tier: "STARTER" },
    { id: "FACEBOOK", name: "Facebook", desc: lang === "tr" ? "Facebook sayfanızı paylaşın" : "Share Facebook page", icon: Globe, tier: "FREE" },
    { id: "INSTAGRAM", name: "Instagram", desc: lang === "tr" ? "Instagram'ınızı paylaşın" : "Share Instagram page", icon: Globe, tier: "FREE" },
    { id: "SOCIAL_MEDIA", name: lang === "tr" ? "Sosyal medya" : "Social Media", desc: lang === "tr" ? "Sosyal kanallarınızı paylaşın" : "Share social channels", icon: MessageCircle, tier: "STARTER" },
    { id: "WHATSAPP", name: "WhatsApp", desc: lang === "tr" ? "WhatsApp mesajlarını alın" : "Receive WhatsApp messages", icon: MessageCircle, tier: "FREE" },
    { id: "MP3", name: "MP3", desc: lang === "tr" ? "Bir ses dosyası paylaş" : "Share an audio file", icon: Music, tier: "CREATOR" },
    { id: "MENU", name: lang === "tr" ? "Menü" : "Menu", desc: lang === "tr" ? "Bir restoran menüsü oluşturun" : "Create restaurant menu", icon: Utensils, tier: "CREATOR" },
    { id: "APPS", name: lang === "tr" ? "Uygulamalar" : "Apps", desc: lang === "tr" ? "Bir uygulama mağazasına yönlendir" : "Redirect to app store", icon: Smartphone, tier: "CREATOR" },
    { id: "COUPON", name: lang === "tr" ? "Kupon" : "Coupon", desc: lang === "tr" ? "Kupon paylaş" : "Share promotional coupons", icon: Percent, tier: "STARTER" },
    { id: "WIFI", name: "Wifi", desc: lang === "tr" ? "Bir Wi-Fi ağına bağlanın" : "Connect to a Wi-Fi network", icon: Wifi, tier: "FREE" },
  ];

  const userPlan = initialUser.plan || "FREE";
  const qrLimitMax = userPlan === "FREE" ? 5 : userPlan === "STARTER" ? 15 : Infinity;
  const qrCount = qrCodes.length;
  const isQuotaReached = qrCount >= qrLimitMax;

  const isTemplateUnlocked = (templateTier: string) => {
    if (userPlan === "CREATOR" || userPlan === "PRO_BUSINESS" || initialUser.role === "ADMIN") {
      return true;
    }
    if (userPlan === "STARTER") {
      return templateTier === "FREE" || templateTier === "STARTER";
    }
    return templateTier === "FREE";
  };

  const getQrTypeMeta = (type: string) => {
    const found = QR_TEMPLATES.find((t) => t.id === type);
    return found || { name: type, desc: "", icon: QrCode, tier: "FREE" };
  };

  const COLORS = ["#a855f7", "#ec4899", "#10b981", "#3b82f6", "#f59e0b", "#6366f1"];

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-8 w-full max-w-full items-start justify-start overflow-hidden">
      {/* LEFT COLUMN: ACTIVE WORKSPACE CONTENT */}
      <div className="flex-1 space-y-5 md:space-y-8 w-full max-w-full md:max-w-3xl min-w-0 overflow-hidden">
        <div className="w-full max-w-full space-y-5 md:space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350 overflow-hidden">
          
          {/* Top Banner Alert / Quotas */}
          <div className="p-3 md:p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 relative overflow-hidden bg-white border-zinc-200 shadow-sm">
            <div className="space-y-2 flex-1 w-full">
              <div className="flex items-center gap-2.5">
                <QrCode className="h-5 w-5 text-teal-500" />
                <h2 className="font-black text-lg text-zinc-950">
                  {lang === "tr" ? "Dinamik QR Kod Stüdyosu" : "Dynamic QR Code Studio"}
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {lang === "tr" 
                  ? "Kreatör profiliniz ve özel şablonlarınız için yüksek çözünürlüklü dynamic QR kodları oluşturun."
                  : "Create custom high-resolution dynamic QR codes for your profiles and template assets."}
              </p>

              {/* Quota Progress Bar */}
              <div className="space-y-1.5 pt-2 max-w-md">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                  <span>{lang === "tr" ? "QR OLUŞTURMA LİMİTİ" : "QR USAGE LIMIT"}</span>
                  <span>
                    {qrCount} / {qrLimitMax === Infinity ? (lang === "tr" ? "SINIRSIZ" : "UNLIMITED") : `${qrLimitMax}`}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-zinc-100">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-rose-500 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((qrCount / (qrLimitMax === Infinity ? 100 : qrLimitMax)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {qrMode === "catalog" && (
              <button
                type="button"
                onClick={() => {
                  if (isQuotaReached) {
                    alert(lang === "tr" ? "Oluşturma limitine ulaştınız. Lütfen paketinizi yükseltin!" : "You have reached your creation limit. Please upgrade your plan!");
                    return;
                  }
                  setQrMode("create");
                }}
                className={`px-5 py-3 rounded-xl font-bold text-xs cursor-pointer transition-all flex items-center gap-2 text-slate-900 bg-gradient-to-r from-purple-600 to-rose-600 hover:opacity-90 shadow-md ${
                  isQuotaReached ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Plus className="h-4 w-4" />
                {lang === "tr" ? "Yeni QR Kodu Oluştur" : "Create New QR Code"}
              </button>
            )}
          </div>

          {/* MODE 1: CATALOG VIEW */}
          {qrMode === "catalog" && (
            <>
              {qrCodes.length === 0 ? (
                <div className="p-6 md:p-16 rounded-2xl border text-center flex flex-col items-center gap-4 bg-white border-zinc-200 shadow-sm">
                  <div className="h-16 w-16 rounded-full bg-teal-400/10 flex items-center justify-center border border-teal-500/20">
                    <QrCode className="h-8 w-8 text-teal-500" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-sm text-zinc-900">
                      {lang === "tr" ? "Henüz QR Kod Oluşturmadınız" : "No QR Codes Created Yet"}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      {lang === "tr" 
                        ? "Yukarıdaki 'Yeni QR Kodu Oluştur' butonuna basarak 16 şablondan birini seçip ilk dinamik QR kodunuzu oluşturabilirsiniz!"
                        : "Click the 'Create New QR Code' button above to select from 16 templates and generate your first dynamic code!"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {qrCodes.map((qr) => {
                    const meta = getQrTypeMeta(qr.type);
                    const MetaIcon = meta.icon;
                    return (
                      <div 
                        key={qr.id} 
                        className="p-4 md:p-5 rounded-2xl border flex flex-col justify-between gap-5 relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md bg-white border-zinc-200 shadow-sm hover:border-zinc-350"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit">
                              <MetaIcon className="h-2.5 w-2.5" />
                              {meta.name}
                            </span>
                            <h4 className="font-black text-sm leading-snug text-zinc-900">{qr.name}</h4>
                            <p className="text-[10px] text-slate-500 font-semibold">{new Date(qr.createdAt).toLocaleDateString("tr-TR")}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteQr(qr.id)}
                            className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Center Preview QR Code */}
                        <div ref={qrRef} className="flex justify-center py-2.5 md:py-2 bg-white rounded-xl p-3 border border-zinc-100">
                          <QRCodeSVG
                            value={qr.value}
                            size={140}
                            fgColor={qr.fgColor}
                            bgColor={qr.bgColor}
                            level="H"
                          />
                        </div>

                        {/* Download Action Bar */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const link = document.createElement("a");
                              const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(qr.value)}&color=${qr.fgColor.replace("#", "")}&ecc=H`;
                              link.href = fallbackUrl;
                              link.download = `qr-${qr.name}.png`;
                              link.target = "_blank";
                              link.click();
                            }}
                            className="flex items-center justify-center gap-1.5 py-2.5 md:py-2 rounded-xl border font-bold text-[10px] transition-colors cursor-pointer bg-zinc-550/10 border-zinc-200 text-zinc-755 hover:bg-zinc-100"
                          >
                            <Download className="h-3 w-3" />
                            PNG
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(qr.value)}&color=${qr.fgColor.replace("#", "")}&ecc=H&format=svg`;
                              link.download = `qr-${qr.name}.svg`;
                              link.target = "_blank";
                              link.click();
                            }}
                            className="flex items-center justify-center gap-1.5 py-2.5 md:py-2 rounded-xl border font-bold text-[10px] transition-colors cursor-pointer bg-zinc-550/10 border-zinc-200 text-zinc-755 hover:bg-zinc-100"
                          >
                            <Download className="h-3 w-3" />
                            SVG
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* MODE 2: CREATION BUILDER VIEW */}
          {qrMode === "create" && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
              {/* Cancel Header Bar */}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    setQrMode("catalog");
                    setSelectedTemplate(null);
                  }}
                  className="px-4 py-2.5 md:py-2 rounded-full border text-xs font-bold transition-all cursor-pointer bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                >
                  &larr; {lang === "tr" ? "Listeye Geri Dön" : "Back to List"}
                </button>

                {selectedTemplate && (
                  <span className="px-3 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase flex items-center gap-1.5">
                    {lang === "tr" ? "Aktif Şablon" : "Active Template"}: {selectedTemplate}
                  </span>
                )}
              </div>

              {/* 1. SELECT TEMPLATE GRID (IF NOT YET SELECTED) */}
              {!selectedTemplate ? (
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <h3 className="font-black text-sm uppercase tracking-wider text-zinc-800">
                      {lang === "tr" ? "Bir Şablon Tipi Seçin" : "Select a Template Type"}
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      {lang === "tr" 
                        ? "Kreatör planınıza dahil olan 16 premium şablondan birini seçerek başlayın."
                        : "Start by selecting one of the 16 premium templates included in your subscription."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {QR_TEMPLATES.map((tmpl) => {
                      const Icon = tmpl.icon;
                      const unlocked = isTemplateUnlocked(tmpl.tier);
                      return (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => {
                            if (!unlocked) {
                              alert(lang === "tr" 
                                ? `Bu şablon ${tmpl.tier} planı gerektiriyor! Lütfen profilinizi yükseltin.` 
                                : `This template requires ${tmpl.tier} plan! Please upgrade your subscription.`);
                              return;
                            }
                            setSelectedTemplate(tmpl.id);
                            setQrName(tmpl.name);
                          }}
                          className={`p-3 sm:p-4 md:p-5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 sm:gap-3 transition-all relative group cursor-pointer overflow-hidden ${
                            unlocked 
                              ? "bg-white border-zinc-200 hover:border-emerald-350 hover:shadow-md"
                              : "opacity-40 cursor-not-allowed"
                          }`}
                        >
                          {/* Locked Overlay badge */}
                          {!unlocked && (
                            <div className="absolute top-2.5 right-2.5 p-1 rounded-md bg-gray-50 border border-gray-100 text-slate-500">
                              <Lock className="h-3 w-3" />
                            </div>
                          )}

                          <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${
                            unlocked 
                              ? "bg-emerald-50 text-emerald-500" 
                              : "bg-gray-50 text-slate-500"
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="space-y-0.5">
                            <h4 className="font-black text-xs text-zinc-900">
                              {tmpl.name}
                            </h4>
                            <p className="text-[9px] text-slate-500 font-semibold leading-normal line-clamp-2">
                              {tmpl.desc}
                            </p>
                          </div>

                          {tmpl.tier !== "FREE" && (
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full select-none ${
                              tmpl.tier === "STARTER" 
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                                : "bg-teal-400/10 text-teal-500 border border-teal-500/20"
                            }`}>
                              {tmpl.tier}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* 2. DYNAMIC TEMPLATE DESIGNER BUILDER */
                <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
                  {/* Left: Input parameters */}
                  <div className="flex-1 space-y-6">
                    <div className="p-3 md:p-6 rounded-2xl border space-y-5 md:space-y-6 w-full max-w-full overflow-hidden bg-white border-zinc-200 shadow-sm">
                      <div className="border-b pb-3 flex items-center gap-3">
                        <span className="p-2 rounded-lg bg-emerald-50 text-emerald-500">
                          {(() => {
                            const MetaIcon = getQrTypeMeta(selectedTemplate).icon;
                            return <MetaIcon className="h-5 w-5" />;
                          })()}
                        </span>
                        <div className="space-y-0.5">
                          <h3 className="font-black text-sm uppercase tracking-wider text-zinc-900">
                            {lang === "tr" ? "Şablon Ayrıntılarını Doldurun" : "Fill Template Details"}
                          </h3>
                          <p className="text-[10px] text-slate-500">
                            {lang === "tr" ? "Seçtiğiniz şablon tipine göre aşağıdaki form alanlarını girin." : "Fill the template fields below to automatically encode your custom code."}
                          </p>
                        </div>
                      </div>

                      {/* QR General Name */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider block text-zinc-550">
                          {lang === "tr" ? "QR Kod İsmi" : "QR Code Label Name"}
                        </label>
                        <input
                          type="text"
                          value={qrName}
                          onChange={(e) => setQrName(e.target.value)}
                          placeholder={lang === "tr" ? "Örn: Portfolyo Linkim" : "e.g., My Portfolio Link"}
                          className="w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs bg-zinc-50 border-zinc-200 text-zinc-900"
                        />
                      </div>

                      {/* DYNAMIC FORM: WIFI */}
                      {selectedTemplate === "WIFI" && (
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider block text-zinc-550">Network SSID (Ağ Adı)</label>
                            <input
                              type="text"
                              value={wifiSsid}
                              onChange={(e) => setWifiSsid(e.target.value)}
                              placeholder="e.g. Creator_Guest_Wifi"
                              className="w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs bg-zinc-50 border-zinc-200 text-zinc-900"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider block text-zinc-550">Wi-Fi Şifresi</label>
                            <input
                              type="password"
                              value={wifiPassword}
                              onChange={(e) => setWifiPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs bg-zinc-50 border-zinc-200 text-zinc-900"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider block text-zinc-550">Şifreleme Tipi</label>
                            <select
                              value={wifiEncryption}
                              onChange={(e: any) => setWifiEncryption(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs font-semibold bg-zinc-50 border-zinc-200 text-zinc-900"
                            >
                              <option value="WPA">WPA / WPA2</option>
                              <option value="WEP">WEP</option>
                              <option value="nopass">{lang === "tr" ? "Şifresiz (Açık)" : "Open (No Password)"}</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* DYNAMIC FORM: WHATSAPP */}
                      {selectedTemplate === "WHATSAPP" && (
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider block text-zinc-550">Telefon Numarası</label>
                            <input
                              type="text"
                              value={whatsAppPhone}
                              onChange={(e) => setWhatsAppPhone(e.target.value)}
                              placeholder="Örn: +905321234567"
                              className="w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs bg-zinc-50 border-zinc-200 text-zinc-900"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider block text-zinc-550">Hazır Mesaj (Seçenekli)</label>
                            <textarea
                              value={whatsAppMessage}
                              onChange={(e) => setWhatsAppMessage(e.target.value)}
                              placeholder={lang === "tr" ? "Örn: Merhaba, beatler hakkında bilgi almak istiyorum." : "e.g. Hi! I'd like to check licensing prices."}
                              className="w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs min-h-[80px] resize-y bg-zinc-50 border-zinc-200 text-zinc-900"
                            />
                          </div>
                        </div>
                      )}

                      {/* DYNAMIC FORM: VCARD */}
                      {selectedTemplate === "VCARD" && (
                        <div className="space-y-4 pt-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-wider block text-zinc-550">Tam İsim</label>
                              <input
                                type="text"
                                value={vCardName}
                                onChange={(e) => setVCardName(e.target.value)}
                                placeholder="Jane Doe"
                                className="w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs bg-zinc-50 border-zinc-200 text-zinc-900"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-wider block text-zinc-550">Telefon</label>
                              <input
                                type="text"
                                value={vCardPhone}
                                onChange={(e) => setVCardPhone(e.target.value)}
                                placeholder="+90555..."
                                className="w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs bg-zinc-50 border-zinc-200 text-zinc-900"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-wider block text-zinc-550">E-posta Adresi</label>
                              <input
                                type="email"
                                value={vCardEmail}
                                onChange={(e) => setVCardEmail(e.target.value)}
                                placeholder="jane@company.com"
                                className="w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs bg-zinc-50 border-zinc-200 text-zinc-900"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-wider block text-zinc-550">İşletme / Kurum</label>
                              <input
                                type="text"
                                value={vCardOrg}
                                onChange={(e) => setVCardOrg(e.target.value)}
                                placeholder="Creator Corp"
                                className="w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs bg-zinc-50 border-zinc-200 text-zinc-900"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-wider block text-zinc-550">Başlık / Ünvan</label>
                              <input
                                type="text"
                                value={vCardTitle}
                                onChange={(e) => setVCardTitle(e.target.value)}
                                placeholder="Lead Producer"
                                className="w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs bg-zinc-50 border-zinc-200 text-zinc-900"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-wider block text-zinc-550">İnternet Adresi</label>
                              <input
                                type="text"
                                value={vCardUrl}
                                onChange={(e) => setVCardUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs bg-zinc-50 border-zinc-200 text-zinc-900"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* DEFAULT REDIRECT URL INPUT FOR ALL BASIC/URL SHABLONS */}
                      {selectedTemplate !== "WIFI" && selectedTemplate !== "WHATSAPP" && selectedTemplate !== "VCARD" && (
                        <div className="space-y-2 pt-2">
                          <label className="text-[10px] font-black uppercase tracking-wider block text-zinc-550">
                            {lang === "tr" ? "Yönlendirilecek İnternet Adresi (URL)" : "Action Destination URL"}
                          </label>
                          <input
                            type="text"
                            value={qrValueText}
                            onChange={(e) => setQrValueText(e.target.value)}
                            placeholder={lang === "tr" ? "https://my-website.com" : "https://my-portfolio-link.com"}
                            className="w-full px-4 py-3 rounded-xl border focus:border-teal-500/50 outline-none text-xs bg-zinc-50 border-zinc-200 text-zinc-900"
                          />
                        </div>
                      )}

                      {/* Design Customizations */}
                      <div className="space-y-4 pt-4 border-t border-zinc-150">
                        <h4 className="text-xs font-bold text-zinc-900">{t.qrColors}</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.qrFg}</label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={qrFgColor}
                                onChange={(e) => setQrFgColor(e.target.value)}
                                className="h-10 w-10 rounded border cursor-pointer bg-transparent border-zinc-200"
                              />
                              <input
                                type="text"
                                value={qrFgColor}
                                onChange={(e) => setQrFgColor(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border text-xs bg-zinc-50 border-zinc-200 text-zinc-900"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.qrBg}</label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={qrBgColor}
                                onChange={(e) => setQrBgColor(e.target.value)}
                                className="h-10 w-10 rounded border cursor-pointer bg-transparent border-zinc-200"
                              />
                              <input
                                type="text"
                                value={qrBgColor}
                                onChange={(e) => setQrBgColor(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border text-xs bg-zinc-50 border-zinc-200 text-zinc-900"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCreateQr}
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-900 font-extrabold text-xs transition-colors cursor-pointer"
                      >
                        {lang === "tr" ? "QR Kodu Kaydet" : "Save QR Code"}
                      </button>
                    </div>
                  </div>

                  {/* Designer preview side */}
                  <div className="w-full lg:w-[300px] shrink-0 space-y-4">
                    <div className="p-6 rounded-2xl border flex flex-col items-center justify-center bg-white border-zinc-200 shadow-sm gap-4">
                      <h4 className="text-[10px] font-black uppercase text-slate-500">{lang === "tr" ? "CANLI TASARIM ÖNİZLEMESİ" : "LIVE DESIGN PREVIEW"}</h4>
                      
                      <div className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-inner">
                        <QRCodeSVG
                          value={computedQrValue}
                          size={180}
                          fgColor={qrFgColor}
                          bgColor={qrBgColor}
                          level="H"
                        />
                      </div>

                      <div className="text-center space-y-1 w-full px-2">
                        <div className="text-xs font-black truncate text-zinc-900">
                          {qrName || (lang === "tr" ? "Yeni QR Kod" : "Unnamed QR")}
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold leading-normal truncate font-mono">
                          {computedQrValue}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: INVISIBLE SPACER */}
      <div className="hidden lg:block lg:w-[360px] shrink-0 sticky top-32 self-start pointer-events-none opacity-0" />
    </div>
  );
}
