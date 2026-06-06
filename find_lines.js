const fs = require('fs');
const content = fs.readFileSync('src/app/(dashboard)/dashboard/editor/editor-client.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
    if (line.includes('â€')) {
        console.log(`${index + 1}: ${line}`);
    }
});
