#!/usr/bin/env python3
"""Build a machine-readable index from repository Markdown.

Every Markdown file is discoverable. Optional YAML front matter enriches it with
stable ids, types, topics and graph relations. No contributor has to edit JS.
"""
from pathlib import Path
import json, re

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "site-data"
SKIP = {"node_modules", ".git", "site-data"}


def scalar(v):
    v = v.strip()
    if not v: return ""
    if v.lower() in ("true", "false"): return v.lower() == "true"
    if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
        return v[1:-1]
    if v.startswith('[') and v.endswith(']'):
        return [x.strip().strip('"\'') for x in v[1:-1].split(',') if x.strip()]
    return v


def frontmatter(text):
    if not text.startswith("---\n"): return {}, text
    end = text.find("\n---\n", 4)
    if end < 0: return {}, text
    raw, body = text[4:end], text[end+5:]
    data, key = {}, None
    for line in raw.splitlines():
        if not line.strip() or line.lstrip().startswith('#'): continue
        if re.match(r'^\s*-\s+', line) and key:
            data.setdefault(key, []).append(scalar(re.sub(r'^\s*-\s+', '', line)))
            continue
        m = re.match(r'^([A-Za-z0-9_-]+):\s*(.*)$', line)
        if m:
            key, val = m.groups()
            data[key] = scalar(val) if val else []
    return data, body


def title_of(body, path):
    m = re.search(r'^#\s+(.+?)\s*$', body, re.M)
    return m.group(1).strip() if m else ("Inicio" if path.name == 'README.md' else path.stem.replace('-', ' ').title())


def excerpt(body):
    clean = re.sub(r'```.*?```', ' ', body, flags=re.S)
    clean = re.sub(r'^#+\s+', '', clean, flags=re.M)
    clean = re.sub(r'[*_>`\[\]()]', '', clean)
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean[:280] + ('…' if len(clean) > 280 else '')


def inferred_type(rel):
    p = rel.parts
    if "personas" in p: return "persona"
    if "instituciones" in p: return "institucion"
    if "debates" in p: return "debate"
    return "documento"


def normalize_relations(raw, source):
    # Simple front matter accepts relations: [target-a, target-b]. Rich relation
    # objects can later be supplied via site-data/relations.json.
    if not isinstance(raw, list): return []
    return [{"source": source, "target": str(t), "type": "relacionado", "confidence": "sin-clasificar"} for t in raw]


def main():
    docs, relations = [], []
    for path in sorted(ROOT.rglob('*.md')):
        rel = path.relative_to(ROOT)
        if any(part in SKIP or part.startswith('.') for part in rel.parts): continue
        text = path.read_text(encoding='utf-8')
        meta, body = frontmatter(text)
        doc_id = str(meta.get('id') or rel.with_suffix('').as_posix().replace('/', '--'))
        topics = meta.get('topics', [])
        if isinstance(topics, str): topics = [topics]
        doc = {
            "id": doc_id,
            "type": str(meta.get('type') or inferred_type(rel)),
            "title": str(meta.get('name') or meta.get('title') or title_of(body, path)),
            "path": rel.as_posix(),
            "topics": topics,
            "excerpt": str(meta.get('summary') or excerpt(body)),
        }
        docs.append(doc)
        relations.extend(normalize_relations(meta.get('relations', []), doc_id))

    # Curated relations are additive: contributors can improve the graph without
    # modifying application code.
    curated = ROOT / 'data' / 'relations.json'
    if curated.exists(): relations.extend(json.loads(curated.read_text(encoding='utf-8')))

    ids = {d['id'] for d in docs}
    broken = [r for r in relations if r.get('source') not in ids or r.get('target') not in ids]
    if broken:
        print('ERROR: relations reference unknown ids:')
        for r in broken: print(' -', r)
        raise SystemExit(1)

    OUT.mkdir(exist_ok=True)
    (OUT / 'content.json').write_text(json.dumps(docs, ensure_ascii=False, indent=2), encoding='utf-8')
    (OUT / 'relations.json').write_text(json.dumps(relations, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Indexed {len(docs)} Markdown documents and {len(relations)} relations.')

if __name__ == '__main__': main()
