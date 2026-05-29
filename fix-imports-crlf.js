const fs = require('fs');
const file = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace using regex to handle both LF and CRLF
content = content.replace(/,\s*Youtube,\s*Twitter,\s*Linkedin\s*} from "lucide-react";/g, '\n} from "lucide-react";');
fs.writeFileSync(file, content);
console.log('Fixed imports with regex!');
