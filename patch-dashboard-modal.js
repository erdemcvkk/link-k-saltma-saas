const fs = require('fs');

let file = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf-8');

// 1. Add quickLinkIcon state
if (!file.includes('const [quickLinkIcon, setQuickLinkIcon]')) {
  file = file.replace(
    'const [quickLinkUrl, setQuickLinkUrl] = useState("");',
    'const [quickLinkUrl, setQuickLinkUrl] = useState("");\n  const [quickLinkIcon, setQuickLinkIcon] = useState("WEBSITE");'
  );
}

// 2. Add icon UI for the quick link modal
const searchBlock = `
                                  <div className="space-y-0.5">
                                    <input
                                      type="text"
                                      placeholder={lang === "tr" ? "Link URL" : "Link URL"}
                                      value={quickLinkUrl}
                                      onChange={(e) => setQuickLinkUrl(e.target.value)}
                                      className="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-[10px] text-zinc-900 focus:border-teal-500 outline-none bg-white"
                                    />
                                  </div>
                                </div>
`;

const replaceBlock = `
                                  <div className="space-y-0.5">
                                    <input
                                      type="text"
                                      placeholder={lang === "tr" ? "Link URL" : "Link URL"}
                                      value={quickLinkUrl}
                                      onChange={(e) => setQuickLinkUrl(e.target.value)}
                                      className="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-[10px] text-zinc-900 focus:border-teal-500 outline-none bg-white"
                                    />
                                  </div>
                                </div>
                                <div className="pt-2 pb-2">
                                  <label className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block mb-2">
                                    {lang === "tr" ? "İkon Seçimi" : "Icon Selection"}
                                  </label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {[
                                      { id: "WEBSITE", icon: Globe },
                                      { id: "INSTAGRAM", icon: InstagramIcon },
                                      { id: "WHATSAPP", icon: MessageCircle },
                                      { id: "TIKTOK", icon: TiktokIcon },
                                      { id: "PINTEREST", icon: PinterestIcon },
                                      { id: "YOUTUBE", icon: YoutubeIcon },
                                      { id: "X", icon: TwitterIcon },
                                      { id: "REDDIT", icon: MessageCircle },
                                      { id: "LINKEDIN", icon: LinkedinIcon },
                                    ].map(iconOption => (
                                      <button
                                        key={iconOption.id}
                                        type="button"
                                        onClick={() => setQuickLinkIcon(iconOption.id)}
                                        className={\`p-1.5 rounded-lg flex items-center justify-center transition-all \${
                                          quickLinkIcon === iconOption.id 
                                            ? "bg-emerald-500 text-white shadow-md" 
                                            : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                                        }\`}
                                      >
                                        <iconOption.icon className="h-3.5 w-3.5" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
`;

if (!file.includes('setQuickLinkIcon(')) {
  file = file.replace(searchBlock, replaceBlock);
}

// 3. Update addLink arguments
const addLinkSearch = `
                                        await addLink(
                                          initialUser.id,
                                          quickLinkTitle,
                                          quickLinkUrl,
                                          "WEBSITE",
                                          "",
                                          "TEXT_LINK",
                                          null
                                        );
`;
const addLinkReplace = `
                                        await addLink(
                                          initialUser.id,
                                          quickLinkTitle,
                                          quickLinkUrl,
                                          quickLinkIcon,
                                          "",
                                          "TEXT_LINK",
                                          null
                                        );
`;
file = file.replace(addLinkSearch, addLinkReplace);

// 4. Update UI temp link logic
file = file.replace(
  'type: "WEBSITE",\n                                            clicks: [],\n                                            blockType: "TEXT_LINK",',
  'type: quickLinkIcon,\n                                            clicks: [],\n                                            blockType: "TEXT_LINK",'
);

// 5. Reset the icon field after success
file = file.replace(
  'setQuickLinkTitle("");\n                                        setQuickLinkUrl("");\n                                        setSuccessMsg(',
  'setQuickLinkTitle("");\n                                        setQuickLinkUrl("");\n                                        setQuickLinkIcon("WEBSITE");\n                                        setSuccessMsg('
);

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', file);
console.log('Patched dashboard-client.tsx modal!');
