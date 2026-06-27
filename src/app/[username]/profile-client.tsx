"use client";

import { useState, useTransition } from "react";
import { buyProductSimulated } from "@/app/actions";
import { Loader2, CheckCircle, CreditCard, Lock, X, Download, FileText, ShoppingBag } from "lucide-react";
import GlobalOverlayManager from "@/components/global-overlay-manager";
import UniversalProfile, { UniversalProfileData } from "@/components/universal-profile";

type LinkItem = {
 id: string;
 title: string;
 url: string;
 isActive: boolean;
 type?: string;
 animation?: string;
 bgColor?: string | null;
 textColor?: string | null;
 borderColor?: string | null;
 borderStyle?: string | null;
 borderWidth?: string | null;
 borderRadius?: string | null;
 shadow?: string | null;
 fontWeight?: string | null;
 blockType?: string;
 metadata?: string | null;
};

type ProductItem = {
 id: string;
 title: string;
 type: string;
 price: number;
 description: string | null;
 fileUrl: string | null;
 isActive: boolean;
 salesCount: number;
};

interface ProfileClientProps {
 username: string;
 displayName?: string | null;
 bio: string;
 theme: string;
 links: LinkItem[];
 products: ProductItem[];
 addons?: any[];
 avatarUrl: string | null;
 avatarShape?: string | null;
 background: string | null;
 fontStyle: string;
 bioColor?: string | null;
 usernameColor?: string | null;
 plan?: string | null;
 storeTitle?: string | null;
 storeCoverUrl?: string | null;
 storeLayout?: string | null;
 customCss?: string | null;
 buttonClass?: string | null;
 systemSettings?: {
   adScript?: string | null;
   customImageUrl?: string | null;
   customTargetUrl?: string | null;
   isActive: boolean;
 } | null;
 purchasedTemplates?: any[];
 purchasedModules?: any[];
 showBadge?: boolean;
 isActiveTemplatePremium?: boolean;
 hasActivePremiumModule?: boolean;
 isCoded?: boolean;
 customHtml?: string | null;
 masterLayoutHtml?: string | null;
 avatarHtml?: string | null;
 headerHtml?: string | null;
 socialHtml?: string | null;
 linksHtml?: string | null;
 backgroundHtml?: string | null;
 containerClasses?: string | null;
 jsonConfig?: string | null;
 socialLinks?: any;
 socials?: any[];
 isPremiumTemplateActive?: boolean;
 templateSettings?: any;
}

