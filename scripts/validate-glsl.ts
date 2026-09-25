// ============================================================================
//  Vivid Lite — headless GLSL validation harness
//
//  Builds every preset × version bucket × loader combination exactly like the
//  web builder does, resolves `#include "/..."` the same way Iris / OptiFine do
//  (paths are relative to the `shaders/` root), and compiles every .vsh/.fsh
//  stub with Khronos glslangValidator (GLSL 1.20 profile).
//
//  This does NOT replace an in-game test (driver quirks, loader-specific
//  uniforms), but it catches every hard compile error — undeclared
//  identifiers, bad #if expressions, type mismatches — before a user sees
//  "shader failed to compile" in latest.log.
//
//  Usage:  npm run validate            (all combos)
//          npm run validate -- --quick (medium + extraPotato only)
// ============================================================================

import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { buildPackFiles } from '../src/shader/pack';
import { PRESETS, type PresetId, type ShaderSettings } from '../src/shader/settings';
import type { LoaderId, VersionTargetId } from '../src/shader/compat';

const require = createRequire(import.meta.url);
const GLSLANG = (() => {
  const dir = require.resolve('glslang-validator-prebuilt-predownloaded/package.json').replace(/package\.json$/, '');
  const bin = join(dir, 'bin', process.platform === 'win32' ? 'glslangValidator.exe' : process.platform === 'darwin' ? 'glslangValidator.darwin' : 'glslangValidator.linux');
  try { chmodSync(bin, 0o755); } catch { /* read-only FS: fine */ }
  return bin;
})();

/** Resolve `#include "/x"` recursively (Iris/OptiFine semantics: "/" = shaders/). */
function resolveIncludes(src: string, files: Record<string, string>, depth = 0): string {
  if (depth > 16) throw new Error('include depth > 16 (cycle?)');
  return src.replace(/^[ \t]*#include\s+"([^"]+)"[ \t]*$/gm, (_m, p: string) => {
    const key = 'shaders' + (p.startsWith('/') ? p : '/' + p);
    const inc = files[key];
    if (inc === undefined) throw new Error(`missing include ${p}`);
    return resolveIncludes(inc, files, depth + 1);
  });
}

export interface ComboResult { combo: string; file: string; log: string }

/** sha1(resolved source + stage) -> compile log ('' = OK). Identical sources compile once. */
const compileCache = new Map<string, string>();
export const stats = { stages: 0, compiled: 0 };

export function validateCombo(s: ShaderSettings, comboName: string, workDir: string): ComboResult[] {
  const files = buildPackFiles(s);
  const errors: ComboResult[] = [];
  for (const path of Object.keys(files).sort()) {
    const m = path.match(/\.(vsh|fsh)$/);
    if (!m) continue;
    const src = resolveIncludes(files[path], files);
    const out = join(workDir, path.replace(/[/\\]/g, '__') + (m[1] === 'vsh' ? '.vert' : '.frag'));
    stats.stages++;
    const key = createHash('sha1').update(m[1]).update(src).digest('hex');
    let log = compileCache.get(key);
    if (log === undefined) {
      stats.compiled++;
      writeFileSync(out, src);
      try {
        execFileSync(GLSLANG, [out], { stdio: 'pipe' });
        log = '';
      } catch (e) {
        const err = e as { stdout?: Buffer; stderr?: Buffer };
        log = (err.stdout?.toString() ?? '') + (err.stderr?.toString() ?? '') || 'unknown glslang failure';
      }
      compileCache.set(key, log);
    }
    if (log) errors.push({ combo: comboName, file: path, log });
  }
  return errors;
}

/**
 * Profile sanity: every token in every profile.X line must name a real option in
 * settings.glsl and (for value options) use a value from its //[...] list —
 * Iris/OptiFine silently ignore anything else.
 */
