import fs from "fs";
const filePath = "C:\\Users\\Erdem\\.gemini\\antigravity\\scratch\\link-saas\\src\\app\\actions.ts";
const content = fs.readFileSync(filePath, "utf-8");
const lines = content.split("\n");

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("function ensureAdmin") || lines[i].includes("async function ensureAdmin")) {
    console.log(`L${i+1}: ${lines[i].trim()}`);
    // Print 30 lines after
    for (let j = 1; j <= 30; j++) {
      if (lines[i+j]) {
        console.log(`  +${j}: ${lines[i+j].trim()}`);
      }
    }
    break;
  }
}
