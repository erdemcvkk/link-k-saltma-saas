const fs = require('fs');
const path = require('path');

function fix(file, from, to) {
  const abs = path.resolve(file);
  let c = fs.readFileSync(abs, 'utf8');
  if (c.includes(from)) {
    c = c.replace(from, to);
    fs.writeFileSync(abs, c);
    console.log(`  FIXED in ${file}`);
    return true;
  }
  console.log(`  SKIP (not found) in ${file}`);
  return false;
}

// ==========================================================
// ERROR 1 & 2: dashboard-client.tsx - UserProfile missing customCss & buttonClass
// ==========================================================
console.log('\n1. Fix UserProfile type (add customCss & buttonClass)');
fix(
  'src/app/(dashboard)/dashboard/dashboard-client.tsx',
  `type UserProfile = {
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
};`,
  `type UserProfile = {
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
};`
);

// ==========================================================
// ERROR 3: dashboard-client.tsx - duplicate className on <input> (lines 3937-3971)
// The input at line 3937 has className at line 3939, and another at line 3971.
// Remove the second className (line 3971) since it overrides the first.
// ==========================================================
console.log('\n2. Fix duplicate className on custom URL input');
fix(
  'src/app/(dashboard)/dashboard/dashboard-client.tsx',
  `}
  }}
  className="flex-1 bg-white border border-zinc-200 rounded-lg px-2 py-2.5 text-xs font-bold text-zinc-800 outline-none focus:border-teal-500"
  />
  </div>
  <p className="text-[9px] text-zinc-500 leading-tight">
  {lang === "tr" 
  ? "Eğer boş bırakırsanız özel link devre dışı kalır. Bu link sadece bu şablonun uygulanmış halini gösterir."
  : "If left empty, custom link is disabled. This link displays your profile with this specific template applied."}`,
  `}
  });
  }}
  />
  </div>
  <p className="text-[9px] text-zinc-500 leading-tight">
  {lang === "tr" 
  ? "Eğer boş bırakırsanız özel link devre dışı kalır. Bu link sadece bu şablonun uygulanmış halini gösterir."
  : "If left empty, custom link is disabled. This link displays your profile with this specific template applied."}`
);

// ==========================================================
// ERROR 4: dashboard-client.tsx - username prop is string | null, should be string
// ==========================================================
console.log('\n3. Fix username prop type (string | null -> string)');
fix(
  'src/app/(dashboard)/dashboard/dashboard-client.tsx',
  'username={initialUser.username}\n  />',
  'username={initialUser.username || ""}\n  />'
);

// ==========================================================
// ERROR 5: page.tsx - fileUrl is string | undefined, should be string  
// ==========================================================
console.log('\n4. Fix ProductItem fileUrl type');
fix(
  'src/app/(dashboard)/dashboard/dashboard-client.tsx',
  `type ProductItem = {
  id: string;
  title: string;
  type: string;
  price: number;
  description: string | null;
  fileUrl: string;
  isActive: boolean;
  salesCount: number;
  createdAt: string;
};`,
  `type ProductItem = {
  id: string;
  title: string;
  type: string;
  price: number;
  description: string | null;
  fileUrl?: string;
  isActive: boolean;
  salesCount: number;
  createdAt: string;
};`
);

// ==========================================================
// ERROR 6 & 7: [addonSlug]/page.tsx - displayName does not exist on profile
// Replace with username (which does exist)
// ==========================================================
console.log('\n5. Fix displayName in addonSlug page');
let addonFile = fs.readFileSync('src/app/[username]/[addonSlug]/page.tsx', 'utf8');
addonFile = addonFile.replace(/user\.profile\.displayName/g, 'user.username');
fs.writeFileSync('src/app/[username]/[addonSlug]/page.tsx', addonFile);
console.log('  FIXED displayName -> username');

// ==========================================================
// ERROR 8: admin-client.tsx - 'e' is of type 'unknown'
// ==========================================================
console.log('\n6. Fix unknown error type in admin catch block');
fix(
  'src/app/admin/admin-client.tsx',
  '} catch (e) {\n  alert(e.message || "Kaydedilemedi")',
  '} catch (e: any) {\n  alert(e?.message || "Kaydedilemedi")'
);

// ==========================================================
// ERROR 9: templates-client.tsx - Property 'count' does not exist
// The seedTemplates action returns { success, seeded, message } without count
// ==========================================================
console.log('\n7. Fix templates-client count property');
fix(
  'src/app/admin/templates/templates-client.tsx',
  'showMsg(`Başarıyla ${res.count} adet örnek şablon eklendi!`, "success");',
  'showMsg(res.message || "Örnek şablonlar başarıyla eklendi!", "success");'
);

