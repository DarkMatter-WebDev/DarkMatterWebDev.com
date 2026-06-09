import os, re, collections

ROOT = os.path.dirname(os.path.abspath(__file__))
OFFLIMITS = {
    os.path.normcase(os.path.join(ROOT, p)) for p in [
        "apps.html", "es\\apps.html", "casestudies.html", "es\\casestudies.html",
    ]
}
RC = "\ufffd"

def in_scope(path):
    if "node_modules" in path.split(os.sep):
        return False
    if os.path.normcase(path) in OFFLIMITS:
        return False
    return path.lower().endswith(".html")

files = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d != "node_modules"]
    for fn in filenames:
        p = os.path.join(dirpath, fn)
        if in_scope(p):
            files.append(p)

# normalize entity forms to RC first for analysis
tokens = collections.Counter()   # alpha tokens containing RC
puncts = collections.Counter()   # isolated RC with context window
total = 0
WORDCH = re.compile(r"[A-Za-z\u00C0-\u017F\ufffd]")
for p in files:
    with open(p, "r", encoding="utf-8") as f:
        text = f.read()
    text = text.replace("&#65533;", RC).replace("&#xFFFD;", RC).replace("&#xfffd;", RC)
    n = len(text)
    for m in re.finditer(re.escape(RC), text):
        total += 1
        i = m.start()
        # is it part of an alpha token?
        left_alpha = i>0 and bool(WORDCH.match(text[i-1]))
        right_alpha = i+1<n and bool(WORDCH.match(text[i+1]))
        if left_alpha or right_alpha:
            a = i
            while a>0 and WORDCH.match(text[a-1]):
                a-=1
            b = i+1
            while b<n and WORDCH.match(text[b]):
                b+=1
            tokens[text[a:b]] += 1
        else:
            s = max(0, i-30); e = min(n, i+30)
            puncts[text[s:e].replace("\n"," ")] += 1

out = []
out.append(f"FILES IN SCOPE: {len(files)}")
out.append(f"TOTAL OCCURRENCES: {total}")
out.append(f"UNIQUE ALPHA TOKENS: {len(tokens)}")
out.append(f"UNIQUE PUNCT CONTEXTS: {len(puncts)}")
out.append("="*80)
out.append("ALPHA TOKENS (token | count):")
for t, c in sorted(tokens.items(), key=lambda x:(-x[1], x[0])):
    out.append(f"  {c:4d}  {t}")
out.append("="*80)
out.append("PUNCT CONTEXTS (context | count):")
for t, c in sorted(puncts.items(), key=lambda x:(-x[1], x[0])):
    out.append(f"  {c:4d}  ...{t}...")

with open(os.path.join(ROOT, "_enum_out.txt"), "w", encoding="utf-8") as f:
    f.write("\n".join(out))
print("done", len(files), total)
