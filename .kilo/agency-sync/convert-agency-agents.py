#!/usr/bin/env python3
"""Sync msitarzewski/agency-agents into this project's Kilo subagents.

Usage:
    git clone --depth 1 https://github.com/msitarzewski/agency-agents /tmp/agency-agents
    python3 .kilo/agency-sync/convert-agency-agents.py /tmp/agency-agents .kilo/agent/agency

Every roster file becomes a `mode: subagent` Kilo agent, so it stays out of the
primary agent menu and is reachable through the Task tool.
"""
import os
import re
import sys

SRC = sys.argv[1] if len(sys.argv) > 1 else "/tmp/agency-agents"
DEST = sys.argv[2] if len(sys.argv) > 2 else ".kilo/agent/agency"

DIVISIONS = {
    "academic": ("Academic", "#8B5CF6"),
    "design": ("Design", "#EC4899"),
    "engineering": ("Engineering", "#3B82F6"),
    "finance": ("Finance", "#22C55E"),
    "game-development": ("Game Development", "#A855F7"),
    "gis": ("GIS", "#14B8A6"),
    "healthcare": ("Healthcare", "#0D9488"),
    "marketing": ("Marketing", "#F97316"),
    "paid-media": ("Paid Media", "#EAB308"),
    "product": ("Product", "#D946EF"),
    "project-management": ("Project Management", "#0EA5E9"),
    "research": ("Research", "#7C3ED"),
    "sales": ("Sales", "#10B981"),
    "security": ("Security", "#EF4444"),
    "spatial-computing": ("Spatial Computing", "#06B6D4"),
    "specialized": ("Specialized", "#6366F1"),
    "support": ("Support", "#84CC16"),
    "testing": ("Testing", "#F59E0B"),
}
DIVISIONS["research"] = ("Research", "#7C3AED")

NAMED_COLORS = {
    "blue": "#3B82F6", "green": "#22C55E", "orange": "#F97316", "purple": "#A855F7",
    "teal": "#14B8A6", "indigo": "#6366F1", "red": "#EF4444", "amber": "#F59E0B",
    "cyan": "#06B6D4", "pink": "#EC4899", "violet": "#8B5CF6", "gold": "#EAB308",
    "slate": "#64748B", "yellow": "#EAB308", "navy": "#1E3A8A", "gray": "#6B7280",
    "grey": "#6B7280", "lime": "#84CC16", "magenta": "#D946EF", "coral": "#FB7185",
    "brown": "#92400E", "white": "#E5E7EB", "black": "#111827", "default": "#3B82F6",
}

FM_RE = re.compile(r"\A---\r?\n(.*?)\r?\n---\r?\n", re.S)


def parse_scalar(value):
    v = value.strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
        return v[1:-1]
    return v


def parse_frontmatter(block):
    data, key = {}, None
    for line in block.split("\n"):
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        m = re.match(r"^([A-Za-z_][\w-]*):(.*)$", line)
        if m:
            key = m.group(1)
            data[key] = parse_scalar(m.group(2))
        elif key and line.startswith((" ", "\t")):
            data[key] = (str(data.get(key, "")) + " " + line.strip()).strip()
    return data


def resolve_color(value, fallback):
    if not value:
        return fallback
    v = value.strip()
    if v.startswith("#"):
        return v.upper()
    return NAMED_COLORS.get(v.lower(), fallback)


written = []
for div, (label, div_color) in DIVISIONS.items():
    div_src = os.path.join(SRC, div)
    if not os.path.isdir(div_src):
        print(f"skip missing division {div}", file=sys.stderr)
        continue
    out_dir = os.path.join(DEST, div)
    os.makedirs(out_dir, exist_ok=True)
    for fname in sorted(os.listdir(div_src)):
        if not fname.endswith(".md"):
            continue
        path = os.path.join(div_src, fname)
        raw = open(path, encoding="utf-8").read()
        m = FM_RE.match(raw)
        if not m:
            print(f"skip (no frontmatter) {path}", file=sys.stderr)
            continue
        fm = parse_frontmatter(m.group(1))
        body = raw[m.end():].lstrip("\n")
        first = body.split("\n", 1)[0].strip()
        if first.startswith("# ") and first[2:].strip().startswith(str(fm.get("name") or "")):
            body = body.split("\n", 1)[1].lstrip("\n") if "\n" in body else ""
        name = fm.get("name") or os.path.splitext(fname)[0]
        desc = fm.get("description") or f"{name} agent from The Agency roster."
        vibe = fm.get("vibe")
        color = resolve_color(fm.get("color"), div_color)

        desc_line = f"{label} division. {desc}".replace('"', "'")
        front = [
            "---",
            f'description: "{desc_line}"',
            "mode: subagent",
            f'color: "{color}"',
            "---",
            "",
        ]
        header = [f"# {name}", ""]
        if vibe:
            header += [f"**Vibe:** {vibe}", ""]
        out = "\n".join(front + header + [body])
        dest_path = os.path.join(out_dir, fname)
        with open(dest_path, "w", encoding="utf-8") as fh:
            fh.write(out)
        written.append(dest_path)

print(f"wrote {len(written)} agents to {DEST}")