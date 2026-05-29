const fs = require('fs');

let file = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf-8');
// Normalize to LF
file = file.replace(/\r\n/g, '\n');

// 2. Add icon UI for the quick link modal
const searchBlock = `                                  <div className="space-y-0.5">
                                    <input
                                      type="text"
                                      placeholder={lang === "tr" ? "Link URL" : "Link URL"}
                                      value={quickLinkUrl}
                                      onChange={(e) => setQuickLinkUrl(e.target.value)}
                                      className="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-[10px] text-zinc-900 focus:border-teal-500 outline-none bg-white"
                                    />
                                  </div>
                                </div>`;

const replaceBlock = `                                  <div className="space-y-0.5">
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
                                </div>`;

if (file.includes(searchBlock)) {
  file = file.replace(searchBlock, replaceBlock);
  console.log("Successfully replaced icon selector UI");
} else {
  console.log("Failed to find searchBlock");
}

// 3. Update addLink arguments
const addLinkSearch = `                                        await addLink(
                                          initialUser.id,
                                          quickLinkTitle,
                                          quickLinkUrl,
                                          "WEBSITE",
                                          "",
                                          "TEXT_LINK",
                                          null
                                        );`;
const addLinkReplace = `                                        await addLink(
                                          initialUser.id,
                                          quickLinkTitle,
                                          quickLinkUrl,
                                          quickLinkIcon,
                                          "",
                                          "TEXT_LINK",
                                          null
                                        );`;
if (file.includes(addLinkSearch)) {
  file = file.replace(addLinkSearch, addLinkReplace);
  console.log("Successfully replaced addLink");
} else {
  console.log("Failed to find addLinkSearch");
}

// 4. Update UI temp link logic
const tempLinkSearch = `type: "WEBSITE",
                                            clicks: [],
                                            blockType: "TEXT_LINK",`;
const tempLinkReplace = `type: quickLinkIcon,
                                            clicks: [],
                                            blockType: "TEXT_LINK",`;
if (file.includes(tempLinkSearch)) {
  file = file.replace(tempLinkSearch, tempLinkReplace);
  console.log("Successfully replaced temp link logic");
} else {
  console.log("Failed to find tempLinkSearch");
}

// 5. Reset the icon field after success
const resetSearch = `setQuickLinkTitle("");
                                        setQuickLinkUrl("");
                                        setSuccessMsg(`;
const resetReplace = `setQuickLinkTitle("");
                                        setQuickLinkUrl("");
                                        setQuickLinkIcon("WEBSITE");
                                        setSuccessMsg(`;
if (file.includes(resetSearch)) {
  file = file.replace(resetSearch, resetReplace);
  console.log("Successfully replaced reset logic");
} else {
  console.log("Failed to find resetSearch");
}

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', file);
