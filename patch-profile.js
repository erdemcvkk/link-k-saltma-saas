const fs = require('fs');
let content = fs.readFileSync('src/app/[username]/profile-client.tsx', 'utf-8');

// Update Props
content = content.replace(
  'storeLayout?: string | null;\n}',
  'storeLayout?: string | null;\n  customCss?: string | null;\n}'
);

// Update Component signature
content = content.replace(
  'export default function ProfileClient({ username, bio, theme, links, products, addons = [], avatarUrl, background, fontStyle, bioColor, usernameColor, plan, storeTitle, storeCoverUrl, storeLayout }: ProfileClientProps) {',
  'export default function ProfileClient({ username, bio, theme, links, products, addons = [], avatarUrl, background, fontStyle, bioColor, usernameColor, plan, storeTitle, storeCoverUrl, storeLayout, customCss }: ProfileClientProps) {'
);

// Inject customCss
content = content.replace(
  '  return (\n    <div \n      className={`min-h-screen relative flex flex-col justify-between py-20 px-4 transition-all duration-500 ${bgClassName}`}',
  '  return (\n    <>\n      {customCss && (\n        <style dangerouslySetInnerHTML={{ __html: customCss }} />\n      )}\n    <div \n      className={`min-h-screen relative flex flex-col justify-between py-20 px-4 transition-all duration-500 ${bgClassName}`}'
);

// Close the fragment at the end
content = content.replace(
  '      )}\n    </div>\n  );\n}',
  '      )}\n    </div>\n    </>\n  );\n}'
);

fs.writeFileSync('src/app/[username]/profile-client.tsx', content);
console.log("profile-client.tsx patched.");
