import fs from "fs";
import path from "path";

const filePath = "C:\\Users\\Erdem\\.gemini\\antigravity\\scratch\\link-saas\\src\\app\\admin\\admin-client.tsx";
const content = fs.readFileSync(filePath, "utf-8");

const lines = content.split("\n");
console.log("File loaded. Total lines:", lines.length);

// Search for terms like "payment", "shopier", "kaydet", "settings", "globalSetting"
const searchTerms = ["settings", "globalSetting", "save", "onSubmit", "updateSettings", "handleSave"];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (const term of searchTerms) {
    if (line.toLowerCase().includes(term.toLowerCase())) {
      console.log(`L${i+1} [${term}]: ${line.trim().substring(0, 100)}`);
      break;
    }
  }
}
