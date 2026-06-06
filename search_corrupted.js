const fs = require('fs');
const path = require('path');

const REPLACEMENTS = {
    'Ã¶': 'ö',
    'Ã¼': 'ü',
    'Ã§': 'ç',
    'ÅŸ': 'ş',
    'Ä±': 'ı',
    'Äž': 'Ğ',
    'ÄŸ': 'ğ',
    'Ã–': 'Ö',
    'Ãœ': 'Ü',
    'Ã‡': 'Ç',
    'Åž': 'Ş',
    'Ä°': 'İ',
    'â€"': '–',
    'â€™': "'",
    'â€œ': '"',
    'â€': '"',
    'âœ•': '✕',
};

function scanDir(dirPath) {
    const results = [];
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
                results.push(...scanDir(fullPath));
            }
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.html')) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                const found = [];
                for (const broken of Object.keys(REPLACEMENTS)) {
                    if (content.includes(broken)) {
                        found.push(broken);
                    }
                }
                if (found.length > 0) {
                    results.push({ path: fullPath, found });
                }
            } catch (err) {
                // Ignore read errors
            }
        }
    }
    return results;
}

const srcDir = __dirname;
if (fs.existsSync(srcDir)) {
    const corrupted = scanDir(srcDir);
    if (corrupted.length > 0) {
        console.log("Found corrupted files:");
        for (const item of corrupted) {
            console.log(`- ${item.path} (contains: ${item.found.join(', ')})`);
        }
    } else {
        console.log("No corrupted files found in src.");
    }
} else {
    console.log("src directory not found.");
}
