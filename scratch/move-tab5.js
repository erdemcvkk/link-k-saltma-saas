const fs = require('fs');
const path = 'src/app/(dashboard)/dashboard/dashboard-client.tsx';

// Split by actual newline character
let content = fs.readFileSync(path, 'utf8');
let lns = content.split('\n');

const start = lns.findIndex(l => l.includes('TAB 5: OWNED TEMPLATES'));
const end = lns.findIndex(l => l.includes('{/* TAB 2: TRAFFIC ANALYTICS */}')) - 1;

let t5 = lns.slice(start, end);
// Remove t5 lines from original array
lns.splice(start, end - start);

// Clean up the wrapper
const wrapIdx = t5.findIndex(l => l.includes('activeTab === "templates" && ('));
if (wrapIdx !== -1) {
    t5.splice(wrapIdx, 1);
    for (let i = t5.length - 1; i >= 0; i--) {
        if (t5[i].includes(')}')) {
            t5.splice(i, 1);
            break;
        }
    }
}

// Find insertion point and insert
const tIdx = lns.findIndex(l => l.includes('<div id="owned-templates-injected"></div>'));
if (tIdx !== -1) {
    lns.splice(tIdx, 1, ...t5);
    fs.writeFileSync(path, lns.join('\n'), 'utf8');
    console.log("Moved smoothly!");
} else {
    console.log("Could not find <div id=\"owned-templates-injected\"></div>");
}