// ==========================================================
// ERROR 10: eklentiler-client.tsx - "premium-video" not assignable to StoreThemeType
// Add "premium-video" to StoreThemeType union
// ==========================================================
console.log('\n8. Fix StoreThemeType - add premium-video');
fix(
  'src/components/storefront-preview.tsx',
  `export type StoreThemeType =
  | "dark-drill" | "glassmorphism" | "minimalist" | "vibrant-pop" | "classic"
  | "neo-brutalism" | "organic-earth" | "retro-arcade" | "dark-academia" | "y2k-holographic" | "premium-creator";`,
  `export type StoreThemeType =
  | "dark-drill" | "glassmorphism" | "minimalist" | "vibrant-pop" | "classic"
  | "neo-brutalism" | "organic-earth" | "retro-arcade" | "dark-academia" | "y2k-holographic" | "premium-creator" | "premium-video";`
);

// ==========================================================
// ERROR 11: eklentiler/page.tsx - Property 'type' missing in DummyProduct
// Need to add type field to the product mapping
// ==========================================================
console.log('\n9. Fix eklentiler/page.tsx DummyProduct type mapping');
let eklentilerPage = fs.readFileSync('src/app/eklentiler/page.tsx', 'utf8');
// The page maps products but doesn't include the 'type' field
// Let's find and check the exact code
if (eklentilerPage.includes('dummyProducts={storeProducts')) {
  // The storeProducts is directly from DB which has no 'type' field
  // We need to map it to include type
  eklentilerPage = eklentilerPage.replace(
    /dummyProducts=\{storeProducts\b[^}]*\}/g,
    match => {
      console.log('  Found dummyProducts prop, replacing with mapped version');
      return 'dummyProducts={storeProducts.map(p => ({ ...p, type: "PRODUCT", imageUrl: p.imageUrl || null }))}';
    }
  );
  fs.writeFileSync('src/app/eklentiler/page.tsx', eklentilerPage);
  console.log('  FIXED eklentiler page.tsx');
} else {
  console.log('  Checking alternative pattern...');
  // Try to find the pattern differently
  const lines = eklentilerPage.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('dummyProducts')) {
      console.log(`  Line ${i}: ${line.trim().substring(0, 80)}`);
    }
  });
}

// ==========================================================
// ERROR 12: page.tsx - creatorsData does not exist on HomeClientProps
// Add creatorsData to HomeClientProps
// ==========================================================
console.log('\n10. Fix HomeClientProps - add creatorsData');
fix(
  'src/app/home-client.tsx',
  `interface HomeClientProps {
  userId: string | null;
  siteTitle: string;
  siteLogo: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  featuresData?: any[];
  sliderItems?: any[];
  paymentLinkStarter?: string;
  paymentLinkCreator?: string;
  paymentLinkPro?: string;
  priceStarter?: string;
  priceCreator?: string;
}`,
  `interface HomeClientProps {
  userId: string | null;
  siteTitle: string;
  siteLogo: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  creatorsData?: any;
  featuresData?: any[];
  sliderItems?: any[];
  paymentLinkStarter?: string;
  paymentLinkCreator?: string;
  paymentLinkPro?: string;
  priceStarter?: string;
  priceCreator?: string;
}`
);

// ==========================================================
// ERROR 13: temp-buy.ts - Cannot find name 'purchaseAddon'
// Delete temp file
// ==========================================================
console.log('\n11. Delete temp-buy.ts');
try {
  if (fs.existsSync('temp-buy.ts')) {
    fs.unlinkSync('temp-buy.ts');
    console.log('  DELETED temp-buy.ts');
  } else {
    console.log('  temp-buy.ts not found');
  }
} catch (e) {
  console.log('  Could not delete: ' + e.message);
}

// ==========================================================
// ERROR 14: addon-config-modal.tsx - multiple type errors
// ==========================================================
console.log('\n12. Fix addon-config-modal.tsx type errors');
let addonModal = fs.readFileSync('src/components/addons/addon-config-modal.tsx', 'utf8');

// Fix: Parameter 'message' implicitly has 'any' type
// The showAlert and showConfirm functions need type annotations
addonModal = addonModal.replace(
  /const showAlert = \(message\) =>/g,
  'const showAlert = (message: string) =>'
);
addonModal = addonModal.replace(
  /const showConfirm = \(message, onConfirm\) =>/g, 
  'const showConfirm = (message: string, onConfirm: () => void) =>'
);

// Fix: Property 'onConfirm' missing - add it to setState calls
addonModal = addonModal.replace(
  /setAlertState\(\{ isOpen: true, type: "alert", message: (.*?) \}\)/g,
  'setAlertState({ isOpen: true, type: "alert", message: $1, onConfirm: null })'
);
addonModal = addonModal.replace(
  /setAlertState\(\{ isOpen: false, type: "", message: "" \}\)/g,
  'setAlertState({ isOpen: false, type: "", message: "", onConfirm: null })'
);

fs.writeFileSync('src/components/addons/addon-config-modal.tsx', addonModal);
console.log('  FIXED addon-config-modal.tsx');

console.log('\n=== ALL FIXES APPLIED ===');
