const fs = require('fs');
const file = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('  Youtube,\n  Twitter,\n  Linkedin\n} from "lucide-react";', '} from "lucide-react";');
fs.writeFileSync(file, content);
console.log('Fixed imports!');
