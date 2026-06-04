"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from "recharts";
import {
  Eye,
  MousePointerClick,
  Percent,
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
  Wifi,
  ShoppingBag
} from "lucide-react";
import { useDashboard } from "../dashboard-context";

type ClickItem = {
  id: string;
  createdAt: string;
};

type LinkItem = {
  id: string;
  title: string;
  url: string;
  type?: string;
  clicks?: ClickItem[];
};

type PageViewItem = {
  id: string;
  device: string | null;
  browser: string | null;
  country: string | null;
  referrer: string | null;
  createdAt: string;
};

interface AnalyticsClientProps {
  initialLinks: LinkItem[];
  initialPageViews: PageViewItem[];
}

const getLinkIconHelper = (type?: string, url?: string) => {
  switch (type) {
    case "WEBSITE":
    case "FACEBOOK":
    case "INSTAGRAM":
      return <Globe className="h-4 w-4 text-emerald-500" />;
    case "PDF":
      return <FileText className="h-4 w-4 text-emerald-500" />;
    case "LINK_LIST":
      return <List className="h-4 w-4 text-emerald-500" />;
    case "VCARD":
      return <User className="h-4 w-4 text-emerald-500" />;
    case "BUSINESS":
      return <Briefcase className="h-4 w-4 text-emerald-500" />;
    case "VIDEO":
      return <Play className="h-4 w-4 text-emerald-500" />;
    case "IMAGES":
      return <Image className="h-4 w-4 text-emerald-500" />;
    case "SOCIAL_MEDIA":
    case "WHATSAPP":
      return <MessageCircle className="h-4 w-4 text-emerald-500" />;
    case "MP3":
      return <Music className="h-4 w-4 text-emerald-500" />;
    case "MENU":
      return <Utensils className="h-4 w-4 text-emerald-500" />;
    case "APPS":
      return <Smartphone className="h-4 w-4 text-emerald-500" />;
    case "COUPON":
      return <Percent className="h-4 w-4 text-emerald-500" />;
    case "WIFI":
      return <Wifi className="h-4 w-4 text-emerald-500" />;
    default:
      if (url) {
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes("spotify") || lowerUrl.includes("soundcloud") || lowerUrl.includes("music")) {
          return <Music className="h-4 w-4 text-emerald-500" />;
        }
        if (lowerUrl.includes("shop") || lowerUrl.includes("store") || lowerUrl.includes("presets")) {
          return <ShoppingBag className="h-4 w-4 text-emerald-500" />;
        }
        if (lowerUrl.includes("website") || lowerUrl.includes("portfolio")) {
          return <Globe className="h-4 w-4 text-emerald-500" />;
        }
      }
      return <Globe className="h-4 w-4 text-emerald-500" />;
  }
};

