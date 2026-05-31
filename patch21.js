const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');

const startMarker = '{/* INLINE TEMPLATE CUSTOMIZATION CONTROL DRAWER */}';
const startIndex = content.indexOf(startMarker);
const endMarker = '{/* Action Buttons */}';
let endIndex = content.indexOf(')}', content.indexOf(endMarker));

if (startIndex !== -1 && endIndex !== -1) {
  endIndex += 2; // include ')}'
  const extractedBlock = content.slice(startIndex, endIndex);
  
  // Remove it from the original location
  content = content.replace(extractedBlock, '{/* Template Customization Modal Moved to Root */}');

  // Clean the extracted block from the wrapper
  // We want to remove `{customizingTemplateId === template.id && (` from the beginning
  // and `)}` from the end.
  let cleanedBlock = extractedBlock;
  const wrapStartStr = '{customizingTemplateId === template.id && (';
  const wrapStartIdx = cleanedBlock.indexOf(wrapStartStr);
  if (wrapStartIdx !== -1) {
    cleanedBlock = cleanedBlock.slice(wrapStartIdx + wrapStartStr.length);
  }
  const wrapEndIdx = cleanedBlock.lastIndexOf(')}');
  if (wrapEndIdx !== -1) {
    cleanedBlock = cleanedBlock.slice(0, wrapEndIdx);
  }

  // Create the modal wrapper
  const modalWrapper = `
      {/* FULL SCREEN TEMPLATE CUSTOMIZATION MODAL */}
      {(() => {
        if (!customizingTemplateId) return null;
        const template = ownedTemplates.find(t => t.id === customizingTemplateId);
        if (!template) return null;

        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={() => setCustomizingTemplateId(null)} />
            <div className="relative w-full max-w-2xl max-h-[95vh] bg-slate-50 overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20">
              <button 
                onClick={() => setCustomizingTemplateId(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white text-zinc-500 hover:bg-zinc-100 transition-colors z-10 shadow-sm border border-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="p-2 sm:p-4">
                ${cleanedBlock}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
`;

  // Append just before the final `</div>\n  );\n}`
  const finalTags = `    </div>\n  );\n}`;
  content = content.replace(finalTags, modalWrapper);

  fs.writeFileSync('src/app/(dashboard)/dashboard/dashboard-client.tsx', content);
  console.log("Successfully extracted to modal");
} else {
  console.log("Could not find start/end markers");
}
