import os
import sys

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
}

def scan_dir(path):
    corrupted_files = []
    for root, dirs, files in os.walk(path):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.next' in dirs:
            dirs.remove('.next')
        if '.git' in dirs:
            dirs.remove('.git')
        for file in files:
            if file.endswith(('.tsx', '.ts', '.js', '.jsx', '.css', '.html')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    found = []
                    for broken in REPLACEMENTS.keys():
                        if broken in content:
                            found.append(broken)
                    
                    if found:
                        corrupted_files.append((file_path, found))
                except Exception as e:
                    # print(f"Could not read {file_path}: {e}")
                    pass
    return corrupted_files

if __name__ == '__main__':
    src_dir = 'src'
    if not os.path.exists(src_dir):
        print(f"Directory '{src_dir}' not found.")
        sys.exit(1)
        
    results = scan_dir(src_dir)
    if results:
        print("Found corrupted files:")
        for path, chars in results:
            print(f"- {path} (contains: {', '.join(chars)})")
    else:
        print("No corrupted files found in src.")
