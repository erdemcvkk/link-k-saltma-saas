import fs from "fs";
const filePath = "C:\\Users\\Erdem\\.gemini\\antigravity\\scratch\\link-saas\\src\\app\\actions.ts";
const content = fs.readFileSync(filePath, "utf-8");
const lines = content.split("\n");

console.log("Occurrences of ensureAdmin in actions.ts:");
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("ensureAdmin")) {
    console.log(`L${i+1}: ${lines[i].trim()}`);
  }
}
