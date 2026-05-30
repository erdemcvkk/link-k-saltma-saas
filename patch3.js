const fs = require('fs');
const path = 'src/app/admin/templates/templates-client.tsx';

let content = fs.readFileSync(path, 'utf8');

// Remove validation for coverUrl
content = content.replace(
  `if (!formData.name || !formData.price || !formData.coverUrl) {`,
  `if (!formData.name || !formData.price) {`
);

// Remove the input field block completely
content = content.replace(
  `                {/* Cover Image URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Kapak Görseli URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.coverUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, coverUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold focus:outline-none focus:border-neon-blue"
                  />
                </div>`,
  ``
);

fs.writeFileSync(path, content);
console.log('coverUrl input removed');
