const fs = require('fs');

const path = 'src/components/addons/addon-config-modal.tsx';
// Use regex split to handle both \n and \r\n safely, or just \n
const content = fs.readFileSync(path, 'utf-8');
const lines = content.split(/\r?\n/);

const startIndex = lines.findIndex(l => l.includes('const renderFields = () => {'));
const endIndex = lines.findIndex((l, i) => i > startIndex && l.includes('const renderLivePreview = () => {'));

if (startIndex !== -1 && endIndex !== -1) {
  const newFields = fs.readFileSync('newFields.txt', 'utf-8').split(/\r?\n/);
  lines.splice(startIndex, endIndex - startIndex, ...newFields);
  fs.writeFileSync(path, lines.join('\n'), 'utf-8');
  console.log("Replaced renderFields successfully!");
} else {
  console.log("Could not find start/end bounds for renderFields", startIndex, endIndex);
}
