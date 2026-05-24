import fs from 'fs';
const path = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove simulatedPlan declaration from its current location
content = content.replace('const [simulatedPlan, setSimulatedPlan] = useState(initialUser.plan);\n  const [activeTab', 'const [activeTab');

// 2. Insert it at the very top of DashboardClient
const functionSignature = 'export default function DashboardClient({ initialUser, initialLinks, initialPageViews, initialProducts, globalSettings, initialFonts = FONTS_CATALOG, initialQrCodes = [] }: DashboardClientProps) {';
content = content.replace(
  functionSignature,
  functionSignature + '\n  const [simulatedPlan, setSimulatedPlan] = useState(initialUser.plan);'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Moved simulatedPlan to top successfully.');
