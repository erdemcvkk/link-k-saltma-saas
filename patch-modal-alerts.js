const fs = require('fs');
const path = 'src/components/addons/addon-config-modal.tsx';
let code = fs.readFileSync(path, 'utf-8');

if (!code.includes('useRouter')) {
  code = code.replace(
    'import React, { useState, useTransition, useEffect } from "react";',
    'import React, { useState, useTransition, useEffect } from "react";\nimport { useRouter } from "next/navigation";'
  );
}

if (!code.includes('const router = useRouter();')) {
  code = code.replace(
    '  const [isPending, startTransition] = useTransition();',
    '  const router = useRouter();\n' +
    '  const [isPending, startTransition] = useTransition();\n' +
    '  const [dialog, setDialog] = useState({ isOpen: false, type: "alert", message: "", onConfirm: null });\n\n' +
    '  const showAlert = (message) => setDialog({ isOpen: true, type: "alert", message });\n' +
    '  const showConfirm = (message, onConfirm) => setDialog({ isOpen: true, type: "confirm", message, onConfirm });\n' +
    '  const closeDialog = () => setDialog({ isOpen: false, type: "alert", message: "" });'
  );
}

code = code.split('alert(').join('showAlert(');

const searchConfirmBlock = 'if (confirm(lang === "tr" ? "Bu ürünü silmek istediğinize emin misiniz?" : "Are you sure?")) {\n' +
'                            await deleteAddonProduct(p.id);\n' +
'                            window.location.reload();\n' +
'                          }';

const replaceConfirmBlock = 'showConfirm(lang === "tr" ? "Bu ürünü silmek istediğinize emin misiniz?" : "Are you sure?", async () => {\n' +
'                            await deleteAddonProduct(p.id);\n' +
'                            router.refresh();\n' +
'                          });';

const codeNormalized = code.replace(/\\r\\n/g, '\\n');
code = codeNormalized.replace(searchConfirmBlock, replaceConfirmBlock);

code = code.replace(/window\\.location\\.reload\\(\\)/g, 'router.refresh()');

const customDialogJSX = '\n' +
'      {/* Custom Alert/Confirm Dialog */}\n' +
'      {dialog.isOpen && (\n' +
'        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">\n' +
'          <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full transform transition-all animate-in fade-in zoom-in-95 duration-200">\n' +
'            <h3 className="text-xl font-black text-slate-800 mb-3 text-center">\n' +
'              {domain} {lang === "tr" ? "mesajı" : "says"}\n' +
'            </h3>\n' +
'            <p className="text-slate-600 font-medium text-center mb-8">{dialog.message}</p>\n' +
'            <div className="flex items-center justify-center gap-3">\n' +
'              <button\n' +
'                onClick={() => {\n' +
'                  if (dialog.type === "confirm" && dialog.onConfirm) {\n' +
'                    dialog.onConfirm();\n' +
'                  }\n' +
'                  closeDialog();\n' +
'                }}\n' +
'                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl transition-all shadow-md shadow-indigo-600/20"\n' +
'              >\n' +
'                {lang === "tr" ? "Tamam" : "OK"}\n' +
'              </button>\n' +
'              {dialog.type === "confirm" && (\n' +
'                <button\n' +
'                  onClick={closeDialog}\n' +
'                  className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold rounded-2xl transition-all"\n' +
'                >\n' +
'                  {lang === "tr" ? "İptal" : "Cancel"}\n' +
'                </button>\n' +
'              )}\n' +
'            </div>\n' +
'          </div>\n' +
'        </div>\n' +
'      )}\n';

const lastDivIndex = code.lastIndexOf('</div>');
if (lastDivIndex !== -1) {
  code = code.slice(0, lastDivIndex) + customDialogJSX + code.slice(lastDivIndex);
}

fs.writeFileSync(path, code, 'utf-8');
console.log("Patched modal alerts successfully!");