export function validateProfiles(s: ShaderSettings, combo: string): string[] {
  const files = buildPackFiles(s);
  const glsl = files['shaders/lib/settings.glsl'];
  const props = files['shaders/shaders.properties'];
  const bools = new Set<string>();
  const values = new Map<string, string[]>();
  for (const line of glsl.split('\n')) {
    let m = line.match(/^(?:\/\/)?#define\s+([A-Z_0-9]+)\s*(?:\/\/.*)?$/);
    if (m) { bools.add(m[1]); continue; }
    m = line.match(/^#define\s+([A-Z_0-9]+)\s+(-?[\d.]+)\s*\/\/\[([^\]]+)\]/) ?? line.match(/^const\s+(?:int|float)\s+(\w+)\s*=\s*(-?[\d.]+);\s*\/\/\[([^\]]+)\]/);
    if (m) values.set(m[1], m[3].trim().split(/\s+/));
  }
  const problems: string[] = [];
  for (const line of props.split('\n').filter((l) => l.startsWith('profile.'))) {
    const [name, body] = line.split('=', 2).length === 2 ? [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)] : [line, ''];
    for (const tok of body.trim().split(/\s+/)) {
      if (tok.includes('=')) {
        const [k, v] = tok.split('=');
        const allowed = values.get(k);
        if (!allowed) problems.push(`${combo} ${name}: unknown value option ${k}`);
        else if (!allowed.includes(v)) problems.push(`${combo} ${name}: ${k}=${v} not in [${allowed.join(' ')}]`);
      } else {
        const k = tok.replace(/^!/, '');
        if (!bools.has(k)) problems.push(`${combo} ${name}: unknown toggle ${k}`);
      }
    }
  }
  return problems;
}

function main() {
  const profileProblems = validateProfiles({ ...PRESETS.medium, mcVersion: 'latest', loader: 'both' }, 'profiles');
  if (profileProblems.length) { console.error(profileProblems.join('\n')); process.exit(1); }
  console.log('✔ Profiles OK — every profile token is a real option with an allowed value.');
  const quick = process.argv.includes('--quick');
  const presets = (quick ? ['extraPotato', 'medium'] : Object.keys(PRESETS)) as PresetId[];
  const buckets: VersionTargetId[] = ['legacy', 'classic', 'modern', 'latest'];
  const loaders: LoaderId[] = ['iris', 'optifine', 'both'];
  const work = mkdtempSync(join(tmpdir(), 'vl-glsl-'));
  let combos = 0;
  const all: ComboResult[] = [];
  // Extra synthetic combos: every option ON that the presets never enable together.
  const extra: [string, ShaderSettings][] = [
    ['stress/allOn', { ...PRESETS.extraHigh, smallWave: true, lowResShadow: true, skipPcf: false, vertexAO: true, halfResBloom: true, torchFlicker: true, coloredShadows: true }],
    ['stress/shadowsHard', { ...PRESETS.highPotato, skipPcf: true, coloredShadows: true }],
  ];
  const targets: [string, ShaderSettings][] = presets.map((p) => [p, PRESETS[p]]);
  if (!quick) targets.push(...extra);
  for (const [name, base] of targets) {
    for (const mc of buckets) {
      for (const loader of loaders) {
        const combo = `${name}/${mc}/${loader}`;
        all.push(...validateCombo({ ...base, mcVersion: mc, loader }, combo, work));
        combos++;
      }
    }
  }
  rmSync(work, { recursive: true, force: true });
  if (all.length) {
    const seen = new Set<string>();
    for (const e of all) {
      const key = e.file + e.log;
      if (seen.has(key)) continue;
      seen.add(key);
      console.error(`\n✖ ${e.combo} :: ${e.file}\n${e.log.trim().split('\n').slice(0, 8).join('\n')}`);
    }
    console.error(`\n${all.length} failing stage(s) across ${combos} combos.`);
    process.exit(1);
  }
  console.log(`✔ GLSL OK — ${combos} combos (presets × 4 buckets × 3 loaders), every .vsh/.fsh compiled (${stats.stages} stages, ${stats.compiled} unique sources).`);
}

main();
