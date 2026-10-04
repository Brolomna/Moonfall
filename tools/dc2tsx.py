#!/usr/bin/env python3
"""Convert a Moonfall design component (.dc.html, exported from the design canvas)
into a React class component (.tsx) plus a CSS file.

Usage: python3 tools/dc2tsx.py design/Host.dc.html src/views/HostView.tsx HostView

The design's logic class (renderVals etc.) is kept verbatim as a React class, and the
<x-dc> template is turned into JSX that reads from `v = this.renderVals()`.
Re-run this after changing a design, then re-apply anything marked `// NET:` by hand
(see src/views/*.tsx) — or edit the generated TSX directly from then on.
"""
import re
import sys
from html.parser import HTMLParser

VOID = {'br', 'img', 'input', 'meta', 'link', 'hr'}
EVENTS = {'onclick': 'onClick', 'onchange': 'onChange', 'oninput': 'onInput', 'onsubmit': 'onSubmit',
          'onpointerdown': 'onPointerDown', 'onpointerup': 'onPointerUp', 'onkeydown': 'onKeyDown'}
ATTR = {'class': 'className', 'for': 'htmlFor', 'viewbox': 'viewBox', 'preserveaspectratio': 'preserveAspectRatio',
        'autocomplete': 'autoComplete', 'maxlength': 'maxLength', 'tabindex': 'tabIndex', 'readonly': 'readOnly',
        'crossorigin': 'crossOrigin', 'srcset': 'srcSet'}
SVG_KEEP = {'viewBox'}


class Node:
    def __init__(self, tag, attrs):
        self.tag, self.attrs, self.children = tag, attrs, []


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('root', [])
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs)
        self.stack[-1].children.append(n)
        if tag not in VOID:
            self.stack.append(n)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].children.append(Node(tag, attrs))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                return

    def handle_data(self, data):
        self.stack[-1].children.append(data)


HOLE = re.compile(r'\{\{\s*([^}]+?)\s*\}\}')


def expr(path, scope):
    path = path.strip()
    if path in ('true', 'false', 'null') or re.match(r'^-?\d+(\.\d+)?$', path) or path.startswith(("'", '"')):
        return path
    head = path.split('.')[0]
    if head in scope:
        return path
    return 'v.' + path


