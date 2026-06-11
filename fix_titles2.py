import re, os

fixes = {
    'index.html': [
        ('DARK MATTER | Managed Website Services &middot; Southwest Florida',
         'Surette Data Systems | Managed Website Services &middot; Southwest Florida'),
        ('DARK MATTER | Managed Website Services &#183; Southwest Florida',
         'Surette Data Systems | Managed Website Services &#183; Southwest Florida'),
    ],
    'app-pricing.html': [
        ('Dark Matter App Pricing | Surette Data Systems',
         'App Pricing | Surette Data Systems'),
    ],
    'built-by.html': [
        ('Website Powered by Dark Matter | Get a Site Like This',
         'Website Powered by Surette Data Systems | Get a Site Like This'),
        ('powered by Dark Matter Surette Systems Portal',
         'powered by Surette Data Systems'),
        ('Dark Matter Surette Systems Portal',
         'Surette Data Systems'),
    ],
    'es/index.html': [
        ('DARK MATTER | Servicios de Sitios Web Administrados &middot; el suroeste de Florida',
         'Surette Data Systems | Servicios de Sitios Web Administrados &middot; el suroeste de Florida'),
        ('DARK MATTER | Servicios de Sitios Web Administrados &#183; el suroeste de Florida',
         'Surette Data Systems | Servicios de Sitios Web Administrados &#183; el suroeste de Florida'),
    ],
    'es/built-by.html': [
        ('Sitio Web Impulsado por Dark Matter | Consigue un Sitio Como Este',
         'Sitio Web Impulsado por Surette Data Systems | Consigue un Sitio Como Este'),
        ('impulsado por Dark Matter Surette Systems Portal',
         'impulsado por Surette Data Systems'),
        ('Dark Matter Surette Systems Portal',
         'Surette Data Systems'),
    ],
}

# Also fix og:description references sitewide
desc_pattern = re.compile(r'Dark Matter Surette Systems Portal', re.IGNORECASE)
desc_dm_pattern = re.compile(r"Dark Matter's", re.IGNORECASE)

base = os.path.dirname(os.path.abspath(__file__))

for rel, replacements in fixes.items():
    fp = os.path.join(base, rel.replace('/', os.sep))
    content = open(fp, encoding='utf-8').read()
    for old, new in replacements:
        content = content.replace(old, new)
    open(fp, 'w', encoding='utf-8').write(content)
    print('Updated: ' + rel)

# Sitewide: fix remaining og:description "Dark Matter" references
desc_fixes = []
for root, dirs, files in os.walk(base):
    dirs[:] = [d for d in dirs if d not in ('node_modules', '.claude', '.git')]
    for f in files:
        if not f.endswith('.html'): continue
        fp = os.path.join(root, f)
        content = open(fp, encoding='utf-8').read()
        new = desc_pattern.sub('Surette Data Systems', content)
        if new != content:
            open(fp, 'w', encoding='utf-8').write(new)
            rel = os.path.relpath(fp, base)
            desc_fixes.append(rel)

print('\nDescription fixes:')
for r in desc_fixes:
    print('  ' + r)
print('\nDone.')
