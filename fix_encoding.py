import sys

# Map of mojibake (UTF-8 bytes misread as Latin-1) to correct Turkish characters
REPLACEMENTS = {
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
    '\u0080\u0099': '',  # stray bytes
    'ðŸ"'': '🔒',
    'ðŸ"·': '📷',
    'ðŸŽ¬': '🎬',
}

file_path = sys.argv[1]

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

original = content
for broken, fixed in REPLACEMENTS.items():
    content = content.replace(broken, fixed)

if content != original:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed encoding in {file_path}")
else:
    print(f"No changes needed in {file_path}")
