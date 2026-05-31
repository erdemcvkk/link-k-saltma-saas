const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');

const replacement = `onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (!file) return;
                                          const reader = new FileReader();
                                          reader.onload = (event) => {
                                            if (event.target?.result) setAvatarUrl(event.target.result as string);
                                          };
                                          reader.readAsDataURL(file);
                                        }}`;

content = content.replace('onChange={handleAvatarUpload}', replacement);

fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', content);
console.log("Fixed handleAvatarUpload reference");
