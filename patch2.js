const fs = require('fs');
const path = 'src/app/admin/templates/templates-client.tsx';

let content = fs.readFileSync(path, 'utf8');

const listStartMarker = '{/* Templates List */}';
const modalStartMarker = '{/* Add Template Modal */}';

const startIndex = content.indexOf(listStartMarker);
const endIndex = content.indexOf(modalStartMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const before = content.substring(0, startIndex);
  const after = content.substring(endIndex);

  const newList = `{/* Templates List */}
      {templates.length > 0 && (
        <div className="space-y-3">
          {templates.map((template) => {
            const firstLetter = template.name.charAt(0).toUpperCase();
            
            return (
              <div key={template.id} className="group p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{ background: template.bgColor || "#1e293b" }}>
                    <div className="text-white opacity-90 mix-blend-overlay font-bold text-lg">
                      {firstLetter}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold text-white group-hover:text-neon-blue transition-colors">{template.name}</div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[9px] font-bold text-slate-400">
                        {template.category}
                      </span>
                      {template.isCoded ? (
                        <span className="px-2 py-0.5 rounded-full bg-purple-950/40 border border-purple-800 text-[9px] font-bold text-purple-300 flex items-center gap-1">
                          <Code className="h-3 w-3" /> Kodlu
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[9px] font-bold text-slate-400 flex items-center gap-1">
                          <Layout className="h-3 w-3" /> Kodsuz
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="text-xs font-bold text-emerald-400">
                        {isEditPriceOpen === template.id ? (
                          <div className="flex items-center gap-1.5 inline-flex">
                            <input
                              type="text"
                              value={newPrice}
                              onChange={(e) => setNewPrice(e.target.value)}
                              className="w-14 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-xs font-semibold focus:outline-none focus:border-neon-blue text-white"
                            />
                            <button onClick={() => handleUpdatePrice(template.id)} className="p-0.5 rounded bg-neon-blue text-white hover:opacity-90">
                              <Check className="h-3 w-3" />
                            </button>
                            <button onClick={() => setIsEditPriceOpen(null)} className="p-0.5 rounded bg-slate-800 text-slate-400 hover:text-white">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <span onClick={() => { setIsEditPriceOpen(template.id); setNewPrice(String(template.price)); }} className="cursor-pointer hover:underline">
                            {template.price} ₺
                          </span>
                        )}
                      </div>
                      
                      {template.price > 0 && (
                        <div className="text-xs text-slate-400">
                          {isEditLinkOpen === template.id ? (
                            <div className="flex items-center gap-1.5 inline-flex">
                              <input
                                type="text"
                                value={newPaymentLink}
                                onChange={(e) => setNewPaymentLink(e.target.value)}
                                className="w-24 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-semibold focus:outline-none focus:border-neon-blue text-white"
                              />
                              <button onClick={() => handleUpdatePaymentLink(template.id)} className="p-0.5 rounded bg-neon-blue text-white hover:opacity-90">
                                <Check className="h-3 w-3" />
                              </button>
                              <button onClick={() => setIsEditLinkOpen(null)} className="p-0.5 rounded bg-slate-800 text-slate-400 hover:text-white">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <span onClick={() => { setIsEditLinkOpen(template.id); setNewPaymentLink(template.paymentLink || ""); }} className="cursor-pointer hover:underline flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {template.paymentLink ? "Link Aktif" : "Link Ekle"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                  <button
                    onClick={() => handleToggleActive(template.id, template.isActive)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
                  >
                    {template.isActive ? <ToggleRight className="h-4 w-4 text-emerald-400" /> : <ToggleLeft className="h-4 w-4 text-slate-400" />}
                    {template.isActive ? "Aktif" : "Pasif"}
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      `;

  content = before + newList + after;
  fs.writeFileSync(path, content);
  console.log('List updated');
} else {
  console.log('Markers not found');
}
