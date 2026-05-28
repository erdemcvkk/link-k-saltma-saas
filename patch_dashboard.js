const fs = require('fs');
const file = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Import AddonConfigModal
if (!content.includes('import AddonConfigModal')) {
  content = content.replace('import GlobalOverlayManager from "@/components/global-overlay-manager";', 'import AddonConfigModal from "@/components/addons/addon-config-modal";\nimport GlobalOverlayManager from "@/components/global-overlay-manager";');
}

// 2. Add editingAddon state
if (!content.includes('const [editingAddon')) {
  content = content.replace('const [addons, setAddons] = useState<AddonItem[]>(initialAddons || []);', 'const [addons, setAddons] = useState<AddonItem[]>(initialAddons || []);\n  const [editingAddon, setEditingAddon] = useState<AddonItem | null>(null);');
}

// 4. Append modal
if (!content.includes('<AddonConfigModal')) {
  const replacement = `      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title={upgradeModalTitle}
        description={upgradeModalDesc}
        globalSettings={globalSettings}
      />

      {editingAddon && (
        <AddonConfigModal
          addon={editingAddon}
          onClose={() => setEditingAddon(null)}
          lang={lang}
        />
      )}
    </div>
  );
}`;
  
  // Find the end of the file safely
  content = content.replace(/      <UpgradeModal[\s\S]*?<\/div>\s*\n\s*\);\s*\n\s*}\s*$/, replacement);
}

fs.writeFileSync(file, content);
console.log('Script completed');
