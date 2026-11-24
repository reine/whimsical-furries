"""Draws docs/mockup.svg: the forest scene with a mock chat window over it,
for the README preview. Every message in it is made up; nothing comes from a
real session. Run after compose.py, then render it (see the README).

Usage: python3 art/mockup.py
"""
import re
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent
W, H = 1600, 900

# The theme's own colors (hooks/register.tsx)
SURFACE0 = '#1f1b30'
SURFACE3 = '#2f2946'
TEXT = '#e4dcf7'
TEXT2 = '#c5bce0'
MUTED = '#a69dc4'
ORCHID = '#c58af0'
LAVENDER = '#b7bdf8'
PEACH = '#f5a97f'
FONT = "-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
MONO = "'SF Mono', Menlo, monospace"


def scene() -> str:
    """The composed scene at its 16:9 placement, as a nested <svg>."""
    s = (ROOT / 'art' / 'scene.svg').read_text()
    s = re.sub(r'@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}', '', s)
    s = s.replace('<svg xmlns="http://www.w3.org/2000/svg"', f'<svg x="0" y="0" width="{W}" height="{H}"', 1)
    return s


def text(x, y, body, size=15, fill=TEXT, weight=400, family=FONT, anchor='start'):
    return (f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" '
            f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{body}</text>')


def lines(x, y, rows, size=15, gap=24, fill=TEXT):
    """Rows of rich text: each row is a list of (words, style) runs."""
    out = []
    for i, row in enumerate(rows):
        spans = []
        for words, style in row:
            w = escape(words)
            if style == 'code':
                spans.append(f'<tspan font-family="{MONO}" font-size="{size - 1}" fill="{LAVENDER}">{w}</tspan>')
            elif style == 'link':
                spans.append(f'<tspan fill="{ORCHID}" text-decoration="underline">{w}</tspan>')
            elif style == 'bold':
                spans.append(f'<tspan font-weight="600">{w}</tspan>')
            else:
                spans.append(f'<tspan>{w}</tspan>')
        out.append(f'<text x="{x}" y="{y + i * gap}" font-family="{FONT}" font-size="{size}" fill="{fill}" '
                   f'xml:space="preserve">{"".join(spans)}</text>')
    return '\n'.join(out)


def window() -> str:
    col_x, col_w = 430, 740
    parts = []

    # Title bar, frosted over the forest
    parts.append(f'<rect x="0" y="0" width="{W}" height="46" fill="{SURFACE0}" fill-opacity="0.62"/>')
    parts.append(f'<rect x="0" y="46" width="{W}" height="1" fill="{SURFACE3}"/>')
    for i, c in enumerate(['#ed8796', '#f5a97f', '#a6da95']):
        parts.append(f'<circle cx="{24 + i * 20}" cy="23" r="6" fill="{c}" fill-opacity="0.85"/>')
    parts.append(text(W / 2, 28, 'Cozy evening refactor', 14, TEXT2, 500, anchor='middle'))
    # speaker, playing
    parts.append(f'<g transform="translate({W - 44} 14)" fill="none" stroke="{ORCHID}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
                 f'<path d="M2 7 h4 l5 -4 v12 l-5 -4 h-4z" fill="{ORCHID}" fill-opacity="0.25"/>'
                 f'<path d="M14 6 q2.5 3 0 6"/><path d="M16.5 3.5 q5 5.5 0 11"/></g>')

    # User message
    y = 92
    msg = 'Could you tidy up the settings loader? It reads the file three times.'
    bw = 520
    parts.append(f'<rect x="{col_x + col_w - bw}" y="{y}" width="{bw}" height="70" rx="14" fill="{SURFACE3}" fill-opacity="0.95"/>')
    parts.append(lines(col_x + col_w - bw + 18, y + 30, [[('Could you tidy up the settings loader?', '')],
                                                       [('It reads the file three times.', '')]], gap=22))

    # Assistant message
    y = 186
    parts.append(f'<rect x="{col_x}" y="{y}" width="{col_w}" height="352" rx="14" fill="{SURFACE0}" fill-opacity="0.92"/>')
    parts.append(lines(col_x + 20, y + 34, [
        [('Sure. The loader opens ', ''), ('settings.json', 'code'), (' once for the defaults,', '')],
        [('once for the overrides and once to watch it. I’ll read it a single time', '')],
        [('and hand the parsed result to all three.', '')],
    ]))

    # Tool rows
    ty = y + 112
    for label, detail in [('Read', 'src/config/loader.ts'), ('Edit', 'src/config/loader.ts  +18 −31')]:
        parts.append(f'<rect x="{col_x + 20}" y="{ty}" width="{col_w - 40}" height="34" rx="8" fill="{SURFACE0}" fill-opacity="0.9" stroke="{SURFACE3}"/>')
        parts.append(f'<circle cx="{col_x + 38}" cy="{ty + 17}" r="4" fill="#a6da95"/>')
        parts.append(text(col_x + 52, ty + 22, label, 14, TEXT, 600))
        parts.append(text(col_x + 52 + len(label) * 9 + 10, ty + 22, escape(detail), 13, MUTED, family=MONO))
        ty += 44

    parts.append(lines(col_x + 20, ty + 26, [
        [('Done. ', 'bold'), ('loadSettings()', 'code'), (' now parses the file once and caches it,', '')],
        [('and the watcher reuses that cache. All ', ''), ('42 tests', 'link'), (' pass.', '')],
    ]))

    # A little code block
    cy = ty + 70
    parts.append(f'<rect x="{col_x + 20}" y="{cy}" width="{col_w - 40}" height="84" rx="8" fill="#25203a"/>')
    code = [
        [('const ', ORCHID), ('settings', TEXT), (' = ', MUTED), ('await ', ORCHID), ('readOnce', LAVENDER), ('(path)', TEXT)],
        [('return ', ORCHID), ('{ ', MUTED), ('...defaults', TEXT), (', ', MUTED), ('...settings', TEXT), (' }', MUTED)],
        [('// ', MUTED), ('one read, three readers', MUTED)],
    ]
    for i, row in enumerate(code):
        spans = ''.join(f'<tspan fill="{c}">{escape(t)}</tspan>' for t, c in row)
        parts.append(f'<text x="{col_x + 38}" y="{cy + 26 + i * 22}" font-family="{MONO}" font-size="13.5" xml:space="preserve">{spans}</text>')

    # Prompt box
    py = 770
    parts.append(f'<rect x="{col_x}" y="{py}" width="{col_w}" height="92" rx="16" fill="{SURFACE0}" fill-opacity="0.78" stroke="{SURFACE3}"/>')
    parts.append(text(col_x + 20, py + 36, 'Reply…', 15, MUTED))
    parts.append(f'<circle cx="{col_x + col_w - 34}" cy="{py + 60}" r="16" fill="{ORCHID}"/>')
    parts.append(f'<path d="M{col_x + col_w - 34} {py + 68} v-15 m-6 6 l6 -6 l6 6" fill="none" stroke="{SURFACE0}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>')
    parts.append(text(col_x + 20, py + 66, '+', 20, MUTED, 300))

    return '\n'.join(parts)


def main():
    out = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">\n'
           f'{scene()}\n{window()}\n</svg>\n')
    (ROOT / 'docs').mkdir(exist_ok=True)
    (ROOT / 'docs' / 'mockup.svg').write_text(out)
    print('wrote docs/mockup.svg', len(out))


if __name__ == '__main__':
    main()