def tmpl(value, scope):
    """Attribute value with holes -> JS expression string."""
    m = HOLE.fullmatch(value.strip())
    if m:
        return expr(m.group(1), scope)
    parts, last = [], 0
    for m in HOLE.finditer(value):
        parts.append(value[last:m.start()].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${'))
        parts.append('${' + expr(m.group(1), scope) + '}')
        last = m.end()
    parts.append(value[last:].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${'))
    return '`' + ''.join(parts) + '`'


def camel(prop):
    if prop.startswith('--'):
        return "'" + prop + "'"
    if prop.startswith('-webkit-'):
        prop = 'Webkit-' + prop[8:]
    return re.sub(r'-([a-z])', lambda m: m.group(1).upper(), prop)


def style_obj(value, scope):
    decls = []
    # split on ; not inside parentheses
    depth, buf = 0, ''
    for ch in value:
        if ch == '(':
            depth += 1
        elif ch == ')':
            depth -= 1
        if ch == ';' and depth == 0:
            decls.append(buf)
            buf = ''
        else:
            buf += ch
    decls.append(buf)
    out = []
    for d in decls:
        if ':' not in d:
            continue
        k, val = d.split(':', 1)
        k, val = k.strip(), val.strip()
        if not k:
            continue
        if HOLE.search(val):
            js = tmpl(val, scope)
        else:
            js = repr(val) if "'" not in val else '"' + val.replace('"', '\\"') + '"'
        out.append(f'{camel(k)}: {js}')
    return '{{ ' + ', '.join(out) + ' }}'


def attr_name(k):
    if k in EVENTS:
        return EVENTS[k]
    if k in ATTR:
        return ATTR[k]
    if k.startswith('aria-') or k.startswith('data-'):
        return k
    if '-' in k:
        return re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k)
    return k


def text(s, scope):
    out, last = [], 0
    for m in HOLE.finditer(s):
        out.append(esc(s[last:m.start()]))
        out.append('{' + expr(m.group(1), scope) + '}')
        last = m.end()
    out.append(esc(s[last:]))
    return ''.join(out)


def esc(s):
    return re.sub(r'([{}<>])', lambda m: "{'" + m.group(1) + "'}", s)


def emit(n, scope, ind):
    pad = '  ' * ind
    if isinstance(n, str):
        return emit_text(n, scope, pad, False, False)
    if n.tag in ('helmet', 'script', 'style', 'link', 'title'):
        return ''
    a = dict(n.attrs)
    if n.tag == 'sc-if':
        cond = tmpl(a['value'], scope)
        inner = emit_children(n.children, scope, ind + 2)
        return f'{pad}{{({cond}) ? (\n{pad}  <>\n{inner}{pad}  </>\n{pad}) : null}}\n'
    if n.tag == 'sc-for':
        lst = tmpl(a['list'], scope)
        var = a.get('as', 'item')
        sc = scope | {var, '$index'}
        inner = emit_children(n.children, sc, ind + 2)
        return (f'{pad}{{(({lst}) || []).map(({var}: any, $index: number) => (\n'
                f'{pad}  <React.Fragment key={{$index}}>\n{inner}{pad}  </React.Fragment>\n{pad}))}}\n')
    attrs = []
    for k, val in n.attrs:
        if k.startswith('hint-'):
            continue
        name = attr_name(k)
        if val is None:
            attrs.append(name)
        elif name == 'style':
            attrs.append('style=' + style_obj(val, scope))
        elif HOLE.search(val):
            attrs.append(f'{name}={{{tmpl(val, scope)}}}')
        else:
            attrs.append(f'{name}={jsx_str(val)}')
    open_ = '<' + n.tag + ('' if not attrs else ' ' + ' '.join(attrs))
    if n.tag in VOID or not n.children:
        return pad + open_ + ' />\n'
    inner = emit_children(n.children, scope, ind + 1)
    return f'{pad}{open_}>\n{inner}{pad}</{n.tag}>\n'


def emit_text(t, scope, pad, has_prev, has_next):
    core = re.sub(r'\s+', ' ', t).strip()
    if not core:
        # whitespace between two inline siblings on one line matters ("</b> <i>")
        return pad + "{' '}\n" if (has_prev and has_next and '\n' not in t) else ''
    lead = "{' '}" if (has_prev and t[0].isspace()) else ''
    trail = "{' '}" if (has_next and t[-1].isspace()) else ''
    return pad + lead + text(core, scope) + trail + '\n'


def emit_children(children, scope, ind):
    out = []
    for i, c in enumerate(children):
        if isinstance(c, str):
            out.append(emit_text(c, scope, '  ' * ind, i > 0, i < len(children) - 1))
        else:
            out.append(emit(c, scope, ind))
    return ''.join(out)


def jsx_str(v):
    if '"' not in v:
        return '"' + v + '"'
    return "{'" + v.replace("\\", "\\\\").replace("'", "\\'") + "'}"


def main(src, dst, name):
    html = open(src, encoding='utf-8').read()
    body = html.split('<x-dc>', 1)[1].split('</x-dc>', 1)[0]
    css = '\n'.join(re.findall(r'<style>(.*?)</style>', body, re.S))
    body = re.sub(r'<helmet>.*?</helmet>', '', body, flags=re.S)
    body = re.sub(r'<!--.*?-->', '', body, flags=re.S)
    p = P()
    p.feed(body)
    roots = [c for c in p.root.children if not (isinstance(c, str) and not c.strip())]
    jsx = ''.join(emit(c, set(), 3) for c in roots)
    script = re.search(r'<script type="text/x-dc" data-dc-script[^>]*>(.*?)</script>', html, re.S).group(1)
    script = script.replace('class Component extends DCLogic {', f'export class {name} extends React.Component<any, any> {{', 1)
    script = script.rstrip()
    assert script.endswith('}')
    script = script[:-1].rstrip() + f'''

  render() {{
    const v: any = this.renderVals();
    return (
{jsx.rstrip()}
    );
  }}
}}
'''
    css_name = dst.rsplit('/', 1)[1].replace('.tsx', '.css')
    out = ('// @ts-nocheck\n// Generated from ' + src + ' by tools/dc2tsx.py, then hand-wired to the room server (see NET: comments).\n'
           "import React from 'react';\nimport './" + css_name + "';\n" + script)
    open(dst, 'w', encoding='utf-8').write(out)
    # scope component CSS: body rules become the app root rules
    css = css.replace('body{margin:0;background:#0a0612}', '')
    open(dst.replace('.tsx', '.css'), 'w', encoding='utf-8').write(css.strip() + '\n')


if __name__ == '__main__':
    main(*sys.argv[1:4])
