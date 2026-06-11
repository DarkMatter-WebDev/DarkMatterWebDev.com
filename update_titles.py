import re, os

project_dir = os.path.dirname(os.path.abspath(__file__))

# Patterns to update
TITLE_RE     = re.compile(r'(<title>[^<]*)\| DARK MATTER(</title>)', re.IGNORECASE)
OG_SITE_RE   = re.compile(r'(content=")Dark Matter Surette Systems Portal(")', re.IGNORECASE)
OG_TITLE_RE  = re.compile(r'(property="og:title"\s+content="[^"]*)\| DARK MATTER(")', re.IGNORECASE)
TW_TITLE_RE  = re.compile(r'(name="twitter:title"\s+content="[^"]*)\| DARK MATTER(")', re.IGNORECASE)

REPLACEMENT = 'Surette Data Systems'

updated, skipped = [], []

for root, dirs, files in os.walk(project_dir):
    dirs[:] = [d for d in dirs if d not in ('node_modules', '.claude', '.git', 'assets')]
    for f in files:
        if not f.endswith('.html'): continue
        fp = os.path.join(root, f)
        rel = os.path.relpath(fp, project_dir)

        with open(fp, 'r', encoding='utf-8') as fh:
            content = fh.read()

        result = content
        result = TITLE_RE.sub(r'\1| ' + REPLACEMENT + r'\2', result)
        result = OG_SITE_RE.sub(r'\g<1>' + REPLACEMENT + r'\2', result)
        result = OG_TITLE_RE.sub(r'\1| ' + REPLACEMENT + r'\2', result)
        result = TW_TITLE_RE.sub(r'\1| ' + REPLACEMENT + r'\2', result)

        if result != content:
            with open(fp, 'w', encoding='utf-8') as fh:
                fh.write(result)
            updated.append(rel)
        else:
            skipped.append(rel)

print("UPDATED (%d):" % len(updated))
for r in updated: print("  " + r)
print("\nno change (%d files)" % len(skipped))