export default function ProfileClient({ 
  username, 
  displayName,
  bio, 
  theme, 
  links, 
  products, 
  addons = [], 
  avatarUrl, 
  avatarShape = "circle", 
  background, 
  fontStyle, 
  bioColor, 
  usernameColor, 
  plan, 
  storeTitle, 
  storeCoverUrl, 
  storeLayout, 
  customCss, 
  buttonClass, 
  systemSettings,
  purchasedTemplates = [],
  purchasedModules = [],
  isActiveTemplatePremium = false,
  hasActivePremiumModule = false,
  isCoded = false,
  customHtml = null,
  masterLayoutHtml = null,
  avatarHtml = null,
  headerHtml = null,
  socialHtml = null,
  linksHtml = null,
  backgroundHtml = null,
  containerClasses = null,
  jsonConfig = null,
  socialLinks = null,
  socials = null,
  isPremiumTemplateActive = false,
  templateSettings = null,
  showBadge = false
}: ProfileClientProps) {
 const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
 const [cardNumber, setCardNumber] = useState("");
 const [cardExpiry, setCardExpiry] = useState("");
 const [cardCvc, setCardCvc] = useState("");
 const [checkoutSuccess, setCheckoutSuccess] = useState(false);
 const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
 
 const [isPending, startTransition] = useTransition();
 const [errorMsg, setErrorMsg] = useState("");
 const [lang, setLang] = useState<"tr" | "en">("en");
 const [activeTheme, setActiveTheme] = useState<"dark" | "light">("dark");

 const handleStateChange = (state: { lang: "tr" | "en"; theme: "dark" | "light" }) => {
 setLang(state.lang);
 setActiveTheme(state.theme);
 };

 const handleCheckoutSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!selectedProduct) return;

 setErrorMsg("");
 startTransition(async () => {
 try {
 await buyProductSimulated(selectedProduct.id);
 setDownloadUrl(selectedProduct.fileUrl);
 setCheckoutSuccess(true);
 } catch (err: any) {
 setErrorMsg(lang === "tr" ? "Simüle edilen transfer işlemi başarısız." : "Simulated payment transaction failed.");
 }
 });
 };

 const closeCheckoutModal = () => {
 setSelectedProduct(null);
 setCardNumber("");
 setCardExpiry("");
 setCardCvc("");
 setCheckoutSuccess(false);
 setDownloadUrl(null);
 setErrorMsg("");
 };

 const t = {
 shopCatalog: lang === "tr" ? "Dijital Ürün Mağazası" : "Digital Shop Catalog",
 noDesc: lang === "tr" ? "Bu ürün için bir açıklama girilmemiş." : "No description provided.",
 downloadGlow: lang === "tr" ? "Anında Dosya Teslimat" : "Instant File Download",
 microGate: lang === "tr" ? "Güvenli Ödeme Geçidi" : "Micro-Checkout Gate",
 totalPrice: lang === "tr" ? "Toplam Tutar" : "Total Price",
 cardNum: lang === "tr" ? "Kredi Kartı Numarası" : "Credit Card Number",
 expiry: lang === "tr" ? "Son Kullanma Tarihi" : "Expiry Date",
 secureSim: lang === "tr" ? "Güvenli simüle edilmiş 3D Secure altyapısı." : "Secure simulated 3D Secure checkout environment.",
 completePay: lang === "tr" ? "Ödemeyi Tamamla" : "Complete Payment",
 confirmed: lang === "tr" ? "Ödeme Başarıyla Alındı!" : "Payment Confirmed!",
 confirmedDesc: lang === "tr" 
 ? "Simüle edilen transferiniz sisteme işlendi. Satın aldığınız dijital dosyaya aşağıdaki butondan anında ulaşabilirsiniz."
 : "Your simulated transfer has been logged. You can instantly access the download link below.",
 downloadInstantly: lang === "tr" ? "Dosyayı Şimdi İndir" : "Download File Instantly",
 };

 const profileData: UniversalProfileData = {
 username,
 displayName,
 bio,
 theme,
 links,
 products,
 addons,
 avatarUrl,
 background,
 fontStyle,
 bioColor,
 usernameColor,
 plan,
 storeTitle,
 storeCoverUrl,
 storeLayout,
 customCss,
 buttonClass,
 systemSettings,
 avatarShape,
 purchasedTemplates,
 purchasedModules,
 isActiveTemplatePremium,
 hasActivePremiumModule,
 isCoded,
 customHtml,
 masterLayoutHtml,
 avatarHtml,
 headerHtml,
 socialHtml,
 linksHtml,
 backgroundHtml,
 containerClasses,
 jsonConfig,
 socialLinks,
 socials,
 isPremiumTemplateActive,
 templateSettings
 };

 return (
 <>
 <GlobalOverlayManager onStateChange={handleStateChange} />
 <UniversalProfile data={profileData} isDarkContext={activeTheme === "dark"} lang={lang} showBadge={showBadge} />
 
 {/* Product Modals */}
 {selectedProduct && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeCheckoutModal} />
 <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 shadow-2xl rounded-3xl p-3 md:p-6 overflow-hidden">
 <button onClick={closeCheckoutModal} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
 <X className="h-5 w-5" />
 </button>

 {!checkoutSuccess ? (
 <>
 <div className="mb-6 border-b border-zinc-800 pb-5">
 <div className="flex items-center gap-3 mb-2">
 <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
 <ShoppingBag className="h-5 w-5" />
 </div>
 <div>
 <h3 className="text-lg font-bold text-white">{selectedProduct.title}</h3>
 <p className="text-xs font-medium text-emerald-400">{t.downloadGlow}</p>
 </div>
 </div>
 <p className="text-sm text-zinc-400 mt-3">{selectedProduct.description || t.noDesc}</p>
 </div>

 <form onSubmit={handleCheckoutSubmit} className="space-y-4">
 <div className="flex justify-between items-center mb-4 p-3 rounded-xl bg-black/50 border border-zinc-800/50">
 <span className="text-sm font-semibold text-zinc-400">{t.totalPrice}</span>
 <span className="text-xl font-black text-white">{selectedProduct.price === 0 ? "Ücretsiz" : `${selectedProduct.price} ₺`}</span>
 </div>
 {/* ... Rest of the checkout form ... */}
 {selectedProduct.price > 0 && (
 <>
 <div className="space-y-3">
 <div className="relative">
 <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
 <input required type="text" placeholder={t.cardNum} maxLength={19} className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors text-sm font-medium" />
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 <input required type="text" placeholder="MM/YY" maxLength={5} className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors text-sm font-medium text-center" />
 <input required type="text" placeholder="CVC" maxLength={3} className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors text-sm font-medium text-center" />
 </div>
 </div>
 <div className="flex items-start gap-2 mt-4 px-1">
 <Lock className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
 <p className="text-[10px] text-zinc-500 leading-tight">{t.secureSim}</p>
 </div>
 </>
 )}
 {errorMsg && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">{errorMsg}</div>}
 <button disabled={isPending} type="submit" className="w-full mt-2 py-3.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
 {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : t.completePay}
 </button>
 </form>
 </>
 ) : (
 <div className="text-center py-6">
 <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500/30">
 <CheckCircle className="h-8 w-8" />
 </div>
 <h3 className="text-xl font-bold text-white mb-2">{t.confirmed}</h3>
 <p className="text-sm text-zinc-400 mb-8">{t.confirmedDesc}</p>
 <a href={downloadUrl || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
 <Download className="h-5 w-5" />
 {t.downloadInstantly}
 </a>
 </div>
 )}
 </div>
 </div>
 )}
 </>
 );
}
