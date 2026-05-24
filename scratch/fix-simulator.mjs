import fs from 'fs';
const path = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add state for simulatedPlan
if (!content.includes('const [simulatedPlan, setSimulatedPlan] = useState(initialUser.plan);')) {
  content = content.replace('const [activeTab, setActiveTab] = useState<"editor"', 'const [simulatedPlan, setSimulatedPlan] = useState(initialUser.plan);\n  const [activeTab, setActiveTab] = useState<"editor"');
}

// 2. Replace all instances of `initialUser.plan` used for rendering logic with `simulatedPlan`
// Inside isTemplateUnlocked:
content = content.replace('const userPlan = initialUser.plan;', 'const userPlan = simulatedPlan;');

// Inside animations useMemo dependencies:
content = content.replace('}, [globalSettings, initialUser.plan, initialUser.role]);', '}, [globalSettings, simulatedPlan, initialUser.role]);');

// Inside rendering logic:
// We'll just replace `initialUser.plan ===` with `simulatedPlan ===`
content = content.replace(/initialUser\.plan ===/g, 'simulatedPlan ===');
// Also wait, `showUpgradePrompt` effect uses `initialUser.plan`. We shouldn't change the effect's dependency to `simulatedPlan` because we only want the prompt if they are TRULY free. But replacing `initialUser.plan ===` changed it there too. Let's fix that back.
content = content.replace('if (simulatedPlan === "FREE") {', 'if (initialUser.plan === "FREE") {');

// 3. Update the Simulator Buttons logic
const simulatorRegex = /onClick=\{async \(\) => \{[\s\S]*?className=\{`/g;
const newSimulatorClick = `onClick={() => setSimulatedPlan(p)}
                      className={\``;
content = content.replace(simulatorRegex, newSimulatorClick);

// 4. In `switchTestPlan` import, remove it to clean up unused import, but we can leave it or remove it safely.
content = content.replace('switchTestPlan,', '');

fs.writeFileSync(path, content, 'utf8');
console.log('Modifications applied successfully.');