export default function AnalyticsClient({
  initialLinks,
  initialPageViews,
}: AnalyticsClientProps) {
  const { lang } = useDashboard();


  const t = {
    totalViews: lang === "tr" ? "Toplam Profil Ziyareti" : "Total Profile Views",
    totalClicks: lang === "tr" ? "Toplam Link Tıklanması" : "Total Link Clicks",
    trafficOverTime: lang === "tr" ? "Zaman İçindeki Ziyaret ve Tıklanmalar" : "Views & Clicks Over Time",
    devices: lang === "tr" ? "Cihaz Türleri" : "Devices",
    browsers: lang === "tr" ? "Kullanılan Tarayıcılar" : "Browsers",
    referrers: lang === "tr" ? "Ziyaret Kaynakları (Referrers)" : "Referral Traffic",
    countries: lang === "tr" ? "Ziyaretçi Ülkeleri" : "Countries",
    performanceInsights: lang === "tr" ? "Performans İstatistikleri" : "Performance Insights",
    linkTitle: lang === "tr" ? "Link Başlığı" : "Link Title",
    linkUrl: lang === "tr" ? "Hedef URL" : "Action Destination URL",
  };

  // Calculations
  const totalViews = initialPageViews.length;
  const totalClicks = useMemo(() => {
    return initialLinks.reduce((sum, link) => sum + (link.clicks?.length || 0), 0);
  }, [initialLinks]);

  const averageCTR = useMemo(() => {
    if (totalViews === 0) return 0;
    return Number(((totalClicks / totalViews) * 100).toFixed(1));
  }, [totalViews, totalClicks]);

  const chartData = useMemo(() => {
    const datesMap: { [key: string]: { date: string; Views: number; Clicks: number } } = {};
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateString = d.toLocaleDateString("tr-TR", { month: "short", day: "numeric" });
      datesMap[dateString] = { date: dateString, Views: 0, Clicks: 0 };
    }

    initialPageViews.forEach((pv) => {
      const dateString = new Date(pv.createdAt).toLocaleDateString("tr-TR", { month: "short", day: "numeric" });
      if (datesMap[dateString]) {
        datesMap[dateString].Views += 1;
      }
    });

    initialLinks.forEach((link) => {
      link.clicks?.forEach((c) => {
        const dateString = new Date(c.createdAt).toLocaleDateString("tr-TR", { month: "short", day: "numeric" });
        if (datesMap[dateString]) {
          datesMap[dateString].Clicks += 1;
        }
      });
    });

    return Object.values(datesMap);
  }, [initialPageViews, initialLinks]);

  const aggregateMetric = (items: any[], key: string) => {
    const map: { [key: string]: number } = {};
    items.forEach((item) => {
      const val = item[key] || "Unknown";
      map[val] = (map[val] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  };

  const deviceData = useMemo(() => aggregateMetric(initialPageViews, "device"), [initialPageViews]);
  const countryData = useMemo(() => aggregateMetric(initialPageViews, "country"), [initialPageViews]);
  const referrerData = useMemo(() => {
    const data = aggregateMetric(initialPageViews, "referrer");
    return data.sort((a, b) => b.value - a.value).slice(0, 5);
  }, [initialPageViews]);

  const COLORS = ["#a855f7", "#ec4899", "#10b981", "#3b82f6", "#f59e0b", "#6366f1"];

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-8 w-full max-w-full items-start justify-start overflow-hidden">
      {/* LEFT COLUMN: ACTIVE WORKSPACE CONTENT */}
      <div className="flex-1 space-y-5 md:space-y-8 w-full max-w-full md:max-w-3xl min-w-0 overflow-hidden">
        
          <div className="w-full max-w-full space-y-5 md:space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-350 overflow-hidden">
            {/* Top Summaries Grids */}
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              <div className="p-3 md:p-6 rounded-2xl border flex items-center justify-between bg-white border-zinc-200 shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">{t.totalViews}</span>
                  <div className="text-xl md:text-3xl font-black text-zinc-950">{totalViews}</div>
                </div>
                <div className="p-3 rounded-xl bg-teal-400/10 border border-teal-500/20 text-teal-500">
                  <Eye className="h-5 w-5" />
                </div>
              </div>

              <div className="p-3 md:p-6 rounded-2xl border flex items-center justify-between bg-white border-zinc-200 shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">{t.totalClicks}</span>
                  <div className="text-xl md:text-3xl font-black text-zinc-950">{totalClicks}</div>
                </div>
                <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                  <MousePointerClick className="h-5 w-5" />
                </div>
              </div>

              <div className="p-3 md:p-6 rounded-2xl border flex items-center justify-between bg-white border-zinc-200 shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Average CTR</span>
                  <div className="text-xl md:text-3xl font-black text-emerald-400">{averageCTR}%</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Percent className="h-5 w-5" />
                </div>
              </div>
            </div>

            {totalViews === 0 ? (
              <div className="p-4 md:p-12 text-center rounded-2xl border border-dashed space-y-3 bg-white border-zinc-200">
                <div className="text-slate-500 text-sm font-semibold italic">
                  {lang === "tr" ? "Henüz trafik kaydı bulunmuyor. Sayfa linkinizi paylaşarak grafikleri anında inceleyebilirsiniz!" : "No traffic logged yet. Promote your link page to see analytics charts instantly!"}
                </div>
              </div>
            ) : (
              <>
                {/* Chart 1: Daily views & clicks */}
                <div className="p-3 md:p-6 rounded-2xl border space-y-4 bg-white border-zinc-200 shadow-sm">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-zinc-800">{t.trafficOverTime}</h3>
                  <div className="h-80 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#52525b" fontSize={10} />
                        <YAxis stroke="#52525b" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", color: "#000", borderRadius: "12px" }} />
                        <Legend />
                        <Area type="monotone" dataKey="Views" stroke="#a855f7" strokeWidth={2.5} fillOpacity={1} fill="url(#viewsGrad)" />
                        <Area type="monotone" dataKey="Clicks" stroke="#ec4899" strokeWidth={2.5} fillOpacity={1} fill="url(#clicksGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sub aggregations grid */}
                <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                  {/* Device and Browser splits */}
                  <div className="p-3 md:p-6 rounded-2xl border space-y-4 flex flex-col justify-between bg-white border-zinc-200 shadow-sm">
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-zinc-800">{t.devices} & {t.browsers}</h3>
                    <div className="h-56 flex items-center justify-center text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={deviceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {deviceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", color: "#000" }} />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Referrals split */}
                  <div className="p-3 md:p-6 rounded-2xl border space-y-4 bg-white border-zinc-200 shadow-sm">
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-zinc-800">{t.referrers}</h3>
                    <div className="h-56 text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={referrerData} layout="vertical">
                          <XAxis type="number" stroke="#52525b" />
                          <YAxis dataKey="name" type="category" stroke="#52525b" width={80} />
                          <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", color: "#000" }} />
                          <Bar dataKey="value" fill="#a855f7" radius={[0, 4, 4, 0]}>
                            {referrerData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Geolocation splits */}
                  <div className="p-3 md:p-6 rounded-2xl border space-y-4 flex flex-col justify-between bg-white border-zinc-200 shadow-sm">
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-zinc-800">{t.countries}</h3>
                    <div className="h-56 flex items-center justify-center text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={countryData}
                            cx="50%"
                            cy="50%"
                            outerRadius={65}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                          >
                            {countryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e4e4e7", color: "#000" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Table: Links Performance */}
                <div className="p-3 md:p-6 rounded-2xl border space-y-4 bg-white border-zinc-200 shadow-sm">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-zinc-800">{t.performanceInsights}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b text-slate-500 border-zinc-200">
                          <th className="py-3 px-4 font-bold">{t.linkTitle}</th>
                          <th className="py-3 px-4 font-bold">{t.linkUrl}</th>
                          <th className="py-3 px-4 font-bold text-center">{lang === "tr" ? "Tıklama Sayısı" : "Click Count"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {initialLinks.map((lnk) => (
                          <tr key={lnk.id} className="border-b hover:bg-zinc-550/10 transition-all border-zinc-100">
                            <td className="py-3.5 px-4 font-bold text-zinc-800">
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/50">
                                  {getLinkIconHelper(lnk.type, lnk.url)}
                                </div>
                                <span>{lnk.title}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 font-mono">{lnk.url}</td>
                            <td className="py-3.5 px-4 font-extrabold text-teal-500 text-center">{lnk.clicks?.length || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>

      </div>

      {/* RIGHT COLUMN: INVISIBLE SPACER */}
      <div className="hidden lg:block lg:w-[360px] shrink-0 sticky top-32 self-start pointer-events-none opacity-0" />
    </div>
  );
}
