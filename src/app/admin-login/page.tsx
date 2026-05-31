"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
 const router = useRouter();
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError("");
 setLoading(true);

 try {
 const res = await fetch("/api/admin-auth", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ type: "admin", email, password }),
 });

 const data = await res.json();

 if (!res.ok) {
 setError(data.error || "Hata oluştu");
 return;
 }

 router.push("/admin");
 router.refresh();
 } catch {
 setError("Sunucuya bağlanılamadı");
 } finally {
 setLoading(false);
 }
 };

 return (
 <div
 className="min-h-screen flex items-center justify-center p-4 font-sans"
 style={{
 background:
 "radial-gradient(ellipse at top left, #0d1117 0%, #0a0a14 50%, #050508 100%)",
 }}
 >
 {/* Background glow */}
 <div className="absolute inset-0 overflow-hidden pointer-events-none">
 <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full md:w-[500px] h-[300px] bg-purple-900/10 rounded-full blur-3xl" />
 <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl" />
 </div>

 <div className="relative w-full max-w-md">
 {/* Card */}
 <div
 style={{
 background: "rgba(10,10,20,0.85)",
 border: "1px solid rgba(139,92,246,0.25)",
 borderRadius: "18px",
 backdropFilter: "blur(24px)",
 boxShadow:
 "0 0 60px rgba(139,92,246,0.08), 0 25px 50px rgba(0,0,0,0.6)",
 }}
 className="p-4 md:p-8"
 >
 {/* Header */}
 <div className="text-center mb-8">
 <div
 className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
 style={{
 background: "rgba(139,92,246,0.12)",
 border: "1px solid rgba(139,92,246,0.35)",
 }}
 >
 <ShieldCheck className="w-8 h-8 text-purple-400" />
 </div>
 <h1 className="text-2xl font-bold text-white mb-1">Admin Girişi</h1>
 <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
 Yönetim paneline erişmek için giriş yapın
 </p>
 </div>

 {/* Form */}
 <form onSubmit={handleSubmit} className="space-y-4">
 {error && (
 <div
 className="flex items-center gap-2 p-3 rounded-lg"
 style={{
 background: "rgba(239,68,68,0.1)",
 border: "1px solid rgba(239,68,68,0.3)",
 }}
 >
 <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
 <span className="text-sm text-red-400">{error}</span>
 </div>
 )}

 {/* Email */}
 <div>
 <label
 className="block text-sm font-medium mb-2"
 style={{ color: "rgba(255,255,255,0.6)" }}
 >
 E-posta Adresi
 </label>
 <div className="relative">
 <Mail
 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
 style={{ color: "rgba(255,255,255,0.3)" }}
 />
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 required
 placeholder="admin@example.com"
 style={{
 width: "100%",
 padding: "12px 12px 12px 40px",
 background: "rgba(255,255,255,0.04)",
 border: "1px solid rgba(255,255,255,0.1)",
 borderRadius: "10px",
 color: "white",
 fontSize: "14px",
 outline: "none",
 transition: "border-color 0.2s",
 boxSizing: "border-box",
 }}
 onFocus={(e) =>
 (e.target.style.borderColor = "rgba(139,92,246,0.5)")
 }
 onBlur={(e) =>
 (e.target.style.borderColor = "rgba(255,255,255,0.1)")
 }
 />
 </div>
 </div>

 {/* Password */}
 <div>
 <label
 className="block text-sm font-medium mb-2"
 style={{ color: "rgba(255,255,255,0.6)" }}
 >
 Şifre
 </label>
 <div className="relative">
 <Lock
 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
 style={{ color: "rgba(255,255,255,0.3)" }}
 />
 <input
 type={showPassword ? "text" : "password"}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 required
 placeholder="••••••••"
 style={{
 width: "100%",
 padding: "12px 44px 12px 40px",
 background: "rgba(255,255,255,0.04)",
 border: "1px solid rgba(255,255,255,0.1)",
 borderRadius: "10px",
 color: "white",
 fontSize: "14px",
 outline: "none",
 transition: "border-color 0.2s",
 boxSizing: "border-box",
 }}
 onFocus={(e) =>
 (e.target.style.borderColor = "rgba(139,92,246,0.5)")
 }
 onBlur={(e) =>
 (e.target.style.borderColor = "rgba(255,255,255,0.1)")
 }
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2"
 style={{ color: "rgba(255,255,255,0.3)" }}
 >
 {showPassword ? (
 <EyeOff className="w-4 h-4" />
 ) : (
 <Eye className="w-4 h-4" />
 )}
 </button>
 </div>
 </div>

 <button
 type="submit"
 disabled={loading || !email || !password}
 style={{
 width: "100%",
 padding: "13px",
 background:
 loading || !email || !password
 ? "rgba(139,92,246,0.25)"
 : "linear-gradient(135deg, #7c3aed, #6d28d9)",
 border: "none",
 borderRadius: "10px",
 color: "white",
 fontSize: "14px",
 fontWeight: "600",
 cursor:
 loading || !email || !password ? "not-allowed" : "pointer",
 transition: "all 0.2s",
 marginTop: "8px",
 boxShadow:
 loading || !email || !password
 ? "none"
 : "0 4px 15px rgba(139,92,246,0.3)",
 }}
 >
 {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
 </button>
 </form>

 {/* Footer link */}
 <div className="mt-6 text-center">
 <a
 href="/super-admin"
 style={{
 color: "rgba(255,255,255,0.25)",
 fontSize: "12px",
 textDecoration: "none",
 }}
 >
 Süper Admin girişi →
 </a>
 </div>
 </div>
 </div>
 </div>
 );
}
