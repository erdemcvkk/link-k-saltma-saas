"use client";

import React, { createContext, useContext, useState, useTransition } from "react";

export type UserProfile = {
  theme: string;
  bio: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  customDomain?: string | null;
  avatarUrl?: string | null;
  background?: string | null;
  fontStyle?: string | null;
  bioColor?: string | null;
  usernameColor?: string | null;
  customCss?: string | null;
  buttonClass?: string | null;
  avatarShape?: string | null;
};

export type UserData = {
  id: string;
  username: string | null;
  plan: string;
  role: string;
  profile: UserProfile | null;
};

export type FontItem = {
  id?: string;
  name: string;
  value: string;
  tier: string;
  giftLabel?: string | null;
};

export type FeatureItem = {
  key: string;
  plans: string[];
};

export type ActiveTemplateType = {
  id: string;
  name: string;
  bgColor: string;
  fontStyle: string;
  buttonStyle: string;
  isCoded: boolean;
  customCss?: string | null;
  configJson?: string | null;
} | null;

interface DashboardContextType {
  user: UserData;
  globalSettings: Record<string, string>;
  lang: "tr" | "en";
  setLang: (lang: "tr" | "en") => void;
  activeTheme: "dark" | "light";
  setActiveTheme: (theme: "dark" | "light") => void;
  activeTemplate: ActiveTemplateType;
  setActiveTemplate: (template: ActiveTemplateType) => void;
  simulatedPlan: string;
  setSimulatedPlan: (plan: string) => void;
  features: FeatureItem[];
  fonts: FontItem[];
  isPremium: boolean;
  isCreator: boolean;
  hasFeature: (key: string, defaultIfMissing?: boolean) => boolean;
  triggerUpgradeModal: (title: string, desc: string) => void;
  successMsg: string;
  setSuccessMsg: (msg: string) => void;
  errorMsg: string;
  setErrorMsg: (msg: string) => void;
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;
  upgradeModalTitle: string;
  upgradeModalDesc: string;
  isPending: boolean;
  startTransition: React.TransitionStartFunction;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({
  children,
  initialUser,
  globalSettings = {},
  initialFeatures = [],
  initialFonts = [],
  initialActiveTemplate = null,
}: {
  children: React.ReactNode;
  initialUser: UserData;
  globalSettings?: Record<string, string>;
  initialFeatures?: FeatureItem[];
  initialFonts?: FontItem[];
  initialActiveTemplate?: ActiveTemplateType;
}) {
  const [lang, setLang] = useState<"tr" | "en">("en");
  const [activeTheme, setActiveTheme] = useState<"dark" | "light">("light");
  const [activeTemplate, setActiveTemplate] = useState<ActiveTemplateType>(initialActiveTemplate);
  const [simulatedPlan, setSimulatedPlan] = useState<string>(initialUser.plan);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeModalTitle, setUpgradeModalTitle] = useState("");
  const [upgradeModalDesc, setUpgradeModalDesc] = useState("");

  const triggerUpgradeModal = (title: string, desc: string) => {
    setUpgradeModalTitle(title);
    setUpgradeModalDesc(desc);
    setIsUpgradeModalOpen(true);
  };

  const hasFeature = (key: string, defaultIfMissing: boolean = false) => {
    if (initialUser.role === "ADMIN") return true;
    if (!initialFeatures || initialFeatures.length === 0) return defaultIfMissing;
    const feature = initialFeatures.find(f => f.key === key);
    if (!feature) return defaultIfMissing;
    return feature.plans.includes(simulatedPlan);
  };

  const isPremium = hasFeature("seo_customization", simulatedPlan !== "FREE") || hasFeature("qr_customization", simulatedPlan !== "FREE");
  const isCreator = hasFeature("custom_domain", simulatedPlan === "CREATOR" || simulatedPlan === "PRO_BUSINESS");

  return (
    <DashboardContext.Provider
      value={{
        user: initialUser,
        globalSettings,
        lang,
        setLang,
        activeTheme,
        setActiveTheme,
        activeTemplate,
        setActiveTemplate,
        simulatedPlan,
        setSimulatedPlan,
        features: initialFeatures,
        fonts: initialFonts,
        isPremium,
        isCreator,
        hasFeature,
        triggerUpgradeModal,
        successMsg,
        setSuccessMsg,
        errorMsg,
        setErrorMsg,
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
        upgradeModalTitle,
        upgradeModalDesc,
        isPending,
        startTransition,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
