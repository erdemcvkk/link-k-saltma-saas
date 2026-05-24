import fs from "fs";
const filePath = "C:\\Users\\Erdem\\.gemini\\antigravity\\scratch\\link-saas\\src\\app\\actions.ts";
const content = fs.readFileSync(filePath, "utf-8");
const lines = content.split("\n");

const targetLines = [443, 456, 482, 574, 689, 701, 713, 737, 753];
for (const lineNum of targetLines) {
  console.log(`--- Line ${lineNum} ---`);
  // print from lineNum-4 to lineNum+4
  for (let j = -4; j <= 4; j++) {
    const idx = lineNum - 1 + j;
    if (lines[idx]) {
      console.log(`${idx+1}: ${lines[idx]}`);
    }
  }
}
