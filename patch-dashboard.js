const fs = require('fs');
let code = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf-8');

// Sync addons state
if (!code.includes("setAddons(initialAddons || [])")) {
  code = code.replace(
    `setSimulatedPlan(initialUser.plan);`,
    `setSimulatedPlan(initialUser.plan);\n    if (initialAddons) setAddons(initialAddons);\n`
  );
}

// Fix hardcoded "Aktif (Active)"
const oldStatusBadge = `<div className="text-[10px] font-bold text-emerald-500 mt-0.5 px-2 py-0.5 rounded-md bg-emerald-50 inline-block border border-emerald-100">
                                Aktif (Active)
                              </div>`;

const newStatusBadge = `{addon.isActive ? (
                                <div className="text-[10px] font-bold text-emerald-500 mt-0.5 px-2 py-0.5 rounded-md bg-emerald-50 inline-block border border-emerald-100">
                                  {lang === "tr" ? "Yayında" : "Active"}
                                </div>
                              ) : (
                                <div className="text-[10px] font-bold text-zinc-500 mt-0.5 px-2 py-0.5 rounded-md bg-zinc-100 inline-block border border-zinc-200">
                                  {lang === "tr" ? "Taslak" : "Draft"}
                                </div>
                              )}`;

code = code.replace(oldStatusBadge, newStatusBadge);

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', code, 'utf-8');
console.log("Dashboard Client patched successfully");
