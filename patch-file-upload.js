const fs = require('fs');

const path = 'src/components/addons/addon-config-modal.tsx';
let code = fs.readFileSync(path, 'utf-8');

const oldCode = \`  const handleFileUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;
          const MAX_SIZE = 800;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Canvas error");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.onerror = () => reject("Image load error");
      };
      reader.onerror = () => reject("File read error");
    });
  };\`;

const newCode = \`  const handleFileUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > 2 * 1024 * 1024) {
        return reject(new Error("Dosya boyutu 2MB'den büyük olamaz. Lütfen daha küçük bir dosya seçin."));
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = () => reject(new Error("Dosya okuma hatası"));
    });
  };\`;

// Windows might have \r\n, so we can replace using regex or string
// Since we have precise text, we can normalize line endings first
const codeNormalized = code.replace(/\\r\\n/g, '\\n');
const oldCodeNormalized = oldCode.replace(/\\r\\n/g, '\\n');

if (codeNormalized.includes(oldCodeNormalized)) {
  code = codeNormalized.replace(oldCodeNormalized, newCode);
  fs.writeFileSync(path, code, 'utf-8');
  console.log("Replaced handleFileUpload successfully!");
} else {
  console.log("Could not find handleFileUpload logic to replace.");
}
