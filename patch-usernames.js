const fs = require('fs');

const file1 = 'src/app/[username]/page.tsx';
let code1 = fs.readFileSync(file1, 'utf-8');

// Patch generateMetadata
code1 = code1.replace(
  `const { username } = await params;`,
  `const { username } = await params;\n  const cleanUsername = username.replace("%40", "").replace(/^@/, "");`
);
code1 = code1.replace(
  `where: { username: username.toLowerCase() },`,
  `where: { username: cleanUsername.toLowerCase() },`
);

// Patch PublicProfilePage
code1 = code1.replace(
  `const { username } = await params;\n\n  // Search for the user`,
  `const { username } = await params;\n  const cleanUsername = username.replace("%40", "").replace(/^@/, "");\n\n  // Search for the user`
);
code1 = code1.replace(
  `equals: username.toLowerCase(),`,
  `equals: cleanUsername.toLowerCase(),`
);
code1 = code1.replace(
  `username={activeUser.username!}`,
  `username={activeUser.username!}` // unchanged but let's make sure it uses cleanUsername if needed... wait it uses activeUser.username
);
code1 = code1.replace(
  `username={username}`, // If it exists
  `username={cleanUsername}`
);
code1 = code1.replace(
  `@{username}`,
  `@{cleanUsername}`
);

fs.writeFileSync(file1, code1, 'utf-8');
console.log('Patched page.tsx');

const file2 = 'src/app/[username]/[addonSlug]/page.tsx';
let code2 = fs.readFileSync(file2, 'utf-8');
code2 = code2.replace(
  `const username = resolvedParams.username.replace("%40", "");`,
  `const username = resolvedParams.username.replace("%40", "").replace(/^@/, "");`
);
fs.writeFileSync(file2, code2, 'utf-8');
console.log('Patched [addonSlug]/page.tsx');
