"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

export default function SuperAdminLoginPage() {
  const router = useRouter();
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
        body: JSON.stringify({ type: "super", password }),
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans" style={{
      background: "radial-gradient(ellipse at top, #1a0000 0%, #0a0a0a 50%, #000000 100%)"
    }}>
      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full md:w-96 h-96 bg-red-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-800/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div style={{
          background: "rgba(10,0,0,0.8)",
          border: "1px solid rgba(220,38,38,0.3)",
          borderRadius: "16px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 60px rgba(220,38,38,0.1), 0 25px 50px rgba(0,0,0,0.5)"
        }} className="p-4 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{
              background: "rgba(220,38,38,0.15)",
              border: "1px solid rgba(220,38,38,0.4)"
            }}>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Süper Admin</h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Yüksek yetkili erişim paneli
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-3 md:py-2.5 md:py-1 rounded-full" style={{
              background: "rgba(220,38,38,0.1)",
              border: "1px solid rgba(220,38,38,0.2)"
            }}>
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-400 font-medium">KISITLI ERİŞİM</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg" style={{
                background: "rgba(220,38,38,0.1)",
                border: "1px solid rgba(220,38,38,0.3)"
              }}>
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-400">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                Süper Admin Şifresi
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  style={{
                    width: "100%",
                    padding: "12px 44px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(220,38,38,0.5)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              style={{
                width: "100%",
                padding: "13px",
                background: loading || !password
                  ? "rgba(220,38,38,0.3)"
                  : "linear-gradient(135deg, #dc2626, #991b1b)",
                border: "none",
                borderRadius: "10px",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading || !password ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: loading || !password ? "none" : "0 4px 15px rgba(220,38,38,0.3)"
              }}
            >
              {loading ? "Doğrulanıyor..." : "Erişim Sağla"}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-6 text-center">
            <a
              href="/admin-login"
              style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", textDecoration: "none" }}
            >
              Admin girişi için tıklayın →
            </a>
          </div>
        </div>

        {/* Warning */}
        <p className="text-center mt-4 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          Bu alana yetkisiz erişim girişimleri kayıt altına alınmaktadır.
        </p>
      </div>
    </div>
  );
}
