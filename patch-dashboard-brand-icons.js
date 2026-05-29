const fs = require('fs');

let file = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf-8');

// 1. Remove Youtube, Twitter, Linkedin from lucide-react
file = file.replace('  Youtube,\n  Twitter,\n  Linkedin\n} from "lucide-react";', '} from "lucide-react";');

// 2. Import them from brand-icons
if (!file.includes('brand-icons')) {
  file = file.replace('} from "lucide-react";', '} from "lucide-react";\nimport { YoutubeIcon, TwitterIcon, LinkedinIcon, TiktokIcon, PinterestIcon, InstagramIcon } from "@/components/brand-icons";');
}

// 3. Update the ICON_OPTIONS in the form
file = file.replace('{ id: "INSTAGRAM", label: "Instagram", icon: Globe }', '{ id: "INSTAGRAM", label: "Instagram", icon: InstagramIcon }');
file = file.replace('{ id: "TIKTOK", label: "TikTok", icon: Music }', '{ id: "TIKTOK", label: "TikTok", icon: TiktokIcon }');
file = file.replace('{ id: "PINTEREST", label: "Pinterest", icon: Image }', '{ id: "PINTEREST", label: "Pinterest", icon: PinterestIcon }');
file = file.replace('{ id: "YOUTUBE", label: "YouTube", icon: Youtube }', '{ id: "YOUTUBE", label: "YouTube", icon: YoutubeIcon }');
file = file.replace('{ id: "X", label: "X", icon: Twitter }', '{ id: "X", label: "X", icon: TwitterIcon }');
file = file.replace('{ id: "LINKEDIN", label: "LinkedIn", icon: Linkedin }', '{ id: "LINKEDIN", label: "LinkedIn", icon: LinkedinIcon }');

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', file);
console.log('Patched dashboard-client.tsx with brand icons!');
