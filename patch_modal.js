const fs = require('fs');
const file = 'src/components/addons/addon-config-modal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update imports
content = content.replace(
  'import { saveAddonConfig } from "@/app/actions";',
  'import { saveAddonConfig, addAddonProduct, deleteAddonProduct } from "@/app/actions";'
);
content = content.replace(
  'import { X, Loader2, Save, Store, Calendar, FileQuestion, Mail, Heart, Clock, Briefcase, HelpCircle, MapPin, MessageCircle } from "lucide-react";',
  'import { X, Loader2, Save, Store, Calendar, FileQuestion, Mail, Heart, Clock, Briefcase, HelpCircle, MapPin, MessageCircle, Trash2, Plus, ShoppingBag } from "lucide-react";'
);

// 2. Update props interface
content = content.replace(
  '  onClose: () => void;',
  '  products?: any[];\n  onClose: () => void;'
);

// 3. Update component signature
content = content.replace(
  'export default function AddonConfigModal({ addon, onClose, lang }: AddonConfigModalProps) {',
  'export default function AddonConfigModal({ addon, products = [], onClose, lang }: AddonConfigModalProps) {'
);

fs.writeFileSync(file, content);
console.log('Patch 1 complete');
