const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'addons', 'addon-config-modal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find case "NEWSLETTER" and log 200 chars around it
const idx = content.indexOf('case "NEWSLETTER":');
if (idx !== -1) {
  console.log("Found at index:", idx);
  console.log(JSON.stringify(content.substring(idx, idx + 400)));
} else {
  console.log("NOT found");
}
