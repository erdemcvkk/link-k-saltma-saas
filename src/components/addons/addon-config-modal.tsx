"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveAddonConfig, addAddonProduct, deleteAddonProduct } from "@/app/actions";
import { X, Loader2, Save, Store, Calendar, FileQuestion, Mail, Heart, Clock, Briefcase, HelpCircle, MapPin, MessageCircle, Trash2, Plus, ShoppingBag } from "lucide-react";
import StorefrontPreview from "@/components/storefront-preview";

interface AddonConfigModalProps {
 addon: {
 id: string;
 addonType: string;
 isActive: boolean;
 config: string | null;
 };
 products?: any[];
 onClose: (config?: string, isActive?: boolean) => void;
 lang: string;
 username: string;
}

export default function AddonConfigModal({ addon, products = [], onClose, lang, username }: AddonConfigModalProps) {
 const router = useRouter();
 const [isLoading, setIsLoading] = useState(false);
 const [isPending, startTransition] = useTransition();
 const [dialog, setDialog] = useState<{ isOpen: boolean; type: string; message: string; onConfirm: (() => void) | null }>({ isOpen: false, type: "alert", message: "", onConfirm: null });

 const showAlert = (message: string) => setDialog({ isOpen: true, type: "alert", message, onConfirm: null });
 const showConfirm = (message: string, onConfirm: () => void) => setDialog({ isOpen: true, type: "confirm", message, onConfirm });
 const closeDialog = () => setDialog({ isOpen: false, type: "alert", message: "", onConfirm: null });
 const [domain, setDomain] = useState("link-saas.com");
 
 useEffect(() => {
 if (typeof window !== "undefined") {
 setDomain(window.location.host);
 }
 }, []);

 const getDefaultTheme = (type: string) => {
 switch (type) {
 case "NEO_BRUTAL": return "neo-brutalism";
 case "ORGANIC": return "organic-earth";
 case "RETRO": return "retro-arcade";
 case "ACADEMIA": return "dark-academia";
 case "Y2K": return "y2k-holographic";
 case "PREMIUM_CREATOR": return "premium-creator";
 default: return "classic";
 }
 };
 const [configData, setConfigData] = useState<any>(() => {
 try {
 return addon.config ? JSON.parse(addon.config) : {};
 } catch (e) {
 return {};
 }
 });
 const [isActive, setIsActive] = useState<boolean>(addon.isActive);
 const getDefaultSlug = (type: string) => {
 if (!type) return "store";
 if (type === "MINI_STORE") return "store";
 if (type === "NEO_BRUTAL") return "neo-brutal";
 if (type === "ORGANIC") return "organic";
 if (type === "RETRO") return "retro";
 if (type === "ACADEMIA") return "academia";
 if (type === "Y2K") return "y2k";
 if (type === "BOOKING") return "booking";
 if (type === "NEWSLETTER") return "newsletter";
 if (type === "QA") return "qa";
 if (type === "DONATION") return "donation";
 if (type === "PREMIUM_CREATOR") return "creator-store";
 if (type === "PREMIUM_VIDEO") return "masterclass";
 return type.toLowerCase();
 };
 const activeSlug = configData.customSlug || getDefaultSlug(addon?.addonType);


 const handleFileUpload = async (file: File): Promise<string> => {
 return new Promise((resolve, reject) => {
 if (file.size > 2 * 1024 * 1024) {
 return reject(new Error("Dosya boyutu 2MB'den büyük olamaz. Lütfen daha küçük bir dosya seçin."));
 }
 const reader = new FileReader();
 reader.readAsDataURL(file);
 reader.onload = (event) => resolve(event.target?.result as string);
 reader.onerror = () => reject(new Error("Dosya okuma hatası"));
 });
 };

 const handleSave = () => {
 startTransition(async () => {
 try {
 const res: any = await saveAddonConfig(addon.id, JSON.stringify(configData), isActive);
 if (res?.error) {
 showAlert(res.error);
 } else {
 showAlert(lang === "tr" ? "Ayarlar başarıyla kaydedildi!" : "Settings saved!");
 onClose(JSON.stringify(configData), isActive);
 }
 } catch (err: any) {
 showAlert(err.message || "Error");
 }
 });
 };

 const renderInput = (key: string, label: string, placeholder: string, type = "text") => (
 <div className="space-y-1.5 mb-4">
 <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{label}</label>
 <input
 type={type}
 value={configData[key] || ""}
 onChange={(e) => setConfigData({ ...configData, [key]: e.target.value })}
 placeholder={placeholder}
 className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
 />
 </div>
 );


 const renderImageUpload = (key: string, label: string) => (
 <div className="space-y-1.5 mb-4">
 <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{label}</label>
 <div className="flex items-center gap-3">
 {configData[key] && (
 <img src={configData[key]} alt="Preview" className="w-12 h-12 rounded-lg object-cover bg-zinc-100" />
 )}
 <div className="flex-1 relative">
 <input
 type="text"
 value={configData[key] || ""}
 onChange={(e) => setConfigData({ ...configData, [key]: e.target.value })}
 placeholder="https://..."
 className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 outline-none pr-24"
 />
 <label className="absolute right-1 top-1 bottom-1 flex items-center justify-center px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold rounded-lg cursor-pointer transition-colors">
 {lang === "tr" ? "Dosya Seç" : "Upload"}
 <input 
 type="file" 
 className="hidden" 
 accept="image/*"
 onChange={async (e) => {
 const file = e.target.files?.[0];
 if (file) {
 try {
 const url = await handleFileUpload(file);
 setConfigData({ ...configData, [key]: url });
 } catch (err: any) { showAlert(err.message); }
 }
 }}
 />
 </label>
 </div>
 </div>
 </div>
 );

 const renderTextarea = (key: string, label: string, placeholder: string) => (
 <div className="space-y-1.5 mb-4">
 <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{label}</label>
 <textarea
 value={configData[key] || ""}
 onChange={(e) => setConfigData({ ...configData, [key]: e.target.value })}
 placeholder={placeholder}
 rows={3}
 className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm resize-none custom-scrollbar"
 />
 </div>
 );

 const renderFaqEditor = () => {
 const pairs = configData.faqPairs || [];
 return (
 <div className="space-y-3">
 {pairs.map((p: any, idx: number) => (
 <div key={idx} className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 relative group">
 <button
 type="button"
 onClick={() => {
 const newPairs = [...pairs];
 newPairs.splice(idx, 1);
 setConfigData({ ...configData, faqPairs: newPairs });
 }}
 className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
 >
 <X className="h-3 w-3" />
 </button>
 <input
 type="text"
 placeholder="Soru"
 value={p.q}
 onChange={(e) => {
 const newPairs = [...pairs];
 newPairs[idx].q = e.target.value;
 setConfigData({ ...configData, faqPairs: newPairs });
 }}
 className="w-full p-2 text-sm font-bold bg-transparent border-b border-zinc-200 focus:border-indigo-500 outline-none mb-2"
 />
 <textarea
 placeholder="Cevap"
 value={p.a}
 onChange={(e) => {
 const newPairs = [...pairs];
 newPairs[idx].a = e.target.value;
 setConfigData({ ...configData, faqPairs: newPairs });
 }}
 className="w-full p-2 text-xs bg-transparent outline-none resize-none h-16"
 />
 </div>
 ))}
 <button
 type="button"
 onClick={() => {
 const newPairs = [...pairs, { q: "", a: "" }];
 setConfigData({ ...configData, faqPairs: newPairs });
 }}
 className="w-full py-3 md:py-2.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-colors"
 >
 + Soru Ekle
 </button>
 </div>
 );
 };

 const getAddonDetails = () => {
 switch (addon.addonType) {
 case "MINI_STORE":
 case "NEO_BRUTAL":
 case "ORGANIC":
 case "RETRO":
 case "ACADEMIA":
 case "Y2K":
 case "PREMIUM_CREATOR": return { icon: <Store className="h-5 w-5" />, title: lang === "tr" ? "Mağaza" : "Store" };
 case "PREMIUM_VIDEO": return { icon: <Store className="h-5 w-5" />, title: lang === "tr" ? "Premium Video" : "Premium Video" };
 case "BOOKING": return { icon: <Calendar className="h-5 w-5" />, title: lang === "tr" ? "Randevu" : "Booking" };
 case "QA": return { icon: <FileQuestion className="h-5 w-5" />, title: lang === "tr" ? "Soru-Cevap" : "Q&A" };
 case "NEWSLETTER": return { icon: <Mail className="h-5 w-5" />, title: lang === "tr" ? "Bülten" : "Newsletter" };
 case "DONATION": return { icon: <Heart className="h-5 w-5" />, title: lang === "tr" ? "Bağış" : "Donation" };
 case "COUNTDOWN": return { icon: <Clock className="h-5 w-5" />, title: lang === "tr" ? "Geri Sayım" : "Countdown" };
 case "PORTFOLIO": return { icon: <Briefcase className="h-5 w-5" />, title: lang === "tr" ? "Portfolyo" : "Portfolio" };
 case "FAQ": return { icon: <HelpCircle className="h-5 w-5" />, title: "FAQ" };
 case "MAP": return { icon: <MapPin className="h-5 w-5" />, title: lang === "tr" ? "Harita" : "Map" };
 case "WHATSAPP": return { icon: <MessageCircle className="h-5 w-5" />, title: "WhatsApp" };
 default: return { icon: <Store className="h-5 w-5" />, title: "Add-on" };
 }
 };

 const { icon, title } = getAddonDetails();

 const renderFields = () => {
 const renderSlugAndAvatar = () => (
 <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 {lang === "tr" ? "Genel Ayarlar" : "General Settings"}
 </h4>
 
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{lang === "tr" ? "Profil Fotoğrafı (URL veya Dosya)" : "Profile Image"}</label>
 <div className="flex gap-2">
 <input
 type="text"
 value={configData["avatarUrl"] || ""}
 onChange={(e) => setConfigData({ ...configData, avatarUrl: e.target.value })}
 placeholder="https://..."
 className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
 />
 <label className="flex items-center justify-center px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold rounded-xl cursor-pointer border border-zinc-200 transition-colors whitespace-nowrap">
 {lang === "tr" ? "Dosya Seç" : "Upload"}
 <input 
 type="file" 
 className="hidden" 
 accept="image/*"
 onChange={async (e) => {
 const file = e.target.files?.[0];
 if (file) {
 try {
 const url = await handleFileUpload(file);
 setConfigData({ ...configData, avatarUrl: url });
 } catch (err: any) { showAlert(err.message); }
 }
 }}
 />
 </label>
 </div>
 </div>
 </div>
 );

 let specificFields = null;

 switch (addon.addonType) {
 case "MINI_STORE":
 case "NEO_BRUTAL":
 case "ORGANIC":
 case "RETRO":
 case "ACADEMIA":
 case "Y2K":
 case "PREMIUM_CREATOR":
 specificFields = (
 <>
 <div className="space-y-4 pt-2 border-b border-zinc-200 pb-6 mb-6">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 <Store className="h-4 w-4" />
 {lang === "tr" ? "Mağaza Genel Ayarları" : "Store Settings"}
 </h4>
 {renderInput("storeTitle", lang === "tr" ? "Mağaza Başlığı" : "Store Title", lang === "tr" ? "Örn: Premium İçeriklerim" : "Store Name")}
 
 
 <div className="space-y-1.5 mb-4">
 <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{lang === "tr" ? "Profil Fotoğrafı (URL veya Dosya)" : "Profile Image"}</label>
 <div className="flex gap-2">
 <input
 type="text"
 value={configData["storeAvatarUrl"] || ""}
 onChange={(e) => setConfigData({ ...configData, storeAvatarUrl: e.target.value })}
 placeholder="https://..."
 className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
 />
 <label className="flex items-center justify-center px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-bold rounded-xl cursor-pointer border border-zinc-200 transition-colors whitespace-nowrap">
 {lang === "tr" ? "Dosya Seç" : "Upload"}
 <input 
 type="file" 
 className="hidden" 
 accept="image/*"
 onChange={async (e) => {
 const file = e.target.files?.[0];
 if (file) {
 try {
 const url = await handleFileUpload(file);
 setConfigData({ ...configData, storeAvatarUrl: url });
 } catch (err: any) { showAlert(err.message); }
 }
 }}
 />
 </label>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {renderInput("storeUsername", lang === "tr" ? "Mağaza Kullanıcı Adı" : "Store Username", "@username")}
 {renderInput("buyButtonText", lang === "tr" ? "Satın Al Butonu Metni" : "Buy Button Text", "Satın Al")}
 </div>
 {renderTextarea("storeBio", lang === "tr" ? "Mağaza Açıklaması (Bio)" : "Store Bio", lang === "tr" ? "Yazar & Kariyer Danışmanı" : "Author & Consultant")}

 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {renderInput("currency", lang === "tr" ? "Para Birimi" : "Currency", "₺, $, €")}
 <div className="space-y-1.5">
 <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">{lang === "tr" ? "Mağaza Teması" : "Store Theme"}</label>
 <select
 value={configData["theme"] || "classic"}
 onChange={(e) => setConfigData({ ...configData, theme: e.target.value })}
 className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
 >
 <option value="classic">Classic Minimal</option>
 <option value="vibrant-pop">Vibrant Pop</option>
 <option value="glassmorphism">Glassmorphism</option>
 <option value="neo-brutalism">Neo Brutalism</option>
 <option value="dark-drill">Dark Drill</option>
 <option value="organic-earth">Organic Earth</option>
 <option value="retro-arcade">Retro Arcade</option>
 <option value="dark-academia">Dark Academia</option>
 <option value="y2k-holographic">Y2K Holographic</option>
 <option value="premium-creator">Premium Creator</option>
 </select>
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <div className="flex flex-wrap items-center justify-between">
 <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
 <ShoppingBag className="h-4 w-4" />
 {lang === "tr" ? "Ürün Yönetimi" : "Product Management"}
 </h4>
 </div>

 {/* Add New Product Form */}
 <div className="p-4 md:p-5 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 space-y-4">
 <h5 className="text-sm font-bold text-indigo-700 flex items-center gap-2">
 <Plus className="h-4 w-4" />
 {lang === "tr" ? "Yeni Ürün Ekle" : "Add New Product"}
 </h5>
 <div className="space-y-3">
 <input type="text" id="newProdTitle" placeholder={lang === "tr" ? "Ürün Adı" : "Product Name"} className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none" />
 <div className="flex gap-2">
 <input type="number" id="newProdPrice" placeholder={lang === "tr" ? "Fiyat (₺)" : "Price"} className="w-1/3 p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none" />
 <select id="newProdType" className="w-2/3 p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none">
 <option value="PRESET">Lightroom Preset</option>
 <option value="EBOOK">E-Book (PDF)</option>
 <option value="BEAT">Audio Beat</option>
 <option value="SAMPLE_PACK">Sample Pack</option>
 <option value="VIDEO_COURSE">Video Course</option>
 <option value="SOFTWARE">Software/App</option>
 <option value="OTHER">Diğer</option>
 </select>
 </div>
 <div className="flex gap-2">
 <div className="w-1/2 flex gap-1 relative">
 <input type="text" id="newProdImageUrl" placeholder={lang === "tr" ? "Ürün Görseli (URL)" : "Product Image (URL)"} className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none pr-24" />
 <label className="absolute right-1 top-1 bottom-1 flex items-center justify-center px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-bold rounded-lg cursor-pointer transition-colors">
 {lang === "tr" ? "Dosya Seç" : "Upload"}
 <input 
 type="file" 
 className="hidden" 
 accept="image/*"
 onChange={async (e) => {
 const file = e.target.files?.[0];
 if (file) {
 try {
 const url = await handleFileUpload(file);
 (document.getElementById("newProdImageUrl") as HTMLInputElement).value = url;
 } catch (err: any) { showAlert(err.message); }
 }
 }}
 />
 </label>
 </div>
 <div className="w-1/2 flex gap-1 relative">
 <input type="text" id="newProdFileUrl" placeholder={lang === "tr" ? "İndirme Linki (Dosya)" : "Download Link (File)"} className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none pr-24" />
 <label className="absolute right-1 top-1 bottom-1 flex items-center justify-center px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-bold rounded-lg cursor-pointer transition-colors">
 {lang === "tr" ? "Dosya Seç" : "Upload"}
 <input 
 type="file" 
 className="hidden" 
 accept="*/*"
 onChange={async (e) => {
 const file = e.target.files?.[0];
 if (file) {
 try {
 const url = await handleFileUpload(file);
 (document.getElementById("newProdFileUrl") as HTMLInputElement).value = url;
 } catch (err: any) { showAlert(err.message); }
 }
 }}
 />
 </label>
 </div>
 </div>
 <textarea id="newProdDesc" placeholder={lang === "tr" ? "Ürün Açıklaması" : "Description"} className="w-full p-3 rounded-xl border border-indigo-100 bg-white text-sm font-medium focus:border-indigo-500 outline-none resize-none min-h-[80px]" />
 <button 
 type="button"
 onClick={async () => {
 try {
 setIsLoading(true);
 const title = (document.getElementById("newProdTitle") as HTMLInputElement).value;
 const price = parseFloat((document.getElementById("newProdPrice") as HTMLInputElement).value);
 const type = (document.getElementById("newProdType") as HTMLSelectElement).value;
 const imageUrl = (document.getElementById("newProdImageUrl") as HTMLInputElement).value;
 const fileUrl = (document.getElementById("newProdFileUrl") as HTMLInputElement).value;
 const description = (document.getElementById("newProdDesc") as HTMLTextAreaElement).value;
 
 if (!title || isNaN(price)) {
 showAlert(lang === "tr" ? "Lütfen başlık ve geçerli bir fiyat girin" : "Please enter title and valid price");
 return;
 }
 
 await addAddonProduct(title, type, price, description, fileUrl, imageUrl);
 (document.getElementById("newProdTitle") as HTMLInputElement).value = "";
 (document.getElementById("newProdPrice") as HTMLInputElement).value = "";
 (document.getElementById("newProdImageUrl") as HTMLInputElement).value = "";
 (document.getElementById("newProdFileUrl") as HTMLInputElement).value = "";
 (document.getElementById("newProdDesc") as HTMLTextAreaElement).value = "";
 showAlert(lang === "tr" ? "Ürün eklendi!" : "Product added!");
 router.refresh();
 } catch (err: any) {
 showAlert(err.message);
 } finally {
 setIsLoading(false);
 }
 }}
 className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm"
 >
 {lang === "tr" ? "Ürünü Ekle" : "Add Product"}
 </button>
 </div>
 </div>

 {/* Product List */}
 <div className="space-y-3">
 {products.length === 0 ? (
 <div className="text-center py-6 text-slate-500 text-sm">
 {lang === "tr" ? "Henüz ürün eklenmemiş." : "No products added yet."}
 </div>
 ) : (
 products.map(p => (
 <div key={p.id} className="flex flex-wrap items-center justify-between p-3 rounded-xl border border-zinc-200 bg-white shadow-sm">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0">
 {(p.imageUrl || p.fileUrl) ? (
 <img src={p.imageUrl || p.fileUrl || ""} alt={p.title} className="w-full h-full object-cover" />
 ) : (
 <ShoppingBag className="w-5 h-5 m-auto mt-3.5 text-zinc-400" />
 )}
 </div>
 <div>
 <p className="font-bold text-slate-800 text-sm line-clamp-1">{p.title}</p>
 <div className="flex items-center gap-2 mt-0.5">
 <span className="text-xs font-bold text-emerald-600">{p.price}₺</span>
 <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{p.type}</span>
 </div>
 </div>
 </div>
 <button 
 onClick={async () => {
 showConfirm(lang === "tr" ? "Bu ürünü silmek istediğinize emin misiniz?" : "Are you sure?", async () => {
 await deleteAddonProduct(p.id);
 router.refresh();
 });
 }}
 className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
 >
 <Trash2 className="h-4 w-4" />
 </button>
 </div>
 ))
 )}
 </div>
 </div>
 </>
 );
 break;
 case "BOOKING":
 specificFields = (
 <>
 {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Birebir Görüşme Ayarla" : "Book a 1:1 Call")}
 {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", lang === "tr" ? "Sizinle tanışmak için sabırsızlanıyorum." : "Looking forward to meeting you.")}
 {renderInput("calendarLink", lang === "tr" ? "Takvim Linki (Calendly vb.)" : "Calendar URL", "https://calendly.com/...")}
 {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Takvimi Görüntüle" : "View Calendar")}
 </>
 );
 break;
 case "QA":
 specificFields = (
 <>
 {renderInput("boxTitle", lang === "tr" ? "Kutu Başlığı" : "Box Title", lang === "tr" ? "Bana Soru Sor!" : "Ask me anything!")}
 {renderTextarea("welcomeMessage", lang === "tr" ? "Karşılama Mesajı" : "Welcome Message", lang === "tr" ? "Sorularınızı anonim olarak sorabilirsiniz." : "You can ask questions anonymously.")}
 {renderInput("placeholderText", lang === "tr" ? "Kutu İçi Yer Tutucu Metin" : "Input Placeholder", lang === "tr" ? "Sorunuzu buraya yazın..." : "Type your question...")}
 {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Gönder" : "Send")}
 <div className="flex items-center gap-2 mt-4">
 <input type="checkbox" id="allowAnonymous" className="rounded" checked={configData.allowAnonymous ?? true} onChange={(e) => setConfigData({ ...configData, allowAnonymous: e.target.checked })} />
 <label htmlFor="allowAnonymous" className="text-sm font-medium text-slate-700">
 {lang === "tr" ? "Anonim sorulara izin ver" : "Allow anonymous questions"}
 </label>
 </div>
 </>
 );
 break;
 case "PREMIUM_VIDEO":
 specificFields = (
 <>
 {renderImageUpload("coverUrl", lang === "tr" ? "Kapak Fotoğrafı (URL)" : "Cover Photo URL")}
 {renderInput("videoUrl", lang === "tr" ? "Video Linki (YouTube/Vimeo)" : "Video URL", "https://youtube.com/...")}
 {renderInput("title", lang === "tr" ? "Video Başlığı" : "Video Title", "UI/UX Masterclass Bölüm 1")}
 {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", "Tasarım sistemleri...")}
 {renderInput("actionUrl", lang === "tr" ? "Aksiyon Butonu Linki" : "Action URL", "https://...")}
 {renderInput("buttonText", lang === "tr" ? "Aksiyon Butonu Metni" : "Action Button Text", "Tamamını İzle")}
 </>
 );
 break;
 case "NEWSLETTER":
 specificFields = (
 <>
 {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Haftalık Bülten" : "Weekly Newsletter")}
 {renderTextarea("incentiveMsg", lang === "tr" ? "Teşvik Mesajı" : "Incentive Message", lang === "tr" ? "Spam yok, sadece kaliteli içerik." : "No spam, just good content.")}
 {renderInput("serviceUrl", lang === "tr" ? "Mailchimp/Revue Abonelik Linki" : "Newsletter URL", "https://mailchimp.com/...")}
 {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Subscribe Button Text", lang === "tr" ? "Abone Ol" : "Subscribe")}
 </>
 );
 break;
 case "DONATION":
 specificFields = (
 <>
 {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Bana Kahve Ismarla" : "Buy me a coffee")}
 {renderTextarea("thankYouMsg", lang === "tr" ? "Açıklama / Teşekkür Mesajı" : "Description / Thank You", lang === "tr" ? "Desteğiniz için teşekkürler!" : "Thank you for your support!")}
 {renderInput("platformUrl", lang === "tr" ? "Bağış Platformu Linki (Örn: Patreon)" : "Donation URL", "https://patreon.com/yourname")}
 {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Destek Ol" : "Support Me")}
 </>
 );
 break;
 case "COUNTDOWN":
 specificFields = (
 <>
 {renderInput("title", lang === "tr" ? "Etkinlik Başlığı" : "Event Title", lang === "tr" ? "Büyük Lansman" : "Big Launch")}
 {renderInput("targetDate", lang === "tr" ? "Hedef Tarih (Örn: 2026-12-31T23:59:59)" : "Target Date", "2026-12-31T23:59:59")}
 {renderTextarea("description", lang === "tr" ? "Açıklama" : "Description", lang === "tr" ? "Yeni ürünümüz çok yakında sizlerle!" : "Our new product is coming soon!")}
 {renderInput("buttonUrl", lang === "tr" ? "Yönlendirme Linki (Opsiyonel)" : "Redirect URL (Optional)", "https://...")}
 {renderInput("buttonText", lang === "tr" ? "Buton Yazısı (Opsiyonel)" : "Button Text (Optional)", lang === "tr" ? "Detaylar" : "Details")}
 </>
 );
 break;
 case "PORTFOLIO":
 specificFields = (
 <>
 {renderInput("title", lang === "tr" ? "Başlık" : "Title", lang === "tr" ? "Benim Çalışmalarım" : "My Works")}
 {renderTextarea("description", lang === "tr" ? "Kısa Biyografi / Açıklama" : "Short Bio / Description", lang === "tr" ? "Yaratıcı tasarımcı ve geliştirici." : "Creative designer and developer.")}
 {renderInput("behanceUrl", lang === "tr" ? "Behance Profil Linki" : "Behance URL", "https://behance.net/...")}
 {renderInput("dribbbleUrl", lang === "tr" ? "Dribbble Profil Linki" : "Dribbble URL", "https://dribbble.com/...")}
 {renderInput("githubUrl", lang === "tr" ? "GitHub Profil Linki" : "GitHub URL", "https://github.com/...")}
 {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Projelerime Göz At" : "View Projects")}
 </>
 );
 break;
 case "FAQ":
 specificFields = (
 <>
 {renderInput("title", lang === "tr" ? "S.S.S. Başlığı" : "FAQ Title", "Sıkça Sorulan Sorular")}
 {renderTextarea("questionsText", lang === "tr" ? "Sorular ve Cevaplar (Format: Soru|Cevap; Soru|Cevap;)" : "Questions & Answers (Format: Q|A; Q|A;)", "Kargo ne zaman ulaşır?|2-3 iş günü içinde.; İade var mı?|Evet, 14 gün içinde.;")}
 {renderInput("contactUrl", lang === "tr" ? "İletişim Linki" : "Contact URL", "mailto:info@domain.com")}
 {renderInput("buttonText", lang === "tr" ? "İletişim Butonu Yazısı" : "Contact Button Text", lang === "tr" ? "Bize Ulaşın" : "Contact Us")}
 </>
 );
 break;
 case "MAP":
 specificFields = (
 <>
 {renderInput("title", lang === "tr" ? "Lokasyon Başlığı" : "Location Title", lang === "tr" ? "Bizi Ziyaret Edin" : "Visit Us")}
 {renderTextarea("address", lang === "tr" ? "Açık Adres" : "Full Address", "İstanbul, Türkiye")}
 {renderInput("googleMapsUrl", lang === "tr" ? "Google Maps Linki" : "Google Maps URL", "https://maps.app.goo.gl/...")}
 {renderInput("buttonText", lang === "tr" ? "Yol Tarifi Butonu" : "Directions Button Text", lang === "tr" ? "Yol Tarifi Al" : "Get Directions")}
 </>
 );
 break;
 case "WHATSAPP":
 specificFields = (
 <>
 {renderInput("title", lang === "tr" ? "Başlık" : "Title", "WhatsApp İletişim")}
 {renderInput("phoneNumber", lang === "tr" ? "Telefon Numarası (Ülke kodu ile)" : "Phone Number (with country code)", "905551234567")}
 {renderTextarea("welcomeMessage", lang === "tr" ? "Karşılama Mesajı" : "Welcome Message", lang === "tr" ? "Merhaba, size nasıl yardımcı olabilirim?" : "Hello, how can I help you?")}
 {renderInput("buttonText", lang === "tr" ? "Buton Yazısı" : "Button Text", lang === "tr" ? "Sohbete Başla" : "Start Chat")}
 </>
 );
 break;
 default:
 specificFields = (
 <div className="p-3 md:p-6 bg-zinc-50 border border-zinc-200 text-zinc-600 rounded-2xl text-sm text-center">
 {lang === "tr" ? "Bu eklenti için özel ayar bulunmuyor." : "No specific settings for this add-on."}
 </div>
 );
 }
 
 return (
 <div className="space-y-6">
 {addon.addonType !== "MINI_STORE" && 
 addon.addonType !== "NEO_BRUTAL" && 
 addon.addonType !== "ORGANIC" && 
 addon.addonType !== "RETRO" && 
 addon.addonType !== "ACADEMIA" && 
 addon.addonType !== "Y2K" ? renderSlugAndAvatar() : null}
 {specificFields}
 </div>
 );
 };

 const renderLivePreview = () => {
 switch (addon.addonType) {
 case "MINI_STORE":
 case "NEO_BRUTAL":
 case "ORGANIC":
 case "RETRO":
 case "ACADEMIA":
 case "Y2K":
 return (
 <div className="w-full h-full relative overflow-hidden flex flex-col">
 <StorefrontPreview 
 theme={configData.theme || getDefaultTheme(addon.addonType)} 
 products={products.map(p => ({
 id: p.id,
 title: p.title,
 type: p.type,
 price: p.price.toString(),
 imageUrl: p.imageUrl || p.fileUrl,
 description: p.description || ""
 }))}
 storeTitle={configData.storeTitle || (lang === "tr" ? "Mağazam" : "My Store")}
 username={configData.storeUsername}
 bio={configData.storeBio}
 avatarUrl={configData.storeAvatarUrl}
 buyButtonText={configData.buyButtonText}
 />
 </div>
 );
 // For other addons, we render a generic card that reacts to configData in real time.
 case "BOOKING":
 return (
 <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-3 md:p-6">
 <div className="w-full p-3 md:p-6 bg-white rounded-3xl border border-zinc-200 shadow-lg flex flex-col items-center text-center space-y-4 transition-all">
 {configData.avatarUrl ? (
 <img src={configData.avatarUrl} className="w-16 h-16 rounded-full object-cover shadow-md" alt="Profile" />
 ) : (
 <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
 <Calendar className="h-8 w-8" />
 </div>
 )}
 <div>
 <h3 className="font-bold text-lg text-slate-800">{configData.title || (lang === "tr" ? "Birebir Görüşme Ayarla" : "Book a 1:1 call")}</h3>
 <p className="text-sm text-slate-500 mt-1">{configData.description || (lang === "tr" ? "Sizinle tanışmak için sabırsızlanıyorum." : "Looking forward to meeting you.")}</p>
 </div>
 <div className="w-full py-3 mt-2 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md cursor-pointer hover:bg-slate-800 transition-colors">
 {configData.buttonText || (lang === "tr" ? "Takvimi Görüntüle" : "View Calendar")}
 </div>
 </div>
 </div>
 );
 case "QA":
 return (
 <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-3 md:p-6">
 <div className="w-full p-3 md:p-6 bg-white rounded-3xl border border-zinc-200 shadow-lg flex flex-col space-y-4 transition-all">
 <div className="flex items-center gap-3">
 {configData.avatarUrl ? (
 <img src={configData.avatarUrl} className="w-12 h-12 rounded-full object-cover shrink-0 shadow-sm" alt="Profile" />
 ) : (
 <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
 <FileQuestion className="h-6 w-6" />
 </div>
 )}
 <h3 className="font-bold text-slate-800">{configData.boxTitle || (lang === "tr" ? "Bana Soru Sor!" : "Ask me anything!")}</h3>
 </div>
 <p className="text-sm text-slate-500 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
 {configData.welcomeMessage || (lang === "tr" ? "Sorularınızı anonim olarak sorabilirsiniz." : "Ask anonymously.")}
 </p>
 <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 h-24">
 <span className="text-xs text-zinc-400">{configData.placeholderText || (lang === "tr" ? "Sorunuzu buraya yazın..." : "Type your question...")}</span>
 </div>
 <div className="w-full py-3 rounded-xl bg-slate-900 text-white text-center font-bold text-sm shadow-md cursor-pointer hover:bg-slate-800 transition-colors">
 {configData.buttonText || (lang === "tr" ? "Gönder" : "Send")}
 </div>
 </div>
 </div>
 );
case "FAQ":
 return (
 <div className="w-full h-full bg-zinc-50 flex flex-col pt-16 px-4">
 <h3 className="font-black text-2xl text-slate-800 mb-6 px-2">{configData.title || (lang === "tr" ? "Sıkça Sorulan Sorular" : "FAQ")}</h3>
 <div className="space-y-3 w-full">
 {(configData.faqPairs && configData.faqPairs.length > 0) ? (
 configData.faqPairs.map((p: any, idx: number) => (
 <div key={idx} className="w-full p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm">
 <h4 className="font-bold text-sm text-slate-800 mb-1">{p.q || "Soru?"}</h4>
 <p className="text-xs text-slate-500">{p.a || "Cevap..."}</p>
 </div>
 ))
 ) : (
 <div className="w-full p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm">
 <h4 className="font-bold text-sm text-slate-800 mb-1">Soru Örneği?</h4>
 <p className="text-xs text-slate-500">Cevap Örneği...</p>
 </div>
 )}
 </div>
 </div>
 );
 default:
 return (
 <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-3 md:p-6 text-center">
 <div className="space-y-4">
 <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-inner">
 {icon}
 </div>
 <div>
 <h3 className="font-bold text-xl text-slate-800">{configData.title || configData.storeTitle || addon.addonType}</h3>
 <p className="text-sm text-slate-500 mt-2 max-w-[250px] mx-auto leading-relaxed">
 {lang === "tr" ? "Bu eklenti için canlı önizleme şu an desteklenmiyor, ancak ayarlarınız kaydedilecektir." : "Live preview not supported yet, but your settings will be saved."}
 </p>
 </div>
 </div>
 </div>
 );
 }
 };

 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md">
 <div className="relative w-full max-w-full md:w-[1200px] h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/20">
 
 {/* Header (Top Bar) */}
 <div className="px-6 md:px-8 py-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between bg-white shrink-0 z-20 gap-4">
 <div className="flex items-center gap-4">
 <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
 {icon}
 </div>
 <div>
 <h2 className="text-xl font-black text-slate-900 tracking-tight">
 {title} {lang === "tr" ? "Ayarları" : "Settings"}
 </h2>
 <p className="text-sm text-slate-500 font-medium mt-0.5">
 {lang === "tr" ? "Gerçek zamanlı eklenti düzenleyicisi" : "Real-time addon editor"}
 </p>
 </div>
 </div>

 <div className="flex items-center gap-3 md:gap-5 self-end sm:self-auto">
 {/* Status Toggle */}
 <div className="flex items-center gap-3 px-5 py-3 md:py-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-sm cursor-pointer" onClick={() => setIsActive(!isActive)}>
 <span className={`text-xs uppercase tracking-wider font-bold transition-colors ${isActive ? 'text-emerald-600' : 'text-zinc-400'}`}>
 {isActive ? (lang === "tr" ? "Yayında" : "Published") : (lang === "tr" ? "Taslak" : "Draft")}
 </span>
 <button 
 type="button"
 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${isActive ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-zinc-300'}`}
 >
 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-sm ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
 </button>
 </div>

 <button
 onClick={handleSave}
 disabled={isPending}
 className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
 >
 {isPending ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Save className="h-4.5 w-4.5" />}
 {lang === "tr" ? "Kaydet & Kapat" : "Save & Close"}
 </button>
 
 <button
 onClick={() => onClose()}
 className="p-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
 >
 <X className="h-5 w-5" />
 </button>
 </div>
 </div>

 {/* Split Screen Body */}
 <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-zinc-50/30">
 
 {/* Left Panel: Editor Form */}
 <div className="w-full lg:w-[45%] h-full overflow-y-auto p-3 md:p-6 md:p-8 bg-white border-r border-zinc-100 custom-scrollbar relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
 <div className="max-w-full md:w-[420px] mx-auto space-y-2">
 {renderFields()}
 </div>
 </div>

 {/* Right Panel: Live Mockup Preview */}
 <div className="hidden lg:flex flex-1 items-center justify-center p-4 md:p-8 relative overflow-hidden bg-zinc-100/50">
 {/* Ambient Background Glow matching the active state */}
 <div className="absolute inset-0 overflow-hidden pointer-events-none">
 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[600px] h-[600px] blur-[120px] rounded-full transition-colors duration-1000 ${isActive ? 'bg-emerald-500/10' : 'bg-indigo-500/5'}`} />
 </div>
 
 {/* iPhone Mockup Frame */}
 <div className="relative w-full max-w-sm lg:w-[360px] h-[740px] bg-black rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-[12px] border-black flex flex-col overflow-hidden z-10 shrink-0 ring-1 ring-white/10">
 {/* Notch */}
 <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
 <div className="w-36 h-7 bg-black rounded-b-3xl relative">
 <div className="absolute top-2.5 right-6 w-2 h-2 rounded-full bg-blue-900/40 border border-blue-400/20" />
 </div>
 </div>
 
 {/* Status Bar */}
 <div className="h-12 w-full bg-white flex justify-between items-center px-4 md:px-8 pt-3 text-[10px] font-medium z-40 text-black">
 <span>9:41</span>
 <div className="flex items-center gap-1.5">
 <div className="w-4 h-2.5 bg-black rounded-sm relative">
 <div className="absolute right-[-2px] top-0.5 bottom-0.5 w-[2px] bg-black rounded-r-sm" />
 </div>
 </div>
 </div>

 {/* Screen Content */}
 <div className="flex-1 w-full bg-white overflow-y-auto custom-scrollbar relative">
 {renderLivePreview()}
 </div>
 
 {/* Home Indicator */}
 <div className="absolute bottom-2 inset-x-0 h-1.5 flex justify-center z-50">
 <div className="w-32 h-1.5 bg-black/20 rounded-full" />
 </div>
 </div>

 {/* Hint label */}
 <div className="absolute bottom-8 text-xs font-bold uppercase tracking-widest text-zinc-400 bg-white/50 backdrop-blur-md px-4 py-3 md:py-2 rounded-full shadow-sm">
 {lang === "tr" ? "Canlı Önizleme Modu" : "Live Preview Mode"}
 </div>
 </div>
 
 </div>
 </div>
 
 {/* Custom Alert/Confirm Dialog */}
 {dialog.isOpen && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
 <div className="bg-white rounded-[2rem] shadow-2xl p-4 md:p-8 max-w-sm w-full transform transition-all animate-in fade-in zoom-in-95 duration-200">
 <h3 className="text-xl font-black text-slate-800 mb-3 text-center">
 {domain} {lang === "tr" ? "mesajı" : "says"}
 </h3>
 <p className="text-slate-600 font-medium text-center mb-8">{dialog.message}</p>
 <div className="flex items-center justify-center gap-3">
 <button
 onClick={() => {
 if (dialog.type === "confirm" && dialog.onConfirm) {
 dialog.onConfirm();
 }
 closeDialog();
 }}
 className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl transition-all shadow-md shadow-indigo-600/20"
 >
 {lang === "tr" ? "Tamam" : "OK"}
 </button>
 {dialog.type === "confirm" && (
 <button
 onClick={closeDialog}
 className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold rounded-2xl transition-all"
 >
 {lang === "tr" ? "İptal" : "Cancel"}
 </button>
 )}
 </div>
 </div>
 </div>
 )}
</div>
 );
}
