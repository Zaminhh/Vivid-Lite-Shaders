import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronRight, Copy, FileCode2, FileText, FolderOpen } from 'lucide-react';
import { cn } from '../utils/cn';

type Token = { text: string; cls?: string };

const KW = 'uniform|varying|attribute|const|void|if|else|for|while|return|discard|in|out|inout|true|false|struct|break|continue';
const TYPES = 'float|int|bool|vec2|vec3|vec4|ivec2|ivec3|ivec4|mat2|mat3|mat4|sampler2D|sampler2DShadow';
const BUILTINS =
  'texture2D|texture2DLod|shadow2D|mix|pow|exp|sin|cos|dot|cross|normalize|length|clamp|smoothstep|step|max|min|abs|floor|fract|reflect|sqrt|ftransform|sat|luma|toLinear|toSRGB|hash12|hash13|getSkyColor|getLightColors|getLighting|getShadow|applyFog|getWave|getWaveNormal|sampleShadow|bloomTile|tonemapVivid|tonemapACES|screenToView|getDayFactor|getSunsetFactor|getSunVis|getMoonVis';

const GLSL_RE = new RegExp(
  `(\\/\\/.*)|(\\/\\*.*?\\*\\/)|(\\b\\d+\\.?\\d*(?:[eE][+-]?\\d+)?\\b)|(\\b(?:${KW})\\b)|(\\b(?:${TYPES})\\b)|(\\b(?:${BUILTINS})\\b)|(gl_\\w+|mc_\\w+)`,
  'g',
);
const CLS = ['text-slate-500 italic', 'text-slate-500 italic', 'text-amber-200', 'text-rose-300', 'text-sky-300', 'text-violet-300', 'text-emerald-300'];

function tokenizeGlslLine(line: string): Token[] {
  if (/^\s*#/.test(line)) {
    const idx = line.indexOf('//');
    if (idx > 0) return [{ text: line.slice(0, idx), cls: 'text-fuchsia-300' }, { text: line.slice(idx), cls: 'text-slate-500 italic' }];
    return [{ text: line, cls: 'text-fuchsia-300' }];
  }
  const out: Token[] = [];
  let last = 0;
  GLSL_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = GLSL_RE.exec(line)) !== null) {
    if (m.index > last) out.push({ text: line.slice(last, m.index) });
    const gi = m.slice(1).findIndex((g) => g !== undefined);
    out.push({ text: m[0], cls: CLS[gi] });
    last = m.index + m[0].length;
    if (m[0].length === 0) GLSL_RE.lastIndex++;
  }
  if (last < line.length) out.push({ text: line.slice(last) });
  return out;
}

function tokenizePropsLine(line: string): Token[] {
  if (/^\s*#/.test(line)) return [{ text: line, cls: 'text-slate-500 italic' }];
  const eq = line.indexOf('=');
  if (eq > 0) return [{ text: line.slice(0, eq), cls: 'text-sky-300' }, { text: '=', cls: 'text-slate-500' }, { text: line.slice(eq + 1), cls: 'text-amber-100' }];
  return [{ text: line }];
}

function groupOf(path: string): string {
  if (path.startsWith('shaders/lib/')) return 'lib/ — thư viện dùng chung';
  if (path.startsWith('shaders/program/')) return 'program/ — các program';
  if (path.startsWith('shaders/lang/')) return 'lang/ — ngôn ngữ menu';
  if (path.startsWith('shaders/world-1/')) return 'world-1/ — Nether';
  if (path.startsWith('shaders/world1/')) return 'world1/ — End';
  if (/\.(vsh|fsh)$/.test(path)) return 'shaders/ — stub Overworld';
  return 'Gốc & cấu hình';
}

const GROUP_ORDER = ['Gốc & cấu hình', 'lib/ — thư viện dùng chung', 'program/ — các program', 'shaders/ — stub Overworld', 'world-1/ — Nether', 'world1/ — End', 'lang/ — ngôn ngữ menu'];

export default function CodeViewer({ files }: { files: Record<string, string> }) {
  const [selected, setSelected] = useState('shaders/lib/settings.glsl');
  const [copied, setCopied] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ 'Gốc & cấu hình': true, 'lib/ — thư viện dùng chung': true, 'program/ — các program': true });

  const groups = useMemo(() => {
    const g: Record<string, string[]> = {};
    Object.keys(files).forEach((p) => {
      const k = groupOf(p);
      (g[k] ||= []).push(p);
    });
    Object.values(g).forEach((arr) => arr.sort());
    return g;
  }, [files]);

  const content = files[selected] ?? '';
  const isGlsl = /\.(glsl|vsh|fsh)$/.test(selected);

  const lines = useMemo(() => {
    const tok = isGlsl ? tokenizeGlslLine : tokenizePropsLine;
    return content.split('\n').map((l) => tok(l));
  }, [content, isGlsl]);

  useEffect(() => setCopied(false), [selected]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="glass grid overflow-hidden rounded-2xl lg:grid-cols-[280px_1fr]">
      <aside className="code-scroll max-h-[560px] overflow-y-auto border-b border-white/10 bg-night-950/40 p-3 lg:border-b-0 lg:border-r">
        {GROUP_ORDER.filter((g) => groups[g]).map((g) => {
          const open = openGroups[g] ?? false;
          return (
            <div key={g} className="mb-1">
              <button
                type="button"
                onClick={() => setOpenGroups((o) => ({ ...o, [g]: !open }))}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-semibold text-slate-300 hover:bg-white/5"
              >
                <ChevronRight className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-90')} />
                <FolderOpen className="h-3.5 w-3.5 text-amber-300" />
                <span className="truncate">{g}</span>
                <span className="ml-auto font-pixel text-[8px] text-slate-600">{groups[g].length}</span>
              </button>
              {open && (
                <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-2">
                  {groups[g].map((p) => {
                    const name = p.split('/').pop()!;
                    const active = p === selected;
                    return (
                      <li key={p}>
                        <button
                          type="button"
                          onClick={() => setSelected(p)}
                          className={cn(
                            'flex w-full items-center gap-2 rounded-md px-2 py-1 text-left font-mono text-[11px] transition-colors',
                            active ? 'bg-amber-400/15 text-amber-200' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
                          )}
                        >
                          {/\.(glsl|vsh|fsh)$/.test(p) ? <FileCode2 className="h-3 w-3 shrink-0" /> : <FileText className="h-3 w-3 shrink-0" />}
                          <span className="truncate">{name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </aside>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-night-950/40 px-4 py-2.5">
          <span className="truncate font-mono text-xs text-slate-300">{selected}</span>
          <div className="flex items-center gap-3">
            <span className="hidden text-[10px] text-slate-500 sm:inline">{lines.length} dòng</span>
            <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-200 hover:bg-white/10">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Đã chép' : 'Sao chép'}
            </button>
          </div>
        </div>
        <pre className="code-scroll max-h-[520px] overflow-auto bg-night-950/60 p-4 font-mono text-[12px] leading-relaxed text-slate-300">
          <code>
            {lines.map((tokens, i) => (
              <div key={i} className="flex">
                <span className="w-10 shrink-0 select-none pr-3 text-right text-slate-600">{i + 1}</span>
                <span className="whitespace-pre">
                  {tokens.map((t, j) => (
                    <span key={j} className={t.cls}>
                      {t.text}
                    </span>
                  ))}
                  {tokens.length === 0 && ' '}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
