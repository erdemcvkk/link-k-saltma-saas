import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import HomeClient from "./home-client";

export default async function Home() {
 const { userId } = await auth();

 // Fetch global settings
 const settings = await db.globalSetting.findMany();
 const serializedSettings = settings.reduce((acc, curr) => {
 acc[curr.key] = curr.value;
 return acc;
 }, {} as Record<string, string>);

 const dbSliderItems = await db.sliderItem.findMany({ orderBy: { createdAt: "asc" } });
 const serializedSliderItems = dbSliderItems.map((item) => ({
 id: item.id,
 title: item.title,
 imageUrl: item.imageUrl,
 link: item.link || undefined,
 }));

 const siteTitle = serializedSettings["site_title"] || "CREATOR.HUB";
 const siteLogo = serializedSettings["site_logo"] || "";
 const heroTitle = serializedSettings["hero_title"] || "Your home";
 const heroHighlight = serializedSettings["hero_highlight"] || "on the web";
 const heroSubtitle = serializedSettings["hero_subtitle"] || "The ultimate platform built for creators who want to stand out. Showcase everything you create, sell, and share - beautifully.";
 
 let creatorsData = [];
 try {
 if (serializedSettings["creators_data"]) {
 creatorsData = JSON.parse(serializedSettings["creators_data"]);
 } else {
 // Default fallback
 creatorsData = [
 { id: "1", name: "Metro Beats", username: "metro_beats", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&fit=crop" },
 { id: "2", name: "Sarah J.", username: "sarahj", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop" },
 { id: "3", name: "Alex Chen", username: "alexc", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop" },
 { id: "4", name: "Maria Garcia", username: "mariag", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&h=256&fit=crop" }
 ];
 }
 } catch (e) {}

 let featuresData = [];
 try {
 if (serializedSettings["features_data"]) {
 featuresData = JSON.parse(serializedSettings["features_data"]);
 } else {
 // Default fallback
 featuresData = [
 {
 id: "feat-1",
 title: "Build your page in minutes.",
 highlightWords: "in minutes.",
 description: "Drag, drop, and customize. Our intuitive editor makes it easy to create a stunning page that showcases everything you do.",
 imageUrl: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=800&auto=format&fit=crop",
 listItems: [
 { text: "Smart link blocks", icon: "layout" },
 { text: "Music & video embeds", icon: "component" },
 { text: "Custom storefronts", icon: "smartphone" }
 ]
 },
 {
 id: "feat-2",
 title: "Know your audience. Grow your reach.",
 highlightWords: "Grow your reach.",
 description: "See exactly how your page performs. Track views, clicks, and where your traffic comes from—all in real-time.",
 imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
 listItems: [
 { text: "Visitor Analytics", icon: "chart" },
 { text: "Traffic sources", icon: "target" },
 { text: "Device breakdown", icon: "smartphone" }
 ]
 }
 ];
 }
 } catch (e) {}

 return (
 <HomeClient
 userId={userId}
 siteTitle={siteTitle}
 siteLogo={siteLogo}
 heroTitle={heroTitle}
 heroHighlight={heroHighlight}
 heroSubtitle={heroSubtitle}
 creatorsData={creatorsData}
 featuresData={featuresData}
 sliderItems={serializedSliderItems}
 paymentLinkStarter={serializedSettings["payment_link_starter"] || ""}
 paymentLinkCreator={serializedSettings["payment_link_creator"] || ""}
 paymentLinkPro={serializedSettings["payment_link_pro"] || ""}
 priceStarter={serializedSettings["price_starter"] || "150"}
 priceCreator={serializedSettings["price_creator"] || "450"}
 />
 );
}
